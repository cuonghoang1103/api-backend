// perf/many-jobs.mjs — bài 10.1: gửi N việc xuất (mỗi việc một phòng, ~10 s) rồi đợi xong hết. Đo: tổng thời gian, việc chờ bao lâu.
const BASE = process.env.BASE ?? 'http://localhost:4000', N = Number(process.argv[2] ?? 6);
const H = { authorization: 'Bearer tok_lan', 'content-type': 'application/json' };
const t0 = Date.now();
const locs = [];
for (let i = 1; i <= N; i++) {
  const r = await fetch(`${BASE}/v2/exports`, { method: 'POST', headers: H, body: JSON.stringify({ labId: `lab_${10 + i}`, from: '2026-11-01', to: '2028-06-01' }) });
  locs.push(r.headers.get('location'));
}
console.log(`${N} việc nhận 202 trong ${Date.now() - t0} ms`);
const jobs = {};
while (Object.values(jobs).filter((j) => j.status === 'succeeded').length < N) {
  await new Promise((ok) => setTimeout(ok, 500));
  for (const l of locs) jobs[l] = await (await fetch(BASE + l, { headers: H })).json();
}
const rel = (s) => ((Date.parse(s) - t0) / 1000).toFixed(1);
for (const j of Object.values(jobs)) console.log(`${j.id}: chờ trong hàng ${rel(j.startedAt).padStart(5)} s · xong ở giây ${rel(j.finishedAt).padStart(5)}`);
console.log(`⇒ ${N} việc xong sau ${((Date.now() - t0) / 1000).toFixed(1)} s`);
