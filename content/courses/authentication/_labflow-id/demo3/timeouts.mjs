// demo3/timeouts.mjs — lesson 3.1: idle timeout (30 min without a request) vs absolute timeout (12 h, active or not).
// A fake clock drives the real session layer; the store is in memory.
import { sessionLayer, memoryStore } from '../src/sessions/index.js';
import { fakeReq, fakeRes, setValue } from './fake-http.mjs';

let clock = Date.UTC(2026, 10, 2, 0, 0);                       // 07:00 in Vietnam
const store = memoryStore();
const layer = sessionLayer({ store, now: () => clock });
const hhmm = () => new Date(clock + 7 * 3600e3).toISOString().slice(11, 16);
const start = async (userId) => { const res = fakeRes(); await layer.start(fakeReq(), res, userId); return `__Host-lfid_ses=${setValue(res)}`; };
const ask = async (cookie) => { const req = fakeReq(cookie); const res = fakeRes(); await layer.load(req, res, () => {});
  return req.session ? 'signed in' : `NOT signed in${setValue(res) === '' ? ' (cookie cleared)' : ''}`; };

const an = await start('usr_1'), binh = await start('usr_2');
console.log(`${hhmm()}  An and Binh sign in; An then sends a request every 15 minutes, Binh walks away`);
clock += 15 * 60e3; console.log(`${hhmm()}  An:   ${await ask(an)}`);
clock += 15 * 60e3; console.log(`${hhmm()}  An:   ${await ask(an)}`);
clock += 1 * 60e3; console.log(`${hhmm()}  Binh (31 min without a request): ${await ask(binh)}`);
clock -= 1 * 60e3;
let n = 0;
while (clock + 15 * 60e3 < Date.UTC(2026, 10, 2, 12, 0)) { clock += 15 * 60e3; n++; await ask(an); }
console.log(`${hhmm()}  An after ${n} more requests: ${await ask(an)}`);
clock += 15 * 60e3; console.log(`${hhmm()}  An (12 h after sign-in, still active): ${await ask(an)}`);
console.log(`store writes: ${store.log.inserts} inserts, ${store.log.updates} updates (last_seen), ${store.log.deletes} deletes`);
