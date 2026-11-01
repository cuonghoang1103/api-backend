// test/capstone.test.mjs — Chương 12: những luật mà "đúng vì chỉ có một tiến trình" không còn đủ. Chạy trên CẢ HAI kho:
//   npm test (RAM) · npm run test:pg (PostgreSQL) — cùng một bộ test, cùng kỳ vọng.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
// Bộ test này bắn hàng chục lượt đặt của cùng một người: nới giới hạn 5 lượt/phút (bài 5.3) — CHỈ trong tiến trình test này
process.env.LABFLOW_BOOKING_LIMIT = '1000/60';
const { app } = await import('../src/app.js');
const { config } = await import('../src/config.js');

let server, base;
before(() => new Promise((ok) => { server = app.listen(0, () => { base = `http://localhost:${server.address().port}`; ok(); }); }));
after(() => server.close());
const H = (tok) => ({ authorization: `Bearer ${tok}`, 'content-type': 'application/json' });
const book = (tok, labId, day, hour = 1) => fetch(`${base}/v2/bookings`, { method: 'POST', headers: H(tok),
  body: JSON.stringify({ labId, period: { start: `2027-09-${day}T0${hour}:00:00Z`, end: `2027-09-${day}T0${hour + 2}:00:00Z` } }) });

test('12.3: 20 request cùng đặt MỘT khung giờ ⇒ đúng 1 lượt 201, 19 lượt 409 kèm conflictWith', async () => {
  const rs = await Promise.all(Array.from({ length: 20 }, () => book('tok_lan', 'lab_2', '01')));
  const codes = rs.map((r) => r.status);
  assert.equal(codes.filter((c) => c === 201).length, 1);
  assert.equal(codes.filter((c) => c === 409).length, 19);
  const winner = await rs.find((r) => r.status === 201).json();
  const loser = await rs.find((r) => r.status === 409).json();
  assert.equal(loser.conflictWith, winner.id);
});

test('12.3: một sinh viên bấm 6 lượt song song ⇒ chỉ 3 lượt được (TOO_MANY_ACTIVE_BOOKINGS)', async () => {
  const rs = await Promise.all(['02', '03', '04', '05', '06', '07'].map((d) => book('tok_bin', 'lab_3', d)));
  const codes = rs.map((r) => r.status).sort();
  assert.deepEqual(codes, [201, 201, 201, 422, 422, 422]);
});

test('12.4: hai quản lý cùng sửa MỘT thiết bị với cùng If-Match ⇒ một 200, một 412', async () => {
  const etag = (await fetch(`${base}/v2/devices/dev_2`)).headers.get('etag');
  const patch = (note) => fetch(`${base}/v2/devices/dev_2`, { method: 'PATCH', headers: { ...H('tok_lan'), 'content-type': 'application/merge-patch+json', 'if-match': etag },
    body: JSON.stringify({ note }) });
  const codes = (await Promise.all([patch('A sửa'), patch('B sửa')])).map((r) => r.status).sort();
  assert.deepEqual(codes, [200, 412]);
});

test('12.3: phân trang con trỏ qua 30 lượt tạo liên tiếp — không trùng, không sót', async () => {
  for (let i = 0; i < 30; i++) await book('tok_lan', 'lab_1', String(1 + Math.floor(i / 2)).padStart(2, '0'), i % 2 ? 1 : 5);   // 15 ngày × 2 ca
  const seen = [];
  let url = `${base}/v2/bookings?limit=7&labId=lab_1`;
  while (url) {
    const r = await fetch(url, { headers: H('tok_lan') });
    const { data, page } = await r.json();
    seen.push(...data.map((b) => b.id));
    url = page.next ? `${base}/v2/bookings?limit=7&labId=lab_1&cursor=${page.next}` : null;
  }
  assert.equal(new Set(seen).size, seen.length, 'có lượt bị trùng giữa các trang');
  assert.equal(seen.length, 30);
});

test('12.5: lượt đặt bị 409 KHÔNG để lại sự kiện; lượt 201 có đúng một sự kiện (outbox cùng transaction)', { skip: config.store !== 'pg' }, async () => {
  const { pool } = await import('../src/pg.js');
  const before = (await pool.query('SELECT count(*)::int AS n FROM outbox')).rows[0].n;
  const ok = await book('tok_lan', 'lab_2', '20');
  const dup = await book('tok_lan', 'lab_2', '20');
  assert.deepEqual([ok.status, dup.status], [201, 409]);
  const { id } = await ok.json();
  const rows = (await pool.query('SELECT subject FROM outbox ORDER BY id OFFSET $1', [before])).rows.map((r) => r.subject);
  assert.deepEqual(rows, [id]);
});
