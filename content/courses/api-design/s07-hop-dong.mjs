/**
 * API Design — Chương 7: Tài liệu và hợp đồng (soạn chi tiết 01/11/2026).
 * Output CHẠY THẬT: Node v22.23.3, Express 5.3.0, @redocly/cli 2.72.1, @stoplight/spectral-cli 6.17.0, @stoplight/prism-cli 5.14.2, openapi-typescript 7.13.0 + openapi-fetch 0.17.0,
 * TypeScript 5.9.3, Ajv 8.20 (2020-12), Zod 4.6.7, graphql 17.0.2 + graphql-http 1.23.1 + dataloader 2.2.3, @grpc/grpc-js 1.14.7, Chromium qua Playwright.
 * LabFlow v2 thành openapi.yaml (lint, kiểm hợp đồng bắt lỗi 415 thật), client có kiểu, mock, luật Spectral, cổng thay đổi phá vỡ, so REST/GraphQL/gRPC.
 * Mã cuối chương = lời giải Lab 7 (bài 7.6, hàng chờ). Slide: api-07-1 … api-07-5 + api-lab-7; giảng EN/VI ở ./giang/.
 * Tệp được sinh một lần bằng script ngoài repo — từ nay SỬA THẲNG tệp này, giữ luật thoát ký tự (_HOP-DONG.md mục 3).
 * GIỮ slug cũ api-7-1-openapi, api-7-2-sinh-code, api-7-3-design-first, api-7-4-khac (thứ tự hiển thị 7.1, 7.3, 7.4, 7.5) và title chương;
 * bài 7.2 (api-7-1-kiem-hop-dong) là bài MỚI tách ra để mỗi bài ≤ 40k ký tự.
 */

import G071 from './giang/api-07-1.mjs';
import G072 from './giang/api-07-2.mjs';
import G073 from './giang/api-07-3.mjs';
import G074 from './giang/api-07-4.mjs';
import G075 from './giang/api-07-5.mjs';
import GL7 from './giang/api-lab-7.mjs';

export default {
  title: 'Chapter 7 — Documentation and contracts|||Chương 7 — Tài liệu và hợp đồng',
  description: 'LabFlow v2 thành tài liệu OpenAPI 3.1 lint sạch; kiểm hợp đồng với server thật (bắt được lỗi 415 do fetch gửi Content-Length: 0); sinh trang docs, client TypeScript có kiểu, so validate theo schema với Zod; design-first với mock Prism, luật Spectral và cổng chặn thay đổi phá vỡ; GraphQL và gRPC đo trên cùng dữ liệu; lab hàng chờ thiết kế trước có rubric, quiz 10 câu.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Writing OpenAPI 3.1: LabFlow’s contract as one file|||7.1 — Viết OpenAPI 3.1: hợp đồng của LabFlow thành một tệp',
      slug: 'api-7-1-openapi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở đầu chương: học xong làm được gì. Bộ khung, một thao tác, schema JSON Schema 2020-12, lint bản nháp đầu (9 error, 4 warning), hai bẫy YAML trong chính tài liệu LabFlow, 3.1 hay 3.2.',
      content: `${G071}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Writing OpenAPI 3.1 — and checking that it tells the truth</h2>
<p class="lead">For six chapters LabFlow’s contract lived in Zod schemas, views and these lessons; a front-end developer had to read code to know what <code>POST /v2/bookings</code> wants. This chapter writes it as one file — <code>openapi.yaml</code> — that machines lint, turn into docs, typed clients and mocks, and check against the running server.</p>

<div class="callout ok">
<p><strong>After Chapter 7 you can:</strong></p>
<ul>
  <li>write an OpenAPI 3.1 document for a real API and get it to 0 lint errors (7.1);</li>
  <li>prove the document matches the running server with a contract check (7.1);</li>
  <li>generate documentation, a typed TypeScript client and validators from it, and catch broken clients at compile time (7.2);</li>
  <li>work design-first: review the contract, mock it for the front-end, and block breaking changes automatically (7.3);</li>
  <li>explain with measurements when GraphQL or gRPC beats REST, and when it does not (7.4).</li>
</ul>
<p><strong>Why it matters:</strong> in a team, the API contract is the thing two people agree on before either writes code. Companies hire for this: “we keep our OpenAPI in the repo and CI checks it” is a normal line in a job description, and the capstone (Chapter 12) starts from this file.</p>
</div>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch7-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the start of Chapter 7 (zip, without node_modules)</span><span class="lc-sub">Contract 2.0.0, before Lab 7. Run <code>npm ci</code>, then <code>npm start</code>; every command of lessons 7.1–7.5 works from the project folder. Demo passwords: an-lab-2026, binh-lab-2026, lan-lab-2026 (learning only).</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>OpenAPI in one picture</h3>
<p><strong>OpenAPI</strong> is a standard format (YAML or JSON) for describing an HTTP API: every path, method, parameter, request body, response and error. It started as <em>Swagger</em> (2011) and became the OpenAPI Specification in 2016. Version 3.1 (2021) made its schemas real <strong>JSON Schema 2020-12</strong> — the same language Ajv and Zod’s exporter speak. The current editions are 3.1.1 (October 2024) and 3.2.0 (September 2025); LabFlow uses 3.1 because every tool in this chapter supports it (measured at the end of the lesson).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · write</span><span class="lz-t">openapi.yaml</span><span class="lz-d">paths, schemas, errors, examples — the contract</span></div>
  <div class="lz-step"><span class="lz-k">2 · lint</span><span class="lz-t">Redocly + Spectral</span><span class="lz-d">valid document, team style rules</span></div>
  <div class="lz-step"><span class="lz-k">3 · use</span><span class="lz-t">docs · types · mock</span><span class="lz-d">generated from the same file (7.2, 7.3)</span></div>
  <div class="lz-step"><span class="lz-k">4 · verify</span><span class="lz-t">contract check</span><span class="lz-d">real requests vs the document — drift is a bug</span></div>
</div>

<a class="link-card" href="https://spec.openapis.org/oas/v3.1.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: OpenAPI Specification v3.1.1 (24 Oct 2024) — read 1 Nov 2026</span><span class="lc-sub">The standard this lesson follows; its Schema Object is JSON Schema 2020-12. The same site lists 3.2.0 (19 Sep 2025) with a QUERY method, a querystring parameter location and streaming media types.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The skeleton</h3>
<p>Every document starts with who it describes and where it lives. <code>security</code> at the root means “every operation needs a token” — operations that are public say <code>security: []</code>.</p>
<pre><code class="language-yaml">openapi: 3.1.0
info:
  title: LabFlow API
  version: 2.0.0
  license: { name: MIT, identifier: MIT }
servers:
  - url: https://api.labflow.example/v2
    description: Production
  - url: http://localhost:4000/v2
    description: Local development
security:
  - bearerAuth: []            # mặc định: mọi thao tác cần token
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: A token from POST /auth/login, or an API key (lf_live_…) in the same header.</code></pre>

<h3>One operation, piece by piece</h3>
<p>This is <code>POST /bookings</code> exactly as LabFlow behaves since Chapter 5: an optional <code>Idempotency-Key</code>, a JSON body, 201 with <code>Location</code> and rate-limit headers, and every error the handler can produce.</p>
<pre><code class="language-yaml">paths:
  /bookings:
    post:
      tags: [Bookings]
      operationId: createBooking          # tên hàm của client sinh ra (7.2)
      summary: Book a lab
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BookingCreate' }
            example:
              labId: lab_1
              period: { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' }
      responses:
        '201':
          description: Created
          headers:
            Location: { description: URL of the new booking, schema: { type: string } }
            RateLimit: { $ref: '#/components/headers/RateLimit' }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Booking' }
        '400': { $ref: '#/components/responses/ValidationFailed' }
        '409': { $ref: '#/components/responses/Conflict' }
        # … 401, 415, 422, 429 — mọi lỗi handler có thể trả</code></pre>

<h3>Schemas: the shapes, in JSON Schema 2020-12</h3>
<pre><code class="language-yaml">components:
  schemas:
    Period:
      type: object
      required: [start, end]
      additionalProperties: false      # giống z.strictObject: trường lạ ⇒ không hợp lệ
      properties:
        start: { type: string, format: date-time }
        end: { type: string, format: date-time }
    Booking:
      type: object
      required: [id, labId, userId, period, purpose, status, createdAt, cancelledAt, checkedInAt]
      additionalProperties: false
      properties:
        id: { type: string, pattern: '^bk_\\d+$' }
        period: { $ref: '#/components/schemas/Period' }
        purpose: { type: [string, 'null'] }     # 3.1: kiểu null thay cho "nullable: true" của 3.0
        status: { type: string, enum: [PENDING, CHECKED_IN, CANCELLED] }
        createdAt: { type: string, format: date-time }
        cancelledAt: { type: [string, 'null'], format: date-time }
        # … labId, userId, checkedInAt
    Problem:
      type: object
      description: RFC 9457 Problem Details, plus LabFlow's machine-readable code
      required: [type, title, status, code]
      properties:
        type: { type: string, format: uri }
        title: { type: string }
        status: { type: integer }
        detail: { type: string }
        code: { type: string, examples: [BOOKING_CONFLICT] }
  responses:
    Conflict:
      description: The current state does not allow this (e.g. already cancelled, slot taken)
      content:
        application/problem+json:
          schema: { $ref: '#/components/schemas/Problem' }</code></pre>
<p>Three 3.1 details that trip people coming from 3.0 tutorials: <code>nullable: true</code> is gone (write <code>type: [string, 'null']</code>); <code>examples</code> inside a schema is an <em>array</em>; and <code>additionalProperties: false</code> is how you say “no unknown fields” — the same rule as <code>z.strictObject</code> in Chapter 2. LabFlow’s rule from 2.3, “optional fields are always present, null when empty”, becomes <code>required</code> plus a null type.</p>
<p>The whole LabFlow v2 document is 523 lines: 12 operations, 16 schemas, 10 reusable error responses, 4 shared parameters. You do not write it in one go — you write one operation, lint, check, repeat.</p>

<h3>Lint: what a first draft looks like</h3>
<p>This is the kind of first draft everybody writes (no operation ids, no errors, an example copied from v1):</p>
<pre><code class="language-yaml">openapi: 3.1.0
info: { title: LabFlow API, version: 2.0.0 }
paths:
  /bookings:
    post:
      summary: Book a lab
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BookingCreate' }
            example: { labId: lab_1, startAt: '2027-03-02T08:00:00+07:00', endAt: '2027-03-02T10:00:00+07:00' }
      responses:
        '201': { description: Created, content: { application/json: { schema: { $ref: '#/components/schemas/Booking' } } } }
  /bookings/{id}:
    get:
      summary: One booking
      responses: { '200': { description: OK } }
# components: BookingCreate (labId, period), Booking, Lab — Lab không ai dùng</code></pre>
<pre><code class="language-bash">npx redocly lint openapi/first-draft.yaml --format=stylish</code></pre>
<div class="out">validating openapi/first-draft.yaml...
openapi/first-draft.yaml:
  2:1    error    no-empty-servers                Servers must be present.
  8:5    error    operation-operationId           Operation object should contain &#96;operationId&#96; field.
  18:7   error    operation-4xx-response          Operation must have at least one &#96;4XX&#96; response.
  25:5   error    operation-operationId           Operation object should contain &#96;operationId&#96; field.
  27:7   error    operation-4xx-response          Operation must have at least one &#96;4XX&#96; response.
  25:5   error    path-parameters-defined         The operation does not define the path parameter &#96;{id}&#96; expected by path &#96;/bookings/{id}&#96;.
  46:5   error    no-unused-components            Component: "Lab" is never used.
  8:5    error    security-defined                Every operation should have security defined on it or on the root level.
  25:5   error    security-defined                Every operation should have security defined on it or on the root level.
  3:1    warning  info-license                    Info object should contain &#96;license&#96; field.
  15:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must have required property 'period'.
  16:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must NOT have additional properties &#96;startAt&#96;.
  17:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must NOT have additional properties &#96;endAt&#96;.

openapi/first-draft.yaml: validated in 23ms

❌ Validation failed with 9 errors and 4 warnings.
run &#96;redocly lint --generate-ignore-file&#96; to add all problems to the ignore file.</div>
<p>Thirteen findings, every one a real problem for a reader: the example still uses v1’s <code>startAt</code>/<code>endAt</code> (Chapter 4 renamed them to <code>period</code>), <code>{id}</code> is never declared, no operation can fail, and the client generator in 7.2 would have no names for its functions. They show as <strong>errors</strong> because LabFlow’s config makes them errors — Redocly’s built-in “recommended” set reports several of them only as warnings:</p>
<pre><code class="language-yaml"># redocly.yaml — bộ "recommended" + luật chặt hơn của LabFlow
extends: [recommended]
rules:
  no-server-example.com: off       # localhost là cố ý; production là api.labflow.example
  operation-operationId: error
  operation-4xx-response: error
  no-unused-components: error
  tag-description: error</code></pre>
<a class="link-card" href="https://redocly.com/docs/cli/rules/recommended" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Redocly CLI — the “recommended” ruleset (read 1 Nov 2026)</span><span class="lc-sub">security-defined and path-parameters-defined are errors there; operation-operationId, operation-4xx-response, no-unused-components and no-invalid-media-type-examples are warnings. LabFlow raises them to errors.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Two YAML traps from LabFlow’s own document</h3>
<p>The short <code>{ … }</code> “flow” style is pleasant to read and dangerous to write. My first full draft did not even parse:</p>
<pre><code class="language-bash">npx redocly lint openapi/draft-1.yaml 2&gt;&amp;1 | grep -A2 'Failed to parse' | sed 's#"/.*/openapi/#"openapi/#'</code></pre>
<div class="out">Failed to parse API description at openapi/draft-1.yaml:

  - missed comma between flow collection entries in "openapi/draft-1.yaml" (116:71)</div>
<p>Line 116 said <code>description: Bookings that overlap [from, to)</code>. Inside <code>{ }</code>, <code>[</code> opens a list. After quoting it, the next run failed somewhere more interesting:</p>
<pre><code class="language-bash">npx redocly lint openapi/draft-2.yaml 2&gt;&amp;1 | sed -n '/\\[1\\]/,/struct rule/p'</code></pre>
<div class="out">[1] openapi/draft-2.yaml:73:66 at #/paths/~1labs/get/parameters/1/accent-insensitive

Property &#96;accent-insensitive&#96; is not expected here.

71 | parameters:
72 |   - { name: building, in: query, schema: { type: string, minLength: 1, maxLength: 50 } }
73 |   - { name: q, in: query, description: Search in the name, accent-insensitive, schema: { type: string, minLength: 1, maxLength: 50 } }
   |                                                            ^^^^^^^^^^^^^^^^^^^
74 |   - { name: minCapacity, in: query, schema: { type: integer, minimum: 1 } }
75 | responses:

Error was generated by the struct rule.</div>
<p>“Search in the name, accent-insensitive” contains a comma, so YAML read <code>accent-insensitive</code> as a <em>new key</em>. No parse error, just a wrong document — caught only because the linter knows which keys a Parameter may have. Rule: quote any text that contains <code>, [ ] { } :</code> or <code>#</code>.</p>
<pre><code class="language-bash">npx redocly lint openapi/openapi.yaml</code></pre>
<div class="out">validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 45ms

Woohoo! Your API description is valid. 🎉</div>

<div class="pitfall"><p><strong>Trap — “it parses, so it is correct”.</strong> The comma trap parsed fine and produced a wrong document. Only a linter that knows the OpenAPI structure saw it — run it in CI, not by eye.</p></div>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“What is OpenAPI for?”</strong> One machine-readable contract: docs, client types, mocks and contract tests come from it, so front-end and back-end can work in parallel.</li>
  <li><strong>“What changed in 3.1?”</strong> Schemas are full JSON Schema 2020-12: <code>type: [x, 'null']</code> instead of <code>nullable</code>, <code>examples</code> arrays, <code>const</code>.</li>
</ul>

<h3>🧪 Practice (20–30 min)</h3>
<div class="callout ok"><ol>
  <li>Add <code>GET /bookings/{id}/receipt</code>’s 200 example and the <code>Me</code> schema to your document; lint to zero.</li>
  <li>Document <code>PATCH /me</code> (strict body, only <code>name</code>, errors 400/401/415).</li>
  <li>Make one change in the document that is wrong on purpose (e.g. <code>capacity</code> as string). Does lint catch it? (Answer in lesson 7.2.)</li>
</ol>
<p><strong>Done when:</strong> <code>redocly lint</code> reports a valid document with your additions.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OpenAPI (OAS)</span><span class="v">Standard YAML/JSON format describing an HTTP API; formerly Swagger.</span></div>
  <div class="kv"><span class="k">Operation</span><span class="v">One method on one path, e.g. <code>POST /bookings</code>; named by <code>operationId</code>.</span></div>
  <div class="kv"><span class="k">Component</span><span class="v">A reusable piece (schema, parameter, response, header) referenced with <code>$ref</code>.</span></div>
  <div class="kv"><span class="k">JSON Schema 2020-12</span><span class="v">The schema language OAS 3.1 uses for bodies and parameters.</span></div>
  <div class="kv"><span class="k">Lint</span><span class="v">Automatic check of a document against rules (validity and team style).</span></div>
  <div class="kv"><span class="k">Drift</span><span class="v">When the document and the running server disagree.</span></div>
  <div class="kv"><span class="k">Contract check</span><span class="v">Real requests whose answers are validated against the document.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>LabFlow v2 as <code>openapi.yaml</code>: 12 operations, 16 schemas, 10 shared error responses, 0 lint errors.</li>
  <li>Measured: a typical first draft had 9 errors and 4 warnings; two YAML flow-style traps (brackets, a comma that became a key).</li>
  <li>Next lesson: a valid document can still lie about the server — the contract check.</li>
  <li>3.1 = JSON Schema 2020-12; 3.2.0 exists (Sep 2025) — stay on 3.1 until your tools support its features.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Viết OpenAPI 3.1 — và kiểm xem nó có nói thật không</h2>
<p class="lead">Suốt sáu chương, hợp đồng của LabFlow nằm rải ở lược đồ Zod, các view và các bài học; bạn front-end muốn biết <code>POST /v2/bookings</code> cần gì thì phải đọc code. Chương này viết nó thành MỘT tệp — <code>openapi.yaml</code> — mà máy kiểm lỗi (lint), sinh tài liệu, client có kiểu, máy chủ giả (mock), và đối chiếu với server đang chạy.</p>

<div class="callout ok">
<p><strong>Học xong Chương 7 bạn làm được:</strong></p>
<ul>
  <li>viết tài liệu OpenAPI 3.1 cho một API thật và đưa nó về 0 lỗi lint (7.1);</li>
  <li>chứng minh tài liệu khớp với server đang chạy bằng một bộ kiểm hợp đồng (7.1);</li>
  <li>từ tài liệu sinh ra trang docs, client TypeScript có kiểu và bộ validate, bắt client gọi sai ngay lúc biên dịch (7.2);</li>
  <li>làm theo kiểu thiết kế trước (design-first): review hợp đồng, dựng mock cho front-end, tự động chặn thay đổi phá vỡ (7.3);</li>
  <li>giải thích bằng số đo khi nào GraphQL hay gRPC hơn REST, và khi nào không (7.4).</li>
</ul>
<p><strong>Vì sao đáng học:</strong> trong một đội, hợp đồng API là thứ hai người thống nhất TRƯỚC khi ai viết code. Tin tuyển dụng hay ghi “OpenAPI nằm trong repo, CI kiểm nó”; và dự án cuối khoá (Chương 12) bắt đầu từ chính tệp này.</p>
</div>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch7-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API đầu Chương 7 (zip, không kèm node_modules)</span><span class="lc-sub">Hợp đồng 2.0.0, trước Lab 7. Chạy <code>npm ci</code> rồi <code>npm start</code>; mọi lệnh của bài 7.1–7.5 chạy từ thư mục dự án. Mật khẩu demo: an-lab-2026, binh-lab-2026, lan-lab-2026 (chỉ để học).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>OpenAPI trong một hình</h3>
<p><strong>OpenAPI</strong> là một định dạng chuẩn (YAML hoặc JSON) để mô tả một HTTP API: mọi đường dẫn (path), phương thức, tham số, body gửi lên, câu trả lời và lỗi. Nó bắt đầu là <em>Swagger</em> (2011) và đổi tên thành OpenAPI Specification năm 2016. Bản 3.1 (2021) cho lược đồ (schema) dùng đúng <strong>JSON Schema 2020-12</strong> — cùng ngôn ngữ mà Ajv và bộ xuất của Zod dùng. Bản mới hiện có là 3.1.1 (10/2024) và 3.2.0 (9/2025); LabFlow dùng 3.1 vì mọi công cụ trong chương này đều hỗ trợ (có đo ở cuối bài).</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · viết</span><span class="lz-t">openapi.yaml</span><span class="lz-d">path, schema, lỗi, ví dụ — chính là hợp đồng</span></div>
  <div class="lz-step"><span class="lz-k">2 · lint</span><span class="lz-t">Redocly + Spectral</span><span class="lz-d">tài liệu hợp lệ, đúng luật của đội</span></div>
  <div class="lz-step"><span class="lz-k">3 · dùng</span><span class="lz-t">docs · kiểu · mock</span><span class="lz-d">sinh từ cùng một tệp (7.2, 7.3)</span></div>
  <div class="lz-step"><span class="lz-k">4 · đối chiếu</span><span class="lz-t">kiểm hợp đồng</span><span class="lz-d">request thật so với tài liệu — lệch là lỗi</span></div>
</div>

<a class="link-card" href="https://spec.openapis.org/oas/v3.1.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: OpenAPI Specification v3.1.1 (24/10/2024) — đọc ngày 1/11/2026</span><span class="lc-sub">Chuẩn mà bài này làm theo; Schema Object của nó là JSON Schema 2020-12. Cùng trang liệt kê bản 3.2.0 (19/9/2025) có thêm phương thức QUERY, vị trí tham số querystring và kiểu media dạng luồng (streaming).</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Bộ khung</h3>
<p>Tài liệu nào cũng mở đầu bằng: mô tả API nào, chạy ở đâu. <code>security</code> ở gốc nghĩa là “mọi thao tác cần token” — thao tác công khai thì ghi <code>security: []</code>.</p>
<pre><code class="language-yaml">openapi: 3.1.0
info:
  title: LabFlow API
  version: 2.0.0
  license: { name: MIT, identifier: MIT }
servers:
  - url: https://api.labflow.example/v2
    description: Production
  - url: http://localhost:4000/v2
    description: Local development
security:
  - bearerAuth: []            # mặc định: mọi thao tác cần token
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: A token from POST /auth/login, or an API key (lf_live_…) in the same header.</code></pre>

<h3>Một thao tác, từng mảnh</h3>
<p>Đây là <code>POST /bookings</code> đúng như LabFlow hoạt động từ Chương 5: <code>Idempotency-Key</code> tuỳ chọn, body JSON, 201 kèm <code>Location</code> và header giới hạn tần suất, cùng mọi lỗi mà handler có thể trả.</p>
<pre><code class="language-yaml">paths:
  /bookings:
    post:
      tags: [Bookings]
      operationId: createBooking          # tên hàm của client sinh ra (7.2)
      summary: Book a lab
      parameters:
        - $ref: '#/components/parameters/IdempotencyKey'
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BookingCreate' }
            example:
              labId: lab_1
              period: { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' }
      responses:
        '201':
          description: Created
          headers:
            Location: { description: URL of the new booking, schema: { type: string } }
            RateLimit: { $ref: '#/components/headers/RateLimit' }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/Booking' }
        '400': { $ref: '#/components/responses/ValidationFailed' }
        '409': { $ref: '#/components/responses/Conflict' }
        # … 401, 415, 422, 429 — mọi lỗi handler có thể trả</code></pre>

<h3>Schema: hình dạng dữ liệu, viết bằng JSON Schema 2020-12</h3>
<pre><code class="language-yaml">components:
  schemas:
    Period:
      type: object
      required: [start, end]
      additionalProperties: false      # giống z.strictObject: trường lạ ⇒ không hợp lệ
      properties:
        start: { type: string, format: date-time }
        end: { type: string, format: date-time }
    Booking:
      type: object
      required: [id, labId, userId, period, purpose, status, createdAt, cancelledAt, checkedInAt]
      additionalProperties: false
      properties:
        id: { type: string, pattern: '^bk_\\d+$' }
        period: { $ref: '#/components/schemas/Period' }
        purpose: { type: [string, 'null'] }     # 3.1: kiểu null thay cho "nullable: true" của 3.0
        status: { type: string, enum: [PENDING, CHECKED_IN, CANCELLED] }
        createdAt: { type: string, format: date-time }
        cancelledAt: { type: [string, 'null'], format: date-time }
        # … labId, userId, checkedInAt
    Problem:
      type: object
      description: RFC 9457 Problem Details, plus LabFlow's machine-readable code
      required: [type, title, status, code]
      properties:
        type: { type: string, format: uri }
        title: { type: string }
        status: { type: integer }
        detail: { type: string }
        code: { type: string, examples: [BOOKING_CONFLICT] }
  responses:
    Conflict:
      description: The current state does not allow this (e.g. already cancelled, slot taken)
      content:
        application/problem+json:
          schema: { $ref: '#/components/schemas/Problem' }</code></pre>
<p>Ba chi tiết của 3.1 hay làm vấp người học theo hướng dẫn 3.0 cũ: <code>nullable: true</code> không còn (viết <code>type: [string, 'null']</code>); <code>examples</code> trong schema là một <em>mảng</em>; và <code>additionalProperties: false</code> là cách nói “không nhận trường lạ” — đúng luật <code>z.strictObject</code> ở Chương 2. Luật của LabFlow từ bài 2.3, “trường tuỳ chọn luôn có mặt, rỗng thì là null”, trở thành <code>required</code> cộng kiểu null.</p>
<p>Toàn bộ tài liệu LabFlow v2 dài 523 dòng: 12 thao tác, 16 schema, 10 câu trả lời lỗi dùng chung, 4 tham số dùng chung. Đừng viết một lèo — viết một thao tác, lint, kiểm, rồi lặp lại.</p>

<h3>Lint: bản nháp đầu tiên trông thế nào</h3>
<p>Đây là kiểu bản nháp ai cũng viết lần đầu (không có operationId, không có lỗi, ví dụ chép từ v1):</p>
<pre><code class="language-yaml">openapi: 3.1.0
info: { title: LabFlow API, version: 2.0.0 }
paths:
  /bookings:
    post:
      summary: Book a lab
      requestBody:
        content:
          application/json:
            schema: { $ref: '#/components/schemas/BookingCreate' }
            example: { labId: lab_1, startAt: '2027-03-02T08:00:00+07:00', endAt: '2027-03-02T10:00:00+07:00' }
      responses:
        '201': { description: Created, content: { application/json: { schema: { $ref: '#/components/schemas/Booking' } } } }
  /bookings/{id}:
    get:
      summary: One booking
      responses: { '200': { description: OK } }
# components: BookingCreate (labId, period), Booking, Lab — Lab không ai dùng</code></pre>
<pre><code class="language-bash">npx redocly lint openapi/first-draft.yaml --format=stylish</code></pre>
<div class="out">validating openapi/first-draft.yaml...
openapi/first-draft.yaml:
  2:1    error    no-empty-servers                Servers must be present.
  8:5    error    operation-operationId           Operation object should contain &#96;operationId&#96; field.
  18:7   error    operation-4xx-response          Operation must have at least one &#96;4XX&#96; response.
  25:5   error    operation-operationId           Operation object should contain &#96;operationId&#96; field.
  27:7   error    operation-4xx-response          Operation must have at least one &#96;4XX&#96; response.
  25:5   error    path-parameters-defined         The operation does not define the path parameter &#96;{id}&#96; expected by path &#96;/bookings/{id}&#96;.
  46:5   error    no-unused-components            Component: "Lab" is never used.
  8:5    error    security-defined                Every operation should have security defined on it or on the root level.
  25:5   error    security-defined                Every operation should have security defined on it or on the root level.
  3:1    warning  info-license                    Info object should contain &#96;license&#96; field.
  15:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must have required property 'period'.
  16:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must NOT have additional properties &#96;startAt&#96;.
  17:15  warning  no-invalid-media-type-examples  Example value must conform to the schema: must NOT have additional properties &#96;endAt&#96;.

openapi/first-draft.yaml: validated in 23ms

❌ Validation failed with 9 errors and 4 warnings.
run &#96;redocly lint --generate-ignore-file&#96; to add all problems to the ignore file.</div>
<p>Mười ba phát hiện, cái nào cũng là vấn đề thật với người đọc: ví dụ vẫn dùng <code>startAt</code>/<code>endAt</code> của v1 (Chương 4 đã đổi thành <code>period</code>), <code>{id}</code> không được khai báo, không thao tác nào có lỗi, và bộ sinh client ở 7.2 sẽ không có tên cho các hàm. Chúng hiện là <strong>error</strong> vì cấu hình của LabFlow nâng chúng lên — bộ “recommended” có sẵn của Redocly chỉ báo vài cái trong số đó là warning:</p>
<pre><code class="language-yaml"># redocly.yaml — bộ "recommended" + luật chặt hơn của LabFlow
extends: [recommended]
rules:
  no-server-example.com: off       # localhost là cố ý; production là api.labflow.example
  operation-operationId: error
  operation-4xx-response: error
  no-unused-components: error
  tag-description: error</code></pre>
<a class="link-card" href="https://redocly.com/docs/cli/rules/recommended" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Redocly CLI — bộ luật “recommended” (đọc ngày 1/11/2026)</span><span class="lc-sub">security-defined và path-parameters-defined là error; operation-operationId, operation-4xx-response, no-unused-components và no-invalid-media-type-examples là warning. LabFlow nâng chúng thành error.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Hai cái bẫy YAML trong chính tài liệu của LabFlow</h3>
<p>Kiểu viết gọn <code>{ … }</code> (“flow style”) dễ đọc nhưng dễ viết sai. Bản nháp đầy đủ đầu tiên của tôi còn không đọc được:</p>
<pre><code class="language-bash">npx redocly lint openapi/draft-1.yaml 2&gt;&amp;1 | grep -A2 'Failed to parse' | sed 's#"/.*/openapi/#"openapi/#'</code></pre>
<div class="out">Failed to parse API description at openapi/draft-1.yaml:

  - missed comma between flow collection entries in "openapi/draft-1.yaml" (116:71)</div>
<p>Dòng 116 ghi <code>description: Bookings that overlap [from, to)</code>. Bên trong <code>{ }</code>, dấu <code>[</code> mở một danh sách. Thêm nháy vào rồi, lần chạy sau hỏng ở chỗ thú vị hơn:</p>
<pre><code class="language-bash">npx redocly lint openapi/draft-2.yaml 2&gt;&amp;1 | sed -n '/\\[1\\]/,/struct rule/p'</code></pre>
<div class="out">[1] openapi/draft-2.yaml:73:66 at #/paths/~1labs/get/parameters/1/accent-insensitive

Property &#96;accent-insensitive&#96; is not expected here.

71 | parameters:
72 |   - { name: building, in: query, schema: { type: string, minLength: 1, maxLength: 50 } }
73 |   - { name: q, in: query, description: Search in the name, accent-insensitive, schema: { type: string, minLength: 1, maxLength: 50 } }
   |                                                            ^^^^^^^^^^^^^^^^^^^
74 |   - { name: minCapacity, in: query, schema: { type: integer, minimum: 1 } }
75 | responses:

Error was generated by the struct rule.</div>
<p>“Search in the name, accent-insensitive” có dấu phẩy, nên YAML đọc <code>accent-insensitive</code> thành một <em>khoá mới</em>. Không có lỗi cú pháp, chỉ là tài liệu sai — bắt được là nhờ bộ lint biết một Parameter được phép có những khoá nào. Luật: chữ nào có <code>, [ ] { } :</code> hay <code>#</code> thì đặt trong nháy.</p>
<pre><code class="language-bash">npx redocly lint openapi/openapi.yaml</code></pre>
<div class="out">validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 45ms

Woohoo! Your API description is valid. 🎉</div>

<div class="pitfall"><p><strong>Bẫy — “đọc được là đúng”.</strong> Bẫy dấu phẩy vẫn đọc được bình thường và cho ra một tài liệu sai. Chỉ bộ lint hiểu cấu trúc OpenAPI mới thấy — chạy nó trong CI, đừng soát bằng mắt.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“OpenAPI để làm gì?”</strong> Một hợp đồng máy đọc được: docs, kiểu cho client, mock và test hợp đồng đều sinh từ nó, nên front-end và back-end làm song song được.</li>
  <li><strong>“3.1 đổi gì?”</strong> Schema là JSON Schema 2020-12 đầy đủ: <code>type: [x, 'null']</code> thay cho <code>nullable</code>, <code>examples</code> là mảng, có <code>const</code>.</li>
</ul>

<h3>🧪 Luyện tập (20–30 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm ví dụ 200 cho <code>GET /bookings/{id}/receipt</code> và schema <code>Me</code> vào tài liệu của bạn; lint về 0.</li>
  <li>Mô tả <code>PATCH /me</code> (body chặt, chỉ có <code>name</code>, lỗi 400/401/415).</li>
  <li>Cố ý sửa sai một chỗ trong tài liệu (vd. <code>capacity</code> thành string). Lint có bắt được không? (Trả lời ở bài 7.2.)</li>
</ol>
<p><strong>Xong khi:</strong> <code>redocly lint</code> báo tài liệu (có phần bạn thêm) hợp lệ.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">OpenAPI (OAS)</span><span class="v">Định dạng YAML/JSON chuẩn mô tả một HTTP API; trước đây gọi là Swagger.</span></div>
  <div class="kv"><span class="k">Operation (thao tác)</span><span class="v">Một phương thức trên một path, vd. <code>POST /bookings</code>; đặt tên bằng <code>operationId</code>.</span></div>
  <div class="kv"><span class="k">Component</span><span class="v">Mảnh dùng lại được (schema, tham số, câu trả lời, header), trỏ tới bằng <code>$ref</code>.</span></div>
  <div class="kv"><span class="k">JSON Schema 2020-12</span><span class="v">Ngôn ngữ schema mà OAS 3.1 dùng cho body và tham số.</span></div>
  <div class="kv"><span class="k">Lint</span><span class="v">Kiểm tự động tài liệu theo luật (hợp lệ và đúng phong cách của đội).</span></div>
  <div class="kv"><span class="k">Drift (lệch)</span><span class="v">Khi tài liệu và server đang chạy nói khác nhau.</span></div>
  <div class="kv"><span class="k">Kiểm hợp đồng</span><span class="v">Gửi request thật rồi kiểm câu trả lời theo tài liệu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>LabFlow v2 thành <code>openapi.yaml</code>: 12 thao tác, 16 schema, 10 câu trả lời lỗi dùng chung, 0 lỗi lint.</li>
  <li>Đo được: một bản nháp đầu điển hình có 9 error và 4 warning; hai bẫy YAML kiểu flow (ngoặc vuông, dấu phẩy biến thành khoá).</li>
  <li>Bài sau: tài liệu hợp lệ vẫn có thể nói sai về server — kiểm hợp đồng.</li>
  <li>3.1 = JSON Schema 2020-12; đã có 3.2.0 (9/2025) — ở lại 3.1 tới khi công cụ hỗ trợ tính năng của nó.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 7.2 (bài MỚI) ─────────────────────────── */
    {
      title: '7.2 — Does the document tell the truth? Contract checks against the running server|||7.2 — Tài liệu có nói thật không? Kiểm hợp đồng với server đang chạy',
      slug: 'api-7-1-kiem-hop-dong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao tài liệu lệch; check-drift.mjs gửi request thật và kiểm theo tài liệu bằng Ajv 2020; bắt được endpoint chưa ghi và lỗi 415 thật (fetch gửi Content-Length: 0); bốn lớp kiểm.',
      content: `${G072}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Does the document tell the truth? Contract checks against the running server</h2>
<p class="lead">Lesson 7.1 ended with a document that lints clean. Lint only proves the document is <em>well-formed</em>; it cannot know what the server really answers. This lesson sends real requests and validates every answer against <code>openapi.yaml</code>. On its first run the check found an undocumented endpoint and a bug that six chapters of curl lines had missed.</p>

<h3>Why documents drift</h3>
<p><strong>Drift</strong> means the document and the server say different things. It does not need a careless team — it only needs time:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">day 1</span><span class="lz-t">document = server</span><span class="lz-d">written together, reviewed, merged</span></div>
  <div class="lz-step"><span class="lz-k">day 30</span><span class="lz-t">code changes</span><span class="lz-d">a new endpoint, a new error, a field becomes null</span></div>
  <div class="lz-step"><span class="lz-k">day 31</span><span class="lz-t">document forgotten</span><span class="lz-d">nobody’s test fails — the document is not code</span></div>
  <div class="lz-step"><span class="lz-k">day 60</span><span class="lz-t">a client trusts it</span><span class="lz-d">generated types (7.3) say “never null” — the app crashes</span></div>
</div>
<p>The fix is a test — a <strong>contract check</strong>: for real requests, is every status documented and does every body match its schema?</p>

<h3>The checker</h3>
<p>Sixty lines, three ideas: load the YAML; give Ajv the components so <code>$ref</code> works (OpenAPI 3.1 schemas are JSON Schema 2020-12, so Ajv’s 2020 class validates them directly); then for each request find the documented response for the <em>actual</em> status code and validate the body.</p>
<pre><code class="language-javascript">// check-drift.mjs — bài 7.2: tài liệu có nói ĐÚNG về server đang chạy không?
// Gửi request THẬT, rồi kiểm status + body của từng câu trả lời theo openapi.yaml (JSON Schema 2020-12, như OpenAPI 3.1).
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const BASE = process.env.BASE ?? 'http://localhost:4000/v2';
const SPEC = process.env.SPEC ?? new URL('./openapi.yaml', import.meta.url);   // SPEC=… để kiểm một phiên bản khác
const spec = parse(readFileSync(SPEC, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema({ $id: 'spec', components: spec.components });   // để $ref '#/components/…' trỏ được vào spec

// '#/components/schemas/X' ⇒ 'spec#/components/schemas/X' (đổi mọi $ref sang tài liệu gốc)
const rebase = (s) =&gt; JSON.parse(JSON.stringify(s).replaceAll('"#/components/', '"spec#/components/'));
const resolve = (o) =&gt; (o?.$ref ? o.$ref.split('/').slice(1).reduce((x, k) =&gt; x[k], spec) : o);

async function check(method, path, { token, body, headers = {} } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(token &amp;&amp; { Authorization: &#96;Bearer \${token}&#96; }), ...(body &amp;&amp; { 'Content-Type': 'application/json' }), ...headers },
    body: body &amp;&amp; JSON.stringify(body),
  });
  const template = Object.keys(spec.paths).find((p) =&gt; new RegExp(&#96;^\${p.replace(/\\{[^}]+\\}/g, '[^/]+')}$&#96;).test(path.split('?')[0]));
  const op = spec.paths[template]?.[method.toLowerCase()];
  const where = &#96;\${method} \${path} → \${res.status}&#96;;
  if (!op) return console.log(&#96;✗ \${where}: KHÔNG có trong tài liệu&#96;);
  const doc = resolve(op.responses[String(res.status)]);
  if (!doc) return console.log(&#96;✗ \${where}: tài liệu không khai mã \${res.status}&#96;);
  const type = (res.headers.get('content-type') ?? '').split(';')[0];
  const media = doc.content?.[type];
  if (doc.content &amp;&amp; !media) return console.log(&#96;✗ \${where}: tài liệu không khai kiểu \${type}&#96;);
  const data = await res.json().catch(() =&gt; undefined);
  if (!media) return console.log(&#96;✓ \${where}&#96;);
  const validate = ajv.compile(rebase(media.schema));
  if (validate(data)) return console.log(&#96;✓ \${where}&#96;);
  for (const e of validate.errors) console.log(&#96;✗ \${where}: \${e.instancePath || '(gốc)'} \${e.message}\${e.params?.additionalProperty ? &#96; "\${e.params.additionalProperty}"&#96; : ''}&#96;);
}

const login = async (email, password) =&gt; (await (await fetch(&#96;\${BASE}/auth/login&#96;, { method: 'POST',
  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })).json()).accessToken;
const an = await login('an@student.labflow.example', 'an-lab-2026');
const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
const lan = await login('lan@labflow.example', 'lan-lab-2026');
const period = { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' };

await check('GET', '/labs');
await check('GET', '/labs?minCapacity=abc');
await check('GET', '/labs/lab_1');
await check('GET', '/labs/lab_99');
await check('GET', '/me', { token: an });
await check('GET', '/me');
await check('POST', '/bookings', { token: an, body: { labId: 'lab_1', period } });
await check('POST', '/bookings', { token: bin, body: { labId: 'lab_1', period } });
await check('POST', '/bookings', { token: an, body: { labId: 'lab_1' } });
await check('GET', '/bookings?limit=1', { token: an });
await check('GET', '/bookings/bk_1', { token: an });
await check('GET', '/bookings/bk_1', { token: bin });
await check('GET', '/bookings/bk_1/receipt', { token: bin });
await check('POST', '/bookings/bk_1/cancel', { token: an });
await check('POST', '/bookings/bk_1/cancel', { token: an });
await check('POST', '/devices/dev_1/issues', { token: an, body: { title: 'Port 3 is dead', severity: 'HIGH' } });
await check('POST', '/issues/iss_1/resolve', { token: lan, headers: { 'If-Match': '"iss_1-v1"' }, body: {} });
await check('POST', '/issues/iss_1/resolve', { token: lan, headers: { 'If-Match': '"iss_1-v1"' }, body: {} });
await check('POST', '/bookings/bk_1/check-in', { token: an });

// Lab 7 — hàng chờ (chỉ kiểm khi tài liệu đã có /labs/{labId}/waitlist)
if (spec.paths['/labs/{labId}/waitlist']) {
  const P2 = { start: '2027-03-09T08:00:00+07:00', end: '2027-03-09T10:00:00+07:00' };
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2 } });
  await check('POST', '/bookings', { token: an, body: { labId: 'lab_2', period: P2 } });
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2 } });
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2 } });
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2, seats: 3 } });
  await check('GET', '/me/waitlist', { token: bin });
  await check('DELETE', '/waitlist/wl_1', { token: an });
  await check('DELETE', '/waitlist/wl_1', { token: bin });
}</code></pre>
<p>It logs in as three people (one account exercises one branch of each policy, 6.2), sends <em>failing</em> requests on purpose (errors are contract too), and never trusts its own expectations: it asks the document.</p>
<a class="link-card" href="https://ajv.js.org/json-schema.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Ajv — JSON Schema drafts and formats (read 1 Nov 2026)</span><span class="lc-sub">Draft 2020-12 needs Ajv’s separate 2020 class; “format” keywords such as date-time are only checked after adding the ajv-formats plugin — exactly the two lines at the top of check-drift.mjs.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>First run: two kinds of drift</h3>
<p>Against the server as it was at the end of Chapter 6:</p>
<pre><code class="language-bash">node openapi/check-drift.mjs</code></pre>
<div class="out">✓ GET /labs → 200
✓ GET /labs?minCapacity=abc → 400
✓ GET /labs/lab_1 → 200
✓ GET /labs/lab_99 → 404
✓ GET /me → 200
✓ GET /me → 401
✓ POST /bookings → 201
✓ POST /bookings → 409
✓ POST /bookings → 400
✓ GET /bookings?limit=1 → 200
✓ GET /bookings/bk_1 → 200
✓ GET /bookings/bk_1 → 403
✓ GET /bookings/bk_1/receipt → 404
✗ POST /bookings/bk_1/cancel → 415: tài liệu không khai mã 415
✗ POST /bookings/bk_1/cancel → 415: tài liệu không khai mã 415
✓ POST /devices/dev_1/issues → 201
✓ POST /issues/iss_1/resolve → 200
✓ POST /issues/iss_1/resolve → 412
✗ POST /bookings/bk_1/check-in → 415: KHÔNG có trong tài liệu</div>
<p><code>check-in</code> (lesson 4.4) was simply never documented: the document lagged the code. The 415 was worse. A cancel request has no body — why “unsupported media type”? Two curl lines settle it:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings/bk_1/cancel \\
  -H "Authorization: Bearer $(cat an.jwt)"</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings/bk_1/cancel \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  -H 'Content-Length: 0'</code></pre>
<div class="out">415</div>
<p>Who sends <code>Content-Length: 0</code>? A 15-line probe asks Node’s <code>fetch()</code> and a real Chromium:</p>
<pre><code class="language-javascript">// hdr-probe.mjs — bài 7.2: POST KHÔNG body, Node fetch và Chromium gửi header gì?
import http from 'node:http';
import { chromium } from 'playwright';
const seen = [];
const srv = http.createServer((req, res) =&gt; {
  if (req.method === 'POST') seen.push(&#96;\${req.headers['user-agent']?.includes('Chrome') ? 'Chromium' : 'Node fetch'}: content-length=\${req.headers['content-length'] ?? '(none)'} content-type=\${req.headers['content-type'] ?? '(none)'}&#96;);
  res.setHeader('Access-Control-Allow-Origin', '*'); res.end('ok');
}).listen(4099);
await fetch('http://localhost:4099/cancel', { method: 'POST' });
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('http://localhost:4099/');
await p.evaluate(() =&gt; fetch('/cancel', { method: 'POST' }));
await b.close(); srv.close();
console.log(seen.join('\\n'));</code></pre>
<pre><code class="language-bash">node hdr-probe.mjs</code></pre>
<div class="out">Node fetch: content-length=0 content-type=(none)
Chromium: content-length=0 content-type=(none)</div>
<p>That is a <strong>real bug</strong>. <code>fetch()</code> — in Node and in the browser — sends <code>Content-Length: 0</code> on a POST without a body. LabFlow’s gate from Chapter 2 treated “there is a length header” as “there is a body”, and a body without <code>Content-Type: application/json</code> gets 415. curl sends no length header for an empty POST, which is why six chapters of curl lines never saw it. The React app of the capstone would have failed on every cancel and check-in.</p>
<pre><code class="language-javascript">// app.js — bài 7.2: "Content-Length: 0" nghĩa là KHÔNG có body
const hasBody = (req) =&gt; req.get('transfer-encoding') !== undefined || Number(req.get('content-length') ?? 0) &gt; 0;
app.use((req, res, next) =&gt; {
  if (hasBody(req) &amp;&amp; req.is(JSON_TYPES) === false)
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', { got: req.get('content-type') });
  next();
});</code></pre>
<p>Then the document got <code>/bookings/{id}/check-in</code>, and a documented <code>415</code> on every operation that takes a body. Second run:</p>
<pre><code class="language-bash">node openapi/check-drift.mjs | cut -c1 | sort | uniq -c</code></pre>
<div class="out">  19 ✓</div>

<div class="pitfall"><p><strong>Trap — writing the document once, at the end.</strong> The next day it is already behind the code. A contract check in <code>npm test</code> or CI is what keeps it honest.</p></div>

<h3>What lint cannot see — the answer to 7.1’s exercise</h3>
<p>In 7.1’s practice you changed <code>capacity</code> to a string in the document. Lint is happy — the document is still a valid OpenAPI document. Only the server knows it sends a number:</p>
<pre><code class="language-bash">npx redocly lint openapi/capacity-string.yaml 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">Woohoo! Your API description is valid. 🎉</div>
<pre><code class="language-bash">SPEC=openapi/capacity-string.yaml node openapi/check-drift.mjs | grep -v '^✓'</code></pre>
<div class="out">✗ GET /labs → 200: /data/0/capacity must be string
✗ GET /labs → 200: /data/1/capacity must be string
✗ GET /labs → 200: /data/2/capacity must be string
✗ GET /labs/lab_1 → 200: /capacity must be string</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lint (Redocly, Spectral)</span><span class="lz-lnote">is the document well-formed and in our style? — no server needed</span></div>
  <div class="lz-layer"><span class="lz-lname">Contract check (this lesson)</span><span class="lz-lnote">does the running server answer what the document says?</span></div>
  <div class="lz-layer"><span class="lz-lname">Typed client (7.3)</span><span class="lz-lnote">does the CLIENT code use the document correctly? — compile time</span></div>
  <div class="lz-layer"><span class="lz-lname">Diff gate (7.4)</span><span class="lz-lnote">did the NEW document break old clients?</span></div>
</div>
<p>Each layer caught something real in this chapter that the others could not.</p>

<div class="pitfall"><p><strong>Trap — checking only the happy path.</strong> The 415 bug lived on a request that “just works” in curl. Send what real clients send (fetch, a browser, an app), and send the failing requests too.</p></div>

<h3>Making it part of the work</h3>
<p>LabFlow’s <code>package.json</code> gets named scripts — <code>api:lint</code>, <code>api:drift</code>, and later <code>api:types</code>, <code>api:docs</code>, <code>api:mock</code>, <code>api:diff</code> — so nobody has to remember the commands (full list in Lab 7).</p>
<p>In CI the order is: install → start the server with an empty database → <code>npm run api:lint</code> → <code>npm run api:drift</code> → stop. A pull request that adds an endpoint without documenting it fails the same way the first run above did.</p>
<p><strong>One step further:</strong> <em>consumer-driven contract testing</em> (Pact) — each client records the requests it makes, the provider replays them in CI. LabFlow’s provider-only check is enough while one team owns both sides.</p>
<a class="link-card" href="https://docs.pact.io/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Pact documentation — consumer-driven contract testing (read 1 Nov 2026)</span><span class="lc-sub">Contracts are generated from the consumers’ own tests, so only the parts of the provider that consumers really use are checked — and unused behaviour can change freely.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“How do you keep API docs correct?”</strong> Lint in CI plus a contract check that sends real requests (including failing ones) and validates them against the document. Here it found a real 415 bug.</li>
  <li><strong>“Lint passes — is the spec right?”</strong> Only well-formed. Lint cannot know what the server returns; a contract check can.</li>
</ul>

<h3>🧪 Practice (20–30 min)</h3>
<div class="callout ok"><ol>
  <li>Reproduce the 415 bug on the Chapter 6 code with <code>fetch()</code> in a five-line Node script, then apply the fix.</li>
  <li>Add <code>PATCH /me</code> (documented in 7.1’s practice) to <code>check-drift.mjs</code>: one valid request, one with <code>role</code> in the body (expect 400).</li>
  <li>Make the checker print which documented operations it never called (“coverage”). How many of LabFlow’s 12 are covered?</li>
</ol>
<p><strong>Done when:</strong> every line is ✓ and you can name the operations without a check.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Drift</span><span class="v">The document and the running server disagree.</span></div>
  <div class="kv"><span class="k">Contract check</span><span class="v">Real requests whose status codes and bodies are validated against the document.</span></div>
  <div class="kv"><span class="k">Ajv 2020</span><span class="v">The Ajv class that understands JSON Schema 2020-12 (OpenAPI 3.1 schemas).</span></div>
  <div class="kv"><span class="k">Content-Length: 0</span><span class="v">“The body is empty” — sent by fetch() on a body-less POST; not a body of the wrong type.</span></div>
  <div class="kv"><span class="k">Consumer-driven contract</span><span class="v">Clients record the requests they use; the provider replays them in CI (Pact).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Lint proves the document is well-formed; only a contract check proves it matches the server.</li>
  <li>First run: an undocumented endpoint (check-in) and a real bug — 415 on <code>Content-Length: 0</code>, which fetch()-based clients send (measured in Node and Chromium).</li>
  <li>After fixing the server and the document: 19/19 ✓; a wrong type in the document (<code>capacity</code> as string) passes lint but fails 4 checks.</li>
  <li>Four layers: lint · contract check · typed client · diff gate — each catches what the others cannot.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Tài liệu có nói thật không? Kiểm hợp đồng với server đang chạy</h2>
<p class="lead">Bài 7.1 kết thúc với một tài liệu lint sạch. Lint chỉ chứng minh tài liệu <em>viết đúng cấu trúc</em>; nó không thể biết server thật sự trả gì. Bài này gửi request thật rồi kiểm mọi câu trả lời theo <code>openapi.yaml</code>. Ngay lần chạy đầu, bộ kiểm tìm ra một endpoint chưa ghi tài liệu và một lỗi mà sáu chương gõ curl đã bỏ sót.</p>

<h3>Vì sao tài liệu bị lệch</h3>
<p><strong>Drift (lệch)</strong> là khi tài liệu và server nói khác nhau. Không cần một đội cẩu thả — chỉ cần thời gian trôi:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">ngày 1</span><span class="lz-t">tài liệu = server</span><span class="lz-d">viết cùng nhau, review, merge</span></div>
  <div class="lz-step"><span class="lz-k">ngày 30</span><span class="lz-t">code đổi</span><span class="lz-d">thêm endpoint, thêm lỗi, một trường thành null</span></div>
  <div class="lz-step"><span class="lz-k">ngày 31</span><span class="lz-t">quên tài liệu</span><span class="lz-d">không test nào đỏ — tài liệu đâu phải code</span></div>
  <div class="lz-step"><span class="lz-k">ngày 60</span><span class="lz-t">client tin nó</span><span class="lz-d">kiểu sinh ra (7.3) nói “không bao giờ null” — app sập</span></div>
</div>
<p>Cách chữa là một bài test — <strong>kiểm hợp đồng (contract check)</strong>: với request thật, mã trạng thái nào cũng có trong tài liệu và body nào cũng khớp schema?</p>

<h3>Bộ kiểm</h3>
<p>Sáu mươi dòng, ba ý: đọc YAML; đưa phần components cho Ajv để <code>$ref</code> trỏ được (schema của OpenAPI 3.1 là JSON Schema 2020-12, nên lớp Ajv 2020 kiểm thẳng được); rồi với mỗi request, tìm câu trả lời được ghi cho mã trạng thái <em>thực tế</em> và kiểm body.</p>
<pre><code class="language-javascript">// check-drift.mjs — bài 7.2: tài liệu có nói ĐÚNG về server đang chạy không?
// Gửi request THẬT, rồi kiểm status + body của từng câu trả lời theo openapi.yaml (JSON Schema 2020-12, như OpenAPI 3.1).
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const BASE = process.env.BASE ?? 'http://localhost:4000/v2';
const SPEC = process.env.SPEC ?? new URL('./openapi.yaml', import.meta.url);   // SPEC=… để kiểm một phiên bản khác
const spec = parse(readFileSync(SPEC, 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema({ $id: 'spec', components: spec.components });   // để $ref '#/components/…' trỏ được vào spec

// '#/components/schemas/X' ⇒ 'spec#/components/schemas/X' (đổi mọi $ref sang tài liệu gốc)
const rebase = (s) =&gt; JSON.parse(JSON.stringify(s).replaceAll('"#/components/', '"spec#/components/'));
const resolve = (o) =&gt; (o?.$ref ? o.$ref.split('/').slice(1).reduce((x, k) =&gt; x[k], spec) : o);

async function check(method, path, { token, body, headers = {} } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(token &amp;&amp; { Authorization: &#96;Bearer \${token}&#96; }), ...(body &amp;&amp; { 'Content-Type': 'application/json' }), ...headers },
    body: body &amp;&amp; JSON.stringify(body),
  });
  const template = Object.keys(spec.paths).find((p) =&gt; new RegExp(&#96;^\${p.replace(/\\{[^}]+\\}/g, '[^/]+')}$&#96;).test(path.split('?')[0]));
  const op = spec.paths[template]?.[method.toLowerCase()];
  const where = &#96;\${method} \${path} → \${res.status}&#96;;
  if (!op) return console.log(&#96;✗ \${where}: KHÔNG có trong tài liệu&#96;);
  const doc = resolve(op.responses[String(res.status)]);
  if (!doc) return console.log(&#96;✗ \${where}: tài liệu không khai mã \${res.status}&#96;);
  const type = (res.headers.get('content-type') ?? '').split(';')[0];
  const media = doc.content?.[type];
  if (doc.content &amp;&amp; !media) return console.log(&#96;✗ \${where}: tài liệu không khai kiểu \${type}&#96;);
  const data = await res.json().catch(() =&gt; undefined);
  if (!media) return console.log(&#96;✓ \${where}&#96;);
  const validate = ajv.compile(rebase(media.schema));
  if (validate(data)) return console.log(&#96;✓ \${where}&#96;);
  for (const e of validate.errors) console.log(&#96;✗ \${where}: \${e.instancePath || '(gốc)'} \${e.message}\${e.params?.additionalProperty ? &#96; "\${e.params.additionalProperty}"&#96; : ''}&#96;);
}

const login = async (email, password) =&gt; (await (await fetch(&#96;\${BASE}/auth/login&#96;, { method: 'POST',
  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })).json()).accessToken;
const an = await login('an@student.labflow.example', 'an-lab-2026');
const bin = await login('binh@student.labflow.example', 'binh-lab-2026');
const lan = await login('lan@labflow.example', 'lan-lab-2026');
const period = { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' };

await check('GET', '/labs');
await check('GET', '/labs?minCapacity=abc');
await check('GET', '/labs/lab_1');
await check('GET', '/labs/lab_99');
await check('GET', '/me', { token: an });
await check('GET', '/me');
await check('POST', '/bookings', { token: an, body: { labId: 'lab_1', period } });
await check('POST', '/bookings', { token: bin, body: { labId: 'lab_1', period } });
await check('POST', '/bookings', { token: an, body: { labId: 'lab_1' } });
await check('GET', '/bookings?limit=1', { token: an });
await check('GET', '/bookings/bk_1', { token: an });
await check('GET', '/bookings/bk_1', { token: bin });
await check('GET', '/bookings/bk_1/receipt', { token: bin });
await check('POST', '/bookings/bk_1/cancel', { token: an });
await check('POST', '/bookings/bk_1/cancel', { token: an });
await check('POST', '/devices/dev_1/issues', { token: an, body: { title: 'Port 3 is dead', severity: 'HIGH' } });
await check('POST', '/issues/iss_1/resolve', { token: lan, headers: { 'If-Match': '"iss_1-v1"' }, body: {} });
await check('POST', '/issues/iss_1/resolve', { token: lan, headers: { 'If-Match': '"iss_1-v1"' }, body: {} });
await check('POST', '/bookings/bk_1/check-in', { token: an });

// Lab 7 — hàng chờ (chỉ kiểm khi tài liệu đã có /labs/{labId}/waitlist)
if (spec.paths['/labs/{labId}/waitlist']) {
  const P2 = { start: '2027-03-09T08:00:00+07:00', end: '2027-03-09T10:00:00+07:00' };
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2 } });
  await check('POST', '/bookings', { token: an, body: { labId: 'lab_2', period: P2 } });
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2 } });
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2 } });
  await check('POST', '/labs/lab_2/waitlist', { token: bin, body: { period: P2, seats: 3 } });
  await check('GET', '/me/waitlist', { token: bin });
  await check('DELETE', '/waitlist/wl_1', { token: an });
  await check('DELETE', '/waitlist/wl_1', { token: bin });
}</code></pre>
<p>Nó đăng nhập bằng ba người (một tài khoản chỉ đi qua một nhánh của mỗi chính sách, 6.2), cố ý gửi cả request <em>hỏng</em> (lỗi cũng là hợp đồng), và không tự đặt kỳ vọng: nó hỏi tài liệu.</p>
<a class="link-card" href="https://ajv.js.org/json-schema.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Ajv — các bản JSON Schema và format (đọc ngày 1/11/2026)</span><span class="lc-sub">Draft 2020-12 cần lớp Ajv 2020 riêng; từ khoá “format” như date-time chỉ được kiểm khi thêm plugin ajv-formats — đúng hai dòng đầu của check-drift.mjs.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Lần chạy đầu: hai kiểu lệch</h3>
<p>Với server như cuối Chương 6:</p>
<pre><code class="language-bash">node openapi/check-drift.mjs</code></pre>
<div class="out">✓ GET /labs → 200
✓ GET /labs?minCapacity=abc → 400
✓ GET /labs/lab_1 → 200
✓ GET /labs/lab_99 → 404
✓ GET /me → 200
✓ GET /me → 401
✓ POST /bookings → 201
✓ POST /bookings → 409
✓ POST /bookings → 400
✓ GET /bookings?limit=1 → 200
✓ GET /bookings/bk_1 → 200
✓ GET /bookings/bk_1 → 403
✓ GET /bookings/bk_1/receipt → 404
✗ POST /bookings/bk_1/cancel → 415: tài liệu không khai mã 415
✗ POST /bookings/bk_1/cancel → 415: tài liệu không khai mã 415
✓ POST /devices/dev_1/issues → 201
✓ POST /issues/iss_1/resolve → 200
✓ POST /issues/iss_1/resolve → 412
✗ POST /bookings/bk_1/check-in → 415: KHÔNG có trong tài liệu</div>
<p><code>check-in</code> (bài 4.4) đơn giản là chưa từng được ghi: tài liệu chạy sau code. 415 thì tệ hơn. Request huỷ không có body — sao lại “kiểu media không hỗ trợ”? Hai dòng curl trả lời:</p>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings/bk_1/cancel \\
  -H "Authorization: Bearer $(cat an.jwt)"</code></pre>
<div class="out">200</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4000/v2/bookings/bk_1/cancel \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  -H 'Content-Length: 0'</code></pre>
<div class="out">415</div>
<p>Ai gửi <code>Content-Length: 0</code>? Một script dò 15 dòng hỏi <code>fetch()</code> của Node và một Chromium thật:</p>
<pre><code class="language-javascript">// hdr-probe.mjs — bài 7.2: POST KHÔNG body, Node fetch và Chromium gửi header gì?
import http from 'node:http';
import { chromium } from 'playwright';
const seen = [];
const srv = http.createServer((req, res) =&gt; {
  if (req.method === 'POST') seen.push(&#96;\${req.headers['user-agent']?.includes('Chrome') ? 'Chromium' : 'Node fetch'}: content-length=\${req.headers['content-length'] ?? '(none)'} content-type=\${req.headers['content-type'] ?? '(none)'}&#96;);
  res.setHeader('Access-Control-Allow-Origin', '*'); res.end('ok');
}).listen(4099);
await fetch('http://localhost:4099/cancel', { method: 'POST' });
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('http://localhost:4099/');
await p.evaluate(() =&gt; fetch('/cancel', { method: 'POST' }));
await b.close(); srv.close();
console.log(seen.join('\\n'));</code></pre>
<pre><code class="language-bash">node hdr-probe.mjs</code></pre>
<div class="out">Node fetch: content-length=0 content-type=(none)
Chromium: content-length=0 content-type=(none)</div>
<p>Đó là <strong>lỗi thật</strong>. <code>fetch()</code> — trong Node và trong trình duyệt — gửi <code>Content-Length: 0</code> khi POST không có body. Cổng kiểm từ Chương 2 của LabFlow coi “có header độ dài” là “có body”, mà body không có <code>Content-Type: application/json</code> thì nhận 415. curl không gửi header độ dài cho POST rỗng, nên sáu chương gõ curl không ai thấy. App React của dự án cuối khoá sẽ hỏng ở mọi lần huỷ và check-in.</p>
<pre><code class="language-javascript">// app.js — bài 7.2: "Content-Length: 0" nghĩa là KHÔNG có body
const hasBody = (req) =&gt; req.get('transfer-encoding') !== undefined || Number(req.get('content-length') ?? 0) &gt; 0;
app.use((req, res, next) =&gt; {
  if (hasBody(req) &amp;&amp; req.is(JSON_TYPES) === false)
    throw new HttpError(415, 'UNSUPPORTED_MEDIA_TYPE', { got: req.get('content-type') });
  next();
});</code></pre>
<p>Rồi tài liệu được thêm <code>/bookings/{id}/check-in</code>, và khai <code>415</code> cho mọi thao tác có body. Lần chạy thứ hai:</p>
<pre><code class="language-bash">node openapi/check-drift.mjs | cut -c1 | sort | uniq -c</code></pre>
<div class="out">  19 ✓</div>

<div class="pitfall"><p><strong>Bẫy — viết tài liệu một lần, vào cuối dự án.</strong> Hôm sau nó đã chạy sau code. Bộ kiểm hợp đồng trong <code>npm test</code> hay CI mới giữ nó trung thực.</p></div>

<h3>Thứ lint không thấy — đáp án bài luyện 7.1</h3>
<p>Ở phần luyện tập 7.1 bạn sửa <code>capacity</code> thành string trong tài liệu. Lint vẫn vui vẻ — tài liệu vẫn là một tài liệu OpenAPI hợp lệ. Chỉ server biết nó gửi một con số:</p>
<pre><code class="language-bash">npx redocly lint openapi/capacity-string.yaml 2&gt;&amp;1 | tail -2</code></pre>
<div class="out">Woohoo! Your API description is valid. 🎉</div>
<pre><code class="language-bash">SPEC=openapi/capacity-string.yaml node openapi/check-drift.mjs | grep -v '^✓'</code></pre>
<div class="out">✗ GET /labs → 200: /data/0/capacity must be string
✗ GET /labs → 200: /data/1/capacity must be string
✗ GET /labs → 200: /data/2/capacity must be string
✗ GET /labs/lab_1 → 200: /capacity must be string</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lint (Redocly, Spectral)</span><span class="lz-lnote">tài liệu đúng cấu trúc và đúng phong cách đội? — không cần server</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm hợp đồng (bài này)</span><span class="lz-lnote">server đang chạy có trả đúng như tài liệu nói?</span></div>
  <div class="lz-layer"><span class="lz-lname">Client có kiểu (7.3)</span><span class="lz-lnote">code CLIENT có dùng tài liệu đúng? — lúc biên dịch</span></div>
  <div class="lz-layer"><span class="lz-lname">Cổng so phiên bản (7.4)</span><span class="lz-lnote">tài liệu MỚI có làm gãy client cũ?</span></div>
</div>
<p>Trong chương này lớp nào cũng bắt được một thứ thật mà các lớp kia không bắt nổi.</p>

<div class="pitfall"><p><strong>Bẫy — chỉ kiểm đường vui (happy path).</strong> Lỗi 415 nằm ở một request “chạy ngon” với curl. Gửi đúng thứ client thật gửi (fetch, trình duyệt, app), và gửi cả request hỏng.</p></div>

<h3>Biến nó thành thói quen</h3>
<p><code>package.json</code> của LabFlow có các script đặt tên — <code>api:lint</code>, <code>api:drift</code>, rồi sau này <code>api:types</code>, <code>api:docs</code>, <code>api:mock</code>, <code>api:diff</code> — để không ai phải nhớ lệnh (danh sách đầy đủ ở Lab 7).</p>
<p>Trong CI thứ tự là: cài đặt → chạy server với CSDL rỗng → <code>npm run api:lint</code> → <code>npm run api:drift</code> → tắt server. Một pull request thêm endpoint mà không ghi tài liệu sẽ đỏ đúng như lần chạy đầu ở trên.</p>
<p><strong>Xa hơn một bước:</strong> <em>consumer-driven contract testing</em> (Pact) — mỗi client ghi lại request nó gửi, server chạy lại chúng trong CI. Bộ kiểm chỉ-phía-server của LabFlow là đủ khi một đội làm cả hai đầu.</p>
<a class="link-card" href="https://docs.pact.io/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: tài liệu Pact — consumer-driven contract testing (đọc ngày 1/11/2026)</span><span class="lc-sub">Hợp đồng sinh từ chính test của các client, nên chỉ phần server mà client thật sự dùng mới bị kiểm — phần không ai dùng được tự do thay đổi.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Giữ tài liệu API luôn đúng bằng cách nào?”</strong> Lint trong CI cộng một bộ kiểm hợp đồng gửi request thật (cả request hỏng) rồi kiểm theo tài liệu. Ở đây nó tìm ra một lỗi 415 thật.</li>
  <li><strong>“Lint qua rồi — spec đúng chưa?”</strong> Mới chỉ đúng cấu trúc. Lint không thể biết server trả gì; kiểm hợp đồng thì biết.</li>
</ul>

<h3>🧪 Luyện tập (20–30 phút)</h3>
<div class="callout ok"><ol>
  <li>Tái hiện lỗi 415 trên code Chương 6 bằng <code>fetch()</code> trong một script Node 5 dòng, rồi áp bản vá.</li>
  <li>Thêm <code>PATCH /me</code> (đã mô tả ở bài luyện 7.1) vào <code>check-drift.mjs</code>: một request hợp lệ, một request có <code>role</code> trong body (mong đợi 400).</li>
  <li>Cho bộ kiểm in ra các thao tác có trong tài liệu nhưng chưa từng được gọi (“độ phủ”). 12 thao tác của LabFlow được phủ bao nhiêu?</li>
</ol>
<p><strong>Xong khi:</strong> mọi dòng là ✓ và bạn kể được tên các thao tác chưa có phép kiểm.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Drift (lệch)</span><span class="v">Tài liệu và server đang chạy nói khác nhau.</span></div>
  <div class="kv"><span class="k">Kiểm hợp đồng</span><span class="v">Gửi request thật, kiểm mã trạng thái và body theo tài liệu.</span></div>
  <div class="kv"><span class="k">Ajv 2020</span><span class="v">Lớp Ajv hiểu JSON Schema 2020-12 (schema của OpenAPI 3.1).</span></div>
  <div class="kv"><span class="k">Content-Length: 0</span><span class="v">“Body rỗng” — fetch() gửi khi POST không có body; không phải body sai kiểu.</span></div>
  <div class="kv"><span class="k">Consumer-driven contract</span><span class="v">Client ghi lại request nó dùng; server chạy lại chúng trong CI (Pact).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Lint chứng minh tài liệu đúng cấu trúc; chỉ kiểm hợp đồng mới chứng minh nó khớp server.</li>
  <li>Lần chạy đầu: một endpoint chưa ghi (check-in) và một lỗi thật — 415 với <code>Content-Length: 0</code>, thứ mọi client dùng fetch() đều gửi (đo cả Node lẫn Chromium).</li>
  <li>Sau khi vá server và tài liệu: 19/19 ✓; một kiểu sai trong tài liệu (<code>capacity</code> thành string) qua lint nhưng trượt 4 phép kiểm.</li>
  <li>Bốn lớp: lint · kiểm hợp đồng · client có kiểu · cổng so phiên bản — lớp nào cũng bắt được thứ các lớp khác không bắt nổi.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Generating docs, typed clients and validators from one file|||7.3 — Sinh tài liệu, client có kiểu và bộ validate từ một tệp',
      slug: 'api-7-2-sinh-code',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Server công bố /docs và /openapi.yaml; openapi-typescript + openapi-fetch: tsc bắt 4 lỗi gọi API và một trường bị đổi tên; schema của tài liệu so với Zod: hình dạng, chuẩn hoá, luật nghiệp vụ.',
      content: `${G073}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Generating docs, typed clients and validators from one file</h2>
<p class="lead">A contract that only humans read is half used. This lesson turns <code>openapi.yaml</code> into three things: a documentation page the server publishes, TypeScript types that make a client refuse to compile when it calls LabFlow wrongly, and a comparison of the document’s schemas with the Zod validators the server really runs. One finding: JSON Schema cannot say everything Zod says.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">input</span><span class="lz-t">openapi.yaml</span><span class="lz-d">one source of truth</span></div>
  <div class="lz-step"><span class="lz-k">for people</span><span class="lz-t">docs/index.html</span><span class="lz-d">Redoc page at /docs, raw file at /openapi.yaml</span></div>
  <div class="lz-step"><span class="lz-k">for client code</span><span class="lz-t">labflow.d.ts</span><span class="lz-d">types → mistakes fail at compile time</span></div>
  <div class="lz-step"><span class="lz-k">for the server</span><span class="lz-t">schema checks</span><span class="lz-d">compared with Zod — what each can express</span></div>
</div>

<h3>Documentation the server publishes</h3>
<p>Docs belong next to the API, at a fixed URL, so nobody reads an old PDF. Redocly renders the document into one HTML file; two routes publish it and the raw YAML:</p>
<pre><code class="language-javascript">// app.js — bài 7.3: tài liệu là một phần của API
const SPEC = readFileSync(new URL('../openapi/openapi.yaml', import.meta.url));
app.get('/openapi.yaml', (req, res) =&gt; res.type('application/yaml').set('Cache-Control', 'public, max-age=300').send(SPEC));
app.get('/docs', (req, res) =&gt; res.sendFile(new URL('../docs/index.html', import.meta.url).pathname));</code></pre>
<pre><code class="language-bash">npm run api:docs 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🎉 bundled successfully in: docs/index.html (280 KiB) [⏱ 90ms].</div>
<pre><code class="language-bash">curl -sI http://localhost:4000/openapi.yaml | grep -iE '^(HTTP|content-type|cache-control)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/yaml
Cache-Control: public, max-age=300</div>
<pre><code class="language-bash">curl -sI http://localhost:4000/docs | grep -iE '^(HTTP|content-type|content-length)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 286620</div>
<p>Two details from the real run. The page is 280 KiB because Redocly pre-renders every operation into HTML. And by default it still loads the Redoc script from Redocly’s CDN — on a network without internet (an exam room, a locked-down company) pass <code>--inlineBundle</code>. The raw <code>/openapi.yaml</code> is what tools and other teams download; cache it for a few minutes like any static file (Chapter 9 goes deeper into caching).</p>
<a class="link-card" href="https://redocly.com/docs/cli/commands/build-docs" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Redocly CLI — build-docs (read 1 Nov 2026)</span><span class="lc-sub">Builds Redoc into one HTML file (default name redoc-static.html); loads the Redoc scripts from the Redocly CDN unless you pass --inlineBundle.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Types for the client</h3>
<p><strong>openapi-typescript</strong> reads the document and writes TypeScript <em>types only</em> — no runtime code. <strong>openapi-fetch</strong> is a tiny <code>fetch</code> wrapper that uses those types to check every path, parameter and body. One gotcha from installing them on 1 Nov 2026: openapi-typescript 7.13 declares <code>typescript@^5</code> as a peer dependency, so <code>npm i -D typescript</code> (which installed 7.0) failed with <code>ERESOLVE</code>; <code>typescript@5</code> works.</p>
<pre><code class="language-bash">npm run api:types 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🚀 openapi/openapi.yaml → client/labflow.d.ts [76.3ms]</div>
<pre><code class="language-bash">wc -l client/labflow.d.ts</code></pre>
<div class="out">     813 client/labflow.d.ts</div>
<pre><code class="language-bash">grep -A11 '        Booking: {' client/labflow.d.ts</code></pre>
<div class="out">        Booking: {
            id: string;
            labId: components["schemas"]["LabId"];
            userId: string;
            period: components["schemas"]["Period"];
            purpose: string | null;
            /** @enum {string} */
            status: "PENDING" | "CHECKED_IN" | "CANCELLED";
            createdAt: components["schemas"]["Instant"];
            /** Format: date-time */
            cancelledAt: string | null;
            /** Format: date-time */</div>
<p><code>purpose: string | null</code> and the exact three statuses come straight from the schema of 7.1. A client written against these types:</p>
<pre><code class="language-typescript">// client/book.ts — bài 7.3: client CÓ KIỂU sinh từ openapi.yaml (openapi-typescript + openapi-fetch)
import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';

const api = createClient&lt;paths&gt;({ baseUrl: 'http://localhost:4000/v2' });

const login = await api.POST('/auth/login', {
  body: { email: 'an@student.labflow.example', password: 'an-lab-2026' },
});
if (!login.data) throw new Error(login.error.detail);
const auth = { Authorization: &#96;Bearer \${login.data.accessToken}&#96; };

const { data, error, response } = await api.POST('/bookings', {
  headers: auth,
  body: { labId: 'lab_2', period: { start: '2027-03-03T13:00:00+07:00', end: '2027-03-03T15:00:00+07:00' } },
});
if (error) console.log(response.status, error.code, error.detail);
else console.log(response.status, data.id, data.status, data.period.start, response.headers.get('location'));</code></pre>
<pre><code class="language-bash">npx tsc -p . &amp;&amp; echo 'tsc: 0 lỗi'</code></pre>
<div class="out">tsc: 0 lỗi</div>
<pre><code class="language-bash">node client/book.ts</code></pre>
<div class="out">201 bk_1 PENDING 2027-03-03T06:00:00.000Z /v2/bookings/bk_1</div>
<pre><code class="language-bash">node client/book.ts</code></pre>
<div class="out">409 BOOKING_CONFLICT Phòng đã có lượt bk_1 trong khung giờ này</div>
<p>Node 22 runs <code>.ts</code> files directly (it strips the types), so there is no build step in this exercise.</p>

<h3>What the types catch — before anything runs</h3>
<p>Three mistakes everyone makes when calling an API by hand, plus a forgotten path parameter:</p>
<pre><code class="language-typescript">const { data } = await api.POST('/bookings', {
  body: { labID: 'lab_2', period: { start: '2027-03-03T13:00:00+07:00', end: '2027-03-03T15:00:00+07:00' } },
});
if (data) {
  console.log(data.purpose.length);                 // purpose có thể là null
  if (data.status === 'CONFIRMED') console.log('ok'); // không có trạng thái này
}
await api.GET('/bookings/{id}', {});               // quên tham số đường dẫn id</code></pre>
<pre><code class="language-bash">npx tsc -p mistakes</code></pre>
<div class="out">mistakes/book-wrong.ts(8,11): error TS2561: Object literal may only specify known properties, but 'labID' does not exist in type '{ labId: string; period: { start: string; end: string; } &amp; {}; purpose?: string | undefined; } &amp; {}'. Did you mean to write 'labId'?
mistakes/book-wrong.ts(11,15): error TS18047: 'data.purpose' is possibly 'null'.
mistakes/book-wrong.ts(12,7): error TS2367: This comparison appears to be unintentional because the types '"PENDING" | "CHECKED_IN" | "CANCELLED"' and '"CONFIRMED"' have no overlap.
mistakes/book-wrong.ts(14,33): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ params: { query?: undefined; header?: undefined; path: { id: string; }; cookie?: undefined; }; } &amp; { body?: undefined; } &amp; { baseUrl?: string | undefined; querySerializer?: QuerySerializerOptions | QuerySerializer&lt;...&gt; | undefined; ... 5 more ...; middleware?: Middleware[] | undefined; } &amp; Omit&lt;...&gt; &amp; { ...; }'.
  Property 'params' is missing in type '{}' but required in type '{ params: { query?: undefined; header?: undefined; path: { id: string; }; cookie?: undefined; }; }'.</div>
<p>Each error points at a real crash or a silent 400: the typo would get <code>VALIDATION_FAILED</code>, <code>purpose.length</code> would throw on the first booking without a purpose, and <code>'CONFIRMED'</code> would never be true.</p>

<h3>When the contract changes</h3>
<p>Suppose the back-end team renames <code>period</code> to <code>slot</code> in the document. Regenerate the types and compile the client that worked a minute ago:</p>
<pre><code class="language-bash">npx openapi-typescript openapi/rename-period.yaml -o client/labflow.d.ts 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🚀 openapi/rename-period.yaml → client/labflow.d.ts [77.7ms]</div>
<pre><code class="language-bash">npx tsc -p .</code></pre>
<div class="out">client/book.ts(18,62): error TS2339: Property 'period' does not exist on type '{ id: string; labId: string; userId: string; slot: { start: string; end: string; }; purpose: string | null; status: "PENDING" | "CHECKED_IN" | "CANCELLED"; createdAt: string; cancelledAt: string | null; checkedInAt: string | null; }'.</div>
<pre><code class="language-bash">npm run -s api:types &gt;/dev/null 2&gt;&amp;1 &amp;&amp; npx tsc -p . &amp;&amp; echo 'tsc: 0 lỗi'</code></pre>
<div class="out">tsc: 0 lỗi</div>
<p>The break shows up in the <strong>client’s</strong> build, at the exact line that reads <code>data.period</code>, before any user sees it. That is why companies regenerate client types in CI. (Whether such a rename may ship at all is lesson 7.4’s job — it is a breaking change.)</p>

<div class="pitfall"><p><strong>Trap — editing the generated file.</strong> <code>labflow.d.ts</code> says “do not make direct changes”: the next <code>npm run api:types</code> overwrites it. Change the document, regenerate.</p></div>

<h3>Validators: the document’s schema vs the server’s Zod</h3>
<p>Could the server validate requests with the document’s schemas instead of Zod? Same bodies, both validators:</p>
<pre><code class="language-javascript">// compare-validators.mjs — bài 7.3: cùng một body, kiểm bằng lược đồ trong openapi.yaml (Ajv) và bằng Zod của server
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { BookingCreateV2 } from '../src/schemas.js';

const spec = parse(readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'));
const ajv = addFormats(new Ajv2020({ allErrors: true, strict: false }));
ajv.addSchema({ $id: 'spec', components: spec.components });
const fromSpec = ajv.getSchema('spec#/components/schemas/BookingCreate');

const P = { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' };
const cases = {
  'hợp lệ': { labId: 'lab_1', period: P },
  'gõ sai labID': { labID: 'lab_1', period: P },
  'thêm status': { labId: 'lab_1', period: P, status: 'CHECKED_IN' },
  'giờ không múi giờ': { labId: 'lab_1', period: { ...P, start: '2027-03-02T08:00:00' } },
  'purpose toàn dấu cách': { labId: 'lab_1', period: P, purpose: '   ' },
  'end trước start': { labId: 'lab_1', period: { start: P.end, end: P.start } },
};
const yn = (ok) =&gt; (ok ? 'nhận' : 'TỪ CHỐI');
for (const [name, body] of Object.entries(cases)) {
  console.log(&#96;\${name.padEnd(24)} spec: \${yn(fromSpec(body)).padEnd(8)} zod: \${yn(BookingCreateV2.safeParse(body).success)}&#96;);
}</code></pre>
<pre><code class="language-bash">node openapi/compare-validators.mjs</code></pre>
<div class="out">hợp lệ                   spec: nhận     zod: nhận
gõ sai labID             spec: TỪ CHỐI  zod: TỪ CHỐI
thêm status              spec: TỪ CHỐI  zod: TỪ CHỐI
giờ không múi giờ        spec: TỪ CHỐI  zod: TỪ CHỐI
purpose toàn dấu cách    spec: nhận     zod: TỪ CHỐI
end trước start          spec: nhận     zod: nhận</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-03-05T10:00:00+07:00","end":"2027-03-05T08:00:00+07:00"}}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"INVALID_TIME_RANGE","detail":"endAt phải sau startAt"}</div>
<p>They agree on <strong>shape</strong>: unknown fields, a missing time zone. They differ where Zod does more than describe — <code>.trim()</code> turns “   ” into an empty string that fails <code>min(1)</code>; JSON Schema has no trimming, so “   ” is a valid string of length 3. And neither checks the <strong>business rule</strong> “end after start”: the handler does, with 422. Three layers, each with its own job:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Shape — the document</span><span class="lz-lnote">types, required, unknown fields, formats ⇒ 400 (mock and clients use this)</span></div>
  <div class="lz-layer"><span class="lz-lname">Normalisation — Zod</span><span class="lz-lnote">trim, NFC, coercion of query strings ⇒ 400</span></div>
  <div class="lz-layer"><span class="lz-lname">Business rules — handler</span><span class="lz-lnote">end after start, lab exists, ≤ 3 active ⇒ 422 / 409</span></div>
</div>
<p>So LabFlow keeps Zod in the server, the document for everyone else, and the contract check of 7.2 to prove they agree. Look at the 422’s <code>detail</code> once more: “endAt phải sau startAt” — a v1 field name inside a v2 answer. The contract check could not catch it (the schema only says <code>detail</code> is a string); a reader did. Fix it in the practice.</p>

<div class="pitfall"><p><strong>Trap — two validators that silently disagree.</strong> If you validate with both the document and Zod, the stricter one wins and the error messages differ. Pick one per layer and test that they agree.</p></div>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“How do front-end and back-end stay in sync?”</strong> Generate client types from the OpenAPI document in CI; a contract change breaks the client build, not production.</li>
  <li><strong>“Validate with the spec or with code?”</strong> The spec for shape (shared with mocks and clients), code for normalisation and business rules — and a contract test that they agree.</li>
</ul>

<h3>🧪 Practice (20–30 min)</h3>
<div class="callout ok"><ol>
  <li>Write <code>client/cancel.ts</code> with openapi-fetch: cancel your booking, print the new status; make one deliberate mistake and read the tsc error.</li>
  <li>Make the v2 message for <code>INVALID_TIME_RANGE</code> say <code>period.end</code> / <code>period.start</code>, without changing v1’s message.</li>
  <li>Add <code>--inlineBundle</code> to <code>api:docs</code> and compare the file size and the number of external requests in DevTools.</li>
</ol>
<p><strong>Done when:</strong> <code>npx tsc -p .</code> shows 0 errors for your correct client and the expected errors for the broken one.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Redoc</span><span class="v">A renderer that turns an OpenAPI document into a documentation page.</span></div>
  <div class="kv"><span class="k">openapi-typescript</span><span class="v">Generates TypeScript types (no runtime code) from OpenAPI 3.0/3.1.</span></div>
  <div class="kv"><span class="k">openapi-fetch</span><span class="v">A small typed fetch client that uses those types.</span></div>
  <div class="kv"><span class="k">Peer dependency</span><span class="v">A package your package expects the project to install, in a given version range.</span></div>
  <div class="kv"><span class="k">Normalisation</span><span class="v">Changing input into a standard form (trim, NFC) before checking it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>The server publishes <code>/docs</code> (Redoc, 280 KiB, CDN script unless <code>--inlineBundle</code>) and <code>/openapi.yaml</code>.</li>
  <li>813 lines of generated types; tsc caught 4 client mistakes and a renamed field — at compile time.</li>
  <li>Document and Zod agree on shape, differ on normalisation (“   ”); business rules live in the handler (422).</li>
  <li>Found by reading: a v1 field name in a v2 error message — contract checks only check structure.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-7-1-mapped-types" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Deriving a type so it cannot drift — TS 7.1: Mapped types</span><span class="lc-sub">Same: a type computed from one source of truth never drifts, so you never hand-maintain a copy that falls out of date. Different: there a generator turns an OpenAPI document into client types as a build step; in TypeScript a mapped type <code>{ [K in keyof T]: … }</code> derives a form, <code>Readonly</code> or <code>Record</code> from another type at compile time, with no generator — and <code>Readonly</code>/<code>Record</code> are themselves mapped types.</span></span>
  <span class="lc-cta">OPEN TYPESCRIPT LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Sinh tài liệu, client có kiểu và bộ validate từ một tệp</h2>
<p class="lead">Hợp đồng mà chỉ người đọc thì mới dùng được một nửa. Bài này biến <code>openapi.yaml</code> thành ba thứ: trang tài liệu do server công bố, kiểu TypeScript khiến client gọi sai LabFlow là không biên dịch nổi, và một phép so giữa schema trong tài liệu với bộ validate Zod mà server thật sự chạy. Một phát hiện: JSON Schema không nói được mọi thứ Zod nói.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">đầu vào</span><span class="lz-t">openapi.yaml</span><span class="lz-d">một nguồn sự thật</span></div>
  <div class="lz-step"><span class="lz-k">cho người</span><span class="lz-t">docs/index.html</span><span class="lz-d">trang Redoc ở /docs, tệp gốc ở /openapi.yaml</span></div>
  <div class="lz-step"><span class="lz-k">cho code client</span><span class="lz-t">labflow.d.ts</span><span class="lz-d">kiểu → gọi sai thì hỏng lúc biên dịch</span></div>
  <div class="lz-step"><span class="lz-k">cho server</span><span class="lz-t">kiểm theo schema</span><span class="lz-d">so với Zod — mỗi bên nói được gì</span></div>
</div>

<h3>Tài liệu do chính server công bố</h3>
<p>Tài liệu nên nằm cạnh API, ở một URL cố định, để không ai đọc nhầm một tệp PDF cũ. Redocly dựng tài liệu thành một tệp HTML; hai route công bố nó cùng tệp YAML gốc:</p>
<pre><code class="language-javascript">// app.js — bài 7.3: tài liệu là một phần của API
const SPEC = readFileSync(new URL('../openapi/openapi.yaml', import.meta.url));
app.get('/openapi.yaml', (req, res) =&gt; res.type('application/yaml').set('Cache-Control', 'public, max-age=300').send(SPEC));
app.get('/docs', (req, res) =&gt; res.sendFile(new URL('../docs/index.html', import.meta.url).pathname));</code></pre>
<pre><code class="language-bash">npm run api:docs 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🎉 bundled successfully in: docs/index.html (280 KiB) [⏱ 90ms].</div>
<pre><code class="language-bash">curl -sI http://localhost:4000/openapi.yaml | grep -iE '^(HTTP|content-type|cache-control)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: application/yaml
Cache-Control: public, max-age=300</div>
<pre><code class="language-bash">curl -sI http://localhost:4000/docs | grep -iE '^(HTTP|content-type|content-length)'</code></pre>
<div class="out">HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 286620</div>
<p>Hai chi tiết từ lần chạy thật. Trang nặng 280 KiB vì Redocly dựng sẵn mọi thao tác thành HTML. Và mặc định nó vẫn tải script Redoc từ CDN của Redocly — ở mạng không có internet (phòng thi, công ty khoá mạng) hãy thêm <code>--inlineBundle</code>. Tệp <code>/openapi.yaml</code> gốc là thứ công cụ và đội khác tải về; cho cache vài phút như mọi tệp tĩnh (Chương 9 nói kỹ về cache).</p>
<a class="link-card" href="https://redocly.com/docs/cli/commands/build-docs" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Redocly CLI — build-docs (đọc ngày 1/11/2026)</span><span class="lc-sub">Dựng Redoc thành một tệp HTML (tên mặc định redoc-static.html); tải script Redoc từ CDN của Redocly trừ khi thêm --inlineBundle.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Kiểu cho client</h3>
<p><strong>openapi-typescript</strong> đọc tài liệu và viết ra <em>chỉ kiểu</em> TypeScript — không có code chạy. <strong>openapi-fetch</strong> là một lớp bọc <code>fetch</code> rất nhỏ dùng các kiểu đó để kiểm mọi path, tham số và body. Một cái bẫy khi cài ngày 1/11/2026: openapi-typescript 7.13 khai <code>typescript@^5</code> là peer dependency (gói “đi kèm” mà dự án phải tự cài, đúng dải phiên bản), nên cài TypeScript 7.0 thì <code>npm</code> báo <code>ERESOLVE</code>; dùng <code>typescript@5</code> là chạy.</p>
<pre><code class="language-bash">npm run api:types 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🚀 openapi/openapi.yaml → client/labflow.d.ts [76.3ms]</div>
<pre><code class="language-bash">wc -l client/labflow.d.ts</code></pre>
<div class="out">     813 client/labflow.d.ts</div>
<pre><code class="language-bash">grep -A11 '        Booking: {' client/labflow.d.ts</code></pre>
<div class="out">        Booking: {
            id: string;
            labId: components["schemas"]["LabId"];
            userId: string;
            period: components["schemas"]["Period"];
            purpose: string | null;
            /** @enum {string} */
            status: "PENDING" | "CHECKED_IN" | "CANCELLED";
            createdAt: components["schemas"]["Instant"];
            /** Format: date-time */
            cancelledAt: string | null;
            /** Format: date-time */</div>
<p><code>purpose: string | null</code> và đúng ba trạng thái lấy thẳng từ schema ở bài 7.1. Một client viết theo các kiểu đó:</p>
<pre><code class="language-typescript">// client/book.ts — bài 7.3: client CÓ KIỂU sinh từ openapi.yaml (openapi-typescript + openapi-fetch)
import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';

const api = createClient&lt;paths&gt;({ baseUrl: 'http://localhost:4000/v2' });

const login = await api.POST('/auth/login', {
  body: { email: 'an@student.labflow.example', password: 'an-lab-2026' },
});
if (!login.data) throw new Error(login.error.detail);
const auth = { Authorization: &#96;Bearer \${login.data.accessToken}&#96; };

const { data, error, response } = await api.POST('/bookings', {
  headers: auth,
  body: { labId: 'lab_2', period: { start: '2027-03-03T13:00:00+07:00', end: '2027-03-03T15:00:00+07:00' } },
});
if (error) console.log(response.status, error.code, error.detail);
else console.log(response.status, data.id, data.status, data.period.start, response.headers.get('location'));</code></pre>
<pre><code class="language-bash">npx tsc -p . &amp;&amp; echo 'tsc: 0 lỗi'</code></pre>
<div class="out">tsc: 0 lỗi</div>
<pre><code class="language-bash">node client/book.ts</code></pre>
<div class="out">201 bk_1 PENDING 2027-03-03T06:00:00.000Z /v2/bookings/bk_1</div>
<pre><code class="language-bash">node client/book.ts</code></pre>
<div class="out">409 BOOKING_CONFLICT Phòng đã có lượt bk_1 trong khung giờ này</div>
<p>Node 22 chạy thẳng tệp <code>.ts</code> (nó bỏ phần kiểu đi), nên bài này không cần bước build.</p>

<h3>Kiểu bắt được gì — trước khi chạy bất cứ thứ gì</h3>
<p>Ba lỗi ai cũng mắc khi gọi API bằng tay, cộng một tham số đường dẫn bị quên:</p>
<pre><code class="language-typescript">const { data } = await api.POST('/bookings', {
  body: { labID: 'lab_2', period: { start: '2027-03-03T13:00:00+07:00', end: '2027-03-03T15:00:00+07:00' } },
});
if (data) {
  console.log(data.purpose.length);                 // purpose có thể là null
  if (data.status === 'CONFIRMED') console.log('ok'); // không có trạng thái này
}
await api.GET('/bookings/{id}', {});               // quên tham số đường dẫn id</code></pre>
<pre><code class="language-bash">npx tsc -p mistakes</code></pre>
<div class="out">mistakes/book-wrong.ts(8,11): error TS2561: Object literal may only specify known properties, but 'labID' does not exist in type '{ labId: string; period: { start: string; end: string; } &amp; {}; purpose?: string | undefined; } &amp; {}'. Did you mean to write 'labId'?
mistakes/book-wrong.ts(11,15): error TS18047: 'data.purpose' is possibly 'null'.
mistakes/book-wrong.ts(12,7): error TS2367: This comparison appears to be unintentional because the types '"PENDING" | "CHECKED_IN" | "CANCELLED"' and '"CONFIRMED"' have no overlap.
mistakes/book-wrong.ts(14,33): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ params: { query?: undefined; header?: undefined; path: { id: string; }; cookie?: undefined; }; } &amp; { body?: undefined; } &amp; { baseUrl?: string | undefined; querySerializer?: QuerySerializerOptions | QuerySerializer&lt;...&gt; | undefined; ... 5 more ...; middleware?: Middleware[] | undefined; } &amp; Omit&lt;...&gt; &amp; { ...; }'.
  Property 'params' is missing in type '{}' but required in type '{ params: { query?: undefined; header?: undefined; path: { id: string; }; cookie?: undefined; }; }'.</div>
<p>Lỗi nào cũng chỉ vào một lần sập thật hoặc một lần 400 lặng lẽ: gõ sai tên trường sẽ nhận <code>VALIDATION_FAILED</code>, <code>purpose.length</code> sẽ ném lỗi ở lượt đặt đầu tiên không có mục đích, còn <code>'CONFIRMED'</code> không bao giờ đúng.</p>

<h3>Khi hợp đồng thay đổi</h3>
<p>Giả sử đội back-end đổi tên <code>period</code> thành <code>slot</code> trong tài liệu. Sinh lại kiểu rồi biên dịch cái client vừa chạy ngon một phút trước:</p>
<pre><code class="language-bash">npx openapi-typescript openapi/rename-period.yaml -o client/labflow.d.ts 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🚀 openapi/rename-period.yaml → client/labflow.d.ts [77.7ms]</div>
<pre><code class="language-bash">npx tsc -p .</code></pre>
<div class="out">client/book.ts(18,62): error TS2339: Property 'period' does not exist on type '{ id: string; labId: string; userId: string; slot: { start: string; end: string; }; purpose: string | null; status: "PENDING" | "CHECKED_IN" | "CANCELLED"; createdAt: string; cancelledAt: string | null; checkedInAt: string | null; }'.</div>
<pre><code class="language-bash">npm run -s api:types &gt;/dev/null 2&gt;&amp;1 &amp;&amp; npx tsc -p . &amp;&amp; echo 'tsc: 0 lỗi'</code></pre>
<div class="out">tsc: 0 lỗi</div>
<p>Chỗ gãy hiện ra trong build của <strong>client</strong>, đúng dòng đọc <code>data.period</code>, trước khi người dùng nào thấy. Vì thế các công ty sinh lại kiểu client trong CI. (Một việc đổi tên như thế có được phát hành hay không là việc của bài 7.4 — đó là thay đổi phá vỡ.)</p>

<div class="pitfall"><p><strong>Bẫy — sửa tay tệp sinh ra.</strong> <code>labflow.d.ts</code> ghi rõ “do not make direct changes”: lần <code>npm run api:types</code> sau sẽ ghi đè. Sửa tài liệu, rồi sinh lại.</p></div>

<h3>Bộ validate: schema trong tài liệu và Zod của server</h3>
<p>Server có thể dùng schema của tài liệu thay cho Zod không? Cùng các body, cả hai bộ kiểm:</p>
<pre><code class="language-javascript">// compare-validators.mjs — bài 7.3: cùng một body, kiểm bằng lược đồ trong openapi.yaml (Ajv) và bằng Zod của server
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { BookingCreateV2 } from '../src/schemas.js';

const spec = parse(readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'));
const ajv = addFormats(new Ajv2020({ allErrors: true, strict: false }));
ajv.addSchema({ $id: 'spec', components: spec.components });
const fromSpec = ajv.getSchema('spec#/components/schemas/BookingCreate');

const P = { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' };
const cases = {
  'hợp lệ': { labId: 'lab_1', period: P },
  'gõ sai labID': { labID: 'lab_1', period: P },
  'thêm status': { labId: 'lab_1', period: P, status: 'CHECKED_IN' },
  'giờ không múi giờ': { labId: 'lab_1', period: { ...P, start: '2027-03-02T08:00:00' } },
  'purpose toàn dấu cách': { labId: 'lab_1', period: P, purpose: '   ' },
  'end trước start': { labId: 'lab_1', period: { start: P.end, end: P.start } },
};
const yn = (ok) =&gt; (ok ? 'nhận' : 'TỪ CHỐI');
for (const [name, body] of Object.entries(cases)) {
  console.log(&#96;\${name.padEnd(24)} spec: \${yn(fromSpec(body)).padEnd(8)} zod: \${yn(BookingCreateV2.safeParse(body).success)}&#96;);
}</code></pre>
<pre><code class="language-bash">node openapi/compare-validators.mjs</code></pre>
<div class="out">hợp lệ                   spec: nhận     zod: nhận
gõ sai labID             spec: TỪ CHỐI  zod: TỪ CHỐI
thêm status              spec: TỪ CHỐI  zod: TỪ CHỐI
giờ không múi giờ        spec: TỪ CHỐI  zod: TỪ CHỐI
purpose toàn dấu cách    spec: nhận     zod: TỪ CHỐI
end trước start          spec: nhận     zod: nhận</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  --json '{"labId":"lab_1","period":{"start":"2027-03-05T10:00:00+07:00","end":"2027-03-05T08:00:00+07:00"}}' | jq -c '{status, code, detail}'</code></pre>
<div class="out">{"status":422,"code":"INVALID_TIME_RANGE","detail":"endAt phải sau startAt"}</div>
<p>Hai bên đồng ý về <strong>hình dạng</strong>: trường lạ, giờ không có múi giờ. Chúng khác nhau ở chỗ Zod làm nhiều hơn là mô tả — <code>.trim()</code> biến “   ” thành chuỗi rỗng nên trượt <code>min(1)</code>; JSON Schema không có trim, nên “   ” là một chuỗi hợp lệ dài 3. Và không bên nào kiểm <strong>luật nghiệp vụ</strong> “end sau start”: handler kiểm, trả 422. Ba lớp, mỗi lớp một việc:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hình dạng — tài liệu</span><span class="lz-lnote">kiểu, bắt buộc, trường lạ, format ⇒ 400 (mock và client dùng lớp này)</span></div>
  <div class="lz-layer"><span class="lz-lname">Chuẩn hoá — Zod</span><span class="lz-lnote">trim, NFC, ép kiểu tham số query ⇒ 400</span></div>
  <div class="lz-layer"><span class="lz-lname">Luật nghiệp vụ — handler</span><span class="lz-lnote">end sau start, phòng tồn tại, ≤ 3 lượt còn hiệu lực ⇒ 422 / 409</span></div>
</div>
<p>Nên LabFlow giữ Zod trong server, tài liệu cho mọi người khác, và bộ kiểm hợp đồng của bài 7.2 để chứng minh hai bên khớp nhau. Nhìn lại <code>detail</code> của 422: “endAt phải sau startAt” — tên trường của v1 nằm trong câu trả lời v2. Bộ kiểm hợp đồng không bắt được (schema chỉ nói <code>detail</code> là chuỗi); một người đọc bắt được. Sửa nó trong phần luyện tập.</p>

<div class="pitfall"><p><strong>Bẫy — hai bộ validate lặng lẽ bất đồng.</strong> Validate bằng cả tài liệu lẫn Zod thì bên chặt hơn thắng và câu báo lỗi khác nhau. Mỗi lớp chọn một bên, và test rằng chúng khớp.</p></div>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Front-end và back-end giữ khớp nhau thế nào?”</strong> Sinh kiểu client từ tài liệu OpenAPI trong CI; hợp đồng đổi thì build của client đỏ, không phải production.</li>
  <li><strong>“Validate bằng spec hay bằng code?”</strong> Spec cho hình dạng (dùng chung với mock và client), code cho chuẩn hoá và luật nghiệp vụ — kèm một test hợp đồng chứng minh chúng khớp.</li>
</ul>

<h3>🧪 Luyện tập (20–30 phút)</h3>
<div class="callout ok"><ol>
  <li>Viết <code>client/cancel.ts</code> bằng openapi-fetch: huỷ lượt đặt của bạn, in trạng thái mới; cố ý sai một chỗ rồi đọc lỗi tsc.</li>
  <li>Sửa câu báo của <code>INVALID_TIME_RANGE</code> ở v2 thành <code>period.end</code> / <code>period.start</code>, không đổi câu của v1.</li>
  <li>Thêm <code>--inlineBundle</code> vào <code>api:docs</code>, so kích thước tệp và số request ra ngoài trong DevTools.</li>
</ol>
<p><strong>Xong khi:</strong> <code>npx tsc -p .</code> báo 0 lỗi với client đúng và đúng các lỗi mong đợi với client sai.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Redoc</span><span class="v">Bộ dựng biến tài liệu OpenAPI thành trang tài liệu.</span></div>
  <div class="kv"><span class="k">openapi-typescript</span><span class="v">Sinh kiểu TypeScript (không có code chạy) từ OpenAPI 3.0/3.1.</span></div>
  <div class="kv"><span class="k">openapi-fetch</span><span class="v">Client fetch nhỏ có kiểu, dùng các kiểu đó.</span></div>
  <div class="kv"><span class="k">Peer dependency</span><span class="v">Gói mà gói của bạn cần dự án tự cài, trong một dải phiên bản.</span></div>
  <div class="kv"><span class="k">Chuẩn hoá</span><span class="v">Đưa đầu vào về dạng chuẩn (trim, NFC) trước khi kiểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Server công bố <code>/docs</code> (Redoc, 280 KiB, script từ CDN trừ khi <code>--inlineBundle</code>) và <code>/openapi.yaml</code>.</li>
  <li>813 dòng kiểu sinh ra; tsc bắt 4 lỗi gọi API và một trường bị đổi tên — ngay lúc biên dịch.</li>
  <li>Tài liệu và Zod khớp về hình dạng, khác về chuẩn hoá (“   ”); luật nghiệp vụ nằm ở handler (422).</li>
  <li>Đọc mới thấy: tên trường v1 trong câu báo lỗi v2 — kiểm hợp đồng chỉ kiểm cấu trúc.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/typescript/learn?lessonSlug=typescript-7-1-mapped-types" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Suy một cái kiểu để nó không trôi — TS 7.1: Mapped types</span><span class="lc-sub">Giống: một kiểu tính từ một nguồn sự thật không bao giờ trôi, nên bạn không bao giờ bảo trì tay một bản sao cũ dần. Khác: ở đó một bộ sinh biến một tài liệu OpenAPI thành type client như một bước build; trong TypeScript một mapped type <code>{ [K in keyof T]: … }</code> suy ra một form, <code>Readonly</code> hay <code>Record</code> từ một kiểu khác ngay lúc biên dịch, không cần bộ sinh — và <code>Readonly</code>/<code>Record</code> tự chúng là mapped type.</span></span>
  <span class="lc-cta">MỞ BÀI TYPESCRIPT →</span>
</a>
</div>
`,
    },
    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Design-first vs code-first: mocks, style rules and a gate for breaking changes|||7.4 — Thiết kế trước hay code trước: mock, luật phong cách và cổng chặn thay đổi phá vỡ',
      slug: 'api-7-3-design-first',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Zod xuất JSON Schema (code-first) và đánh rơi trim; mock Prism (422 thay 400, 409 thành 201 vì Accept); style guide Spectral; cổng so phiên bản tự viết vì openapi-diff không đọc được 3.1.',
      content: `${G074}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Design-first vs code-first: mocks, style rules and a gate for breaking changes</h2>
<p class="lead">Who writes the contract first — the document or the code? This lesson tries both on LabFlow, then builds what design-first needs in a team: a mock for the front-end, a style guide a machine reviews, and a gate that refuses breaking changes. Two tools surprised us.</p>

<h3>Two ways to get a contract</h3>
<p><strong>Design-first</strong>: <code>openapi.yaml</code> is the truth, reviewed before code — best for public or multi-team APIs and mobile apps; its risk is drift, which the contract check (7.2) handles. <strong>Code-first</strong>: the document is generated from code (Zod here, springdoc in Spring) — fine for one small team; it documents the code’s mistakes too.</p>
<div class="lz-map">
  <div class="lz-stage">design-first, one change</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Change openapi.yaml in a pull request</div><div class="lz-nsub">only the contract — no code yet</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Lint + style rules (Redocly, Spectral)</div><div class="lz-nsub">machines check what reviewers should not have to</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Diff gate</div><div class="lz-nsub">breaking change ⇒ red, unless it goes to a new version (Chapter 4)</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">Human review, then mock</div><div class="lz-nsub">front-end builds against Prism the same day</div></div></div>
  <div class="lz-node"><span class="lz-badge">5</span><div class="lz-nbody"><div class="lz-ntitle">Implement, then contract check</div><div class="lz-nsub">server must match the merged document (7.2)</div></div></div>
</div>

<h3>Code-first, measured: the schema Zod generates</h3>
<p>Zod 4 exports a schema as JSON Schema 2020-12 with one call, <code>z.toJSONSchema(BookingCreateV2)</code> (the script only shortens long regexes when printing). LabFlow’s real body schema:</p>
<pre><code class="language-bash">node openapi/from-zod.mjs</code></pre>
<div class="out">{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "labId": {
      "type": "string",
      "pattern": "^lab_\\\\d+$"
    },
    "period": {
      "type": "object",
      "properties": {
        "start": {
          "type": "string",
          "format": "date-time",
          "pattern": "…(288 ký tự)"
        },
        "end": {
          "type": "string",
          "format": "date-time",
          "pattern": "…(288 ký tự)"
        }
      },
      "required": [
        "start",
        "end"
      ],
      "additionalProperties": false
    },
    "purpose": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    }
  },
  "required": [
    "labId",
    "period"
  ],
  "additionalProperties": false
}
29 dòng cho IssueCreate</div>
<p>Almost identical to the hand-written schema of 7.1 — with two differences that matter. Zod’s date-time check becomes a 288-character regular expression (precise, unreadable in docs). And <code>.trim()</code> disappears without a warning: JSON Schema has no keyword for it, so the exported schema describes the shape and drops the normalisation — the same gap 7.3 measured. Code-first documents are honest about types and silent about behaviour.</p>
<a class="link-card" href="https://zod.dev/json-schema" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Zod — JSON Schema (read 1 Nov 2026)</span><span class="lc-sub">z.toJSONSchema() targets draft 2020-12 by default (also draft 7, draft 4, OpenAPI 3.0); unrepresentable types such as transforms throw by default.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>A mock from the document: Prism</h3>
<p><code>npm run api:mock</code> starts Stoplight Prism on port 4010. It validates each request against the document and answers with an example or a generated value. First with the early document that had no examples:</p>
<pre><code class="language-bash">curl -s http://localhost:4011/labs/lab_1</code></pre>
<div class="out">{"id":"lab_1","code":"AL-201","name":"string","building":"string","capacity":1}</div>
<p>“string” (or random Latin with <code>Prefer: dynamic=true</code>) is useless to a front-end developer — <strong>a mock is only as good as your examples</strong>. After adding <code>examples</code> to the schemas and a full example to the 409 response:</p>
<pre><code class="language-bash">curl -s http://localhost:4010/labs/lab_1</code></pre>
<div class="out">{"id":"lab_1","code":"AL-201","name":"Phòng Lab Mạng máy tính","building":"Alpha","capacity":30}</div>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4010/bookings \\
  -H 'Authorization: Bearer x' \\
  --json '{"labID":"lab_1"}' | grep -E '^(HTTP|sl-violations)'</code></pre>
<div class="out">HTTP/1.1 422 Unprocessable Entity
sl-violations: [{"location":["request","body"],"severity":"Error","code":"required","message":"Request body must have required property 'labId'"},{"location":["request","body"],"severity":"Error","code":"required","message":"Request body must have required property 'period'"},{"location":["request","body"],"severity":"Error","code":"additionalProperties","message":"Request body must NOT have additional properties; found 'labID'"}]</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4010/bookings \\
  -H 'Authorization: Bearer x' \\
  -H 'Prefer: code=409' \\
  --json '{"labId":"lab_1","period":{"start":"2027-03-02T08:00:00+07:00","end":"2027-03-02T10:00:00+07:00"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4010/bookings \\
  -H 'Authorization: Bearer x' \\
  -H 'Prefer: code=409' \\
  -H 'Accept: application/json, application/problem+json' \\
  --json '{"labId":"lab_1","period":{"start":"2027-03-02T08:00:00+07:00","end":"2027-03-02T10:00:00+07:00"}}'</code></pre>
<div class="out">{"type":"https://labflow.example/problems/booking-conflict","title":"Slot already taken","status":409,"detail":"Lab lab_1 already has booking bk_3 in this period","instance":"/v2/bookings","code":"BOOKING_CONFLICT"}</div>
<pre><code class="language-bash">curl -s -i http://localhost:4010/bookings | grep -E '^(HTTP|sl-violations)'</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
sl-violations: [{"location":["request"],"severity":"Error","code":401,"message":"Invalid security scheme used"}]</div>
<p>Four lessons. A wrong body gets <strong>422</strong> from Prism but <strong>400</strong> from LabFlow — Prism prefers a documented 401, 415, 422, then 400. <code>Prefer: code=409</code> lets the front-end test its error screen. But <code>--json</code> makes curl send <code>Accept: application/json</code>, the 409 exists only as <code>application/problem+json</code>, so Prism silently answered <strong>201</strong>; with <code>Accept: application/json, application/problem+json</code> it answered 409 — real clients should send that header to LabFlow too. And no token ⇒ 401.</p>
<div class="pitfall"><p><strong>Trap — trusting the mock’s status codes.</strong> The mock follows the document plus its own rules (422 before 400). Before release, run the contract check against the real server.</p></div>
<a class="link-card" href="https://github.com/stoplightio/prism/blob/master/docs/guides/01-mocking.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Prism — mocking guide (read 1 Nov 2026)</span><span class="lc-sub">Invalid requests: 401, 415, 422, 400, default — in that order; the Prefer header; content negotiation with Accept.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>A style guide a machine reviews: Spectral</h3>
<p>Lint (7.1) checks that the document is valid. A <strong>style guide</strong> checks that it follows <em>your team’s</em> rules — the ones from Chapters 1–3 that reviewers kept repeating. Spectral rules are a JSONPath (<code>given</code>) plus a check (<code>then</code>):</p>
<pre><code class="language-yaml"># .spectral.yaml — "style guide" API của LabFlow: luật của ĐỘI, máy kiểm thay người review
extends: ["spectral:oas"]
rules:
  labflow-camel-case-properties:
    description: Tên trường JSON dùng camelCase (bài 1.4)
    severity: error
    given: "$..properties[*]~"
    then: { function: casing, functionOptions: { type: camel } }
  labflow-kebab-paths:
    description: Đoạn đường dẫn viết thường, nối bằng gạch ngang (bài 1.1)
    severity: error
    given: "$.paths[*]~"
    then: { function: pattern, functionOptions: { match: "^(/([a-z0-9-]+|\\\\{[a-zA-Z]+\\\\}))+$" } }
  labflow-errors-are-problems:
    description: Mọi câu trả lời 4xx/5xx là application/problem+json (bài 2.1)
    severity: error
    given: "$.paths[*][*].responses[?(@property &gt;= '400')].content"
    then: { field: "application/problem+json", function: truthy }
  labflow-list-is-paged:
    description: Danh sách bookings/issues phải có limit + cursor (bài 3.2)
    severity: warn
    given: "$.paths[?(@property == '/bookings' || @property == '/issues')].get"
    then: { field: parameters, function: length, functionOptions: { min: 2 } }
  operation-description: off   # LabFlow dùng summary một dòng; description chỉ khi cần giải thích thêm</code></pre>
<pre><code class="language-bash">npx spectral lint openapi/pr-no-show.yaml | sed 's#^/.*labflow-ch7-pre-lab/##'</code></pre>
<div class="out">openapi/pr-no-show.yaml
 212:26  error  labflow-kebab-paths            Đoạn đường dẫn viết thường, nối bằng gạch ngang (bài 1.1)      paths./bookings/{id}/no_show
 227:30  error  labflow-camel-case-properties  Tên trường JSON dùng camelCase (bài 1.4)                       paths./bookings/{id}/no_show.post.responses[200].content.application/json.schema.properties.booking_id
 228:29  error  labflow-camel-case-properties  Tên trường JSON dùng camelCase (bài 1.4)                       paths./bookings/{id}/no_show.post.responses[200].content.application/json.schema.properties.marked_by
 231:19  error  labflow-errors-are-problems    Mọi câu trả lời 4xx/5xx là application/problem+json (bài 2.1)  paths./bookings/{id}/no_show.post.responses[400].content

✖ 4 problems (4 errors, 0 warnings, 0 infos, 0 hints)</div>
<p>LabFlow’s own document: 0 errors. Above, a plausible pull request — <code>/no_show</code>, snake_case fields, a plain-JSON 400 — gets four errors, each naming its lesson; the reviewer can discuss whether “no-show” should exist at all.</p>

<h3>A gate for breaking changes</h3>
<p>Chapter 4 listed what breaks old clients. Now a machine applies the list to every change of the document. The tool everyone finds first, <code>openapi-diff</code> (npm), stopped at the first line:</p>
<pre><code class="language-bash">npx openapi-diff openapi/openapi.yaml openapi/rename-period.yaml 2&gt;&amp;1 | grep -m1 -o 'Unsupported OpenAPI version.*'</code></pre>
<div class="out">Unsupported OpenAPI version: 3.1.0. Swagger Parser only supports versions 3.0.0, 3.0.1, 3.0.2, 3.0.3</div>
<p>So LabFlow has its own 100-line checker (full file in Lab 7). It walks every operation of the old document and applies Chapter 4’s table — with opposite rules for what clients <em>send</em> and what they <em>receive</em>:</p>
<ul>
  <li><strong>breaking</strong>: an operation removed; a new required parameter or request field; an optional request field made required; a response field removed or no longer always present; a type changed;</li>
  <li><strong>warning</strong>: a new value in a response enum (old clients may crash on it — measured in 4.1);</li>
  <li><strong>safe</strong>: a new operation, a new optional request field, a new response field.</li>
</ul>
<p>Four proposed changes, four verdicts:</p>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/purpose-required.yaml; echo "exit=$?"</code></pre>
<div class="out">✗ PHÁ VỠ  POST /bookings body.purpose: trước tuỳ chọn, nay bắt buộc
✗ 1 thay đổi phá vỡ — không được phát hành vào /v2
exit=1</div>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/rename-period.yaml | head -4; echo '…'</code></pre>
<div class="out">✗ PHÁ VỠ  GET /bookings → 200.data[].period: trường bị bỏ khỏi câu trả lời
✓ an toàn  GET /bookings → 200.data[].slot: trường mới trong câu trả lời
✗ PHÁ VỠ  POST /bookings → 201.period: trường bị bỏ khỏi câu trả lời
✓ an toàn  POST /bookings → 201.slot: trường mới trong câu trả lời
…</div>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/add-seats.yaml | tail -3; echo "exit=$?"</code></pre>
<div class="out">✓ an toàn  POST /bookings/{id}/cancel → 200.seats: trường mới trong câu trả lời
✓ an toàn  POST /bookings/{id}/check-in → 200.seats: trường mới trong câu trả lời
✓ không có thay đổi phá vỡ
exit=0</div>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/no-show.yaml | sed -n '1p;$p'</code></pre>
<div class="out">⚠ CẨN THẬN  GET /bookings → 200.data[].status: thêm giá trị NO_SHOW — client cũ có xử lý giá trị lạ không? (bài 4.1)
✓ không có thay đổi phá vỡ</div>
<p>Required <code>purpose</code> and the rename are breaking — exit 1, CI red. <code>seats</code> is safe. <code>NO_SHOW</code> in a response enum is a warning: it breaks only clients that crash on unknown values (measured in 4.1).</p>
<div class="pitfall"><p><strong>Trap — trusting a tool’s README about versions.</strong> Measure: feed it your real document. openapi-diff 0.24 rejected OpenAPI 3.1 outright. A tool that accepts the file must still be tested on 3.1 constructs such as <code>type: [string, 'null']</code> — with a variant you know is breaking.</p></div>

<h3>Reviewing an API like code</h3>
<p>What machines leave to people: resource or action (1.1)? What happens on retry (5.1)? Which errors, each with a code (2.1)? Who may call it, on whose records (6.2)? Additive (4.1)? Can’t answer one ⇒ not ready — and nothing is implemented yet, so changing your mind is cheap.</p>

<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-cs5-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in PRJ301 — ⭐ CS.5 Architecture (2): springdoc-openapi</span><span class="lc-sub">If you took PRJ301 on Academy, you published OpenAPI from Spring Boot with springdoc and saw where generated docs go wrong. Same: one OpenAPI document as the contract. Different: that is code-first in Java; here the document comes first and the code must match it. This lesson adds: Prism mocks, a Spectral style guide, and a gate that blocks breaking changes. Not taken PRJ301? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN PRJ301 LESSON →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“Design-first or code-first?”</strong> Design-first when other teams or apps depend on the API — review the shape before code, mock it, gate breaking changes. Code-first for a small internal service, with a contract check so the generated docs stay true.</li>
  <li><strong>“How do you stop breaking changes?”</strong> A diff gate on the document in CI; breaking changes only in a new version.</li>
</ul>

<h3>🧪 Practice (25–35 min)</h3>
<div class="callout ok"><ol>
  <li>Add a Spectral rule: every <code>POST</code> that creates something documents a <code>Location</code> header on its 201. Does LabFlow pass?</li>
  <li>Teach <code>diff.mjs</code> one more rule: a response field that changes from <code>string</code> to <code>[string, 'null']</code> is breaking. Prove it with a variant document.</li>
  <li>Point a tiny front-end script at the mock and make it show both a 201 and a 409 screen using <code>Prefer</code>.</li>
</ol>
<p><strong>Done when:</strong> your new rules fire on a bad document and stay silent on LabFlow’s.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Design-first</span><span class="v">Write and review the OpenAPI document before the code.</span></div>
  <div class="kv"><span class="k">Code-first</span><span class="v">Generate the document from the code (Zod, springdoc…).</span></div>
  <div class="kv"><span class="k">Mock server</span><span class="v">A fake API generated from the document (Prism), for clients to build against.</span></div>
  <div class="kv"><span class="k">Style guide</span><span class="v">Team rules for API shape, checked by a linter (Spectral).</span></div>
  <div class="kv"><span class="k">Diff gate</span><span class="v">A CI step that compares two versions of the document and fails on breaking changes.</span></div>
  <div class="kv"><span class="k">Content negotiation</span><span class="v">Choosing the response format from the request’s Accept header.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Code-first measured: Zod exports the shape (a 288-character date regex) and drops <code>.trim()</code>.</li>
  <li>Prism mock: useless without examples; 422 where the server says 400; a 409 silently became 201 because of the Accept header.</li>
  <li>Spectral style guide: 0 errors on LabFlow, 4 on a plausible bad pull request.</li>
  <li>Diff gate: purpose-required and rename ⇒ breaking (exit 1), new optional field ⇒ safe, new enum value ⇒ warning; openapi-diff 0.24 could not read 3.1.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Thiết kế trước hay code trước: mock, luật phong cách và cổng chặn thay đổi phá vỡ</h2>
<p class="lead">Ai viết hợp đồng trước — tài liệu hay code? Bài này thử cả hai trên LabFlow, rồi dựng những gì design-first cần trong một đội: máy chủ giả (mock) cho front-end, bộ luật phong cách do máy review, và một cổng từ chối thay đổi phá vỡ. Hai công cụ làm chúng ta bất ngờ.</p>

<h3>Hai cách có được hợp đồng</h3>
<p><strong>Design-first</strong>: <code>openapi.yaml</code> là sự thật, được review trước khi code — hợp với API công khai, nhiều đội, app di động; rủi ro là lệch, đã có kiểm hợp đồng (7.2) lo. <strong>Code-first</strong>: tài liệu sinh từ code (ở đây là Zod, Spring thì springdoc) — ổn cho một đội nhỏ; nó ghi lại cả chỗ sai của code.</p>
<div class="lz-map">
  <div class="lz-stage">design-first, một thay đổi</div>
  <div class="lz-node"><span class="lz-badge">1</span><div class="lz-nbody"><div class="lz-ntitle">Sửa openapi.yaml trong một pull request</div><div class="lz-nsub">chỉ hợp đồng — chưa có code</div></div></div>
  <div class="lz-node"><span class="lz-badge">2</span><div class="lz-nbody"><div class="lz-ntitle">Lint + luật phong cách (Redocly, Spectral)</div><div class="lz-nsub">máy kiểm những thứ người review không nên phải nhắc</div></div></div>
  <div class="lz-node"><span class="lz-badge">3</span><div class="lz-nbody"><div class="lz-ntitle">Cổng so phiên bản</div><div class="lz-nsub">thay đổi phá vỡ ⇒ đỏ, trừ khi nó đi vào phiên bản mới (Chương 4)</div></div></div>
  <div class="lz-node"><span class="lz-badge">4</span><div class="lz-nbody"><div class="lz-ntitle">Người review, rồi dựng mock</div><div class="lz-nsub">front-end làm với Prism ngay trong ngày</div></div></div>
  <div class="lz-node"><span class="lz-badge">5</span><div class="lz-nbody"><div class="lz-ntitle">Cài đặt, rồi kiểm hợp đồng</div><div class="lz-nsub">server phải khớp tài liệu đã merge (7.2)</div></div></div>
</div>

<h3>Code-first, đo thật: schema mà Zod sinh ra</h3>
<p>Zod 4 xuất một schema thành JSON Schema 2020-12 chỉ bằng một lệnh, <code>z.toJSONSchema(BookingCreateV2)</code> (script chỉ rút gọn regex dài khi in ra). Schema body thật của LabFlow:</p>
<pre><code class="language-bash">node openapi/from-zod.mjs</code></pre>
<div class="out">{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "labId": {
      "type": "string",
      "pattern": "^lab_\\\\d+$"
    },
    "period": {
      "type": "object",
      "properties": {
        "start": {
          "type": "string",
          "format": "date-time",
          "pattern": "…(288 ký tự)"
        },
        "end": {
          "type": "string",
          "format": "date-time",
          "pattern": "…(288 ký tự)"
        }
      },
      "required": [
        "start",
        "end"
      ],
      "additionalProperties": false
    },
    "purpose": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    }
  },
  "required": [
    "labId",
    "period"
  ],
  "additionalProperties": false
}
29 dòng cho IssueCreate</div>
<p>Gần như y hệt schema viết tay ở bài 7.1 — với hai khác biệt đáng kể. Phép kiểm ngày giờ của Zod thành một biểu thức chính quy dài 288 ký tự (chính xác, nhưng đọc trong tài liệu thì chịu). Và <code>.trim()</code> biến mất không một lời cảnh báo: JSON Schema không có từ khoá nào cho nó, nên schema xuất ra chỉ mô tả hình dạng và bỏ mất phần chuẩn hoá — đúng khoảng trống bài 7.3 đã đo. Tài liệu code-first trung thực về kiểu và im lặng về hành vi.</p>
<a class="link-card" href="https://zod.dev/json-schema" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Zod — JSON Schema (đọc ngày 1/11/2026)</span><span class="lc-sub">z.toJSONSchema() mặc định ra draft 2020-12 (còn draft 7, draft 4, OpenAPI 3.0); kiểu không biểu diễn được như transform mặc định ném lỗi.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Mock từ tài liệu: Prism</h3>
<p><code>npm run api:mock</code> chạy Stoplight Prism ở cổng 4010. Nó kiểm từng request theo tài liệu và trả lời bằng ví dụ hoặc giá trị tự sinh. Trước hết với bản tài liệu đầu, khi chưa có ví dụ:</p>
<pre><code class="language-bash">curl -s http://localhost:4011/labs/lab_1</code></pre>
<div class="out">{"id":"lab_1","code":"AL-201","name":"string","building":"string","capacity":1}</div>
<p>“string” (hay chữ Latin ngẫu nhiên khi gửi <code>Prefer: dynamic=true</code>) chẳng giúp gì bạn front-end — <strong>mock chỉ tốt bằng ví dụ của bạn</strong>. Sau khi thêm <code>examples</code> vào schema và một ví dụ đầy đủ cho câu trả lời 409:</p>
<pre><code class="language-bash">curl -s http://localhost:4010/labs/lab_1</code></pre>
<div class="out">{"id":"lab_1","code":"AL-201","name":"Phòng Lab Mạng máy tính","building":"Alpha","capacity":30}</div>
<pre><code class="language-bash">curl -s -i -X POST http://localhost:4010/bookings \\
  -H 'Authorization: Bearer x' \\
  --json '{"labID":"lab_1"}' | grep -E '^(HTTP|sl-violations)'</code></pre>
<div class="out">HTTP/1.1 422 Unprocessable Entity
sl-violations: [{"location":["request","body"],"severity":"Error","code":"required","message":"Request body must have required property 'labId'"},{"location":["request","body"],"severity":"Error","code":"required","message":"Request body must have required property 'period'"},{"location":["request","body"],"severity":"Error","code":"additionalProperties","message":"Request body must NOT have additional properties; found 'labID'"}]</div>
<pre><code class="language-bash">curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://localhost:4010/bookings \\
  -H 'Authorization: Bearer x' \\
  -H 'Prefer: code=409' \\
  --json '{"labId":"lab_1","period":{"start":"2027-03-02T08:00:00+07:00","end":"2027-03-02T10:00:00+07:00"}}'</code></pre>
<div class="out">201</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4010/bookings \\
  -H 'Authorization: Bearer x' \\
  -H 'Prefer: code=409' \\
  -H 'Accept: application/json, application/problem+json' \\
  --json '{"labId":"lab_1","period":{"start":"2027-03-02T08:00:00+07:00","end":"2027-03-02T10:00:00+07:00"}}'</code></pre>
<div class="out">{"type":"https://labflow.example/problems/booking-conflict","title":"Slot already taken","status":409,"detail":"Lab lab_1 already has booking bk_3 in this period","instance":"/v2/bookings","code":"BOOKING_CONFLICT"}</div>
<pre><code class="language-bash">curl -s -i http://localhost:4010/bookings | grep -E '^(HTTP|sl-violations)'</code></pre>
<div class="out">HTTP/1.1 401 Unauthorized
sl-violations: [{"location":["request"],"severity":"Error","code":401,"message":"Invalid security scheme used"}]</div>
<p>Bốn bài học. Body sai nhận <strong>422</strong> từ Prism nhưng <strong>400</strong> từ LabFlow — Prism ưu tiên 401, 415, 422 rồi mới 400 nếu tài liệu có khai. <code>Prefer: code=409</code> cho front-end thử màn hình báo lỗi. Nhưng <code>--json</code> khiến curl gửi <code>Accept: application/json</code>, mà 409 chỉ có dạng <code>application/problem+json</code>, nên Prism lặng lẽ trả <strong>201</strong>; thêm <code>Accept: application/json, application/problem+json</code> thì nó trả 409 — client thật cũng nên gửi header đó tới LabFlow. Và không có token ⇒ 401.</p>
<div class="pitfall"><p><strong>Bẫy — tin mã trạng thái của mock.</strong> Mock theo tài liệu cộng luật riêng của nó (422 trước 400). Trước khi phát hành, chạy kiểm hợp đồng với server thật.</p></div>
<a class="link-card" href="https://github.com/stoplightio/prism/blob/master/docs/guides/01-mocking.md" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Prism — hướng dẫn mocking (đọc ngày 1/11/2026)</span><span class="lc-sub">Request sai: 401, 415, 422, 400, default — theo thứ tự đó; header Prefer; chọn định dạng theo Accept.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Bộ luật phong cách do máy review: Spectral</h3>
<p>Lint (7.1) kiểm tài liệu hợp lệ. <strong>Style guide (bộ luật phong cách)</strong> kiểm tài liệu theo luật <em>của đội bạn</em> — những luật từ Chương 1–3 mà người review cứ phải nhắc mãi. Một luật Spectral gồm một JSONPath (<code>given</code>) và một phép kiểm (<code>then</code>):</p>
<pre><code class="language-yaml"># .spectral.yaml — "style guide" API của LabFlow: luật của ĐỘI, máy kiểm thay người review
extends: ["spectral:oas"]
rules:
  labflow-camel-case-properties:
    description: Tên trường JSON dùng camelCase (bài 1.4)
    severity: error
    given: "$..properties[*]~"
    then: { function: casing, functionOptions: { type: camel } }
  labflow-kebab-paths:
    description: Đoạn đường dẫn viết thường, nối bằng gạch ngang (bài 1.1)
    severity: error
    given: "$.paths[*]~"
    then: { function: pattern, functionOptions: { match: "^(/([a-z0-9-]+|\\\\{[a-zA-Z]+\\\\}))+$" } }
  labflow-errors-are-problems:
    description: Mọi câu trả lời 4xx/5xx là application/problem+json (bài 2.1)
    severity: error
    given: "$.paths[*][*].responses[?(@property &gt;= '400')].content"
    then: { field: "application/problem+json", function: truthy }
  labflow-list-is-paged:
    description: Danh sách bookings/issues phải có limit + cursor (bài 3.2)
    severity: warn
    given: "$.paths[?(@property == '/bookings' || @property == '/issues')].get"
    then: { field: parameters, function: length, functionOptions: { min: 2 } }
  operation-description: off   # LabFlow dùng summary một dòng; description chỉ khi cần giải thích thêm</code></pre>
<pre><code class="language-bash">npx spectral lint openapi/pr-no-show.yaml | sed 's#^/.*labflow-ch7-pre-lab/##'</code></pre>
<div class="out">openapi/pr-no-show.yaml
 212:26  error  labflow-kebab-paths            Đoạn đường dẫn viết thường, nối bằng gạch ngang (bài 1.1)      paths./bookings/{id}/no_show
 227:30  error  labflow-camel-case-properties  Tên trường JSON dùng camelCase (bài 1.4)                       paths./bookings/{id}/no_show.post.responses[200].content.application/json.schema.properties.booking_id
 228:29  error  labflow-camel-case-properties  Tên trường JSON dùng camelCase (bài 1.4)                       paths./bookings/{id}/no_show.post.responses[200].content.application/json.schema.properties.marked_by
 231:19  error  labflow-errors-are-problems    Mọi câu trả lời 4xx/5xx là application/problem+json (bài 2.1)  paths./bookings/{id}/no_show.post.responses[400].content

✖ 4 problems (4 errors, 0 warnings, 0 infos, 0 hints)</div>
<p>Tài liệu của LabFlow: 0 lỗi. Ở trên, một pull request rất đời thường — <code>/no_show</code>, trường snake_case, lỗi 400 bằng JSON thường — nhận bốn lỗi, lỗi nào cũng ghi bài đặt ra luật; người review được bàn chuyện có nên có no-show không.</p>

<h3>Cổng chặn thay đổi phá vỡ</h3>
<p>Chương 4 đã liệt kê những gì làm gãy client cũ. Giờ một cỗ máy áp danh sách đó lên mọi thay đổi của tài liệu. Công cụ ai cũng tìm thấy đầu tiên, <code>openapi-diff</code> (npm), dừng ngay dòng đầu:</p>
<pre><code class="language-bash">npx openapi-diff openapi/openapi.yaml openapi/rename-period.yaml 2&gt;&amp;1 | grep -m1 -o 'Unsupported OpenAPI version.*'</code></pre>
<div class="out">Unsupported OpenAPI version: 3.1.0. Swagger Parser only supports versions 3.0.0, 3.0.1, 3.0.2, 3.0.3</div>
<p>Nên LabFlow có bộ so riêng 100 dòng (tệp đầy đủ ở Lab 7). Nó đi qua mọi thao tác của tài liệu cũ và áp bảng của Chương 4 — với luật ngược nhau cho thứ client <em>gửi</em> và thứ client <em>nhận</em>:</p>
<ul>
  <li><strong>phá vỡ</strong>: xoá một thao tác; tham số hay trường request bắt buộc mới; trường request đang tuỳ chọn thành bắt buộc; trường response bị bỏ hoặc không còn luôn có; đổi kiểu;</li>
  <li><strong>cẩn thận</strong>: thêm giá trị vào enum của response (client cũ có thể sập — đã đo ở 4.1);</li>
  <li><strong>an toàn</strong>: thao tác mới, trường request tuỳ chọn mới, trường response mới.</li>
</ul>
<p>Bốn đề xuất thay đổi, bốn phán quyết:</p>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/purpose-required.yaml; echo "exit=$?"</code></pre>
<div class="out">✗ PHÁ VỠ  POST /bookings body.purpose: trước tuỳ chọn, nay bắt buộc
✗ 1 thay đổi phá vỡ — không được phát hành vào /v2
exit=1</div>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/rename-period.yaml | head -4; echo '…'</code></pre>
<div class="out">✗ PHÁ VỠ  GET /bookings → 200.data[].period: trường bị bỏ khỏi câu trả lời
✓ an toàn  GET /bookings → 200.data[].slot: trường mới trong câu trả lời
✗ PHÁ VỠ  POST /bookings → 201.period: trường bị bỏ khỏi câu trả lời
✓ an toàn  POST /bookings → 201.slot: trường mới trong câu trả lời
…</div>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/add-seats.yaml | tail -3; echo "exit=$?"</code></pre>
<div class="out">✓ an toàn  POST /bookings/{id}/cancel → 200.seats: trường mới trong câu trả lời
✓ an toàn  POST /bookings/{id}/check-in → 200.seats: trường mới trong câu trả lời
✓ không có thay đổi phá vỡ
exit=0</div>
<pre><code class="language-bash">node openapi/diff.mjs openapi/openapi.yaml openapi/no-show.yaml | sed -n '1p;$p'</code></pre>
<div class="out">⚠ CẨN THẬN  GET /bookings → 200.data[].status: thêm giá trị NO_SHOW — client cũ có xử lý giá trị lạ không? (bài 4.1)
✓ không có thay đổi phá vỡ</div>
<p>Bắt buộc <code>purpose</code> và đổi tên là phá vỡ — mã thoát 1, CI đỏ. <code>seats</code> an toàn. <code>NO_SHOW</code> trong enum của response chỉ bị cảnh báo: nó chỉ làm gãy client sập khi gặp giá trị lạ (đã đo ở 4.1).</p>
<div class="pitfall"><p><strong>Bẫy — tin README của công cụ về phiên bản hỗ trợ.</strong> Hãy đo: đưa nó tài liệu thật của bạn. openapi-diff 0.24 từ chối thẳng OpenAPI 3.1. Công cụ nhận tệp rồi vẫn phải được thử với cấu trúc riêng của 3.1 như <code>type: [string, 'null']</code> — bằng một biến thể mà bạn biết chắc là phá vỡ.</p></div>

<h3>Review API như review code</h3>
<p>Phần máy để lại cho người: tài nguyên hay hành động (1.1)? Gửi lại thì sao (5.1)? Trả những lỗi nào, mỗi lỗi có mã chưa (2.1)? Ai được gọi, trên bản ghi của ai (6.2)? Chỉ thêm, không phá (4.1)? Không trả lời được câu nào ⇒ chưa sẵn sàng — mà lúc này chưa có dòng code nào, nên đổi ý rất rẻ.</p>

<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-slide-cs5-2" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở PRJ301 — ⭐ CS.5 Kiến trúc (2): springdoc-openapi</span><span class="lc-sub">Nếu đã học PRJ301 trên Academy, bạn đã công bố OpenAPI từ Spring Boot bằng springdoc và thấy chỗ tài liệu sinh tự động sai. Giống: một tài liệu OpenAPI làm hợp đồng. Khác: đó là code-first bằng Java; ở đây tài liệu có trước và code phải khớp nó. Bài này thêm: mock Prism, bộ luật phong cách Spectral, và cổng chặn thay đổi phá vỡ. Chưa học PRJ301? Bài này vẫn tự đủ.</span></span>
  <span class="lc-cta">MỞ BÀI PRJ301 →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“Design-first hay code-first?”</strong> Design-first khi đội khác hay app phụ thuộc vào API — review hình dạng trước khi code, dựng mock, chặn thay đổi phá vỡ. Code-first cho dịch vụ nội bộ nhỏ, kèm kiểm hợp đồng để tài liệu sinh ra luôn đúng.</li>
  <li><strong>“Chặn thay đổi phá vỡ thế nào?”</strong> Cổng so phiên bản tài liệu trong CI; thay đổi phá vỡ chỉ vào phiên bản mới.</li>
</ul>

<h3>🧪 Luyện tập (25–35 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm một luật Spectral: mọi <code>POST</code> tạo mới phải khai header <code>Location</code> ở câu trả lời 201. LabFlow có qua không?</li>
  <li>Dạy <code>diff.mjs</code> thêm một luật: trường response đổi từ <code>string</code> sang <code>[string, 'null']</code> là phá vỡ. Chứng minh bằng một tài liệu biến thể.</li>
  <li>Cho một script front-end nhỏ gọi mock, hiện được cả màn 201 lẫn màn 409 nhờ <code>Prefer</code>.</li>
</ol>
<p><strong>Xong khi:</strong> luật mới của bạn kêu với tài liệu xấu và im lặng với tài liệu của LabFlow.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Design-first</span><span class="v">Viết và review tài liệu OpenAPI trước khi code.</span></div>
  <div class="kv"><span class="k">Code-first</span><span class="v">Sinh tài liệu từ code (Zod, springdoc…).</span></div>
  <div class="kv"><span class="k">Mock server</span><span class="v">API giả sinh từ tài liệu (Prism) để client làm trước.</span></div>
  <div class="kv"><span class="k">Style guide</span><span class="v">Luật của đội về hình dạng API, do bộ lint kiểm (Spectral).</span></div>
  <div class="kv"><span class="k">Diff gate (cổng so phiên bản)</span><span class="v">Bước CI so hai phiên bản tài liệu, đỏ khi có thay đổi phá vỡ.</span></div>
  <div class="kv"><span class="k">Content negotiation</span><span class="v">Chọn định dạng câu trả lời theo header Accept của request.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Code-first đo thật: Zod xuất được hình dạng (regex ngày giờ 288 ký tự) và đánh rơi <code>.trim()</code>.</li>
  <li>Mock Prism: vô dụng khi thiếu ví dụ; trả 422 ở chỗ server trả 400; một 409 lặng lẽ thành 201 vì header Accept.</li>
  <li>Bộ luật Spectral: 0 lỗi với LabFlow, 4 lỗi với một pull request xấu rất đời thường.</li>
  <li>Cổng so phiên bản: bắt buộc purpose và đổi tên ⇒ phá vỡ (mã thoát 1), trường tuỳ chọn mới ⇒ an toàn, giá trị enum mới ⇒ cảnh báo; openapi-diff 0.24 không đọc được 3.1.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — GraphQL and gRPC: when REST is not the answer, measured on LabFlow|||7.5 — GraphQL và gRPC: khi REST không phải câu trả lời, đo trên LabFlow',
      slug: 'api-7-4-khac',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cùng dữ liệu qua REST, GraphQL, gRPC: lượt đi-về và byte, N+1 và DataLoader, query sâu 385 KB, lỗi là 200; Protobuf so với JSON, streaming, độ trễ trên một máy; LabFlow chọn REST + OpenAPI.',
      content: `${G075}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>GraphQL and gRPC: when REST is not the answer — measured on LabFlow</h2>
<p class="lead">“Why not GraphQL?” is a question every API designer gets, and “use gRPC, it is faster” is advice every team hears. Instead of opinions, this lesson serves the same LabFlow data three ways — REST, GraphQL and gRPC — and measures round trips, bytes, database calls and latency. Each style wins something and pays for it somewhere else.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">REST + OpenAPI</span><span class="lz-lnote">many URLs, HTTP semantics (status, cache, retry) · the server shapes the data</span></div>
  <div class="lz-layer"><span class="lz-lname">GraphQL</span><span class="lz-lnote">one URL, a typed schema · the CLIENT picks the fields and nesting</span></div>
  <div class="lz-layer"><span class="lz-lname">gRPC + Protocol Buffers</span><span class="lz-lnote">methods, not URLs · binary messages, generated code, streaming</span></div>
</div>

<h3>GraphQL: the client asks for exactly what it needs</h3>
<p>A GraphQL server publishes a <strong>schema</strong> of types; a client sends a <strong>query</strong> naming the fields it wants, at any depth. LabFlow’s data as a schema (written in SDL, the schema definition language):</p>
<pre><code class="language-javascript">// graphql/server.mjs (trích) — cổng 4001, cùng dữ liệu db.js của LabFlow
const schema = buildSchema(&#96;
  type Query { labs: [Lab!]!  lab(id: ID!): Lab }
  type Lab { id: ID!  code: String!  name: String!  capacity: Int!  devices: [Device!]!  bookings(limit: Int = 5): [Booking!]! }
  type Device { id: ID!  name: String!  status: String! }
  type Booking { id: ID!  start: String!  end: String!  status: String!  purpose: String  lab: Lab! }
&#96;);
let dbCalls = 0;   // mỗi lần "hỏi cơ sở dữ liệu" (ở Chương 12 là một câu SQL)</code></pre>
<p>The lab-manager dashboard wants every lab with its devices and next three bookings. One request:</p>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { name devices { name status } bookings(limit: 3) { start status } } }' --show</code></pre>
<div class="out">HTTP 200 · 838 byte · 7 lần hỏi CSDL
{"data":{"labs":[{"name":"Phòng Lab Mạng máy tính","devices":[{"name":"Cisco Router 2901","status":"AVAILABLE"},{"name":"Cisco Switch 2960","status":"AVAILABLE"}],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T02:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T04:00:00.000Z","status":"CANCELLED"}]},{"name":"Phòng Lab IoT","devices":[{"name":"Raspberry Pi 5","status":"AVAILABLE"}],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T02:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T04:00:00.000Z","status":"PENDING"}]},{"name":"Phòng Lab Phần mềm","devices":[],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T02:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T04:00:00.000Z","status":"PENDING"}]}]}}</div>
<p>The same data from REST <code>/v2</code> (logged in as Lan, production JSON without indentation):</p>
<pre><code class="language-bash">node graphql/rest-same.mjs</code></pre>
<div class="out">REST: 7 request · 3335 byte · 17.5 ms</div>
<p>GraphQL: 1 round trip, 838 bytes, only the requested fields. REST: 7 round trips and 4× the bytes, because each endpoint returns its full view (<code>serialNumber</code>, <code>note</code>, <code>userId</code>…). On a phone over 4G, round trips cost more than bytes — this is GraphQL’s real selling point.</p>

<h3>The price #1: N+1 queries, inside the server</h3>
<p>Look again at the first line: <strong>7 database calls</strong> for one query — 1 for the labs, then 1 for each lab’s devices and 1 for each lab’s bookings. Each field has its own <em>resolver</em> that fetches its own data. With 100 labs that is 201 calls. The standard fix is <strong>DataLoader</strong>: resolvers ask a loader for “bookings of lab_1”, the loader waits until the current tick ends and fetches all requested labs in one call.</p>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { name devices { name status } bookings(limit: 3) { start status } } }'</code></pre>
<div class="out">HTTP 200 · 838 byte · 3 lần hỏi CSDL</div>
<p>7 → 3 calls, the same 838 bytes. DataLoader must be created <strong>per request</strong> (its cache would otherwise leak one user’s data to another).</p>
<a class="link-card" href="https://github.com/graphql/dataloader" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: graphql/dataloader — README (read 1 Nov 2026)</span><span class="lc-sub">Coalesces all loads within a single frame of execution into one batch call; instances are typically created per request, because the cache is per request.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>The price #2: the client controls the cost</h3>
<p>Fields can nest as deep as the schema allows — and <code>Booking.lab.bookings</code> loops. One innocent-looking query:</p>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { bookings(limit: 20) { lab { bookings(limit: 20) { lab { bookings(limit: 20) { id } } } } } } }'</code></pre>
<div class="out">HTTP 200 · 385444 byte · 2524 lần hỏi CSDL</div>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { bookings(limit: 20) { lab { bookings(limit: 20) { lab { bookings(limit: 20) { id } } } } } } }'</code></pre>
<div class="out">HTTP 200 · 385444 byte · 3 lần hỏi CSDL</div>
<p>2,524 database calls without DataLoader. With it, 3 calls — but still <strong>385 KB</strong> built and sent for one request. In REST the server decides the cost of each endpoint (and Chapter 3 capped <code>limit</code> at 100); in GraphQL any client can write this query. Production GraphQL needs a maximum depth, a cost limit per query, and often a list of allowed (“persisted”) queries.</p>
<div class="pitfall"><p><strong>Trap — exposing a GraphQL schema without depth/cost limits.</strong> One query from one client can do the work of thousands of REST requests, and rate limiting by request count (5.3) does not see it.</p></div>

<h3>The price #3: HTTP semantics change</h3>
<pre><code class="language-bash">node graphql/ask.mjs '{ lab(id: "lab_99") { name } }' --show</code></pre>
<div class="out">HTTP 200 · 21 byte · 1 lần hỏi CSDL
{"data":{"lab":null}}</div>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { nme } }' --show</code></pre>
<div class="out">HTTP 400 · 130 byte · 0 lần hỏi CSDL
{"errors":[{"message":"Cannot query field \\"nme\\" on type \\"Lab\\". Did you mean \\"name\\"?","locations":[{"line":1,"column":10}]}]}</div>
<p>“Lab not found” is <strong>200</strong> with <code>"lab": null</code> — status codes stop meaning what Chapter 1 taught; clients must read the body. A wrong field name got 400 from graphql-http 1.23; the current working draft of the GraphQL-over-HTTP spec recommends 422 for validation failures and proposes a special <code>294</code> for “data and errors together” — libraries and drafts are still moving, so check yours. And because queries go by POST to one URL, the HTTP caching of Chapter 9 (Cache-Control, ETag per URL) does not apply as-is.</p>
<a class="link-card" href="https://graphql.github.io/graphql-over-http/draft/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: GraphQL over HTTP — current working draft (read 1 Nov 2026)</span><span class="lc-sub">400 when JSON or the document cannot be parsed; 422 when validation fails; a proposed 294 Partial Success when a result has both data and errors (to be treated as 200 by clients that do not know it).</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>gRPC: methods and binary messages</h3>
<p>gRPC describes an API as services with methods, in a <code>.proto</code> file (Protocol Buffers). Code generators turn it into client and server stubs for many languages; messages travel in a compact binary format over HTTP/2. LabFlow bookings as a gRPC contract:</p>
<pre><code class="language-protobuf">// labflow.proto — bài 7.5: hợp đồng gRPC viết bằng Protocol Buffers (proto3)
syntax = "proto3";
package labflow.v1;

service Bookings {
  rpc ListBookings (ListBookingsRequest) returns (ListBookingsResponse);   // một hỏi – một đáp
  rpc WatchLab (WatchLabRequest) returns (stream Booking);                 // server đẩy dần (streaming)
}

enum BookingStatus {
  BOOKING_STATUS_UNSPECIFIED = 0;   // proto3: giá trị 0 luôn là "không rõ" — client cũ gặp số lạ cũng rơi về đây
  PENDING = 1;
  CHECKED_IN = 2;
  CANCELLED = 3;
}

message Booking {
  string id = 1;          // số thứ tự TRƯỜNG (tag) mới là thứ đi trên dây — đổi tên thoải mái, đổi số là vỡ
  string lab_id = 2;
  string user_id = 3;
  string start = 4;       // RFC 3339; dự án lớn dùng google.protobuf.Timestamp
  string end = 5;
  BookingStatus status = 6;
  string purpose = 7;
}

message ListBookingsRequest { string lab_id = 1; int32 limit = 2; string cursor = 3; }
message ListBookingsResponse { repeated Booking data = 1; string next_cursor = 2; }
message WatchLabRequest { string lab_id = 1; }</code></pre>
<p>Two rules from the proto3 guide that are Chapter 4 in another language: a field’s <em>number</em> is what travels on the wire — rename freely, never renumber, and <code>reserved</code> deleted numbers; and the first enum value must be 0, conventionally <code>…_UNSPECIFIED</code>, which is where unknown values land — the “unknown enum value” problem of 4.1, solved by the format.</p>
<pre><code class="language-bash">node grpc/client.mjs</code></pre>
<div class="out">{"data":[{"id":"bk_2","labId":"lab_2","userId":"usr_2","start":"2026-11-02T00:00:00.000Z","end":"2026-11-02T02:00:00.000Z","status":"PENDING","purpose":"NWC204 Lab 2"},{"id":"bk_5","labId":"lab_2","userId":"usr_1","start":"2026-11-02T02:00:00.000Z","end":"2026-11-02T04:00:00.000Z","status":"PENDING","purpose":"SWT301 Lab 3"}],"nextCursor":"2"}
+204 ms bk_1 PENDING 2026-11-02T00:00:00.000Z
+402 ms bk_4 PENDING 2026-11-02T02:00:00.000Z
+604 ms bk_7 CANCELLED 2026-11-02T04:00:00.000Z
luồng đóng</div>
<p>The second call is a <strong>server stream</strong>: one request, three messages arriving 200 ms apart, then the stream closes. REST has no simple equivalent (Chapter 10 compares SSE and WebSockets).</p>

<h3>Is it faster? Measured on one machine</h3>
<pre><code class="language-bash">node grpc/bench.mjs</code></pre>
<div class="out">100 lượt đặt: JSON 17170 byte · Protobuf 9132 byte (53%)
sau gzip:     JSON 1089 byte · Protobuf 944 byte
2000 lời gọi tuần tự, trang 20 lượt: gRPC 0.324 ms/lần · REST+JSON 0.435 ms/lần</div>
<p>Protobuf is 53% of the JSON size — but after gzip the difference almost vanishes (1,089 vs 944 bytes; LabFlow’s data repeats a lot). 2,000 sequential calls: 0.32 vs 0.44 ms per call. Be honest about what that compares: the REST path also verifies a JWT, checks rate limits and runs validation, which the gRPC demo does not. On localhost the difference is a fraction of a millisecond; across a data centre with HTTP/2 connections reused, gRPC’s advantage is real but rarely the bottleneck of a CRUD API. What gRPC really buys is a strict generated contract and streaming. What it costs: browsers cannot call it directly (gRPC-Web or Connect needed), and curl cannot read the answers.</p>
<a class="link-card" href="https://protobuf.dev/programming-guides/proto3/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Protocol Buffers — proto3 language guide (read 1 Nov 2026)</span><span class="lc-sub">Field numbers cannot change once in use and deleted numbers must be reserved; the first enum value must be 0 and should be named …_UNSPECIFIED; unknown fields and enum values are preserved by older code.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Choosing — and LabFlow’s choice</h3>
<table>
  <thead><tr><th>Need</th><th>Pick</th><th>Why</th></tr></thead>
  <tbody>
    <tr><td>Public API, browsers, caching, simple tools</td><td>REST + OpenAPI</td><td>HTTP semantics, curl, CDN caching, every language</td></tr>
    <tr><td>Many screens needing different shapes of linked data</td><td>GraphQL (often as a BFF over REST)</td><td>1 round trip, client-chosen fields — if you add depth/cost limits and DataLoader</td></tr>
    <tr><td>Service-to-service inside a data centre, streaming</td><td>gRPC</td><td>strict generated contracts, binary, HTTP/2 streams</td></tr>
  </tbody>
</table>
<p>LabFlow stays <strong>REST + OpenAPI</strong> for the capstone: its clients are a web app and a mobile app, its errors and retries rely on HTTP status codes (Chapters 2 and 5), and caching (Chapter 9) works per URL. If one day the manager dashboard needs many shapes, a small GraphQL layer can sit in front of the REST API without changing it.</p>

<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-swd21-1" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in SWD392 — 3.L Service-Oriented Architectures (1/2): SOAP</span><span class="lc-sub">If you took SWD392 on Academy, you saw services described by WSDL and called over SOAP, and the note that new services use REST + OpenAPI, or gRPC inside a data centre. Same: a machine-readable service contract. Different: SWD392 is the architecture view; here you build REST, GraphQL and gRPC on the same data and measure them. Not taken SWD392? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN SWD392 LESSON →</span>
</a>

<h3>In interviews and at work</h3>
<ul>
  <li><strong>“REST or GraphQL?”</strong> GraphQL saves round trips when clients need different shapes of linked data; it costs N+1 inside the server (DataLoader), client-controlled cost (depth/complexity limits), and HTTP status/caching semantics.</li>
  <li><strong>“Why gRPC?”</strong> Strict generated contracts and streaming between services; not for browsers without a proxy. Speed alone is rarely the reason — measure.</li>
</ul>

<h3>🧪 Practice (25–35 min)</h3>
<div class="callout ok"><ol>
  <li>Add a depth limit to the GraphQL demo (reject queries deeper than 4) and re-run the deep query.</li>
  <li>Add <code>Booking.user</code> to the schema with a DataLoader; how many database calls does the dashboard query make with and without it?</li>
  <li>Add a field to <code>labflow.proto</code> safely, then do it unsafely (reuse a number). What does an old client decode?</li>
</ol>
<p><strong>Done when:</strong> you can state, with your own numbers, one case where each of the three styles is the right choice.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GraphQL schema / SDL</span><span class="v">The typed description of what a GraphQL server can return.</span></div>
  <div class="kv"><span class="k">Resolver</span><span class="v">The function that fetches one field’s data.</span></div>
  <div class="kv"><span class="k">N+1 problem</span><span class="v">1 query for a list, then 1 more per item.</span></div>
  <div class="kv"><span class="k">DataLoader</span><span class="v">Batches the loads of one tick into one call; one instance per request.</span></div>
  <div class="kv"><span class="k">Protocol Buffers</span><span class="v">Google’s binary message format and schema language used by gRPC.</span></div>
  <div class="kv"><span class="k">Server streaming</span><span class="v">One request, many response messages over time.</span></div>
  <div class="kv"><span class="k">BFF</span><span class="v">Backend for frontend: a thin API layer shaped for one client.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Dashboard data: GraphQL 1 request / 838 B vs REST 7 requests / 3,335 B.</li>
  <li>GraphQL’s prices, measured: 7 DB calls (N+1) → 3 with DataLoader; one deep query = 2,524 DB calls or 385 KB; “not found” is 200.</li>
  <li>gRPC: Protobuf 53% of JSON (≈ equal after gzip); 0.32 vs 0.44 ms/call on localhost with REST doing more work; streaming built in; no direct browser calls.</li>
  <li>LabFlow keeps REST + OpenAPI; GraphQL could be added later as a layer in front.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>GraphQL và gRPC: khi REST không phải câu trả lời — đo trên LabFlow</h2>
<p class="lead">“Sao không dùng GraphQL?” là câu hỏi người thiết kế API nào cũng gặp, và “dùng gRPC đi, nhanh hơn” là lời khuyên đội nào cũng nghe. Thay vì ý kiến, bài này phục vụ CÙNG dữ liệu LabFlow theo ba cách — REST, GraphQL và gRPC — rồi đo số lượt đi-về, số byte, số lần hỏi cơ sở dữ liệu và độ trễ. Mỗi kiểu thắng một thứ và trả giá ở chỗ khác.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">REST + OpenAPI</span><span class="lz-lnote">nhiều URL, ngữ nghĩa HTTP (mã trạng thái, cache, gửi lại) · server quyết định hình dạng dữ liệu</span></div>
  <div class="lz-layer"><span class="lz-lname">GraphQL</span><span class="lz-lnote">một URL, một schema có kiểu · CLIENT chọn trường và độ lồng</span></div>
  <div class="lz-layer"><span class="lz-lname">gRPC + Protocol Buffers</span><span class="lz-lnote">phương thức thay cho URL · thông điệp nhị phân, code sinh tự động, luồng (streaming)</span></div>
</div>

<h3>GraphQL: client xin đúng thứ nó cần</h3>
<p>Server GraphQL công bố một <strong>schema</strong> gồm các kiểu; client gửi một <strong>query</strong> liệt kê các trường nó muốn, lồng sâu bao nhiêu cũng được. Dữ liệu LabFlow viết thành schema (bằng SDL — ngôn ngữ định nghĩa schema):</p>
<pre><code class="language-javascript">// graphql/server.mjs (trích) — cổng 4001, cùng dữ liệu db.js của LabFlow
const schema = buildSchema(&#96;
  type Query { labs: [Lab!]!  lab(id: ID!): Lab }
  type Lab { id: ID!  code: String!  name: String!  capacity: Int!  devices: [Device!]!  bookings(limit: Int = 5): [Booking!]! }
  type Device { id: ID!  name: String!  status: String! }
  type Booking { id: ID!  start: String!  end: String!  status: String!  purpose: String  lab: Lab! }
&#96;);
let dbCalls = 0;   // mỗi lần "hỏi cơ sở dữ liệu" (ở Chương 12 là một câu SQL)</code></pre>
<p>Bảng điều khiển của quản lý phòng lab cần mọi phòng kèm thiết bị và ba lượt đặt kế tiếp. Một request:</p>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { name devices { name status } bookings(limit: 3) { start status } } }' --show</code></pre>
<div class="out">HTTP 200 · 838 byte · 7 lần hỏi CSDL
{"data":{"labs":[{"name":"Phòng Lab Mạng máy tính","devices":[{"name":"Cisco Router 2901","status":"AVAILABLE"},{"name":"Cisco Switch 2960","status":"AVAILABLE"}],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T02:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T04:00:00.000Z","status":"CANCELLED"}]},{"name":"Phòng Lab IoT","devices":[{"name":"Raspberry Pi 5","status":"AVAILABLE"}],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T02:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T04:00:00.000Z","status":"PENDING"}]},{"name":"Phòng Lab Phần mềm","devices":[],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T02:00:00.000Z","status":"PENDING"},{"start":"2026-11-02T04:00:00.000Z","status":"PENDING"}]}]}}</div>
<p>Cùng dữ liệu đó qua REST <code>/v2</code> (đăng nhập bằng cô Lan, JSON production không thụt lề):</p>
<pre><code class="language-bash">node graphql/rest-same.mjs</code></pre>
<div class="out">REST: 7 request · 3335 byte · 17.5 ms</div>
<p>GraphQL: 1 lượt đi-về, 838 byte, chỉ những trường được xin. REST: 7 lượt đi-về và gấp 4 lần số byte, vì endpoint nào cũng trả nguyên view của nó (<code>serialNumber</code>, <code>note</code>, <code>userId</code>…). Trên điện thoại dùng 4G, lượt đi-về đắt hơn byte — đây mới là điểm mạnh thật của GraphQL.</p>

<h3>Cái giá thứ nhất: N+1 truy vấn, bên trong server</h3>
<p>Nhìn lại dòng đầu: <strong>7 lần hỏi CSDL</strong> cho một query — 1 cho danh sách phòng, rồi mỗi phòng 1 lần lấy thiết bị và 1 lần lấy lượt đặt. Mỗi trường có <em>resolver</em> (hàm lấy dữ liệu cho trường đó) tự đi lấy dữ liệu của mình. 100 phòng là 201 lần. Cách chữa chuẩn là <strong>DataLoader</strong>: resolver xin loader “lượt đặt của lab_1”, loader chờ hết lượt chạy hiện tại rồi lấy tất cả các phòng được xin trong một lần.</p>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { name devices { name status } bookings(limit: 3) { start status } } }'</code></pre>
<div class="out">HTTP 200 · 838 byte · 3 lần hỏi CSDL</div>
<p>7 → 3 lần, vẫn 838 byte. DataLoader phải tạo <strong>mỗi request một cái</strong> (không thì cache của nó làm lộ dữ liệu người này sang người khác).</p>
<a class="link-card" href="https://github.com/graphql/dataloader" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: graphql/dataloader — README (đọc ngày 1/11/2026)</span><span class="lc-sub">Gom mọi lần load trong cùng một nhịp chạy thành một lần gọi theo lô; thường tạo một instance cho mỗi request, vì cache chỉ sống trong một request.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Cái giá thứ hai: client nắm quyền quyết định chi phí</h3>
<p>Các trường lồng sâu tới đâu schema cho phép — mà <code>Booking.lab.bookings</code> lại vòng tròn. Một query trông vô hại:</p>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { bookings(limit: 20) { lab { bookings(limit: 20) { lab { bookings(limit: 20) { id } } } } } } }'</code></pre>
<div class="out">HTTP 200 · 385444 byte · 2524 lần hỏi CSDL</div>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { bookings(limit: 20) { lab { bookings(limit: 20) { lab { bookings(limit: 20) { id } } } } } } }'</code></pre>
<div class="out">HTTP 200 · 385444 byte · 3 lần hỏi CSDL</div>
<p>2.524 lần hỏi CSDL khi không có DataLoader. Có nó: 3 lần — nhưng vẫn <strong>385 KB</strong> được dựng và gửi cho một request. Ở REST, server quyết định chi phí từng endpoint (Chương 3 đã chặn <code>limit</code> ở 100); ở GraphQL client nào cũng viết được query này. GraphQL ở production cần giới hạn độ sâu, giới hạn chi phí mỗi query, và thường là danh sách query được phép (“persisted queries”).</p>
<div class="pitfall"><p><strong>Bẫy — mở schema GraphQL mà không giới hạn độ sâu/chi phí.</strong> Một query của một client có thể làm việc của hàng nghìn request REST, và giới hạn tần suất theo số request (5.3) không nhìn thấy nó.</p></div>

<h3>Cái giá thứ ba: ngữ nghĩa HTTP thay đổi</h3>
<pre><code class="language-bash">node graphql/ask.mjs '{ lab(id: "lab_99") { name } }' --show</code></pre>
<div class="out">HTTP 200 · 21 byte · 1 lần hỏi CSDL
{"data":{"lab":null}}</div>
<pre><code class="language-bash">node graphql/ask.mjs '{ labs { nme } }' --show</code></pre>
<div class="out">HTTP 400 · 130 byte · 0 lần hỏi CSDL
{"errors":[{"message":"Cannot query field \\"nme\\" on type \\"Lab\\". Did you mean \\"name\\"?","locations":[{"line":1,"column":10}]}]}</div>
<p>“Không tìm thấy phòng” là <strong>200</strong> kèm <code>"lab": null</code> — mã trạng thái không còn mang nghĩa như Chương 1 dạy; client phải đọc body. Tên trường sai nhận 400 từ graphql-http 1.23; bản nháp hiện hành của đặc tả GraphQL-over-HTTP khuyên 422 cho lỗi validation và đề xuất mã riêng <code>294</code> cho “vừa có data vừa có errors” — thư viện và bản nháp còn đang đổi, hãy kiểm thư viện của bạn. Và vì query đi bằng POST tới một URL duy nhất, cache HTTP của Chương 9 (Cache-Control, ETag theo URL) không áp dụng nguyên xi được.</p>
<a class="link-card" href="https://graphql.github.io/graphql-over-http/draft/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: GraphQL over HTTP — bản nháp hiện hành (đọc ngày 1/11/2026)</span><span class="lc-sub">400 khi JSON hoặc tài liệu GraphQL không đọc được; 422 khi validation hỏng; đề xuất 294 Partial Success khi kết quả có cả data lẫn errors (client không biết mã này thì coi như 200).</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>gRPC: phương thức và thông điệp nhị phân</h3>
<p>gRPC mô tả API thành các service có phương thức, trong một tệp <code>.proto</code> (Protocol Buffers). Bộ sinh code biến nó thành phần khung client và server cho nhiều ngôn ngữ; thông điệp đi ở dạng nhị phân gọn, trên HTTP/2. Lượt đặt LabFlow viết thành hợp đồng gRPC:</p>
<pre><code class="language-protobuf">// labflow.proto — bài 7.5: hợp đồng gRPC viết bằng Protocol Buffers (proto3)
syntax = "proto3";
package labflow.v1;

service Bookings {
  rpc ListBookings (ListBookingsRequest) returns (ListBookingsResponse);   // một hỏi – một đáp
  rpc WatchLab (WatchLabRequest) returns (stream Booking);                 // server đẩy dần (streaming)
}

enum BookingStatus {
  BOOKING_STATUS_UNSPECIFIED = 0;   // proto3: giá trị 0 luôn là "không rõ" — client cũ gặp số lạ cũng rơi về đây
  PENDING = 1;
  CHECKED_IN = 2;
  CANCELLED = 3;
}

message Booking {
  string id = 1;          // số thứ tự TRƯỜNG (tag) mới là thứ đi trên dây — đổi tên thoải mái, đổi số là vỡ
  string lab_id = 2;
  string user_id = 3;
  string start = 4;       // RFC 3339; dự án lớn dùng google.protobuf.Timestamp
  string end = 5;
  BookingStatus status = 6;
  string purpose = 7;
}

message ListBookingsRequest { string lab_id = 1; int32 limit = 2; string cursor = 3; }
message ListBookingsResponse { repeated Booking data = 1; string next_cursor = 2; }
message WatchLabRequest { string lab_id = 1; }</code></pre>
<p>Hai luật trong hướng dẫn proto3 chính là Chương 4 viết bằng ngôn ngữ khác: thứ đi trên dây là <em>số</em> của trường — đổi tên thoải mái, không bao giờ đổi số, và <code>reserved</code> các số đã xoá; còn giá trị enum đầu tiên phải là 0, theo quy ước tên <code>…_UNSPECIFIED</code>, là nơi giá trị lạ rơi vào — vấn đề “giá trị enum lạ” của bài 4.1, được định dạng giải sẵn.</p>
<pre><code class="language-bash">node grpc/client.mjs</code></pre>
<div class="out">{"data":[{"id":"bk_2","labId":"lab_2","userId":"usr_2","start":"2026-11-02T00:00:00.000Z","end":"2026-11-02T02:00:00.000Z","status":"PENDING","purpose":"NWC204 Lab 2"},{"id":"bk_5","labId":"lab_2","userId":"usr_1","start":"2026-11-02T02:00:00.000Z","end":"2026-11-02T04:00:00.000Z","status":"PENDING","purpose":"SWT301 Lab 3"}],"nextCursor":"2"}
+204 ms bk_1 PENDING 2026-11-02T00:00:00.000Z
+402 ms bk_4 PENDING 2026-11-02T02:00:00.000Z
+604 ms bk_7 CANCELLED 2026-11-02T04:00:00.000Z
luồng đóng</div>
<p>Lần gọi thứ hai là <strong>server stream</strong>: một request, ba thông điệp tới cách nhau 200 ms, rồi luồng đóng. REST không có cách tương đương đơn giản (Chương 10 so SSE và WebSocket).</p>

<h3>Có nhanh hơn không? Đo trên một máy</h3>
<pre><code class="language-bash">node grpc/bench.mjs</code></pre>
<div class="out">100 lượt đặt: JSON 17170 byte · Protobuf 9132 byte (53%)
sau gzip:     JSON 1089 byte · Protobuf 944 byte
2000 lời gọi tuần tự, trang 20 lượt: gRPC 0.324 ms/lần · REST+JSON 0.435 ms/lần</div>
<p>Protobuf bằng 53% kích thước JSON — nhưng sau gzip chênh lệch gần như biến mất (1.089 so với 944 byte; dữ liệu LabFlow lặp nhiều). 2.000 lời gọi tuần tự: 0,32 so với 0,44 ms mỗi lần. Hãy trung thực về thứ đang được so: đường REST còn kiểm JWT, giới hạn tần suất và validate, còn bản demo gRPC thì không. Trên localhost chênh nhau một phần nhỏ của mili giây; trong trung tâm dữ liệu với kết nối HTTP/2 dùng lại, lợi thế của gRPC là thật nhưng hiếm khi là nút thắt của một API CRUD. Thứ gRPC thật sự mang lại là hợp đồng sinh code chặt chẽ và streaming. Cái giá: trình duyệt không gọi thẳng được (cần gRPC-Web hoặc Connect), và curl không đọc được câu trả lời.</p>
<a class="link-card" href="https://protobuf.dev/programming-guides/proto3/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Protocol Buffers — hướng dẫn ngôn ngữ proto3 (đọc ngày 1/11/2026)</span><span class="lc-sub">Số của trường không được đổi khi đã dùng và số đã xoá phải reserved; giá trị enum đầu tiên phải là 0 và nên đặt tên …_UNSPECIFIED; trường và giá trị enum lạ được code cũ giữ nguyên.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Chọn thế nào — và LabFlow chọn gì</h3>
<table>
  <thead><tr><th>Nhu cầu</th><th>Chọn</th><th>Vì sao</th></tr></thead>
  <tbody>
    <tr><td>API công khai, trình duyệt, cache, công cụ đơn giản</td><td>REST + OpenAPI</td><td>ngữ nghĩa HTTP, curl, cache CDN, ngôn ngữ nào cũng gọi được</td></tr>
    <tr><td>Nhiều màn hình cần dữ liệu liên kết với hình dạng khác nhau</td><td>GraphQL (thường làm lớp BFF trước REST)</td><td>1 lượt đi-về, client chọn trường — nếu có giới hạn độ sâu/chi phí và DataLoader</td></tr>
    <tr><td>Dịch vụ gọi dịch vụ trong trung tâm dữ liệu, streaming</td><td>gRPC</td><td>hợp đồng sinh code chặt, nhị phân, luồng HTTP/2</td></tr>
  </tbody>
</table>
<p>LabFlow giữ <strong>REST + OpenAPI</strong> cho dự án cuối khoá: client là một web app và một app di động, lỗi và gửi lại dựa vào mã trạng thái HTTP (Chương 2 và 5), và cache (Chương 9) hoạt động theo URL. Nếu một ngày bảng điều khiển của quản lý cần nhiều hình dạng dữ liệu, một lớp GraphQL nhỏ có thể đứng trước REST API mà không đổi gì nó.</p>

<a class="link-card lien-ket-cheo" href="/courses/software-architecture-and-design/learn?lessonSlug=swd392-slide-swd21-1" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Bạn đã gặp ở SWD392 — 3.L Kiến trúc hướng dịch vụ (1/2): SOAP</span><span class="lc-sub">Nếu đã học SWD392 trên Academy, bạn đã thấy dịch vụ được mô tả bằng WSDL và gọi qua SOAP, cùng nhận xét rằng dịch vụ mới dùng REST + OpenAPI, hoặc gRPC trong trung tâm dữ liệu. Giống: một hợp đồng dịch vụ máy đọc được. Khác: SWD392 là góc nhìn kiến trúc; ở đây bạn dựng REST, GraphQL và gRPC trên cùng dữ liệu và đo chúng. Chưa học SWD392? Bài này vẫn tự đủ.</span></span>
  <span class="lc-cta">MỞ BÀI SWD392 →</span>
</a>

<h3>Khi phỏng vấn và khi đi làm</h3>
<ul>
  <li><strong>“REST hay GraphQL?”</strong> GraphQL tiết kiệm lượt đi-về khi client cần dữ liệu liên kết với nhiều hình dạng; cái giá là N+1 trong server (DataLoader), client nắm chi phí (giới hạn độ sâu/độ phức tạp), và mất ngữ nghĩa mã trạng thái/cache của HTTP.</li>
  <li><strong>“Vì sao gRPC?”</strong> Hợp đồng sinh code chặt và streaming giữa các dịch vụ; không dành cho trình duyệt nếu không có proxy. Chỉ vì tốc độ thì hiếm khi đủ lý do — hãy đo.</li>
</ul>

<h3>🧪 Luyện tập (25–35 phút)</h3>
<div class="callout ok"><ol>
  <li>Thêm giới hạn độ sâu cho bản demo GraphQL (từ chối query sâu hơn 4) rồi chạy lại query sâu.</li>
  <li>Thêm <code>Booking.user</code> vào schema có DataLoader; query bảng điều khiển hỏi CSDL bao nhiêu lần khi có và không có nó?</li>
  <li>Thêm một trường vào <code>labflow.proto</code> đúng cách, rồi làm sai cách (dùng lại một số). Client cũ giải mã ra gì?</li>
</ol>
<p><strong>Xong khi:</strong> bạn nói được, bằng số đo của chính mình, một trường hợp mà mỗi kiểu trong ba kiểu là lựa chọn đúng.</p></div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Schema GraphQL / SDL</span><span class="v">Bản mô tả có kiểu những gì server GraphQL trả được.</span></div>
  <div class="kv"><span class="k">Resolver</span><span class="v">Hàm lấy dữ liệu cho một trường.</span></div>
  <div class="kv"><span class="k">Vấn đề N+1</span><span class="v">1 truy vấn cho danh sách, rồi thêm 1 truy vấn cho mỗi phần tử.</span></div>
  <div class="kv"><span class="k">DataLoader</span><span class="v">Gom các lần load trong một nhịp thành một lần gọi; mỗi request một instance.</span></div>
  <div class="kv"><span class="k">Protocol Buffers</span><span class="v">Định dạng thông điệp nhị phân và ngôn ngữ schema của Google mà gRPC dùng.</span></div>
  <div class="kv"><span class="k">Server streaming</span><span class="v">Một request, nhiều thông điệp trả về theo thời gian.</span></div>
  <div class="kv"><span class="k">BFF</span><span class="v">Backend for frontend: lớp API mỏng may đo cho một client.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Dữ liệu bảng điều khiển: GraphQL 1 request / 838 B so với REST 7 request / 3.335 B.</li>
  <li>Cái giá của GraphQL, đo được: 7 lần hỏi CSDL (N+1) → 3 với DataLoader; một query sâu = 2.524 lần hỏi CSDL hoặc 385 KB; “không tìm thấy” là 200.</li>
  <li>gRPC: Protobuf bằng 53% JSON (≈ ngang nhau sau gzip); 0,32 so với 0,44 ms/lần trên localhost trong khi REST làm nhiều việc hơn; có sẵn streaming; trình duyệt không gọi thẳng.</li>
  <li>LabFlow giữ REST + OpenAPI; GraphQL có thể thêm sau như một lớp đứng trước.</li>
</ul>
</div>
`,
    },
    /* ─────────────────────────── 7.6 Lab (bài MỚI) ─────────────────────────── */
    {
      title: '7.6 — Lab 7: design-first waitlist, from contract to running code (with rubric)|||7.6 — Lab 7: hàng chờ thiết kế trước, từ hợp đồng tới code chạy thật (có thang chấm)',
      slug: 'api-7-6-lab',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lab chương: viết hợp đồng hàng chờ, lint 0, cổng không phá vỡ, client có kiểu chạy với mock rồi với server không sửa gì, check-drift 27/27; thang chấm 10 điểm, lời giải, transcript thật, gói dự án tải về.',
      content: `${GL7}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lab 7</span>
<h2>Lab 7 — Design-first: a waitlist, from contract to running code</h2>
<p class="lead">Students keep asking the lab manager to “call me if bk_12 is cancelled”. The faculty wants a <strong>waitlist</strong>: when a slot is already booked, a student can queue for it. This time you work the way 7.4 described: the contract is written, linted, gated and mocked <em>before</em> any server code, and a client is built against the mock. Only then do you implement — and the contract check decides when you are done.</p>

<h3>The request from the faculty</h3>
<ul>
  <li>A student can join the waitlist of a lab for a period that is <strong>already booked</strong>; if the slot is free, the answer must tell them to book directly.</li>
  <li>A student sees their own entries with their current <strong>position</strong> (1 = next in line).</li>
  <li>A student can leave the waitlist; nobody can remove someone else’s entry (6.2: hidden ⇒ 404).</li>
  <li>Nothing that exists today may break: v2 clients keep working untouched.</li>
</ul>
<p>Time: design 40 min · mock + client 20 min · build 40 min · prove 20 min.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A · 40 min</span><span class="lz-t">contract</span><span class="lz-d">openapi.yaml 2.1.0 · lint 0 · gate: no break</span></div>
  <div class="lz-step"><span class="lz-k">B1 · 20 min</span><span class="lz-t">mock + client</span><span class="lz-d">Prism · typed client works before the server</span></div>
  <div class="lz-step"><span class="lz-k">B2 · 40 min</span><span class="lz-t">build</span><span class="lz-d">routes, Zod, policy, check-drift</span></div>
  <div class="lz-step"><span class="lz-k">C · 20 min</span><span class="lz-t">prove</span><span class="lz-d">same client vs real server · all ✓</span></div>
</div>

<h3>Part A — design (<code>openapi.yaml</code> only)</h3>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch7-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Starting point: LabFlow API at the start of Chapter 7 (zip)</span><span class="lc-sub">Contract 2.0.0 with every gate green: <code>npm run api:lint</code> 0 errors, <code>npm run api:diff</code> no breaking change, <code>npm run api:drift</code> 19 ✓, <code>npm test</code> 10/10. No waitlist yet — that is your job.</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>
<ol>
  <li>Copy the current document to <code>openapi/openapi-v2.0.0.yaml</code> — the baseline for the gate.</li>
  <li>Add three operations: <code>POST /labs/{labId}/waitlist</code>, <code>GET /me/waitlist</code>, <code>DELETE /waitlist/{id}</code>, with schemas, every error, and examples realistic enough for a mock.</li>
  <li>Bump <code>info.version</code> to 2.1.0 — an additive change is a MINOR version in Semantic Versioning; the URL stays <code>/v2</code> (only a breaking change gets a new URL version, Chapter 4).</li>
  <li><code>npm run api:lint</code> must report 0 errors (Redocly + the Spectral style guide); <code>npm run api:diff</code> must report no breaking change.</li>
</ol>
<p>Design questions to answer in <code>DESIGN.md</code> before Part B: which status for “the slot is free”? What happens if the same student joins twice? Should <code>position</code> be stored or computed? Is leaving a <code>DELETE</code> or a <code>POST …/cancel</code> action, and why?</p>

<a class="link-card" href="https://semver.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Source: Semantic Versioning 2.0.0 (read 1 Nov 2026)</span><span class="lc-sub">MAJOR for incompatible API changes, MINOR for backward-compatible additions, PATCH for backward-compatible fixes — the rule behind 2.0.0 → 2.1.0 here.</span></span>
  <span class="lc-cta">OPEN →</span>
</a>

<h3>Part B — mock, client, then build</h3>
<ol>
  <li><code>npm run api:mock</code>, regenerate the types (<code>npm run api:types</code>) and write <code>client/waitlist.ts</code> with openapi-fetch. Run it against the mock (<code>BASE=http://localhost:4010</code>).</li>
  <li>Implement the routes: Zod strict body, 404 for an unknown lab, 422 for end ≤ start, 409 <code>SLOT_AVAILABLE</code> / <code>ALREADY_WAITING</code>, owner-or-manager policy with 404, 201 + <code>Location</code>.</li>
  <li>Add the waitlist requests to <code>check-drift.mjs</code>, including the failing ones.</li>
  <li>Run the same <code>client/waitlist.ts</code> — unchanged — against the real server.</li>
</ol>

<h3>Part C — prove it (<code>TRANSCRIPT.md</code>)</h3>
<p>Unedited output of: lint + diff gate; the client against the mock; the client against the real server before and after the slot is booked; <code>check-drift</code> all ✓; <code>npm test</code> green.</p>

<h3>Rubric — 10 points</h3>
<table>
  <thead><tr><th>Points</th><th>Criterion</th><th>Checked by</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Contract complete: 3 operations, every error documented, realistic examples, version 2.1.0</td><td>openapi.yaml</td></tr>
    <tr><td>1</td><td>Lint and style guide: 0 errors</td><td>api:lint</td></tr>
    <tr><td>1</td><td>Diff gate: no breaking change against 2.0.0</td><td>api:diff</td></tr>
    <tr><td>1</td><td>DESIGN.md answers the four design questions with reasons</td><td>the file</td></tr>
    <tr><td>1</td><td>Typed client written against the mock, unchanged against the server</td><td>transcript · git</td></tr>
    <tr><td>2</td><td>Implementation follows the contract: statuses, policy 404, Location, strict body</td><td>check-drift · code</td></tr>
    <tr><td>1</td><td>check-drift extended with failing requests; all ✓; npm test green</td><td>transcript</td></tr>
    <tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
  </tbody>
</table>
<p>Pass: <strong>7/10</strong>. Stretch: notify the first in line when a booking is cancelled (Chapter 10 will do it with events); expire entries whose period has started; add <code>GET /labs/{labId}/waitlist</code> for lab managers.</p>

<h3>Reference solution — read after you have tried</h3>
<p>The contract added to <code>openapi.yaml</code> (the <code>WaitlistEntry</code> schema follows the same rules as <code>Booking</code>: every field present, <code>position</code> null when not waiting):</p>
<pre><code class="language-yaml">  /labs/{labId}/waitlist:
    post:
      tags: [Waitlist]
      operationId: joinWaitlist
      summary: Wait for a slot that is already booked
      parameters:
        - { name: labId, in: path, required: true, schema: { $ref: '#/components/schemas/LabId' } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/WaitlistCreate' }
            example: { period: { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' } }
      responses:
        '201':
          description: You are on the waitlist
          headers:
            Location: { description: URL of the entry, schema: { type: string } }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/WaitlistEntry' }
        '409':
          description: The slot is free (book it directly) or you are already waiting (&#96;SLOT_AVAILABLE&#96;, &#96;ALREADY_WAITING&#96;)
          content:
            application/problem+json:
              schema: { $ref: '#/components/schemas/Problem' }
        # … 400, 401, 404, 415, 422
  /me/waitlist:
    get: { operationId: listMyWaitlist, … }       # { data: WaitlistEntry[] }
  /waitlist/{id}:
    delete: { operationId: leaveWaitlist, … }     # 204 · 401 · 404</code></pre>
<p>The server side — position is <em>computed</em> from the queue, never stored, so it cannot go stale when someone ahead leaves:</p>
<pre><code class="language-javascript">// routes/waitlist.js — Lab 7 (thiết kế trước, code sau): hàng chờ khi khung giờ đã có người đặt
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { authorize } from '../policy.js';

const instant = z.iso.datetime({ offset: true });
export const WaitlistCreate = z.strictObject({
  period: z.strictObject({ start: instant, end: instant }),
  purpose: z.string().trim().normalize('NFC').min(1).max(200).optional(),
});
export const waitlist = [];   // { id, labId, userId, startAt, endAt, purpose, status, createdAt }

const overlaps = (a, b) =&gt; Date.parse(a.startAt) &lt; Date.parse(b.endAt) &amp;&amp; Date.parse(b.startAt) &lt; Date.parse(a.endAt);
// vị trí = số người CÒN chờ đăng ký trước mình cho khung giờ chồng lên, +1
const positionOf = (e) =&gt; waitlist.filter((x) =&gt; x.labId === e.labId &amp;&amp; x.status === 'WAITING'
  &amp;&amp; overlaps(x, e) &amp;&amp; x.createdAt &lt;= e.createdAt &amp;&amp; x.id !== e.id).length + 1;
export const toEntry = (e) =&gt; ({
  id: e.id, labId: e.labId, userId: e.userId, period: { start: e.startAt, end: e.endAt },
  purpose: e.purpose ?? null, status: e.status, position: e.status === 'WAITING' ? positionOf(e) : null, createdAt: e.createdAt,
});

// POST /v2/labs/:labId/waitlist
export const joinWaitlist = [requireAuth, validate('body', WaitlistCreate), (req, res) =&gt; {
  const lab = labs.find((l) =&gt; l.id === req.params.labId &amp;&amp; !l.retiredAt);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', { id: req.params.labId });
  const { period, purpose } = req.valid.body;
  const want = { labId: lab.id, startAt: new Date(period.start).toISOString(), endAt: new Date(period.end).toISOString() };
  if (Date.parse(want.endAt) &lt;= Date.parse(want.startAt)) throw new HttpError(422, 'INVALID_TIME_RANGE');
  const taken = bookings.find((b) =&gt; b.labId === lab.id &amp;&amp; b.status !== 'CANCELLED' &amp;&amp; overlaps(b, want));
  if (!taken) throw new HttpError(409, 'SLOT_AVAILABLE', { id: lab.id });               // còn trống ⇒ đặt thẳng, đừng xếp hàng
  const mine = waitlist.find((e) =&gt; e.userId === req.user.id &amp;&amp; e.labId === lab.id &amp;&amp; e.status === 'WAITING' &amp;&amp; overlaps(e, want));
  if (mine) throw new HttpError(409, 'ALREADY_WAITING', { id: mine.id }, { entry: mine.id });
  const e = { id: nextId('wl'), ...want, userId: req.user.id, purpose: purpose ?? null, status: 'WAITING', createdAt: new Date().toISOString() };
  waitlist.push(e);
  res.status(201).location(&#96;/v\${req.apiVersion}/waitlist/\${e.id}&#96;).json(toEntry(e));
}];

export const myWaitlist = [requireAuth, (req, res) =&gt; {
  res.json({ data: waitlist.filter((e) =&gt; e.userId === req.user.id &amp;&amp; e.status === 'WAITING').map(toEntry) });
}];

export const waitlistRouter = Router();
waitlistRouter.route('/:id')
  .delete(requireAuth, (req, res) =&gt; {
    const notFound = new HttpError(404, 'WAITLIST_NOT_FOUND', { id: req.params.id });
    const e = waitlist.find((x) =&gt; x.id === req.params.id &amp;&amp; x.status === 'WAITING');
    if (!e) throw notFound;
    authorize(req, 'waitlist:cancel', e, notFound);   // của người khác ⇒ 404 như bài 6.2
    e.status = 'CANCELLED';
    res.status(204).end();
  })
  .all(onlyAllow('DELETE'));</code></pre>
<p>The client, written against the mock before the server existed:</p>
<pre><code class="language-typescript">// client/waitlist.ts — Lab 7: client viết TRƯỚC khi server có hàng chờ (chạy với mock Prism, rồi với server thật)
import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';

const baseUrl = process.env.BASE ?? 'http://localhost:4000/v2';
const api = createClient&lt;paths&gt;({ baseUrl });
const token = process.env.TOKEN ?? 'mock-token';

const { data, error, response } = await api.POST('/labs/{labId}/waitlist', {
  params: { path: { labId: 'lab_2' } },
  headers: { Authorization: &#96;Bearer \${token}&#96; },
  body: { period: { start: '2027-03-09T08:00:00+07:00', end: '2027-03-09T10:00:00+07:00' } },
});
if (error) console.log(response.status, error.code);
else console.log(response.status, data.id, data.status, &#96;vị trí \${data.position}&#96;, response.headers.get('location'));</code></pre>
<p>Everything else — the full <code>openapi.yaml</code> 2.1.0, <code>diff.mjs</code> (the gate of 7.4), <code>check-drift.mjs</code>, the Spectral and Redocly configs, the GraphQL and gRPC demos — is in the project archive:</p>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch7.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Download: LabFlow API at the end of Chapter 7 (zip, without node_modules)</span><span class="lc-sub">Run <code>npm install</code>, then <code>npm start</code>; every command of this chapter works from the project folder. Demo passwords: an-lab-2026, binh-lab-2026, lan-lab-2026 (learning only).</span></span>
  <span class="lc-cta">DOWNLOAD →</span>
</a>

<h3>Reference transcript (real run)</h3>
<pre><code class="language-bash">npm run -s api:lint 2&gt;&amp;1 | grep -E 'valid|error|problems|No results'</code></pre>
<div class="out">validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 48ms
Woohoo! Your API description is valid. 🎉
No results with a severity of 'error' found!</div>
<pre><code class="language-bash">npm run -s api:diff; echo "exit=$?"</code></pre>
<div class="out">✓ an toàn  POST /labs/{labId}/waitlist: thao tác mới
✓ an toàn  GET /me/waitlist: thao tác mới
✓ an toàn  DELETE /waitlist/{id}: thao tác mới
✓ không có thay đổi phá vỡ
exit=0</div>
<pre><code class="language-bash">npm run -s api:types 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🚀 openapi/openapi.yaml → client/labflow.d.ts [98.3ms]</div>
<pre><code class="language-bash">npx tsc -p . &amp;&amp; echo 'tsc: 0 lỗi'</code></pre>
<div class="out">tsc: 0 lỗi</div>
<pre><code class="language-bash">BASE=http://localhost:4010 node client/waitlist.ts</code></pre>
<div class="out">201 wl_1 WAITING vị trí 1 string</div>
<p>Against the mock the client already works: the id, status and position come from the examples; <code>Location</code> prints “string” because the header has no example — a hint to add one.</p>
<p>The commands below read the token of Bình (student) from the folder <em>above</em> the project (<code>../bin.jwt</code>), so one login serves every chapter package unzipped side by side. Write it there first — the token lives 15 minutes (lesson 6.1), so log in again if a command answers 401:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"binh@student.labflow.example","password":"binh-lab-2026"}' | jq -r .accessToken &gt; ../bin.jwt</code></pre>
<pre><code class="language-bash">TOKEN=$(cat ../bin.jwt) node client/waitlist.ts</code></pre>
<div class="out">409 SLOT_AVAILABLE</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  --json '{"labId":"lab_2","period":{"start":"2027-03-09T08:00:00+07:00","end":"2027-03-09T10:00:00+07:00"}}' | jq -c '{id, status}'</code></pre>
<div class="out">{"id":"bk_1","status":"PENDING"}</div>
<pre><code class="language-bash">TOKEN=$(cat ../bin.jwt) node client/waitlist.ts</code></pre>
<div class="out">201 wl_1 WAITING vị trí 1 /v2/waitlist/wl_1</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me/waitlist \\
  -H "Authorization: Bearer $(cat bin.jwt)" | jq -c '.data[] | {id, status, position}'</code></pre>
<div class="out">{"id":"wl_1","status":"WAITING","position":1}</div>
<p>The same client, unchanged: first 409 <code>SLOT_AVAILABLE</code> (the slot is free), then — after An books it — 201 at position 1.</p>
<pre><code class="language-bash">node openapi/check-drift.mjs | tail -8</code></pre>
<div class="out">✓ POST /labs/lab_2/waitlist → 409
✓ POST /bookings → 201
✓ POST /labs/lab_2/waitlist → 409
✓ POST /labs/lab_2/waitlist → 409
✓ POST /labs/lab_2/waitlist → 400
✓ GET /me/waitlist → 200
✓ DELETE /waitlist/wl_1 → 404
✓ DELETE /waitlist/wl_1 → 204</div>
<pre><code class="language-bash">node openapi/check-drift.mjs | cut -c1 | sort | uniq -c</code></pre>
<div class="out">  27 ✓</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^ℹ (tests|pass|fail)'</code></pre>
<div class="out">ℹ tests 10
ℹ pass 10
ℹ fail 0</div>
<p>27 checks — the 19 of 7.2 plus 8 for the waitlist, including 409, 400 and the 404 for someone else’s entry.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Lab 7</span>
<h2>Lab 7 — Thiết kế trước: hàng chờ, từ hợp đồng tới code chạy thật</h2>
<p class="lead">Sinh viên cứ nhờ cô Lan “bk_12 mà huỷ thì gọi em nhé”. Khoa muốn có <strong>hàng chờ (waitlist)</strong>: khi một khung giờ đã có người đặt, sinh viên được xếp hàng chờ nó. Lần này bạn làm đúng như bài 7.4 mô tả: hợp đồng được viết, lint, qua cổng và dựng mock <em>trước</em> khi có dòng code server nào, và client được viết dựa trên mock. Chỉ sau đó mới cài đặt — và bộ kiểm hợp đồng quyết định khi nào bạn xong.</p>

<h3>Yêu cầu của khoa</h3>
<ul>
  <li>Sinh viên được vào hàng chờ của một phòng cho một khung giờ <strong>đã có người đặt</strong>; nếu khung giờ còn trống, câu trả lời phải bảo họ đặt thẳng.</li>
  <li>Sinh viên xem được các lượt chờ của mình kèm <strong>vị trí</strong> hiện tại (1 = người kế tiếp).</li>
  <li>Sinh viên rời được hàng chờ; không ai xoá được lượt chờ của người khác (6.2: bị ẩn ⇒ 404).</li>
  <li>Không thứ gì đang có được phép gãy: client v2 vẫn chạy mà không sửa gì.</li>
</ul>
<p>Thời gian: thiết kế 40 phút · mock + client 20 phút · cài đặt 40 phút · chứng minh 20 phút.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">A · 40 phút</span><span class="lz-t">hợp đồng</span><span class="lz-d">openapi.yaml 2.1.0 · lint 0 · cổng: không phá vỡ</span></div>
  <div class="lz-step"><span class="lz-k">B1 · 20 phút</span><span class="lz-t">mock + client</span><span class="lz-d">Prism · client có kiểu chạy trước khi có server</span></div>
  <div class="lz-step"><span class="lz-k">B2 · 40 phút</span><span class="lz-t">cài đặt</span><span class="lz-d">route, Zod, chính sách, check-drift</span></div>
  <div class="lz-step"><span class="lz-k">C · 20 phút</span><span class="lz-t">chứng minh</span><span class="lz-d">cùng client với server thật · tất cả ✓</span></div>
</div>

<h3>Phần A — thiết kế (chỉ sửa <code>openapi.yaml</code>)</h3>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch7-dau.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Điểm xuất phát: LabFlow API đầu Chương 7 (zip)</span><span class="lc-sub">Hợp đồng 2.0.0, mọi cổng đang xanh: <code>npm run api:lint</code> 0 lỗi, <code>npm run api:diff</code> không phá vỡ, <code>npm run api:drift</code> 19 ✓, <code>npm test</code> 10/10. Chưa có hàng chờ — đó là việc của bạn.</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>
<ol>
  <li>Chép tài liệu hiện tại thành <code>openapi/openapi-v2.0.0.yaml</code> — mốc để cổng so sánh.</li>
  <li>Thêm ba thao tác: <code>POST /labs/{labId}/waitlist</code>, <code>GET /me/waitlist</code>, <code>DELETE /waitlist/{id}</code>, có schema, đủ mọi lỗi, và ví dụ đủ thật để mock dùng được.</li>
  <li>Nâng <code>info.version</code> lên 2.1.0 — thay đổi chỉ thêm là bản MINOR theo Semantic Versioning; URL vẫn là <code>/v2</code> (chỉ thay đổi phá vỡ mới cần phiên bản URL mới, Chương 4).</li>
  <li><code>npm run api:lint</code> phải báo 0 lỗi (Redocly + bộ luật Spectral); <code>npm run api:diff</code> phải báo không có thay đổi phá vỡ.</li>
</ol>
<p>Trả lời các câu hỏi thiết kế trong <code>DESIGN.md</code> trước Phần B: mã trạng thái nào cho “khung giờ còn trống”? Một sinh viên vào hàng chờ hai lần thì sao? <code>position</code> nên lưu hay tính? Rời hàng chờ là <code>DELETE</code> hay một hành động <code>POST …/cancel</code>, và vì sao?</p>
<a class="link-card" href="https://semver.org/" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Nguồn: Semantic Versioning 2.0.0 (đọc ngày 1/11/2026)</span><span class="lc-sub">MAJOR cho thay đổi API không tương thích, MINOR cho thêm chức năng tương thích ngược, PATCH cho sửa lỗi tương thích ngược — luật đằng sau 2.0.0 → 2.1.0 ở đây.</span></span>
  <span class="lc-cta">MỞ →</span>
</a>

<h3>Phần B — mock, client, rồi mới cài đặt</h3>
<ol>
  <li><code>npm run api:mock</code>, sinh lại kiểu (<code>npm run api:types</code>) và viết <code>client/waitlist.ts</code> bằng openapi-fetch. Chạy nó với mock (<code>BASE=http://localhost:4010</code>).</li>
  <li>Cài đặt các route: body Zod chặt, 404 khi không có phòng, 422 khi end ≤ start, 409 <code>SLOT_AVAILABLE</code> / <code>ALREADY_WAITING</code>, chính sách chủ-hoặc-quản-lý trả 404, 201 kèm <code>Location</code>.</li>
  <li>Thêm các request hàng chờ vào <code>check-drift.mjs</code>, kể cả request hỏng.</li>
  <li>Chạy lại đúng <code>client/waitlist.ts</code> — không sửa gì — với server thật.</li>
</ol>

<h3>Phần C — chứng minh (<code>TRANSCRIPT.md</code>)</h3>
<p>Output nguyên văn của: lint + cổng so phiên bản; client chạy với mock; client chạy với server thật trước và sau khi khung giờ có người đặt; <code>check-drift</code> tất cả ✓; <code>npm test</code> xanh.</p>

<h3>Thang chấm — 10 điểm</h3>
<table>
  <thead><tr><th>Điểm</th><th>Tiêu chí</th><th>Kiểm bằng</th></tr></thead>
  <tbody>
    <tr><td>2</td><td>Hợp đồng đủ: 3 thao tác, mọi lỗi được ghi, ví dụ thật, phiên bản 2.1.0</td><td>openapi.yaml</td></tr>
    <tr><td>1</td><td>Lint và bộ luật phong cách: 0 lỗi</td><td>api:lint</td></tr>
    <tr><td>1</td><td>Cổng so phiên bản: không phá vỡ so với 2.0.0</td><td>api:diff</td></tr>
    <tr><td>1</td><td>DESIGN.md trả lời bốn câu hỏi thiết kế kèm lý do</td><td>tệp đó</td></tr>
    <tr><td>1</td><td>Client có kiểu viết theo mock, không sửa khi chạy với server</td><td>transcript · git</td></tr>
    <tr><td>2</td><td>Cài đặt đúng hợp đồng: mã trạng thái, chính sách 404, Location, body chặt</td><td>check-drift · code</td></tr>
    <tr><td>1</td><td>check-drift có thêm request hỏng; tất cả ✓; npm test xanh</td><td>transcript</td></tr>
    <tr><td>1</td><td>Transcript đủ và không chỉnh sửa</td><td>tệp đó</td></tr>
  </tbody>
</table>
<p>Đạt: <strong>7/10</strong>. Mở rộng: báo cho người đứng đầu hàng khi một lượt đặt bị huỷ (Chương 10 sẽ làm bằng sự kiện); tự hết hạn các lượt chờ khi khung giờ đã bắt đầu; thêm <code>GET /labs/{labId}/waitlist</code> cho quản lý.</p>

<h3>Lời giải tham khảo — đọc sau khi đã tự làm</h3>
<p>Phần hợp đồng thêm vào <code>openapi.yaml</code> (schema <code>WaitlistEntry</code> theo cùng luật với <code>Booking</code>: trường nào cũng có mặt, <code>position</code> là null khi không còn chờ):</p>
<pre><code class="language-yaml">  /labs/{labId}/waitlist:
    post:
      tags: [Waitlist]
      operationId: joinWaitlist
      summary: Wait for a slot that is already booked
      parameters:
        - { name: labId, in: path, required: true, schema: { $ref: '#/components/schemas/LabId' } }
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/WaitlistCreate' }
            example: { period: { start: '2027-03-02T08:00:00+07:00', end: '2027-03-02T10:00:00+07:00' } }
      responses:
        '201':
          description: You are on the waitlist
          headers:
            Location: { description: URL of the entry, schema: { type: string } }
          content:
            application/json:
              schema: { $ref: '#/components/schemas/WaitlistEntry' }
        '409':
          description: The slot is free (book it directly) or you are already waiting (&#96;SLOT_AVAILABLE&#96;, &#96;ALREADY_WAITING&#96;)
          content:
            application/problem+json:
              schema: { $ref: '#/components/schemas/Problem' }
        # … 400, 401, 404, 415, 422
  /me/waitlist:
    get: { operationId: listMyWaitlist, … }       # { data: WaitlistEntry[] }
  /waitlist/{id}:
    delete: { operationId: leaveWaitlist, … }     # 204 · 401 · 404</code></pre>
<p>Phía server — vị trí được <em>tính</em> từ hàng chờ, không bao giờ lưu, nên không thể sai khi có người phía trước rời đi:</p>
<pre><code class="language-javascript">// routes/waitlist.js — Lab 7 (thiết kế trước, code sau): hàng chờ khi khung giờ đã có người đặt
import { Router } from 'express';
import { z } from 'zod';
import { labs, bookings, nextId } from '../db.js';
import { HttpError, onlyAllow } from '../http.js';
import { requireAuth } from '../auth.js';
import { validate } from '../validate.js';
import { authorize } from '../policy.js';

const instant = z.iso.datetime({ offset: true });
export const WaitlistCreate = z.strictObject({
  period: z.strictObject({ start: instant, end: instant }),
  purpose: z.string().trim().normalize('NFC').min(1).max(200).optional(),
});
export const waitlist = [];   // { id, labId, userId, startAt, endAt, purpose, status, createdAt }

const overlaps = (a, b) =&gt; Date.parse(a.startAt) &lt; Date.parse(b.endAt) &amp;&amp; Date.parse(b.startAt) &lt; Date.parse(a.endAt);
// vị trí = số người CÒN chờ đăng ký trước mình cho khung giờ chồng lên, +1
const positionOf = (e) =&gt; waitlist.filter((x) =&gt; x.labId === e.labId &amp;&amp; x.status === 'WAITING'
  &amp;&amp; overlaps(x, e) &amp;&amp; x.createdAt &lt;= e.createdAt &amp;&amp; x.id !== e.id).length + 1;
export const toEntry = (e) =&gt; ({
  id: e.id, labId: e.labId, userId: e.userId, period: { start: e.startAt, end: e.endAt },
  purpose: e.purpose ?? null, status: e.status, position: e.status === 'WAITING' ? positionOf(e) : null, createdAt: e.createdAt,
});

// POST /v2/labs/:labId/waitlist
export const joinWaitlist = [requireAuth, validate('body', WaitlistCreate), (req, res) =&gt; {
  const lab = labs.find((l) =&gt; l.id === req.params.labId &amp;&amp; !l.retiredAt);
  if (!lab) throw new HttpError(404, 'LAB_NOT_FOUND', { id: req.params.labId });
  const { period, purpose } = req.valid.body;
  const want = { labId: lab.id, startAt: new Date(period.start).toISOString(), endAt: new Date(period.end).toISOString() };
  if (Date.parse(want.endAt) &lt;= Date.parse(want.startAt)) throw new HttpError(422, 'INVALID_TIME_RANGE');
  const taken = bookings.find((b) =&gt; b.labId === lab.id &amp;&amp; b.status !== 'CANCELLED' &amp;&amp; overlaps(b, want));
  if (!taken) throw new HttpError(409, 'SLOT_AVAILABLE', { id: lab.id });               // còn trống ⇒ đặt thẳng, đừng xếp hàng
  const mine = waitlist.find((e) =&gt; e.userId === req.user.id &amp;&amp; e.labId === lab.id &amp;&amp; e.status === 'WAITING' &amp;&amp; overlaps(e, want));
  if (mine) throw new HttpError(409, 'ALREADY_WAITING', { id: mine.id }, { entry: mine.id });
  const e = { id: nextId('wl'), ...want, userId: req.user.id, purpose: purpose ?? null, status: 'WAITING', createdAt: new Date().toISOString() };
  waitlist.push(e);
  res.status(201).location(&#96;/v\${req.apiVersion}/waitlist/\${e.id}&#96;).json(toEntry(e));
}];

export const myWaitlist = [requireAuth, (req, res) =&gt; {
  res.json({ data: waitlist.filter((e) =&gt; e.userId === req.user.id &amp;&amp; e.status === 'WAITING').map(toEntry) });
}];

export const waitlistRouter = Router();
waitlistRouter.route('/:id')
  .delete(requireAuth, (req, res) =&gt; {
    const notFound = new HttpError(404, 'WAITLIST_NOT_FOUND', { id: req.params.id });
    const e = waitlist.find((x) =&gt; x.id === req.params.id &amp;&amp; x.status === 'WAITING');
    if (!e) throw notFound;
    authorize(req, 'waitlist:cancel', e, notFound);   // của người khác ⇒ 404 như bài 6.2
    e.status = 'CANCELLED';
    res.status(204).end();
  })
  .all(onlyAllow('DELETE'));</code></pre>
<p>Client, viết dựa trên mock trước khi có server:</p>
<pre><code class="language-typescript">// client/waitlist.ts — Lab 7: client viết TRƯỚC khi server có hàng chờ (chạy với mock Prism, rồi với server thật)
import createClient from 'openapi-fetch';
import type { paths } from './labflow.d.ts';

const baseUrl = process.env.BASE ?? 'http://localhost:4000/v2';
const api = createClient&lt;paths&gt;({ baseUrl });
const token = process.env.TOKEN ?? 'mock-token';

const { data, error, response } = await api.POST('/labs/{labId}/waitlist', {
  params: { path: { labId: 'lab_2' } },
  headers: { Authorization: &#96;Bearer \${token}&#96; },
  body: { period: { start: '2027-03-09T08:00:00+07:00', end: '2027-03-09T10:00:00+07:00' } },
});
if (error) console.log(response.status, error.code);
else console.log(response.status, data.id, data.status, &#96;vị trí \${data.position}&#96;, response.headers.get('location'));</code></pre>
<p>Mọi thứ còn lại — <code>openapi.yaml</code> 2.1.0 đầy đủ, <code>diff.mjs</code> (cổng của bài 7.4), <code>check-drift.mjs</code>, cấu hình Spectral và Redocly, bản demo GraphQL và gRPC — nằm trong gói dự án:</p>
<a class="link-card" href="https://media.cuongthai.com/files/academy/API/v1/labflow-api-ch7.zip" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Tải về: LabFlow API cuối Chương 7 (zip, không kèm node_modules)</span><span class="lc-sub">Chạy <code>npm install</code>, rồi <code>npm start</code>; mọi lệnh trong chương chạy từ thư mục dự án. Mật khẩu demo: an-lab-2026, binh-lab-2026, lan-lab-2026 (chỉ để học).</span></span>
  <span class="lc-cta">TẢI VỀ →</span>
</a>

<h3>Transcript tham khảo (chạy thật)</h3>
<pre><code class="language-bash">npm run -s api:lint 2&gt;&amp;1 | grep -E 'valid|error|problems|No results'</code></pre>
<div class="out">validating openapi/openapi.yaml...
openapi/openapi.yaml: validated in 48ms
Woohoo! Your API description is valid. 🎉
No results with a severity of 'error' found!</div>
<pre><code class="language-bash">npm run -s api:diff; echo "exit=$?"</code></pre>
<div class="out">✓ an toàn  POST /labs/{labId}/waitlist: thao tác mới
✓ an toàn  GET /me/waitlist: thao tác mới
✓ an toàn  DELETE /waitlist/{id}: thao tác mới
✓ không có thay đổi phá vỡ
exit=0</div>
<pre><code class="language-bash">npm run -s api:types 2&gt;&amp;1 | tail -1</code></pre>
<div class="out">🚀 openapi/openapi.yaml → client/labflow.d.ts [98.3ms]</div>
<pre><code class="language-bash">npx tsc -p . &amp;&amp; echo 'tsc: 0 lỗi'</code></pre>
<div class="out">tsc: 0 lỗi</div>
<pre><code class="language-bash">BASE=http://localhost:4010 node client/waitlist.ts</code></pre>
<div class="out">201 wl_1 WAITING vị trí 1 string</div>
<p>Với mock, client đã chạy: id, trạng thái và vị trí lấy từ ví dụ; <code>Location</code> in ra “string” vì header chưa có ví dụ — một gợi ý nên thêm.</p>
<p>Các lệnh dưới đây đọc token của Bình (sinh viên) ở thư mục <em>cha</em> của dự án (<code>../bin.jwt</code>), để một lần đăng nhập dùng chung cho mọi gói chương giải nén cạnh nhau. Ghi nó ra đó trước — token sống 15 phút (bài 6.1), lệnh nào trả 401 thì đăng nhập lại:</p>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/auth/login \\
  --json '{"email":"binh@student.labflow.example","password":"binh-lab-2026"}' | jq -r .accessToken &gt; ../bin.jwt</code></pre>
<pre><code class="language-bash">TOKEN=$(cat ../bin.jwt) node client/waitlist.ts</code></pre>
<div class="out">409 SLOT_AVAILABLE</div>
<pre><code class="language-bash">curl -s -X POST http://localhost:4000/v2/bookings \\
  -H "Authorization: Bearer $(cat an.jwt)" \\
  --json '{"labId":"lab_2","period":{"start":"2027-03-09T08:00:00+07:00","end":"2027-03-09T10:00:00+07:00"}}' | jq -c '{id, status}'</code></pre>
<div class="out">{"id":"bk_1","status":"PENDING"}</div>
<pre><code class="language-bash">TOKEN=$(cat ../bin.jwt) node client/waitlist.ts</code></pre>
<div class="out">201 wl_1 WAITING vị trí 1 /v2/waitlist/wl_1</div>
<pre><code class="language-bash">curl -s http://localhost:4000/v2/me/waitlist \\
  -H "Authorization: Bearer $(cat bin.jwt)" | jq -c '.data[] | {id, status, position}'</code></pre>
<div class="out">{"id":"wl_1","status":"WAITING","position":1}</div>
<p>Cùng client đó, không sửa gì: đầu tiên 409 <code>SLOT_AVAILABLE</code> (khung giờ còn trống), rồi — sau khi An đặt — 201 ở vị trí 1.</p>
<pre><code class="language-bash">node openapi/check-drift.mjs | tail -8</code></pre>
<div class="out">✓ POST /labs/lab_2/waitlist → 409
✓ POST /bookings → 201
✓ POST /labs/lab_2/waitlist → 409
✓ POST /labs/lab_2/waitlist → 409
✓ POST /labs/lab_2/waitlist → 400
✓ GET /me/waitlist → 200
✓ DELETE /waitlist/wl_1 → 404
✓ DELETE /waitlist/wl_1 → 204</div>
<pre><code class="language-bash">node openapi/check-drift.mjs | cut -c1 | sort | uniq -c</code></pre>
<div class="out">  27 ✓</div>
<pre><code class="language-bash">npm test 2&gt;&amp;1 | grep -E '^ℹ (tests|pass|fail)'</code></pre>
<div class="out">ℹ tests 10
ℹ pass 10
ℹ fail 0</div>
<p>27 phép kiểm — 19 của bài 7.2 cộng 8 cho hàng chờ, gồm 409, 400 và 404 khi xoá lượt chờ của người khác.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.7 Quiz (bài MỚI) ─────────────────────────── */
    {
      title: '7.7 — Chapter 7 check: documentation and contracts|||7.7 — Kiểm tra Chương 7: tài liệu và hợp đồng',
      slug: 'api-7-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về OpenAPI 3.1, bẫy YAML, kiểm hợp đồng và lỗi 415, lint với kiểm hợp đồng, client có kiểu, schema với Zod, mock Prism, cổng thay đổi phá vỡ, GraphQL và gRPC; mỗi câu có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Chapter 7 check: documentation and contracts</h2>
<p class="lead">Ten situations from LabFlow’s OpenAPI document, its contract check, the typed client, the mock, the diff gate and the GraphQL/gRPC measurements. Each explanation says why the right answer is right and why the most tempting wrong answer is wrong. Aim for 7/10.</p>
<h3>Self-check before you start</h3>
<ul>
  <li>I can write an OpenAPI 3.1 operation with schemas, errors and examples, and lint it to zero.</li>
  <li>I can explain why a valid document can still lie, and prove it does not with a contract check.</li>
  <li>I can generate a typed client and say which mistakes it catches at compile time.</li>
  <li>I can run a design-first change: mock, style guide, diff gate.</li>
  <li>I can say, with numbers, what GraphQL and gRPC gain and cost compared with REST.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7: tài liệu và hợp đồng</h2>
<p class="lead">Mười tình huống từ tài liệu OpenAPI của LabFlow, bộ kiểm hợp đồng, client có kiểu, mock, cổng so phiên bản và các phép đo GraphQL/gRPC. Mỗi phần giải thích nói vì sao đáp án đúng là đúng và vì sao phương án hấp dẫn nhất lại sai. Nhắm 7/10.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
  <li>Tôi viết được một thao tác OpenAPI 3.1 có schema, lỗi và ví dụ, và lint được về 0.</li>
  <li>Tôi giải thích được vì sao tài liệu hợp lệ vẫn có thể nói sai, và chứng minh nó không sai bằng kiểm hợp đồng.</li>
  <li>Tôi sinh được client có kiểu và nói được nó bắt những lỗi nào lúc biên dịch.</li>
  <li>Tôi làm được một thay đổi theo design-first: mock, bộ luật phong cách, cổng so phiên bản.</li>
  <li>Tôi nói được, bằng số đo, GraphQL và gRPC được gì và mất gì so với REST.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: "In LabFlow’s OpenAPI 3.1 document, how is “purpose may be null” written?|||Trong tài liệu OpenAPI 3.1 của LabFlow, “purpose có thể là null” được viết thế nào?",
            options: [
              "nullable: true — the same as in every OpenAPI version|||nullable: true — giống mọi phiên bản OpenAPI",
              "type: [string, 'null'] — 3.1 uses JSON Schema 2020-12 types|||type: [string, 'null'] — 3.1 dùng kiểu của JSON Schema 2020-12",
              "required: false — a field that is not required can be null|||required: false — trường không bắt buộc thì có thể null",
              "default: null — the default value makes it nullable|||default: null — giá trị mặc định làm nó nhận null",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Lesson 7.1. nullable belongs to 3.0; in 3.1 null is a type. Not required means the field may be absent — LabFlow’s rule is “always present, null when empty”.|||VI: Bài 7.1. nullable là của 3.0; ở 3.1 null là một kiểu. Không bắt buộc nghĩa là trường có thể vắng mặt — luật LabFlow là “luôn có mặt, rỗng thì null”.",
          },
          {
            question: "The description “Search in the name, accent-insensitive” inside a { … } flow mapping produced what?|||Mô tả “Search in the name, accent-insensitive” nằm trong kiểu viết { … } đã gây ra gì?",
            options: [
              "A valid YAML file with an extra key accent-insensitive, caught only by the OpenAPI linter|||Một tệp YAML hợp lệ có thêm khoá accent-insensitive, chỉ bộ lint OpenAPI bắt được",
              "A YAML parse error at the comma that stopped every tool immediately|||Một lỗi cú pháp YAML ở dấu phẩy làm mọi công cụ dừng ngay",
              "Nothing at all, because commas are allowed inside description text|||Không gì cả, vì dấu phẩy được phép trong phần mô tả",
              "A runtime 400 from the server for every request to the /labs path|||Một lỗi 400 lúc chạy từ server cho mọi request tới /labs",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Measured in 7.1: the comma split the mapping, YAML read a new key, and only Redocly’s struct rule saw it. The bracket case was the one that failed to parse.|||VI: Đo ở 7.1: dấu phẩy tách mapping, YAML đọc thành khoá mới, chỉ luật struct của Redocly thấy. Trường hợp ngoặc vuông mới là cái không đọc được.",
          },
          {
            question: "The contract check reported “POST /bookings/bk_1/cancel → 415”. What was the cause?|||Bộ kiểm hợp đồng báo “POST /bookings/bk_1/cancel → 415”. Nguyên nhân là gì?",
            options: [
              "The document forgot to say that cancel needs a JSON body with a reason field|||Tài liệu quên ghi rằng huỷ cần body JSON có trường lý do",
              "The checker sent text/plain on purpose to test the 415 path of the server|||Bộ kiểm cố ý gửi text/plain để thử nhánh 415 của server",
              "fetch() sends Content-Length: 0 on a body-less POST, and LabFlow treated it as a body of the wrong type|||fetch() gửi Content-Length: 0 khi POST không body, và LabFlow coi đó là body sai kiểu",
              "Ajv could not validate the response because 415 is not a JSON status code|||Ajv không kiểm được câu trả lời vì 415 không phải mã trạng thái JSON",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Lessons 7.2: Node fetch and Chromium both sent content-length=0; curl sends none, so six chapters of curl never saw it. Fix: a body exists only if Content-Length > 0 or Transfer-Encoding is set.|||VI: Bài 7.2: fetch của Node và Chromium đều gửi content-length=0; curl không gửi, nên sáu chương gõ curl không thấy. Sửa: chỉ coi là có body khi Content-Length > 0 hoặc có Transfer-Encoding.",
          },
          {
            question: "You change capacity to type: string in the document. What happens?|||Bạn đổi capacity thành type: string trong tài liệu. Chuyện gì xảy ra?",
            options: [
              "Lint passes; the contract check fails on GET /labs and GET /labs/lab_1|||Lint qua; bộ kiểm hợp đồng trượt ở GET /labs và GET /labs/lab_1",
              "Lint fails, because capacity is clearly a number in the examples|||Lint trượt, vì capacity rõ ràng là số trong ví dụ",
              "Both pass, because JSON numbers and strings are interchangeable here|||Cả hai đều qua, vì số và chuỗi JSON thay nhau được ở đây",
              "The server starts returning strings because it reads the document|||Server bắt đầu trả chuỗi vì nó đọc tài liệu",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Measured in 7.2: lint only checks that the document is well-formed; 4 contract checks failed (“must be string”). The server does not read the document.|||VI: Đo ở 7.2: lint chỉ kiểm tài liệu đúng cấu trúc; 4 phép kiểm hợp đồng trượt (“must be string”). Server không đọc tài liệu.",
          },
          {
            question: "A client generated with openapi-typescript writes data.purpose.length. What does tsc say?|||Một client sinh bằng openapi-typescript viết data.purpose.length. tsc nói gì?",
            options: [
              "Nothing — types are only comments and are erased at run time|||Không gì — kiểu chỉ là chú thích và bị xoá lúc chạy",
              "Property 'purpose' does not exist, because purpose is optional|||Property 'purpose' does not exist, vì purpose là tuỳ chọn",
              "An error only after the server returns a null purpose at run time|||Chỉ báo lỗi sau khi server trả purpose null lúc chạy",
              "'data.purpose' is possibly 'null' — the schema says string or null|||'data.purpose' is possibly 'null' — schema nói chuỗi hoặc null",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Lesson 7.3: TS18047 at compile time, before anything runs. Types are erased at run time — which is why the check happens at compile time.|||VI: Bài 7.3: TS18047 ngay lúc biên dịch, trước khi chạy gì. Kiểu bị xoá lúc chạy — chính vì thế phép kiểm diễn ra lúc biên dịch.",
          },
          {
            question: "Purpose “   ” (three spaces): what do the document’s schema and LabFlow’s Zod say?|||Purpose “   ” (ba dấu cách): schema trong tài liệu và Zod của LabFlow nói gì?",
            options: [
              "Both reject, because minLength: 1 ignores whitespace in JSON Schema|||Cả hai từ chối, vì minLength: 1 bỏ qua khoảng trắng trong JSON Schema",
              "Schema accepts (length 3); Zod rejects (trim makes it empty)|||Schema nhận (dài 3); Zod từ chối (trim làm nó rỗng)",
              "Both accept, because spaces are valid characters in both validators|||Cả hai nhận, vì dấu cách là ký tự hợp lệ ở cả hai",
              "Schema rejects and Zod accepts, because Zod is more permissive|||Schema từ chối còn Zod nhận, vì Zod dễ dãi hơn",
            ],
            correctIndex: 1,
            points: 1,
            explanation: "EN: Measured in 7.3. JSON Schema has no trimming; Zod normalises first. That is why LabFlow keeps Zod in the server and proves agreement with the contract check.|||VI: Đo ở 7.3. JSON Schema không có trim; Zod chuẩn hoá trước. Vì thế LabFlow giữ Zod trong server và chứng minh hai bên khớp bằng kiểm hợp đồng.",
          },
          {
            question: "Prism answered 201 although the request had Prefer: code=409. Why?|||Prism trả 201 dù request có Prefer: code=409. Vì sao?",
            options: [
              "Prism ignores the Prefer header unless it is started in dynamic mode|||Prism bỏ qua header Prefer trừ khi chạy ở chế độ dynamic",
              "The document had no 409 response for POST /bookings at that time|||Lúc đó tài liệu không có câu trả lời 409 cho POST /bookings",
              "curl --json sent Accept: application/json, and the 409 exists only as application/problem+json|||curl --json gửi Accept: application/json, mà 409 chỉ có dạng application/problem+json",
              "The mock needed a valid JWT before it would return an error code|||Mock cần một JWT hợp lệ rồi mới trả mã lỗi",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: Measured in 7.4: with Accept: application/json, application/problem+json the same request got the 409. Content negotiation decides which documented responses are possible.|||VI: Đo ở 7.4: thêm Accept: application/json, application/problem+json thì cùng request nhận 409. Chọn định dạng (content negotiation) quyết định câu trả lời nào được dùng.",
          },
          {
            question: "Which change does LabFlow’s diff gate report as BREAKING?|||Thay đổi nào bị cổng so phiên bản của LabFlow báo là PHÁ VỠ?",
            options: [
              "Making purpose required in BookingCreate|||Bắt buộc purpose trong BookingCreate",
              "Adding an optional seats field to the request and the response|||Thêm trường seats tuỳ chọn vào request và response",
              "Adding a new operation GET /me/waitlist to the document|||Thêm thao tác mới GET /me/waitlist vào tài liệu",
              "Adding NO_SHOW to the status enum of the booking response|||Thêm NO_SHOW vào enum status của response lượt đặt",
            ],
            correctIndex: 0,
            points: 1,
            explanation: "EN: Old clients that do not send purpose would get 400 — breaking (exit 1). A new enum value in a response is only a warning: it breaks clients that crash on unknown values (4.1).|||VI: Client cũ không gửi purpose sẽ nhận 400 — phá vỡ (mã thoát 1). Giá trị enum mới trong response chỉ là cảnh báo: nó làm gãy client sập khi gặp giá trị lạ (4.1).",
          },
          {
            question: "The dashboard GraphQL query made 7 database calls; with DataLoader 3. What does DataLoader NOT fix?|||Query GraphQL của bảng điều khiển hỏi CSDL 7 lần; có DataLoader còn 3. DataLoader KHÔNG chữa được gì?",
            options: [
              "The N+1 calls of the resolvers for devices and bookings of each lab|||N+1 lần gọi của resolver thiết bị và lượt đặt cho từng phòng",
              "Data leaking between users, because its cache is global by design|||Rò dữ liệu giữa người dùng, vì cache của nó toàn cục theo thiết kế",
              "The 7 REST round trips that the same data needed over /v2|||7 lượt đi-về REST mà cùng dữ liệu đó cần qua /v2",
              "A deep client query still produced 385 KB — cost needs depth/complexity limits|||Một query sâu của client vẫn tạo 385 KB — chi phí cần giới hạn độ sâu/độ phức tạp",
            ],
            correctIndex: 3,
            points: 1,
            explanation: "EN: Measured in 7.5: 2,524 → 3 calls with DataLoader, but still 385 KB. DataLoader is per request (no leak if used correctly). Only limits on depth/cost protect the server.|||VI: Đo ở 7.5: 2.524 → 3 lần với DataLoader, nhưng vẫn 385 KB. DataLoader tạo mỗi request một cái (dùng đúng thì không rò). Chỉ giới hạn độ sâu/chi phí mới bảo vệ server.",
          },
          {
            question: "Which statement about the gRPC measurement on one machine is fair?|||Nhận xét nào về phép đo gRPC trên một máy là công bằng?",
            options: [
              "gRPC is 10 times faster than REST, so every LabFlow endpoint should move|||gRPC nhanh gấp 10 REST, nên mọi endpoint LabFlow nên chuyển sang",
              "Protobuf messages are always larger than JSON because of the field numbers|||Thông điệp Protobuf luôn lớn hơn JSON vì có số của trường",
              "Protobuf was 53% of JSON but nearly equal after gzip; REST also did auth and validation|||Protobuf bằng 53% JSON nhưng gần ngang sau gzip; REST còn làm xác thực và validate",
              "Browsers can call gRPC directly, so the web app could switch tomorrow|||Trình duyệt gọi thẳng được gRPC, nên web app đổi được ngay mai",
            ],
            correctIndex: 2,
            points: 1,
            explanation: "EN: 17,170 vs 9,132 bytes, 1,089 vs 944 after gzip; 0.32 vs 0.44 ms/call while REST also verified a JWT and rate limits. Browsers need gRPC-Web or Connect.|||VI: 17.170 so với 9.132 byte, 1.089 so với 944 sau gzip; 0,32 so với 0,44 ms/lần trong khi REST còn kiểm JWT và giới hạn tần suất. Trình duyệt cần gRPC-Web hoặc Connect.",
          },
        ],
      },
    },
  ],
};
