import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6391');

let dbCalls = 0;
async function dbFindPlant(id) { dbCalls++; await new Promise((r) => setTimeout(r, 120)); return { id, name: 'Monstera', everyDays: 7 }; } // pretend slow query

async function getPlant(id) {                               // cache-aside
  const key = 'plant:' + id;
  const hit = await redis.get(key);
  if (hit) return JSON.parse(hit);
  const plant = await dbFindPlant(id);
  await redis.set(key, JSON.stringify(plant), 'EX', 60);   // ALWAYS a TTL
  return plant;
}
async function updatePlant(id, patch) { /* UPDATE in the database first, then: */ await redis.del('plant:' + id); }

async function timed(label, fn) { const t = performance.now(); await fn(); console.log(label.padEnd(24), (performance.now() - t).toFixed(1), 'ms, db calls so far:', dbCalls); }
await redis.del('plant:10');
await timed('1st read (miss)', () => getPlant(10));
await timed('2nd read (hit)', () => getPlant(10));
await timed('update -> invalidate', () => updatePlant(10, { everyDays: 5 }));
await timed('read after update', () => getPlant(10));
console.log('TTL left on key:', await redis.ttl('plant:10'), 's');

// Atomic rate limit: INCR + EXPIRE in one MULTI, safe across many API processes
async function allow(userId, limit = 3) {
  const key = 'rl:water:' + userId;
  const [[, n]] = await redis.multi().incr(key).expire(key, 60, 'NX').exec();
  return n <= limit;
}
await redis.del('rl:water:1');
const r = []; for (let i = 0; i < 5; i++) r.push(await allow(1));
console.log('5 waterings in a minute ->', r.join(' '));
await redis.quit();
