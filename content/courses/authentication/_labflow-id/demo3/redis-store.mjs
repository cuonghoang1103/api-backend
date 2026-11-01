// demo3/redis-store.mjs — lesson 3.5: the same session store on Redis. Idle timeout = the key's TTL; "sign out everywhere"
// needs a second structure (a set of digests per user), because Redis cannot search values.
import { createClient } from 'redis';

export async function redisStore(url = process.env.REDIS_URL, idleSec = 1800) {
  const r = createClient({ url });
  await r.connect();
  const key = (d) => `ses:${d}`, userKey = (u) => `user-ses:${u}`;
  return {
    client: r,
    async insert(s) {
      await r.multi().set(key(s.digest), JSON.stringify(s), { EX: idleSec }).sAdd(userKey(s.userId), s.digest).exec();
    },
    async get(digest) { const v = await r.get(key(digest)); return v && JSON.parse(v); },
    async update(digest, f) {
      const s = await this.get(digest); if (!s) return;
      await r.set(key(digest), JSON.stringify({ ...s, ...f }), { EX: idleSec });   // touching = a new TTL
    },
    async delete(digest) { const s = await this.get(digest); await r.del(key(digest)); if (s) await r.sRem(userKey(s.userId), digest); },
    async deleteByUser(userId) {
      const ds = await r.sMembers(userKey(userId));
      if (ds.length) await r.del(ds.map(key));
      await r.del(userKey(userId));
      return ds.length;
    },
  };
}
