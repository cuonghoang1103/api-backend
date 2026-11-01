// perf/two-instances.mjs — bài 10.4: hai instance LabFlow (:4000 và :4002, như sau load balancer ở 8.4).
// Client SSE nối vào :4002; lượt đặt được tạo qua :4000. Client thấy bao nhiêu sự kiện?
import { openSSE } from './sse-client.mjs';
import { book } from './book.mjs';
const ctl = new AbortController(), got = [];
const p = openSSE('http://localhost:4002/v2/events/stream', { headers: { authorization: 'Bearer tok_lan' }, signal: ctl.signal,
  onEvent: (m) => { if (m.data) got.push(JSON.parse(m.data).subject); } });
await new Promise((ok) => setTimeout(ok, 300));
await book(10, 'lab_3', 'http://localhost:4000');
await new Promise((ok) => setTimeout(ok, 500));
ctl.abort(); await p;
console.log(`tạo 10 lượt đặt qua :4000 · client nối :4002 thấy ${got.length}: ${got.join(' ') || '—'}`);
