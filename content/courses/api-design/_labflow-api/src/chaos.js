// chaos.js — CHỈ ĐỂ HỌC (Chương 5): giả lập mạng và server hỏng. Production không bao giờ đặt các biến này.
//   LABFLOW_DROP_FIRST=n   ⇒ n response POST đầu tiên bị "mất": server ĐÃ làm xong nhưng cắt kết nối trước khi gửi
//   LABFLOW_SLOW_MS=ms     ⇒ response POST tới muộn ms mili giây (việc đã làm xong); LABFLOW_SLOW_COUNT=n chỉ áp n lần đầu
//   LABFLOW_OUTAGE_MS=ms   ⇒ GET /v2/labs trả 503 trong ms mili giây kể từ request đầu tiên (sự cố), sau đó server
//                            chỉ phục vụ LABFLOW_CAPACITY request mỗi 100 ms (mặc định 10), dư ⇒ 503; GET /chaos/arrivals để đếm
import { Router } from 'express';

let started = null;
let dropped = 0, slowed = 0;
const arrivals = [];                                              // [ms kể từ lúc khởi động, mã trả về]

export function chaos(req, res, next) {
  if (req.method === 'GET' && req.path === '/v2/labs' && process.env.LABFLOW_OUTAGE_MS) {
    started ??= Date.now();
    const t = Date.now() - started;
    const bucket = Math.floor(t / 100);
    const servedNow = arrivals.filter(([u, s]) => s === 200 && Math.floor(u / 100) === bucket).length;
    const down = t < Number(process.env.LABFLOW_OUTAGE_MS)                       // đang sự cố
      || servedNow >= Number(process.env.LABFLOW_CAPACITY ?? 10);                // hoặc quá tải trong 100 ms này
    arrivals.push([t, down ? 503 : 200]);
    if (down) return res.status(503).type('application/problem+json')
      .json({ type: 'about:blank', title: 'Service Unavailable', status: 503 });
  }
  if (req.method !== 'POST') return next();
  if (dropped < Number(process.env.LABFLOW_DROP_FIRST ?? 0)) {
    dropped++;
    res.end = () => req.socket.destroy();                         // việc đã làm, nhưng client không bao giờ nhận được câu trả lời
  }
  const slow = Number(process.env.LABFLOW_SLOW_MS ?? 0);
  if (slow && slowed < Number(process.env.LABFLOW_SLOW_COUNT ?? Infinity)) {
    slowed++;
    const json = res.json.bind(res);
    res.json = (body) => { setTimeout(() => json(body), slow); return res; };
  }
  next();
}

// GET /chaos/arrivals — server đã thấy bao nhiêu request, dồn dập tới mức nào (mỗi ô 100 ms)
export const chaosRouter = Router();
chaosRouter.get('/arrivals', (req, res) => {
  const buckets = {};
  for (const [t] of arrivals) buckets[Math.floor(t / 100)] = (buckets[Math.floor(t / 100)] ?? 0) + 1;
  const last = arrivals.length ? Math.max(...arrivals.map(([t]) => t)) : 0;
  res.json({
    total: arrivals.length,
    failed: arrivals.filter(([, s]) => s === 503).length,
    peakPer100ms: Math.max(0, ...Object.values(buckets)),
    lastArrivalMs: last,
    per100ms: Array.from({ length: Math.floor(last / 100) + 1 }, (_, i) => buckets[i] ?? 0),
  });
});
