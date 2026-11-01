// ops/smoke.mjs — bài 12.7: kiểm "khói" ĐẦU-CUỐI sau mỗi lần triển khai. Đi đúng đường của một người dùng thật, qua cổng công khai.
//   node ops/smoke.mjs http://localhost:8180        (BASE; SMOKE_EMAIL / SMOKE_PASSWORD — tài khoản RIÊNG cho smoke ở production)
// Bất kỳ bước nào trượt ⇒ exit 1 ⇒ script triển khai dừng/quay lui. Tự dọn: lượt đặt tạo ra bị huỷ ngay.
import { readFileSync, existsSync } from 'node:fs';
import { openSSE } from '../perf/sse-client.mjs';

const BASE = process.argv[2] ?? process.env.BASE ?? 'http://localhost:4000';
const EMAIL = process.env.SMOKE_EMAIL ?? 'lan@labflow.example';
const PASSWORD = process.env.SMOKE_PASSWORD ?? 'lan-lab-2026';
const MAIL_LOG = process.env.MAIL_LOG;                             // chỉ khi chạy cạnh worker (máy mình): kiểm cả email
let failed = 0, token;
const H = (extra = {}) => ({ ...(token && { authorization: `Bearer ${token}` }), 'content-type': 'application/json', ...extra });

async function step(name, fn) {
  const t0 = performance.now();
  try {
    const note = await fn();
    console.log(`✓ ${name.padEnd(48)} ${String(Math.round(performance.now() - t0)).padStart(5)} ms${note ? `  ${note}` : ''}`);
  } catch (e) { failed++; console.log(`✗ ${name.padEnd(48)} ${String(Math.round(performance.now() - t0)).padStart(5)} ms  ${e.message}`); }
}
const expect = (cond, msg) => { if (!cond) throw new Error(msg); };
const get = async (path, h) => { const r = await fetch(BASE + path, { headers: H(h) }); return { r, body: await r.json().catch(() => null) }; };

await step('GET /health', async () => { const { r } = await get('/health'); expect(r.status === 200, `status ${r.status}`); });
await step('GET /ready (CSDL + Redis)', async () => {
  const { r, body } = await get('/ready');
  expect(r.status === 200, `status ${r.status} ${JSON.stringify(body)}`);
  return `store=${body.store} database=${body.database}${body.redis ? ` redis=${body.redis}` : ''}`;
});
await step('GET /openapi.yaml', async () => {
  const r = await fetch(`${BASE}/openapi.yaml`); const t = await r.text();
  expect(r.status === 200, `status ${r.status}`); return `version ${t.match(/^\s+version: (\S+)/m)?.[1]}`;
});
await step('GET /v2/labs', async () => { const { r, body } = await get('/v2/labs'); expect(r.status === 200 && body.data.length > 0, `status ${r.status}`); return `${body.data.length} phòng`; });
await step('POST /v2/auth/login', async () => {
  const r = await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: H(), body: JSON.stringify({ email: EMAIL, password: PASSWORD }) });
  expect(r.status === 200, `status ${r.status}`); token = (await r.json()).accessToken;
});
// Mở luồng sự kiện TRƯỚC khi đặt ⇒ chắc chắn bắt được sự kiện của chính lượt đặt này
const events = [];
const ctl = new AbortController();
await step('POST /v2/realtime/tickets + mở SSE', async () => {
  const r = await fetch(`${BASE}/v2/realtime/tickets`, { method: 'POST', headers: H() });
  expect(r.status === 201, `status ${r.status}`);
  const { ticket } = await r.json();
  openSSE(`${BASE}/v2/events/stream?ticket=${ticket}`, { signal: ctl.signal, onEvent: (m) => { if (m.data) events.push(JSON.parse(m.data)); } }).catch(() => {});
  await new Promise((r2) => setTimeout(r2, 300));
});
const day = 1 + Math.floor(Math.random() * 28), hour = 7 + Math.floor(Math.random() * 10);
const slot = { start: `2031-03-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 6) * 10).padStart(2, '0')}:00+07:00` };
slot.end = slot.start.replace(/T(\d\d)/, (m, h) => `T${String(Number(h) + 1).padStart(2, '0')}`);
const key = `smoke-${Date.now()}`;
let id;
await step('POST /v2/bookings (Idempotency-Key)', async () => {
  const r = await fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H({ 'idempotency-key': key }),
    body: JSON.stringify({ labId: 'lab_3', period: slot, purpose: 'smoke test sau triển khai' }) });
  const b = await r.json();
  expect(r.status === 201, `status ${r.status} ${JSON.stringify(b)}`); id = b.id; return id;
});
await step('POST lại cùng khoá ⇒ phát lại, không tạo thêm', async () => {
  const r = await fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H({ 'idempotency-key': key }),
    body: JSON.stringify({ labId: 'lab_3', period: slot, purpose: 'smoke test sau triển khai' }) });
  const b = await r.json();
  expect(r.status === 201 && r.headers.get('idempotent-replayed') === 'true' && b.id === id, `status ${r.status} replayed=${r.headers.get('idempotent-replayed')} id=${b.id}`);
});
await step('GET /v2/bookings/{id} (đọc lại, có thể ở instance khác)', async () => { const { r } = await get(`/v2/bookings/${id}`); expect(r.status === 200, `status ${r.status}`); });
await step('POST /v2/bookings/{id}/cancel (tự dọn)', async () => {
  const r = await fetch(`${BASE}/v2/bookings/${id}/cancel`, { method: 'POST', headers: H() }); expect(r.status === 200, `status ${r.status}`);
});
await step('SSE nhận created + cancelled của lượt này', async () => {
  const deadline = Date.now() + 5000;
  const mine = () => events.filter((e) => e.subject === id).map((e) => e.type.split('.')[2]);
  while (Date.now() < deadline && mine().length < 2) await new Promise((r) => setTimeout(r, 50));
  ctl.abort();
  expect(mine().join(',') === 'created,cancelled', `nhận: [${mine().join(',')}]`);
  return mine().join(' → ');
});
if (MAIL_LOG) await step('email thông báo đã đi (MAIL_LOG)', async () => {
  const deadline = Date.now() + 8000;
  const ids = () => (existsSync(MAIL_LOG) ? readFileSync(MAIL_LOG, 'utf8') : '').split('\n').filter(Boolean).map((l) => JSON.parse(l).id);
  while (Date.now() < deadline && !(ids().includes(`ntf_${id}_v1`) && ids().includes(`ntf_${id}_v2`))) await new Promise((r) => setTimeout(r, 100));
  expect(ids().includes(`ntf_${id}_v1`) && ids().includes(`ntf_${id}_v2`), 'chưa thấy đủ 2 thư');
  return `ntf_${id}_v1, ntf_${id}_v2`;
});
console.log(failed ? `SMOKE TRƯỢT: ${failed} bước` : 'SMOKE ĐẠT: mọi bước xanh');
process.exit(failed ? 1 : 0);
