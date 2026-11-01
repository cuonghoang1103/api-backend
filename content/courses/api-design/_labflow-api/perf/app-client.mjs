// perf/app-client.mjs — bài 8.6: phía APP đọc hợp đồng suy giảm của LabFlow
//   - LabFlow-Degraded + Age ⇒ vẫn hiện dữ liệu, kèm dòng "đang cập nhật"
//   - 503/429 + Retry-After ⇒ chờ đúng chừng đó rồi gửi lại CÙNG Idempotency-Key, nếu còn trong ngân sách thời gian của màn hình
//   - Retry-After dài hơn ngân sách ⇒ dừng ngay, nói rõ cho người dùng (đừng quay vòng)
import { randomUUID } from 'node:crypto';
const BASE = process.env.BASE ?? 'http://localhost:4000';
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const t0 = Date.now();
const log = (s) => console.log(`[${String(Date.now() - t0).padStart(5)} ms] ${s}`);

export async function call(method, path, { body, token, budgetMs = 10_000 } = {}) {
  const key = method === 'POST' ? randomUUID() : undefined;     // MỘT khoá cho mọi lần gửi lại của cùng một thao tác
  const start = Date.now();
  for (let attempt = 1; ; attempt++) {
    const r = await fetch(`${BASE}${path}`, { method, body: body && JSON.stringify(body),
      headers: { 'content-type': 'application/json', ...(token && { authorization: `Bearer ${token}` }), ...(key && { 'idempotency-key': key }) } });
    const data = await r.json();
    if (r.status !== 503 && r.status !== 429) {
      if (r.headers.get('labflow-degraded')) log(`${method} ${path} → ${r.status}, bản cũ ${r.headers.get('age')} s ⇒ hiện dữ liệu + dòng "đang cập nhật"`);
      else log(`${method} ${path} → ${r.status}${attempt > 1 ? ` (lần ${attempt})` : ''}`);
      return { status: r.status, data };
    }
    const wait = 1000 * Number(r.headers.get('retry-after') ?? 1);
    if (Date.now() - start + wait > budgetMs) {
      log(`${method} ${path} → ${r.status} ${data.code}, Retry-After ${wait / 1000} s > ngân sách ${budgetMs / 1000} s ⇒ dừng, báo "chưa đặt được, thử lại sau"`);
      return { status: r.status, data };
    }
    log(`${method} ${path} → ${r.status} ${data.code}, chờ ${wait} ms theo Retry-After rồi gửi lại`);
    await sleep(wait);
  }
}

const who = { email: 'lan@labflow.example', password: 'lan-lab-2026' };
const { data: { accessToken: token } } = await call('POST', '/v2/auth/login', { body: who });
if (process.env.SCENARIO === 'db-down') {
  await call('GET', '/v2/labs');
  await call('POST', '/v2/bookings', { token, body: { labId: 'lab_1', period: { start: '2027-05-03T08:00:00+07:00', end: '2027-05-03T10:00:00+07:00' } } });
}
