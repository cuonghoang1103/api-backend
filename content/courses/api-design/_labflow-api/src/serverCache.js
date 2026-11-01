// serverCache.js — bài 9.2: cache phía server (cache-aside) bằng Redis, và chống "giẫm đạp" (stampede) khi khoá hết hạn
//   LABFLOW_REDIS=redis://localhost:6390   LABFLOW_CACHE_MODE = none | redis | singleflight
// Bài 12.5: cache là ĐỒ TĂNG TỐC, không phải phụ thuộc — Redis hỏng thì đọc thẳng CSDL (chậm hơn, nhưng vẫn đúng).
import { createClient } from 'redis';

const MODE = process.env.LABFLOW_CACHE_MODE ?? 'none';
let client = null;
if (MODE !== 'none') {
  client = createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390',
    socket: { reconnectStrategy: (n) => Math.min(n * 200, 2000) } });   // Redis khởi động lại ⇒ tự nối lại
  client.on('error', (e) => console.error('redis cache', e.message));
  await client.connect();
}
const inflight = new Map();                                       // khoá ⇒ Promise đang tính (chỉ trong MỘT instance)
const quiet = (p) => p.catch(() => null);                         // lỗi cache ⇒ coi như trượt

// cached(key, ttlSec, load): đọc Redis; trượt ⇒ load() rồi SET … EX ttl (+ 0–10% jitter để các khoá không hết hạn cùng lúc)
export async function cached(req, key, ttlSec, load) {
  if (MODE === 'none') return req.timing.timeAsync('db', load);
  const hit = client.isReady ? await req.timing.timeAsync('cache', () => quiet(client.get(key))) : null;
  if (hit !== null) { req.res.set('LabFlow-Cache', 'HIT'); return JSON.parse(hit); }
  req.res.set('LabFlow-Cache', client.isReady ? 'MISS' : 'BYPASS');   // BYPASS: Redis không sẵn sàng, đọc thẳng CSDL
  const fill = async () => {
    const value = await req.timing.timeAsync('db', load);
    const ttl = Math.round(ttlSec * (1 + Math.random() * 0.1));
    if (client.isReady) await quiet(client.set(key, JSON.stringify(value), { expiration: { type: 'EX', value: ttl } }));
    return value;
  };
  if (MODE !== 'singleflight') return fill();
  if (!inflight.has(key)) inflight.set(key, fill().finally(() => inflight.delete(key)));
  return inflight.get(key);                                       // 50 request cùng trượt ⇒ cùng chờ MỘT lần đọc CSDL
}
// Xoá khoá khi dữ liệu nguồn đổi (bài 12.5): xoá SAU khi ghi CSDL xong
export async function invalidate(pattern) {
  if (!client?.isReady) return 0;
  let n = 0;
  for await (const keys of client.scanIterator({ MATCH: pattern, COUNT: 100 })) if (keys.length) n += await client.del(keys);
  return n;
}
export const cacheClient = () => client;
