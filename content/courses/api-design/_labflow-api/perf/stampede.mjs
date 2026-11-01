// perf/stampede.mjs — bài 9.2: khoá cache vừa hết hạn đúng lúc N người cùng hỏi — CSDL bị hỏi bao nhiêu lần?
import { createClient } from 'redis';
const N = Number(process.env.N ?? 50);
const URL_ = 'http://localhost:4000/v2/stats/labs';
const redis = await createClient({ url: 'redis://localhost:6390' }).connect();
const before = Number((await fetch(URL_)).headers.get('labflow-db-queries'));   // số lần hỏi CSDL tới giờ
await redis.del('stats:labs:v1');                                 // giả lập: khoá vừa hết hạn
const t = [];
const counts = await Promise.all(Array.from({ length: N }, async () => {
  const a = performance.now();
  const res = await fetch(URL_); await res.text();
  t.push(performance.now() - a);
  return Number(res.headers.get('labflow-db-queries'));
}));
t.sort((a, b) => a - b);
console.log(`${N} request cùng lúc vào khoá vừa hết hạn ⇒ CSDL bị hỏi ${Math.max(...counts) - before} lần · p50 ${t[Math.floor(N / 2)].toFixed(0)} ms · max ${t[N - 1].toFixed(0)} ms`);
await redis.quit();
