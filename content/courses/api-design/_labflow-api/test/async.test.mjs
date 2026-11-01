// test/async.test.mjs — Chương 10: những lời hứa của hợp đồng bất đồng bộ, chạy KHÔNG cần PostgreSQL/Redis
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import { openSSE } from '../perf/sse-client.mjs';
import { sign, verify } from '../src/webhooks.js';

let server, base;
const H = { authorization: 'Bearer tok_lan', 'content-type': 'application/json' };
before(async () => { await new Promise((ok) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }); });
after(() => server.close());
const book = (day) => fetch(`${base}/v2/bookings`, { method: 'POST', headers: H,
  body: JSON.stringify({ labId: 'lab_3', period: { start: `2027-05-${day}T01:00:00Z`, end: `2027-05-${day}T03:00:00Z` } }) });

test('10.1: POST /v2/exports trả 202 + Location + Retry-After; việc của người khác là 404', async () => {
  const r = await fetch(`${base}/v2/exports`, { method: 'POST', headers: H, body: JSON.stringify({ from: '2026-11-01', to: '2026-11-02' }) });
  assert.equal(r.status, 202);
  assert.match(r.headers.get('location'), /^\/v2\/jobs\/job_\d+$/);
  assert.ok(r.headers.get('retry-after'));
  assert.equal((await fetch(base + r.headers.get('location'), { headers: { authorization: 'Bearer tok_an' } })).status, 404);
});

test('10.3: SSE nối lại với Last-Event-ID nhận đủ sự kiện đã lỡ', async () => {
  const { next } = await (await fetch(`${base}/v2/events`, { headers: H })).json();
  await book('10'); await book('11');
  const got = [], ctl = new AbortController();
  const p = openSSE(`${base}/v2/events/stream`, { headers: { ...H, 'last-event-id': next }, signal: ctl.signal,
    onEvent: (m) => { if (m.data) got.push(JSON.parse(m.data).type); } });
  await new Promise((ok) => setTimeout(ok, 300)); ctl.abort(); await p;
  assert.deepEqual(got, ['labflow.booking.created.v1', 'labflow.booking.created.v1']);
});

test('10.4: chữ ký webhook — đúng thì qua; sửa body, quá hạn thì trượt', () => {
  const secret = `whsec_${Buffer.from('mot-khoa-chi-de-test-0123456').toString('base64')}`, body = '{"type":"labflow.booking.created.v1"}';
  const now = Date.now(), ts = Math.floor(now / 1000);
  const h = { 'webhook-id': 'msg_1', 'webhook-timestamp': String(ts), 'webhook-signature': sign(secret, 'msg_1', ts, body) };
  assert.equal(verify(secret, h, body, { now }).ok, true);
  assert.equal(verify(secret, h, body.replace('created', 'cancelled'), { now }).reason, 'bad signature');
  assert.equal(verify(secret, h, body, { now: now + 301_000 }).reason, 'timestamp outside tolerance');
});
