// perf/shutdown.mjs — bài 12.7: tắt một instance GIỮA lúc đang có tải. Người dùng có thấy lỗi không?
// 20 client liên tục gọi qua proxy kiểm sức khoẻ (:8180); sau AT ms gửi SIGTERM tới tiến trình KILL_PID; đo thêm tới hết SECONDS.
//   KILL_PID=$(lsof -ti tcp:4200 -sTCP:LISTEN) AT=2000 SECONDS=6 node perf/shutdown.mjs
const BASE = process.env.BASE ?? 'http://localhost:8180';
const PID = Number(process.env.KILL_PID), AT = Number(process.env.AT ?? 2000), END = Date.now() + Number(process.env.SECONDS ?? 6) * 1000;
const token = (await (await fetch(`${BASE}/v2/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: 'lan@labflow.example', password: 'lan-lab-2026' }) })).json()).accessToken;
const tally = {};
const t0 = Date.now();
let sent = false;
setTimeout(() => { process.kill(PID, 'SIGTERM'); sent = true; console.log(`  ${Date.now() - t0} ms: gửi SIGTERM tới PID ${PID}`); }, AT);
await Promise.all(Array.from({ length: 20 }, async () => {
  while (Date.now() < END) {
    let k;
    try {
      const r = await fetch(`${BASE}/v2/bookings?limit=20`, { headers: { authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(5000) });
      await r.arrayBuffer();
      k = String(r.status);
    } catch (e) { k = e.name === 'TimeoutError' ? 'timeout 5 s' : (e.cause?.code ?? e.message); }
    const when = sent ? 'sau SIGTERM' : 'trước';
    tally[`${when} ${k}`] = (tally[`${when} ${k}`] ?? 0) + 1;
  }
}));
console.log(Object.entries(tally).map(([k, v]) => `${k}: ${v}`).join(' · '));
