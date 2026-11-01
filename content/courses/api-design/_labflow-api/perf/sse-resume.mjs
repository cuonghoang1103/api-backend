// perf/sse-resume.mjs — bài 10.4: rớt mạng giữa chừng. Nghe SSE, nhận 5 sự kiện, ĐỨT kết nối, trong lúc đứt có 5 sự kiện nữa,
// rồi nối lại: (a) không gửi Last-Event-ID · (b) gửi Last-Event-ID = id cuối đã thấy. Lần (c): đứt quá lâu, sự kiện cũ đã rơi khỏi vùng giữ.
import { openSSE } from './sse-client.mjs';
import { book } from './book.mjs';

const BASE = process.env.BASE ?? 'http://localhost:4000', H = { authorization: 'Bearer tok_lan' };
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
async function listen(label, headers, ms) {
  const got = [], ctl = new AbortController();
  const p = openSSE(`${BASE}/v2/events/stream`, { headers: { ...H, ...headers }, signal: ctl.signal,
    onEvent: (m) => { if (m.event === 'reset') got.push(`reset ${m.data}`); else if (m.data) got.push(`${m.id}:${JSON.parse(m.data).subject}`); } });
  return { stop: async () => { await sleep(ms); ctl.abort(); await p; console.log(`${label.padEnd(30)} nhận ${got.length}: ${got.join(' ')}`); return got; } };
}
const first = await listen('lần đầu', {}, 0);
await sleep(200); await book(5); const got = await first.stop();
const lastId = got.at(-1).split(':')[0];
await book(5);                                                   // 5 sự kiện xảy ra lúc client đang mất mạng
const a = await listen('(a) nối lại, KHÔNG Last-Event-ID', {}, 0); await sleep(200); await book(2); await a.stop();
const b = await listen(`(b) Last-Event-ID: ${lastId}`, { 'last-event-id': lastId }, 0); await sleep(200); await b.stop();
await book(Number(process.env.FAR ?? 30));                        // đứt rất lâu: EVENTS_KEEP=20 ⇒ id cũ không còn
const c = await listen(`(c) Last-Event-ID: ${lastId} (quá cũ)`, { 'last-event-id': lastId }, 0); await sleep(300); await c.stop();
