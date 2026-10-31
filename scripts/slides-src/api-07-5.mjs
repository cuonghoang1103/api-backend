/**
 * api-07-5 — API Design · Chapter 7 · Lesson 7.5 "GraphQL and gRPC" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s07-hop-dong.mjs › api-7-4-khac. Output = chạy thật graphql 17 + graphql-http 1.23 + dataloader 2.2, @grpc/grpc-js 1.14, protobufjs, REST /v2 production.
 */
import { lamDeck, sql, http, two, box, cards } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 7 — Documentation and contracts', bai: '7.5' };

export const deck = { key: 'api-07-5', code: 'API 7.5', title: 'GraphQL and gRPC', sub: 'When REST is not the answer — measured on the same data' };

export const slides = lamDeck(meta, [
  { cover: true, t: 'GraphQL and gRPC:<br>when REST is not the answer', sub: 'Same LabFlow data, three contracts.<br>Numbers, not opinions.' },

  { t: 'Three ways to serve the same data', to: true, giua: true, body: `
<table class="t lon">
<tr><th>Style</th><th>Contract</th><th>Who shapes the data</th></tr>
<tr><td>REST + OpenAPI</td><td>many URLs, HTTP semantics</td><td>the server</td></tr>
<tr><td>GraphQL</td><td>one URL, a typed schema (SDL)</td><td>the <b>client</b> picks fields and depth</td></tr>
<tr><td>gRPC + Protobuf</td><td>methods in a <code class="i">.proto</code>, binary over HTTP/2</td><td>generated code, streams</td></tr>
</table>
${box('Measured', 'round trips · bytes · database calls · latency — each style wins something and pays somewhere else.', 'xanh')}` },

  { t: 'GraphQL: one request for the dashboard', body: sql(`type Query { labs: [Lab!]!  lab(id: ID!): Lab }
type Lab { id: ID!  name: String!  devices: [Device!]!  bookings(limit: Int = 5): [Booking!]! }
type Booking { id: ID!  start: String!  status: String!  lab: Lab! }`, { lang: 'graphql', sm: true }) + http(`$ node graphql/ask.mjs '{ labs { name devices { name status } bookings(limit: 3) { start status } } }' --show
HTTP 200 · 838 byte · 7 lần hỏi CSDL
{"data":{"labs":[{"name":"Phòng Lab Mạng máy tính","devices":[{"name":"Cisco Router 2901","status":"AVAILABLE"},…],"bookings":[{"start":"2026-11-02T00:00:00.000Z","status":"PENDING"},…]},…]}}

$ node graphql/rest-same.mjs
REST: 7 request · 3335 byte · 17.5 ms`, { sm: true, wrap: 'any' }) + two(box('GraphQL wins', '1 round trip, 838 bytes, only requested fields.', 'xanh'), box('REST pays', '7 round trips, 4× the bytes: every endpoint returns its full view.', 'lam')) },

  { t: 'The prices of GraphQL', body: two(http(`# N+1 inside the server
HTTP 200 · 838 byte · 7 lần hỏi CSDL      # 1 + 3 + 3
# with DataLoader (one per request)
HTTP 200 · 838 byte · 3 lần hỏi CSDL

# a deep query: labs → bookings → lab → bookings → lab → bookings
HTTP 200 · 385444 byte · 2524 lần hỏi CSDL
# … with DataLoader
HTTP 200 · 385444 byte · 3 lần hỏi CSDL`, { sm: true, title: 'node graphql/ask.mjs … (4 runs)' }) + box('Client controls the cost', 'Any client can send the deep query. ✓ Depth and cost limits, persisted queries.', 'do2'),
    http(`$ node graphql/ask.mjs '{ lab(id: "lab_99") { name } }' --show
HTTP 200 · 21 byte · 1 lần hỏi CSDL
{"data":{"lab":null}}

$ node graphql/ask.mjs '{ labs { nme } }' --show
HTTP 400 · 130 byte · 0 lần hỏi CSDL
{"errors":[{"message":"Cannot query field \\"nme\\" on type \\"Lab\\". Did you mean \\"name\\"?",…}]}`, { sm: true, wrap: 'any' }) + box('HTTP semantics change', '“Not found” is <b>200</b>. graphql-http said 400; the GraphQL-over-HTTP working draft recommends 422 and proposes 294 for data + errors. POST to one URL ⇒ no per-URL HTTP caching.', 'lam')) },

  { t: 'gRPC: methods, numbers, streams', body: two(sql(`syntax = "proto3";
package labflow.v1;
service Bookings {
  rpc ListBookings (ListBookingsRequest) returns (ListBookingsResponse);
  rpc WatchLab (WatchLabRequest) returns (stream Booking);
}
enum BookingStatus {
  BOOKING_STATUS_UNSPECIFIED = 0;
  PENDING = 1; CHECKED_IN = 2; CANCELLED = 3;
}
message Booking {
  string id = 1;  string lab_id = 2;  string user_id = 3;
  string start = 4;  string end = 5;
  BookingStatus status = 6;  string purpose = 7;
}`, { lang: 'protobuf', sm: true, hl: [5, 8] }) + box('Chapter 4, in another language', 'The <b>number</b> travels on the wire: rename freely, never renumber, <code class="i">reserved</code> deleted ones. Enum 0 = <code class="i">…_UNSPECIFIED</code>.', 'lam'),
    http(`$ node grpc/client.mjs
{"data":[{"id":"bk_2","labId":"lab_2",…,"status":"PENDING","purpose":"NWC204 Lab 2"},…],"nextCursor":"2"}
+204 ms bk_1 PENDING 2026-11-02T00:00:00.000Z
+402 ms bk_4 PENDING 2026-11-02T02:00:00.000Z
+604 ms bk_7 CANCELLED 2026-11-02T04:00:00.000Z
luồng đóng`, { sm: true, wrap: 'any' }) + box('Server streaming', 'One request, three messages 200 ms apart, then the stream closes.', 'xanh'), 'r64') },

  { t: 'Is it faster? Measured on one machine', giua: true, body: http(`$ node grpc/bench.mjs
100 lượt đặt: JSON 17170 byte · Protobuf 9132 byte (53%)
sau gzip:     JSON 1089 byte · Protobuf 944 byte
2000 lời gọi tuần tự, trang 20 lượt: gRPC 0.324 ms/lần · REST+JSON 0.435 ms/lần`) + `<table class="t" style="margin:12px 0">
<tr><th>100 bookings</th><th>JSON</th><th>Protobuf</th></tr>
<tr><td>raw</td><td>17,170 B</td><td>9,132 B (53%)</td></tr>
<tr><td>gzip</td><td>1,089 B</td><td>944 B</td></tr>
<tr><td>per call (2,000 sequential, localhost)</td><td>0.435 ms (REST, with auth + validation)</td><td>0.324 ms</td></tr>
</table>` + two(box('Be honest about the comparison', 'The REST path also verifies a JWT, rate-limits and validates; the gRPC demo does not. Fractions of a millisecond on localhost.', 'do2'), box('What gRPC really buys', 'Strict generated contracts and <b>streaming</b>. Costs: no direct browser calls (gRPC-Web/Connect), curl cannot read it.', 'lam')) },

  { t: 'Choosing — and LabFlow’s choice', to: true, giua: true, body: `
<table class="t">
<tr><th>Need</th><th>Pick</th></tr>
<tr><td>Public API, browsers, caching, simple tools</td><td><b>REST + OpenAPI</b></td></tr>
<tr><td>Many screens, different shapes of linked data</td><td><b>GraphQL</b> (often a BFF over REST) + DataLoader + limits</td></tr>
<tr><td>Service-to-service in a data centre, streaming</td><td><b>gRPC</b></td></tr>
</table>
${box('LabFlow stays REST + OpenAPI', 'Web + mobile clients, errors and retries on HTTP status codes (Chapters 2, 5), caching per URL (Chapter 9). A GraphQL layer can sit in front later.', 'xanh')}` },

  { t: 'Traps and interview answers', to: true, giua: true, body: cards([
    ['✗ GraphQL without limits', 'One query = thousands of REST requests; per-request rate limits do not see it.'],
    ['✗ “gRPC because it is faster”', 'Measure. On a CRUD API the difference is rarely the bottleneck.'],
    ['“REST or GraphQL?”', 'GraphQL saves round trips; costs N+1, client-controlled cost, HTTP semantics.'],
  ]) + box('Proto3 rules = Chapter 4 rules', 'Never renumber a field, reserve deleted numbers, keep enum 0 as UNSPECIFIED — the same discipline as “additive only” in REST.', 'lam') },

  { t: 'Summary', to: true, giua: true, body: `
<ul>
<li>Dashboard: GraphQL <b>1 request / 838 B</b> vs REST <b>7 / 3,335 B</b></li>
<li>GraphQL: 7 → 3 DB calls with DataLoader; one deep query = 2,524 calls or 385 KB; not found = 200</li>
<li>gRPC: Protobuf 53% of JSON (≈ equal gzipped); 0.32 vs 0.44 ms/call; streaming</li>
<li>LabFlow keeps REST + OpenAPI</li>
</ul>
${box('Next', 'Lab 7 — a design-first waitlist, from contract to running code.', 'xanh')}` },
]);
