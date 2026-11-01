// serverCache.js — bài 9.2: cache phía server (cache-aside) bằng Redis, và chống "giẫm đạp" (stampede) khi khoá hết hạn
//   LABFLOW_REDIS=redis://localhost:6390   LABFLOW_CACHE_MODE = none | redis | singleflight
import { createClient } from 'redis';

const MODE = process.env.LABFLOW_CACHE_MODE ?? 'none';
let client = null;
if (MODE !== 'none') {
  client = createClient({ url: process.env.LABFLOW_REDIS ?? 'redis://localhost:6390' });
  client.on('error', (e) => console.error('redis', e.message));
  await client.connect();
}
const inflight = new Map();                                       // khoá ⇒ Promise đang tính (chỉ trong MỘT instance)

// cached(key, ttlSec, load): đọc Redis; trượt ⇒ load() rồi SET … EX ttl (+ 0–10% jitter để các khoá không hết hạn cùng lúc)
export async function cached(req, key, ttlSec, load) {
  if (MODE === 'none') return req.timing.timeAsync('db', load);
  const hit = await req.timing.timeAsync('cache', () => client.get(key));
  if (hit !== null) { req.res.set('LabFlow-Cache', 'HIT'); return JSON.parse(hit); }
  req.res.set('LabFlow-Cache', 'MISS');
  const fill = async () => {
    const value = await req.timing.timeAsync('db', load);
    const ttl = Math.round(ttlSec * (1 + Math.random() * 0.1));
    await client.set(key, JSON.stringify(value), { expiration: { type: 'EX', value: ttl } });
    return value;
  };
  if (MODE !== 'singleflight') return fill();
  if (!inflight.has(key)) inflight.set(key, fill().finally(() => inflight.delete(key)));
  return inflight.get(key);                                       // 50 request cùng trượt ⇒ cùng chờ MỘT lần đọc CSDL
}
export const cacheClient = () => client;
