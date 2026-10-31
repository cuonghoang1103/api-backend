/**
 * api-lab-4 — API Design · Chapter 4 lab "Devices, version 2" (slide EN, kiểu FU, 01/11/2026).
 * Nguồn: content/courses/api-design/s04-phien-ban.mjs › api-4-5-lab. Output = chạy thật lời giải + node --test.
 */
import { lamDeck, sql, http, two, box } from './_api-chung.mjs';

const meta = { chuong: 'Chapter 4 — Versioning and evolution', bai: 'Lab 4' };

export const deck = { key: 'api-lab-4', code: 'API Lab 4', title: 'Lab 4 — Devices, version 2', sub: 'Rename without breaking, deprecate properly, test the old contract' };

export const slides = lamDeck(meta, [
  { cover: true, nhan: 'Chapter 4 — Lab', t: 'Lab 4 — Devices,<br>version 2', sub: 'serialNo becomes serialNumber —<br>and no v1 client notices.' },

  { t: 'The request', to: true, body: `
<ul>
<li>“In v2, devices have <b>serialNumber</b> — in responses <b>and</b> in POST/PUT/PATCH bodies. <code class="i">serialNo</code> in a v2 body is an error.”</li>
<li>“<b>v1 must not change at all</b> — the lab managers’ script reads <code class="i">serialNo</code>.”</li>
<li>“Same rules in both versions: a duplicate serial is 409 whichever name you used.”</li>
<li>“Deprecate <code class="i">/v1/devices</code> from <b>15 Nov 2026</b>, gone on <b>1 Jun 2027</b>, and say where to go.”</li>
<li>“We want to see who still uses <code class="i">/v1/devices</code>.”</li>
</ul>
${box('Time', 'Design 15 min · build 60–90 min · prove 20 min. Start from your code at the end of lesson 4.4.', 'lam')}` },

  { t: 'Part A — design before you code', to: true, giua: true, body: two(`
<ol>
<li>Is the rename breaking? For which clients — loud or silent?</li>
<li>Where does the record keep the serial? Why only <b>one</b> field?</li>
<li>The exact <code class="i">Deprecation</code>, <code class="i">Sunset</code>, <code class="i">Link</code> for <code class="i">GET /v1/devices/dev_1</code></li>
<li>What answers on 2 June 2027?</li>
<li>The v1 contract <b>as data</b>: every member and its type</li>
</ol>`, box('Hint', 'Readers get <code class="i">undefined</code> (silent); writers get 400 for an unknown field (loud).', 'xanh') +
  box('Rule from RFC 9745', 'Sunset must not be earlier than Deprecation.', 'lam'), 'r64') },

  { t: 'Part B — build it: six rules', to: true, giua: true, body: `
<ol>
<li><code class="i">toDeviceV2</code>; <code class="i">VIEWS[2].device</code> uses it. <code class="i">toDevice</code> (v1) is <b>not edited</b></li>
<li>v2 schemas with <code class="i">serialNumber</code>, built from the <b>same</b> field rules (no copied regex)</li>
<li><b>One</b> function turns a v2 body into the internal form; POST/PUT/PATCH and <code class="i">checkRules</code> are shared</li>
<li><code class="i">deprecate()</code> of 4.3 on <code class="i">/v1/devices</code> only, successor <code class="i">/v2/…</code></li>
<li><code class="i">test/contract-v1.test.mjs</code> with <code class="i">node:test</code>; <code class="i">npm test</code> runs it</li>
<li>Prove the test works: break v1 on purpose, watch it go red, revert</li>
</ol>` },

  { t: 'Reference solution: edges only', body: sql(`// views.js — v2 renames on the way OUT; the record keeps serialNo
export const toDeviceV2 = (d) => ({ id: d.id, labId: d.labId, name: d.name, type: d.type,
  serialNumber: d.serialNo, status: d.status, note: d.note ?? null });

// schemas.js — same rules, only the NAME differs
const { serialNo, ...rest } = deviceFields;
const deviceFieldsV2 = { ...rest, serialNumber: serialNo };
export const DeviceCreateV2 = z.strictObject(deviceFieldsV2);

// routes/devices.js — v2 body ⇒ internal form, in ONE place
function internal(body) {
  if (!('serialNumber' in body)) return body;
  const { serialNumber, ...rest } = body;
  return { ...rest, serialNo: serialNumber };
}

// app.js — deprecate ONLY /v1/devices, before app.use('/v1', …)
app.use('/v1/devices', deprecate({ since: '2026-11-15T00:00:00Z', sunset: '2027-06-01T00:00:00Z',
  docs: 'https://labflow.example/docs/devices-v2', successor: (req) => req.originalUrl.replace(/^\\/v1/, '/v2') }));`, { lang: 'javascript', sm: true, hl: [3, 7, 14, 18] }) },

  { t: 'Reference solution: the contract test', body: two(sql(`{
  "id": "string",
  "labId": "string",
  "name": "string",
  "type": "string",
  "serialNo": "string",
  "status": "string",
  "note": "string|null"
}`, { lang: 'json', sm: true }) + box('v1 is frozen', 'Exact member set — even an <b>added</b> member fails. New members belong in v2.', 'lam'), sql(`const typeOf = (v) => (v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v);
function assertShape(obj, contract) {
  assert.deepEqual(Object.keys(obj).sort(), Object.keys(contract).sort(),
    'tập trường của v1 đã đổi');
  for (const [k, types] of Object.entries(contract))
    assert.ok(types.split('|').includes(typeOf(obj[k])), \`\${k}: \${typeOf(obj[k])} …\`);
}
test('GET /v1/devices/:id giữ hình dạng v1', async () => {
  const res = await fetch(\`\${base}/v1/devices/dev_3\`);
  assert.equal(res.status, 200);
  assertShape(await res.json(), V1_DEVICE);
});
// + list · POST v1 with serialNo · Deprecation/Sunset/Link · v1/v2 agree
// package.json: "test": "node --test --test-reporter=spec"`, { lang: 'javascript', sm: true, hl: [3, 13] }), 'r46') },

  { t: 'Part C — prove it (real transcript, 1/2)', body: two(http(`$ curl -si http://localhost:4000/v1/devices/dev_1 -H 'LabFlow-Client: android/1.4.0'
HTTP/1.1 200 OK
Deprecation: @1794700800
Sunset: Tue, 01 Jun 2027 00:00:00 GMT
Link: <https://labflow.example/docs/devices-v2>; rel="deprecation", </v2/devices/dev_1>; rel="successor-version"
LabFlow-Version: 1
…
{ "id": "dev_1", "labId": "lab_1", "name": "Cisco Router 2901", "type": "ROUTER",
  "serialNo": "FTX1840ALBQ", "status": "AVAILABLE", "note": null }

$ curl -s http://localhost:4000/v2/devices/dev_1 | jq -c .
{"id":"dev_1",…,"serialNumber":"FTX1840ALBQ","status":"AVAILABLE","note":null}`, { sm: true, wrap: true, title: 'steps 1–2, body re-indented' }), http(`$ curl -si -X POST …/v2/devices -H 'Authorization: Bearer tok_lan' --json '{…,"serialNumber":"ESP32-7781",…}' | grep -E '^(HTTP|Location)'
HTTP/1.1 201 Created
Location: /v2/devices/dev_4
$ curl -s …/v1/devices/dev_4 | jq -c '{id, serialNo}'
{"id":"dev_4","serialNo":"ESP32-7781"}

$ curl -s -X POST …/v2/devices … -H 'Accept-Language: en' --json '{…,"serialNo":"ESP32-7782",…}' | jq -c '.errors'
[{"pointer":"#/serialNumber","detail":"Invalid input: expected string, received undefined"},
 {"pointer":"#/serialNo","detail":"unknown field"}]`, { sm: true, wrap: true, title: 'steps 3–4' }), 'r46') },

  { t: 'Part C — prove it (real transcript, 2/2)', body: two(http(`$ curl -s -X PATCH …/v2/devices/dev_2 … -d '{"serialNumber":"FTX1840ALBQ"}' | jq -c '{status, code}'
{"status":409,"code":"DUPLICATE_SERIAL"}
$ curl -s -X PATCH …/v1/devices/dev_2 … -d '{"serialNo":"FTX1840ALBQ"}' | jq -c '{status, code}'
{"status":409,"code":"DUPLICATE_SERIAL"}

$ curl -s …/v1/admin/deprecations -H 'Authorization: Bearer tok_lan' | jq -c '.data[]'
{"route":"GET /v1/devices","client":"android/1.4.0","count":1,…}
{"route":"GET /v1/devices","client":"curl/8.7.1","count":1,…}
{"route":"PATCH /v1/devices","client":"curl/8.7.1","count":1,…}

$ npm test
✔ GET /v1/devices/:id giữ hình dạng v1 (30.802916ms)
✔ mọi phần tử của GET /v1/devices giữ hình dạng v1 (3.73875ms)
✔ POST /v1/devices vẫn nhận serialNo (9.296958ms)
✔ v1 báo khai tử đúng chuẩn (RFC 9745 + RFC 8594) (1.360583ms)
✔ v2 dùng serialNumber và cùng dữ liệu với v1 (2.292417ms)
ℹ pass 5
ℹ fail 0`, { sm: true, wrap: true, title: 'steps 5–7' }), http(`# toDevice: serialNo: d.serialNo → serialNumber: d.serialNo
$ npm test
✖ GET /v1/devices/:id giữ hình dạng v1 (33.833625ms)
  AssertionError [ERR_ASSERTION]: tập trường của v1 đã đổi
  + actual - expected
    [ 'id', 'labId', 'name', 'note',
  +   'serialNumber',
  -   'serialNo',
      'status', 'type' ]
… 4 of 5 tests fail`, { sm: true, wrap: true, title: 'rule 6: broken on purpose' }) + box('Read it', 'The edit that silently produced <b>Invalid Date</b> in 4.1 is now a red test naming the member — before any user sees it.', 'xanh'), 'r64') },

  { t: 'Rubric — 10 points', to: true, giua: true, body: `
<table class="t">
<tr><th style="width:90px">Pts</th><th>Criterion</th><th style="width:300px">Checked by</th></tr>
<tr><td>2</td><td>v2 uses <code class="i">serialNumber</code> everywhere, rejects <code class="i">serialNo</code></td><td>steps 2, 3, 4</td></tr>
<tr><td>2</td><td>v1 shape unchanged; one internal field; shared rules</td><td>steps 1, 3, 5 · code</td></tr>
<tr><td>2</td><td>Correct Deprecation / Sunset / Link (dates in order, successor in v2)</td><td>step 1 · Part A</td></tr>
<tr><td>2</td><td>Contract test green now, red when v1 is broken on purpose</td><td>step 7</td></tr>
<tr><td>1</td><td>Usage report shows who still calls <code class="i">/v1/devices</code></td><td>step 6</td></tr>
<tr><td>1</td><td>Transcript complete and unedited</td><td>the file</td></tr>
</table>
<p style="margin-top:10px">Pass: <b>7/10</b>. Stretch: run the test in CI · a v2 contract file · freeze <code class="i">v1-device.json</code> from a real response.</p>` },
]);
