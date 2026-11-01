// check-drift.mjs — bài 7.2: tài liệu có nói ĐÚNG về server đang chạy không?
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
const rebase = (s) => JSON.parse(JSON.stringify(s).replaceAll('"#/components/', '"spec#/components/'));
const resolve = (o) => (o?.$ref ? o.$ref.split('/').slice(1).reduce((x, k) => x[k], spec) : o);

async function check(method, path, { token, body, headers = {} } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...(body && { 'Content-Type': 'application/json' }), ...headers },
    body: body && JSON.stringify(body),
  });
  const template = Object.keys(spec.paths).find((p) => new RegExp(`^${p.replace(/\{[^}]+\}/g, '[^/]+')}$`).test(path.split('?')[0]));
  const op = spec.paths[template]?.[method.toLowerCase()];
  const where = `${method} ${path} → ${res.status}`;
  if (!op) return console.log(`✗ ${where}: KHÔNG có trong tài liệu`);
  const doc = resolve(op.responses[String(res.status)]);
  if (!doc) return console.log(`✗ ${where}: tài liệu không khai mã ${res.status}`);
  const type = (res.headers.get('content-type') ?? '').split(';')[0];
  const media = doc.content?.[type];
  if (doc.content && !media) return console.log(`✗ ${where}: tài liệu không khai kiểu ${type}`);
  // Chương 12: kết quả việc xuất là text/csv — body không phải JSON thì kiểm như chuỗi (trước đây thành undefined ⇒ báo sai)
  const data = /json/.test(type) ? await res.json().catch(() => undefined) : await res.text();
  if (!media) return console.log(`✓ ${where}`);
  const validate = ajv.compile(rebase(media.schema));
  if (validate(data)) return console.log(`✓ ${where}`);
  for (const e of validate.errors) console.log(`✗ ${where}: ${e.instancePath || '(gốc)'} ${e.message}${e.params?.additionalProperty ? ` "${e.params.additionalProperty}"` : ''}`);
}

const login = async (email, password) => (await (await fetch(`${BASE}/auth/login`, { method: 'POST',
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
}

// Chương 10 — việc nền, sự kiện, vé realtime (cần PostgreSQL cho việc xuất chạy tới succeeded; thiếu thì job ra failed — vẫn đúng hợp đồng)
await check('POST', '/exports', { token: lan, body: { labId: 'lab_1', from: '2026-11-01', to: '2026-12-01' } });
await check('POST', '/exports', { token: lan, body: { labId: 'lab_1', from: '2026-11-01' } });
await check('POST', '/exports', { token: an, body: { labId: 'lab_1', from: '2026-11-01', to: '2026-12-01' } });
await check('GET', '/jobs/job_1', { token: lan });
await check('GET', '/jobs/job_1', { token: an });
await check('POST', '/jobs/job_1/cancel', { token: lan });
await new Promise((ok) => setTimeout(ok, 1500));
await check('GET', '/jobs/job_1', { token: lan });
await check('POST', '/jobs/job_1/cancel', { token: lan });
await check('GET', '/jobs/job_1/result', { token: lan });
await check('GET', '/events', { token: an });
await check('GET', '/events?after=0', { token: an });
await check('GET', '/events?wait=99', { token: an });
await check('POST', '/realtime/tickets', { token: an });
