// perf/idle.mjs — bài 10.4: 100 client nghe trong 30 giây mà KHÔNG có sự kiện nào. Server phải làm bao nhiêu việc?
import { openSSE } from './sse-client.mjs';
const BASE = process.env.BASE ?? 'http://localhost:4000', H = { authorization: 'Bearer tok_lan' };
const N = Number(process.env.N ?? 100), MS = Number(process.env.MS ?? 30000), KIND = process.argv[2];
const { next } = await (await fetch(`${BASE}/v2/events`, { headers: H })).json();
let requests = 0, bytes = 0, stop = false;
const hdr = (r) => [...r.headers].reduce((n, [k, v]) => n + k.length + v.length + 4, 17);
const ctl = new AbortController();
const one = async () => {
  if (KIND === 'sse') return openSSE(`${BASE}/v2/events/stream`, { headers: H, signal: ctl.signal,
    onOpen: (r) => { requests++; bytes += hdr(r); }, onEvent: (m) => { bytes += (m.comment ?? '').length + 4; } });
  const wait = KIND === 'long' ? 25 : 0;
  while (!stop) {
    const r = await fetch(`${BASE}/v2/events?after=${next}&wait=${wait}`, { headers: H, signal: ctl.signal }).catch(() => null);
    if (!r) return; const p = await r.json(); requests++; bytes += hdr(r) + JSON.stringify(p).length;
    if (KIND === 'poll') await new Promise((ok) => setTimeout(ok, 2000));
  }
};
const t0 = Date.now(); const all = Array.from({ length: N }, one);
await new Promise((ok) => setTimeout(ok, MS)); stop = true; ctl.abort(); await Promise.allSettled(all);
console.log(`${KIND.padEnd(5)} ${N} client × ${MS / 1000} s, 0 sự kiện ⇒ ${requests} request, ~${Math.round(bytes / 1024)} KB`);
