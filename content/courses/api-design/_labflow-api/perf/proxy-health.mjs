// perf/proxy-health.mjs — bài 12.7: load balancer tối giản CÓ kiểm sức khoẻ (giống nginx/k8s ở mức ý tưởng):
//   mỗi HEALTH_MS hỏi GET /ready của từng instance; chỉ chia request cho instance trả 200 (round-robin).
//   Bài 12.7: trượt FALL lần LIÊN TIẾP mới coi là hỏng (như nginx max_fails / HAProxy "fall"), chờ tối đa HEALTH_TIMEOUT_MS —
//   lần đầu đặt 400 ms, trượt-một-lần-là-loại: instance B đang bận phục vụ tải bị loại oan, proxy trả 503 cho MỌI request.
// node perf/proxy-health.mjs 8180 4200 4201
import http from 'node:http';

const [port, ...ups] = process.argv.slice(2).map(Number);
const HEALTH_MS = Number(process.env.HEALTH_MS ?? 500);
const TIMEOUT = Number(process.env.HEALTH_TIMEOUT_MS ?? 1000), FALL = Number(process.env.HEALTH_FALL ?? 2);
const fails = new Map(ups.map((u) => [u, 0]));
const agent = new http.Agent({ keepAlive: true });
const healthy = new Map(ups.map((u) => [u, true]));
const t0 = Date.now();
const say = (m) => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(6)} s  ${m}`);

setInterval(() => {
  for (const u of ups) {
    const mark = (ok, why) => {
      fails.set(u, ok ? 0 : fails.get(u) + 1);
      if (ok && !healthy.get(u)) { say(`:${u} SẴN SÀNG lại`); healthy.set(u, true); }
      if (!ok && healthy.get(u) && fails.get(u) >= FALL) { say(`:${u} ${why} ${FALL} lần liền ⇒ ngừng gửi`); healthy.set(u, false); }
    };
    const req = http.get({ host: '127.0.0.1', port: u, path: '/ready', timeout: TIMEOUT }, (r) => {
      r.resume();
      mark(r.statusCode === 200, `KHÔNG sẵn sàng (/ready ${r.statusCode})`);
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (e) => mark(false, `không trả lời (${e.code ?? e.message})`));
  }
}, HEALTH_MS).unref();

let i = 0;
http.createServer((req, res) => {
  const live = ups.filter((u) => healthy.get(u));
  if (!live.length) { res.writeHead(503, { 'content-type': 'application/problem+json', 'retry-after': '5' }); return res.end('{"status":503,"title":"No healthy upstream"}'); }
  const up = live[i++ % live.length];
  const p = http.request({ host: '127.0.0.1', port: up, path: req.url, method: req.method, agent,
    headers: { ...req.headers, 'x-forwarded-for': req.socket.remoteAddress } }, (r) => {
    res.writeHead(r.statusCode, r.headers);
    r.pipe(res);
    r.on('aborted', () => res.destroy());                         // instance chết giữa câu trả lời ⇒ cắt luôn phía client (đừng treo)
  });
  p.on('error', (e) => {
    if (res.headersSent) return res.destroy();
    res.writeHead(502, { 'content-type': 'application/problem+json' });
    res.end(JSON.stringify({ status: 502, title: 'Bad Gateway', detail: `instance :${up} ${e.code ?? e.message}` }));
  });
  req.pipe(p);
}).listen(port, () => say(`proxy :${port} → ${ups.map((u) => `:${u}`).join(', ')} (kiểm /ready mỗi ${HEALTH_MS} ms, chờ ${TIMEOUT} ms, trượt ${FALL} lần liền ⇒ loại)`));
