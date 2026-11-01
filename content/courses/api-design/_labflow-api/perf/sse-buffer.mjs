// perf/sse-buffer.mjs — bài 10.4: client gửi Accept-Encoding: gzip (trình duyệt LUÔN gửi). Mỗi giây sinh một sự kiện, trong 8 giây.
// In ra lúc client THẤY từng sự kiện. LabFlow chạy với LABFLOW_SSE_NOFLUSH=1 (quên res.flush()) hoặc mặc định.
import { openSSE } from './sse-client.mjs';
import { book } from './book.mjs';

const BASE = process.env.BASE ?? 'http://localhost:4000';
const ctl = new AbortController(), t0 = Date.now(), seen = [];
let enc;
const p = openSSE(`${BASE}/v2/events/stream`, { headers: { authorization: 'Bearer tok_lan', 'accept-encoding': process.env.AE ?? 'gzip' }, signal: ctl.signal,
  onOpen: (r) => { enc = r.headers.get('content-encoding'); },
  onEvent: (m) => { if (m.data) seen.push(`${JSON.parse(m.data).subject}@${((Date.now() - t0) / 1000).toFixed(1)}s`); } });
for (let i = 0; i < 8; i++) { await new Promise((ok) => setTimeout(ok, 1000)); await book(1); }
await new Promise((ok) => setTimeout(ok, 1000));
console.log(`Content-Encoding: ${enc ?? '(không nén)'} · sinh 8 sự kiện ở giây 1…8 · client thấy ${seen.length}: ${seen.join(' ') || '—'}`);
ctl.abort(); await p;
