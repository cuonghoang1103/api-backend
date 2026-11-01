// perf/poll-job.mjs — bài 10.1: client của API bất đồng bộ: POST ⇒ 202 + Location ⇒ hỏi lại theo Retry-After ⇒ tải kết quả
//   TOKEN=… node perf/poll-job.mjs '{"labId":"lab_1","from":"2026-11-01","to":"2028-06-01"}'
const BASE = process.env.BASE ?? 'http://localhost:4000';
const H = { authorization: `Bearer ${process.env.TOKEN ?? 'tok_lan'}`, 'content-type': 'application/json' };
const t0 = performance.now(), t = () => `${((performance.now() - t0) / 1000).toFixed(2).padStart(6)} s`;

const r = await fetch(`${BASE}/v2/exports`, { method: 'POST', headers: H, body: process.argv[2] });
const loc = r.headers.get('location');
console.log(`${t()}  POST /v2/exports ⇒ ${r.status}, Location: ${loc}, Retry-After: ${r.headers.get('retry-after')}`);
let polls = 0, job;
for (;;) {
  const g = await fetch(BASE + loc, { headers: H });
  job = await g.json(); polls++;
  console.log(`${t()}  GET ${loc} ⇒ ${job.status.padEnd(9)} ${String(job.progress.percent).padStart(3)}%  (${job.progress.done}/${job.progress.total ?? '?'})`);
  if (['succeeded', 'failed', 'cancelled'].includes(job.status)) break;
  await new Promise((ok) => setTimeout(ok, Number(g.headers.get('retry-after') ?? 2) * 1000));
}
if (job.status === 'succeeded') {
  const f = await fetch(BASE + job.result.href, { headers: H });
  const csv = await f.text();
  console.log(`${t()}  GET ${job.result.href} ⇒ ${f.status} ${f.headers.get('content-type')}, ${csv.trim().split('\n').length - 1} dòng, hết hạn ${job.result.expiresAt}`);
}
console.log(`⇒ ${polls} lần hỏi trạng thái; việc chạy ${((Date.parse(job.finishedAt) - Date.parse(job.startedAt)) / 1000).toFixed(1)} s`);
