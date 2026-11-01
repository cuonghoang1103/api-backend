// lab/grade-lab12.mjs — chấm Lab 12 "Báo hỏng thiết bị lên PostgreSQL" trên HAI instance thật (10 điểm).
// Cần: LabFlow kho pg ở A (:4200) và B (:4201), cùng DATABASE_URL, Redis; LABFLOW_REPORT_LIMIT=1000/60 (bộ chấm tạo nhiều báo hỏng).
//   DATABASE_URL=postgres://… node lab/grade-lab12.mjs        (A=… B=… để đổi địa chỉ)
import pg from 'pg';

const A = process.env.A ?? 'http://localhost:4200', B = process.env.B ?? 'http://localhost:4201';
const db = new pg.Client(process.env.DATABASE_URL ?? 'postgres://labflow@localhost:55432/labflow_app');
await db.connect();
const run = Date.now().toString(36);
let total = 0;
const H = (t, x = {}) => ({ authorization: `Bearer ${t}`, 'content-type': 'application/json', ...x });
const login = async (email, password) => (await (await fetch(`${A}/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email, password }) })).json()).accessToken;
const [an, bin, lan] = await Promise.all([login('an@student.labflow.example', 'an-lab-2026'), login('binh@student.labflow.example', 'binh-lab-2026'),
  login('lan@labflow.example', 'lan-lab-2026')]);
const report = (base, tok, dev, title, severity = 'LOW') => fetch(`${base}/v2/devices/${dev}/issues`, { method: 'POST', headers: H(tok),
  body: JSON.stringify({ title, severity }) });
async function check(points, name, fn) {
  let ok = false, note = '';
  try { note = (await fn()) ?? ''; ok = true; } catch (e) { note = e.message; }
  if (ok) total += points;
  console.log(`${ok ? '✓' : '✗'} ${String(ok ? points : 0)}/${points}  ${name}${note ? ` — ${note}` : ''}`);
}
const must = (c, m) => { if (!c) throw new Error(m); };

await check(1, 'bảng issues + index duy nhất có điều kiện cho báo hỏng ĐANG MỞ', async () => {
  must((await db.query("SELECT to_regclass('issues') IS NOT NULL AS ok")).rows[0].ok, 'chưa có bảng issues (đã chạy npm run db:migrate?)');
  const idx = (await db.query("SELECT indexdef FROM pg_indexes WHERE tablename = 'issues' AND indexdef ILIKE '%UNIQUE%' AND indexdef ILIKE '%OPEN%'")).rows;
  must(idx.length, 'không thấy UNIQUE INDEX … WHERE status = \'OPEN\'');
  return idx[0].indexdef.replace(/^CREATE UNIQUE INDEX (\S+).*$/, '$1');
});
let iss;
await check(2, 'báo hỏng tạo ở A đọc được ở B (cùng nội dung)', async () => {
  const r = await report(A, an, 'dev_1', `Quạt kêu to ${run}`);
  must(r.status === 201, `POST ở A: ${r.status}`);
  iss = await r.json();
  const g = await fetch(`${B}/v2/issues/${iss.id}`);
  must(g.status === 200, `GET ${iss.id} ở B: ${g.status}`);
  const b = await g.json();
  must(b.title === iss.title && b.reportedBy === 'usr_1', 'nội dung khác');
  return iss.id;
});
await check(2, '6 báo hỏng CÙNG tiêu đề gửi đồng thời vào A và B ⇒ đúng một 201, năm 409 DUPLICATE_ISSUE', async () => {
  const title = `Cổng 24 chập chờn ${run}`;
  const rs = await Promise.all([an, bin, lan, an, bin, lan].map((t, i) => report(i % 2 ? B : A, t, 'dev_2', title)));
  const codes = rs.map((r) => r.status).sort().join(',');
  must(codes === '201,409,409,409,409,409', `nhận ${codes}`);
  const win = await rs.find((r) => r.status === 201).json();
  const lose = await rs.find((r) => r.status === 409).json();
  must(lose.code === 'DUPLICATE_ISSUE' && lose.existing === win.id, `409 phải có code DUPLICATE_ISSUE + existing ${win.id}`);
  return codes;
});
await check(1, 'báo hỏng HIGH ở A ⇒ thiết bị MAINTENANCE khi đọc ở B', async () => {
  await fetch(`${A}/v2/devices/dev_3`, { method: 'PATCH', headers: H(lan, { 'content-type': 'application/merge-patch+json' }), body: JSON.stringify({ status: 'AVAILABLE' }) });
  const r = await report(A, bin, 'dev_3', `Mất nguồn ngẫu nhiên ${run}`, 'HIGH');
  must(r.status === 201, `POST: ${r.status}`);
  const d = await (await fetch(`${B}/v2/devices/dev_3`)).json();
  must(d.status === 'MAINTENANCE', `dev_3 ở B: ${d.status}`);
  return 'dev_3 MAINTENANCE';
});
await check(2, 'hai quản lý cùng resolve với cùng If-Match (một ở A, một ở B) ⇒ một 200, một 412', async () => {
  must(iss, 'cần báo hỏng của phép kiểm 2');
  const etag = (await fetch(`${A}/v2/issues/${iss.id}`)).headers.get('etag');
  const resolve = (base, text) => fetch(`${base}/v2/issues/${iss.id}/resolve`, { method: 'POST', headers: H(lan, { 'if-match': etag }), body: JSON.stringify({ resolution: text }) });
  const codes = (await Promise.all([resolve(A, 'Thay quạt'), resolve(B, 'Tra dầu')])).map((r) => r.status).sort().join(',');
  must(codes === '200,412', `nhận ${codes}`);
  return `ETag ${etag}: ${codes}`;
});
await check(1, 'dữ liệu nằm trong PostgreSQL (không phải RAM của instance)', async () => {
  must(iss, 'cần báo hỏng của phép kiểm 2');
  const row = (await db.query('SELECT status, version FROM issues WHERE id = $1', [iss.id])).rows[0];
  must(row, `SELECT … WHERE id = '${iss.id}' không có dòng nào`);
  return `${iss.id}: ${row.status}, version ${row.version}`;
});
await check(1, 'GET /v2/issues phân trang con trỏ xen kẽ A/B — không trùng, không sót', async () => {
  const want = (await db.query('SELECT count(*)::int AS n FROM issues')).rows[0].n;
  const seen = [];
  let next = null, i = 0;
  do {
    const r = await fetch(`${i++ % 2 ? B : A}/v2/issues?limit=5${next ? `&cursor=${next}` : ''}`);
    const body = await r.json();
    must(r.status === 200, `trang ${i}: ${r.status} ${body.code ?? ''}`);
    seen.push(...body.data.map((x) => x.id));
    next = body.page.next;
  } while (next && i < 1000);
  must(new Set(seen).size === seen.length, 'có báo hỏng lặp giữa các trang');
  must(seen.length === want, `đi hết các trang thấy ${seen.length}, bảng có ${want}`);
  return `${seen.length} báo hỏng / ${i} trang`;
});
console.log(`TỔNG: ${total}/10`);
await db.end();
