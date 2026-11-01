// lab/grade-lab10.mjs — CHẤM Lab 10 (10 điểm). Cần: LabFlow ở BASE (LABFLOW_PG=1 LABFLOW_JOBS=bullmq LABFLOW_EVENTS=redis
// LABFLOW_WEBHOOK_ALLOW_LOCAL=1), worker (node src/worker.js), PostgreSQL có bảng bookings 1 triệu dòng. Bộ chấm tự mở bên nhận ở :4006.
import http from 'node:http';
import pg from 'pg';
import { verify } from '../src/webhooks.js';

const BASE = process.env.BASE ?? 'http://localhost:4000', LAN = { authorization: 'Bearer tok_lan', 'content-type': 'application/json' };
const db = new pg.Pool({ connectionString: process.env.PGURL ?? 'postgres://labflow@localhost:55432/labflow', max: 2 });
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
let score = 0;
const check = (pts, name, ok, note = '') => { score += ok ? pts : 0; console.log(`${ok ? '✓' : '✗'} ${String(ok ? pts : 0).padStart(1)}/${pts}  ${name}${note ? ' — ' + note : ''}`); };
const post = (body, key, h = LAN) => fetch(`${BASE}/v2/reports/usage/exports`, { method: 'POST', headers: { ...h, ...(key && { 'idempotency-key': key }) }, body: JSON.stringify(body) });

// Bên nhận webhook của bộ chấm
const hooks = [];
const recv = http.createServer((req, res) => { let b = ''; req.on('data', (d) => (b += d)); req.on('end', () => { hooks.push({ headers: req.headers, body: b }); res.writeHead(204).end(); }); }).listen(4006);
const sub = await (await fetch(`${BASE}/v2/webhooks`, { method: 'POST', headers: LAN, body: JSON.stringify({ url: 'http://localhost:4006/hook', events: ['labflow.report.ready.v1'] }) })).json();
if (!sub.secret) { console.log('Không đăng ký được webhook:', sub); process.exit(1); }

// 1. 202 nhanh + Location + Retry-After
const key = `grade-${Date.now()}`, body = { from: '2026-12-01', days: 14 };
const t0 = performance.now(); const r1 = await post(body, key); const ms = performance.now() - t0;
const loc = r1.headers.get('location') ?? '';
check(1, 'POST trả 202 trong < 500 ms, có Location /v2/jobs/{id} và Retry-After', r1.status === 202 && ms < 500 && /^\/v2\/jobs\/job_\w+$/.test(loc) && !!r1.headers.get('retry-after'), `${r1.status}, ${ms.toFixed(0)} ms, ${loc}`);
// 2. Idempotency-Key
const r2 = await post(body, key);
check(1, 'Gửi lại cùng Idempotency-Key ⇒ cùng việc, Idempotent-Replayed', r2.headers.get('location') === loc && r2.headers.get('idempotent-replayed') === 'true');
// 3. Quyền
const an = { authorization: 'Bearer tok_an', 'content-type': 'application/json' };
const r3 = await post(body, null, an), r4 = loc ? await fetch(BASE + loc, { headers: an }) : { status: "-" };
check(1, 'Sinh viên không tạo được (403) và không xem được việc của người khác (404)', r3.status === 403 && r4.status === 404, `${r3.status}, ${r4.status}`);
// 4. Hỏi trạng thái (không có Location ⇒ các mục sau 0 điểm)
const seen = []; let job = { status: 'none', progress: {} }, retryOk = true, mono = true, last = -1;
for (let i = 0; i < (loc ? 120 : 0); i++) {
  const g = await fetch(BASE + loc, { headers: LAN }); job = await g.json();
  if (seen.at(-1) !== job.status) seen.push(job.status);
  if (!['succeeded', 'failed', 'cancelled'].includes(job.status) && !g.headers.get('retry-after')) retryOk = false;
  if (job.progress.percent < last) mono = false; last = job.progress.percent;
  if (['succeeded', 'failed', 'cancelled'].includes(job.status)) break;
  await sleep(500);
}
check(1, 'Trạng thái đi queued/running → succeeded, tiến độ không lùi, Retry-After khi chưa xong', job.status === 'succeeded' && seen.includes('running') && mono && retryOk, seen.join(' → '));
// 5. Kết quả đúng
let okRes = false, note = '';
if (job.status === 'succeeded') {
  const f = await fetch(BASE + job.result.href, { headers: LAN }); const rep = await f.json();
  const pick = [rep.rows[3], rep.rows[260], rep.rows[699]];
  const real = await Promise.all(pick.map(async (x) => (await db.query(`SELECT count(*)::int AS n FROM bookings WHERE lab_id = $1 AND status <> 'CANCELLED'
    AND start_at >= $2::timestamptz AND start_at < $2::timestamptz + interval '1 day'`, [x.labId, `${x.day}T00:00:00Z`])).rows[0].n));
  okRes = f.headers.get('content-type').startsWith('application/json') && rep.rows.length === 14 * 50 && pick.every((x, i) => x.bookings === real[i]);
  note = `${rep.rows.length} dòng, mẫu ${pick.map((x) => x.bookings).join('/')} vs SQL ${real.join('/')}`;
}
check(2, 'Kết quả JSON đủ 14 × 50 dòng, số liệu khớp SQL', okRes, note);
// 6. Huỷ
const rc = await post({ from: '2027-01-01', days: 92 }); const lc = rc.headers.get('location');
await sleep(1500);
if (lc) await fetch(`${BASE}${lc}/cancel`, { method: 'POST', headers: LAN });
let jc = { status: 'none', progress: {} }; for (let i = 0; i < (lc ? 12 : 0); i++) { jc = await (await fetch(BASE + lc, { headers: LAN })).json(); if (jc.status === 'cancelled') break; await sleep(250); }
const rr = lc ? await fetch(`${BASE}${lc}/result`, { headers: LAN }) : { status: '-' };
check(1, 'Huỷ việc đang chạy ⇒ cancelled trong 3 s; lấy kết quả ⇒ 409', jc.status === 'cancelled' && rr.status === 409, `${jc.status}, ${jc.progress.percent}%, result ${rr.status}`);
// 7. Webhook
await sleep(1500);
const mine = hooks.map((h) => ({ h, e: JSON.parse(h.body) })).filter(({ e }) => e.type === 'labflow.report.ready.v1');
const forJob = mine.find(({ e }) => e.data?.jobId === job.id);
const sigOk = forJob && verify(sub.secret, forJob.h.headers, forJob.h.body).ok;
const noCancelled = !mine.some(({ e }) => e.data?.jobId === jc.id);
check(2, 'Webhook labflow.report.ready.v1 tới đúng việc, chữ ký hợp lệ; việc bị huỷ không báo', !!forJob && sigOk && noCancelled,
  `${mine.length} webhook, chữ ký ${sigOk ? 'hợp lệ' : 'SAI'}, ${forJob ? `result ${forJob.e.data.result}` : 'không thấy'}`);
// 8. Thời hạn giữ
check(1, 'Kết quả có expiresAt (sau finishedAt) — hợp đồng nói kết quả giữ bao lâu', !!job.result?.expiresAt && Date.parse(job.result.expiresAt) > Date.parse(job.finishedAt), job.result?.expiresAt);
console.log(`\nĐiểm: ${score}/10`);
await fetch(`${BASE}/v2/webhooks/${sub.id}`, { method: 'DELETE', headers: LAN });
recv.close(); await db.end();
