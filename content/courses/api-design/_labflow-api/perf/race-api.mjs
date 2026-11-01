// perf/race-api.mjs — bài 12.3: cuộc đua của bài 11.6, nhưng qua API THẬT (qua proxy ⇒ chia đều cho các instance).
//   node perf/race-api.mjs slot  [N=50]   N quản lý cùng đặt MỘT khung giờ lab_1 ⇒ bao nhiêu 201?
//   node perf/race-api.mjs quota [N=10]   MỘT sinh viên (An) bấm N lượt cho N khung giờ khác nhau ⇒ luật "tối đa 3"
//   node perf/race-api.mjs etag           hai quản lý PATCH cùng thiết bị, cùng If-Match, rơi vào HAI instance
//   node perf/race-api.mjs etag-n [N=20]  lặp phép thử trên N lần, đếm bao nhiêu lần MẤT cập nhật (cả hai cùng 200)
// BASE=http://localhost:8180  ·  token: đăng nhập thật (mật khẩu demo của khoá)
const BASE = process.env.BASE ?? 'http://localhost:8180';
const mode = process.argv[2] ?? 'slot';
const N = Number(process.argv[3] ?? (mode === 'slot' ? 50 : 10));
const login = async (email, password) => (await (await fetch(`${BASE}/v2/auth/login`, { method: 'POST',
  headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) })).json()).accessToken;
const H = (t, extra = {}) => ({ authorization: `Bearer ${t}`, 'content-type': 'application/json', ...extra });
const tally = (rs) => Object.entries(rs.reduce((m, r) => ({ ...m, [r]: (m[r] ?? 0) + 1 }), {})).map(([k, v]) => `${k}×${v}`).join('  ');
const DAY = process.env.DAY ?? '2027-06-01';

if (mode === 'slot') {
  const lan = await login('lan@labflow.example', 'lan-lab-2026');
  const rs = await Promise.all(Array.from({ length: N }, () => fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H(lan),
    body: JSON.stringify({ labId: 'lab_1', period: { start: `${DAY}T07:00:00+07:00`, end: `${DAY}T09:00:00+07:00` } }) })
    .then(async (r) => `${r.status}${r.headers.get('labflow-instance') ? `@${r.headers.get('labflow-instance')}` : ''}`)));
  console.log(`${N} request cùng đặt lab_1 ${DAY} 07:00–09:00: ${tally(rs)}`);
  const list = await (await fetch(`${BASE}/v2/bookings?labId=lab_1&from=${DAY}T00:00:00Z&to=${DAY}T23:59:59Z&status=PENDING`, { headers: H(lan) })).json();
  console.log(`GET /v2/bookings khung giờ đó (qua proxy): ${list.data.length} lượt PENDING`);
}
if (mode === 'quota') {
  const an = await login('an@student.labflow.example', 'an-lab-2026');
  const rs = await Promise.all(Array.from({ length: N }, (_, k) => fetch(`${BASE}/v2/bookings`, { method: 'POST', headers: H(an),
    body: JSON.stringify({ labId: 'lab_2', period: { start: `${DAY}T${String(7 + k).padStart(2, '0')}:00:00+07:00`, end: `${DAY}T${String(7 + k).padStart(2, '0')}:50:00+07:00` } }) })
    .then((r) => `${r.status}`)));
  console.log(`An bấm ${N} lượt (${N} khung giờ khác nhau) cùng lúc: ${tally(rs)}  — luật: tối đa 3 lượt còn hiệu lực`);
}
if (mode === 'etag') {
  const lan = await login('lan@labflow.example', 'lan-lab-2026');
  const g = await fetch(`${BASE}/v2/devices/dev_1`);
  const etag = g.headers.get('etag');
  const patch = (note) => fetch(`${BASE}/v2/devices/dev_1`, { method: 'PATCH', headers: H(lan, { 'content-type': 'application/merge-patch+json', 'if-match': etag }),
    body: JSON.stringify({ note }) }).then(async (r) => `${r.status}@${r.headers.get('labflow-instance') ?? '?'} ETag ${r.headers.get('etag') ?? '—'}`);
  const rs = await Promise.all([patch('Cô Lan: thay dây nguồn'), patch('Thầy Minh: chuyển sang lab_2')]);
  console.log(`cả hai đọc ETag ${etag} rồi cùng PATCH:\n  ${rs.join('\n  ')}`);
  console.log(`ghi chú cuối cùng: ${JSON.stringify((await (await fetch(`${BASE}/v2/devices/dev_1`)).json()).note)}`);
}
if (mode === 'etag-n') {
  const lan = await login('lan@labflow.example', 'lan-lab-2026');
  let lost = 0, safe = 0, other = 0;
  for (let k = 0; k < N; k++) {
    const etag = (await fetch(`${BASE}/v2/devices/dev_1`)).headers.get('etag');
    const patch = (note) => fetch(`${BASE}/v2/devices/dev_1`, { method: 'PATCH', headers: H(lan, { 'content-type': 'application/merge-patch+json', 'if-match': etag }),
      body: JSON.stringify({ note }) }).then((r) => r.status);
    const codes = (await Promise.all([patch(`A${k}`), patch(`B${k}`)])).sort().join(',');
    if (codes === '200,200') lost++; else if (codes === '200,412') safe++; else other++;
  }
  console.log(`${N} lần hai người cùng PATCH với cùng If-Match: cả hai 200 (MẤT một bản sửa) ×${lost} · 200 + 412 ×${safe}${other ? ` · khác ×${other}` : ''}`);
}
