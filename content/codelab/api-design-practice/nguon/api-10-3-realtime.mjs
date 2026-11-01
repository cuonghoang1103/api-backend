/** API Design · 10.4 — Realtime: polling, long polling, SSE, WebSocket; định dạng SSE và nối lại bằng Last-Event-ID (output thật bài 10.4). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Realtime 1 — Delay, idle cost and the buffering trap', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 10.4: perf/realtime.mjs (30 bookings, one client of each kind), perf/idle.mjs (100 clients, 30 s, no events) and perf/sse-buffer.mjs.',
  vi: 'Những điều từ bài 10.4: perf/realtime.mjs (30 lượt đặt, mỗi loại một client), perf/idle.mjs (100 client, 30 s, không có sự kiện) và perf/sse-buffer.mjs.',
  cau: [
    q('c1', ['Polling every 2 s saw events 1,112 ms late at p50. If the client polls every 500 ms instead, what should you expect?', 'Polling mỗi 2 s thấy sự kiện trễ 1.112 ms ở p50. Nếu client hỏi mỗi 500 ms, nên chờ đợi điều gì?'],
      ['About 250 ms average delay and four times as many requests, most of them empty', 'About 1 ms delay, the same as SSE, and the same number of requests as before', 'No change in delay, because the server answers polls only once per second', 'About 500 ms average delay and half as many requests, thanks to keep-alive'],
      ['An event lands at a random point of the interval: on average half of it (1.1 s for 2 s), at worst all of it (2,005 ms measured).', 'Sự kiện rơi vào một điểm ngẫu nhiên trong khoảng: trung bình nửa khoảng (1,1 s với 2 s), tệ nhất cả khoảng (đo 2.005 ms).']),
    q('c2', ['100 idle clients for 30 s, zero events. How many requests did each contract make?', '100 client im lặng trong 30 s, không có sự kiện. Mỗi hợp đồng gửi bao nhiêu request?'],
      ['Polling 1,500 (~524 KB to say “nothing new”); long polling and SSE 100', 'Polling 100; long polling 1,500, because it reconnects after every timeout', 'All three made 100 requests, because idle connections are kept alive', 'Polling 3,000; SSE 0, because the stream is opened only when an event exists'],
      ['Behind one NAT with Chapter 5’s 100 requests / 60 s IP limit, a computer room of polling clients is blocked within seconds.', 'Sau một NAT với giới hạn IP 100 request / 60 s của Chương 5, cả phòng máy dùng polling bị chặn sau vài giây.']),
    q('c3', ['With compression on and res.flush() forgotten, a browser saw 0 of 8 SSE events while plain curl saw them all. Why?', 'Bật nén mà quên res.flush(), trình duyệt thấy 0/8 sự kiện SSE còn curl thường thấy hết. Vì sao?'],
      ['The browser sends Accept-Encoding: gzip, and gzip holds small writes in its buffer', 'Browsers block text/event-stream unless the response also has CORS headers', 'curl ignores retry: 3000, while the browser waits 3 s before every event', 'EventSource only accepts events whose id is a UUID, not a sequence number'],
      ['curl without --compressed gets no gzip, so the bug ships when the developer tests with curl. nginx buffers too — LabFlow sends X-Accel-Buffering: no.', 'curl không --compressed thì không có gzip, nên lỗi lọt ra khi lập trình viên thử bằng curl. nginx cũng đệm — LabFlow gửi X-Accel-Buffering: no.']),
    q('c4', ['Two LabFlow instances with events in process memory: a dashboard on :4002 saw 0 of 10 bookings made on :4000. What fixed it?', 'Hai instance LabFlow giữ sự kiện trong bộ nhớ tiến trình: dashboard ở :4002 thấy 0/10 lượt đặt tạo ở :4000. Cái gì sửa được?'],
      ['LABFLOW_EVENTS=redis: every instance reads the tail of one Redis Stream (10 of 10)', 'Sticky sessions, so that every client always reaches the instance it booked on', 'A shorter heartbeat, so that the dashboard reconnects to the other instance', 'Switching the dashboard to WebSocket, which broadcasts to every instance'],
      ['The same stream doubles as the replay log for Last-Event-ID.', 'Cùng stream đó cũng là nhật ký phát bù cho Last-Event-ID.']),
  ],
  goiY: [['For polling, think “half the interval”.', 'Với polling, nghĩ tới “nửa khoảng hỏi”.'], ['Test streams the way browsers call them — with gzip.', 'Thử stream theo cách trình duyệt gọi — có gzip.']],
  loi: [['Choosing polling for many idle clients.', 'Chọn polling cho nhiều client ít hoạt động.'], ['Testing SSE only with plain curl.', 'Chỉ thử SSE bằng curl thường.']],
  tns: [tn('long polling', 'giữ request tới khi có tin'), tn('Server-Sent Events', 'luồng sự kiện server → client'), tn('fan-out', 'toả sự kiện tới mọi instance')],
  kn: ['realtime'],
});

function parseSse(text) {
  const events = [];
  let retry = null, lastId = null, type = '', data = [];
  for (const line of text.split(/\r\n|\r|\n/)) {
    if (line === '') {                                           // dòng trống: kết thúc một sự kiện
      if (data.length) events.push({ id: lastId, event: type || 'message', data: data.join('\n') });
      data = []; type = '';
      continue;
    }
    if (line.startsWith(':')) continue;                          // chú thích (": ping")
    const at = line.indexOf(':');
    const field = at === -1 ? line : line.slice(0, at);
    let value = at === -1 ? '' : line.slice(at + 1);
    if (value.startsWith(' ')) value = value.slice(1);           // bỏ MỘT dấu cách sau dấu hai chấm
    if (field === 'data') data.push(value);
    else if (field === 'event') type = value;
    else if (field === 'id') lastId = value;                     // id được NHỚ cho các sự kiện sau
    else if (field === 'retry' && /^\d+$/.test(value)) retry = Number(value);
  }
  return { retry, events };                                      // sự kiện chưa có dòng trống ở cuối bị bỏ
}
const RAW = 'retry: 3000\n\nid: 41\nevent: labflow.booking.created.v1\ndata: {"id":"41","subject":"bk_41"}\n\nid: 42\nevent: labflow.booking.created.v1\ndata: {"id":"42","subject":"bk_42"}\n\n';
const E2 = jsBai({
  ten: 'Realtime 2 — Write parseSse(text): read a text/event-stream', kho: 'MEDIUM', phut: 20,
  en: `<p>Parse an SSE stream the way <code>EventSource</code> does (WHATWG HTML, simplified). Lines end with <code>\\n</code>, <code>\\r\\n</code> or <code>\\r</code>.</p><ul><li>A line starting with <code>:</code> is a comment (<code>: ping</code>) — ignore it.</li><li><code>field: value</code> — split at the first <code>:</code> and drop <b>one</b> leading space of the value (a line without <code>:</code> is a field with an empty value). Fields: <code>data</code> (append a line), <code>event</code> (the type), <code>id</code> (remembered: later events without an <code>id</code> line carry the last id seen; <code>null</code> before any), <code>retry</code> (only if all digits ⇒ a number). Other fields are ignored.</li><li>A blank line dispatches <code>{ id, event, data }</code> — <code>event</code> defaults to <code>"message"</code>, data lines are joined with <code>\\n</code> — but only if at least one <code>data</code> line was seen; then the data and the type are reset (not the id).</li><li>An event not followed by a blank line before the end is discarded.</li></ul><p>Return <code>{ retry, events }</code> (<code>retry</code>: the last valid value, or <code>null</code>).</p>`,
  vi: `<p>Đọc một luồng SSE như <code>EventSource</code> (WHATWG HTML, rút gọn). Dòng kết thúc bằng <code>\\n</code>, <code>\\r\\n</code> hoặc <code>\\r</code>.</p><ul><li>Dòng bắt đầu bằng <code>:</code> là chú thích (<code>: ping</code>) — bỏ qua.</li><li><code>field: value</code> — tách ở dấu <code>:</code> đầu tiên và bỏ <b>một</b> dấu cách đầu của value (dòng không có <code>:</code> là trường với value rỗng). Các trường: <code>data</code> (thêm một dòng), <code>event</code> (loại), <code>id</code> (được nhớ: sự kiện sau không có dòng <code>id</code> mang id cuối cùng đã thấy; <code>null</code> nếu chưa có), <code>retry</code> (chỉ khi toàn chữ số ⇒ một số). Trường khác bỏ qua.</li><li>Dòng trống phát <code>{ id, event, data }</code> — <code>event</code> mặc định <code>"message"</code>, các dòng data nối bằng <code>\\n</code> — nhưng chỉ khi đã thấy ít nhất một dòng <code>data</code>; rồi xoá data và loại (không xoá id).</li><li>Sự kiện chưa có dòng trống theo sau khi hết chữ thì bị bỏ.</li></ul><p>Trả <code>{ retry, events }</code> (<code>retry</code>: giá trị hợp lệ cuối cùng, hoặc <code>null</code>).</p>`,
  dauVao: ['text — string (the bytes received so far)', 'text — chuỗi (những gì đã nhận được)'],
  dauRa: ['{ retry: number | null, events: [{ id, event, data }] }', '{ retry: number | null, events: [{ id, event, data }] }'],
  goiY: [['split(/\\r\\n|\\r|\\n/) — keep the empty strings, they are the blank lines.', 'split(/\\r\\n|\\r|\\n/) — giữ các chuỗi rỗng, chúng là dòng trống.'], ['Keep buffers: data lines, type, last id; flush them on a blank line.', 'Giữ các bộ đệm: dòng data, loại, id cuối; xả chúng ở dòng trống.']],
  loi: [['Splitting on ": " — a JSON value with ": " inside gets cut.', 'Tách theo ": " — value JSON có ": " bên trong bị cắt.'], ['Dispatching “retry: 3000” followed by a blank line as an event without data.', 'Phát “retry: 3000” kèm dòng trống thành một sự kiện không có data.']],
  gt: ['This is the raw stream of lesson 10.4: retry: 3000 tells EventSource to wait 3 s before reconnecting, comments keep proxies from closing idle connections, and the remembered id is what the browser sends back as Last-Event-ID.', 'Đây là luồng thô của bài 10.4: retry: 3000 bảo EventSource đợi 3 s trước khi nối lại, chú thích giữ proxy không cắt kết nối im lặng, và id được nhớ chính là thứ trình duyệt gửi lại trong Last-Event-ID.'],
  kn: ['realtime', 'SSE'],
  tns: [tn('event stream', 'luồng sự kiện'), tn('dispatch', 'phát sự kiện ra'), tn('Last-Event-ID', 'id sự kiện cuối đã nhận')],
  dau: `/** parse a text/event-stream body */
function parseSse(text) {
  // Write your solution here
  const events = [];
  for (const block of text.split('\\n\\n')) {
    const ev = {};
    for (const line of block.split('\\n')) {
      const [k, v] = line.split(': ');
      ev[k] = v;
    }
    if (ev.data) events.push({ id: ev.id || null, event: ev.event || 'message', data: ev.data });
  }
  return { retry: null, events };
}
`,
  giai: '// Reference solution\n' + nguon(parseSse),
  cases: [
    { goi: goi('parseSse', RAW), moTa: ['The raw stream of 10.4', 'Luồng thô của bài 10.4'] },
    { goi: goi('parseSse', ': ping\n\ndata: line one\ndata: line two\n\nevent: reset\ndata: {"latest":"42"}\n\n'), moTa: ['Comment, two data lines, a reset event', 'Chú thích, hai dòng data, sự kiện reset'] },
    { goi: goi('parseSse', 'id: 7\ndata: a\n\ndata: b\n\nid: 8\ndata: c'), an: true },
    { goi: goi('parseSse', 'retry: 3000\r\n\r\ndata:no-space\r\ndata:  two spaces\r\n\r\nretry: soon\r\n'), an: true },
    { goi: goi('parseSse', 'data: {"a": 1, "b": "x: y"}\nfoo: bar\ndata\n\n'), an: true },
    { goi: goi('parseSse', 'event: labflow.booking.cancelled.v1\n\nid: 9\n\n'), an: true },
  ],
});

function resume(ring, lastEventId, held) {
  if (lastEventId === null) return { reset: false, send: [...held] };            // không nối lại: chỉ những gì mới tới
  let last = Number(lastEventId);                                                 // id là SỐ: "10" > "9"
  if (ring.length && last < Number(ring[0]) - 1) {                                // đã rơi khỏi vùng giữ ⇒ không giả vờ
    return { reset: true, latest: ring[ring.length - 1], send: held.filter((id) => Number(id) > last) };
  }
  const send = [];
  for (const id of ring) if (Number(id) > last) { send.push(id); last = Number(id); }
  for (const id of held) if (Number(id) > last) { send.push(id); last = Number(id); }   // tới giữa lúc phát bù: không trùng
  return { reset: false, send };
}
const R = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
const E3 = jsBai({
  ten: 'Realtime 3 — Write resume(ring, lastEventId, held): replay without holes or duplicates', kho: 'HARD', phut: 20,
  en: `<p>An SSE client reconnects. LabFlow keeps the last events in a ring buffer <code>ring</code> (ids as numeric strings, oldest first; it already contains every event published so far, including those that arrived while the handler was replaying). The handler subscribes <b>before</b> it replays, so events that arrived during the replay are also in <code>held</code>. Return what to send:</p><ul><li><code>lastEventId === null</code> (fresh connection) ⇒ <code>{ reset: false, send: held }</code>;</li><li>the ring is not empty and <code>lastEventId &lt; first id − 1</code> (events were lost from the buffer) ⇒ <code>{ reset: true, latest: &lt;last id of ring&gt;, send: &lt;held ids greater than lastEventId&gt; }</code>;</li><li>otherwise ⇒ <code>{ reset: false, send }</code>: the ring ids greater than <code>lastEventId</code>, then the held ids greater than the last id sent — each id at most once, in order.</li></ul><p>Compare ids as <b>numbers</b>.</p>`,
  vi: `<p>Một client SSE nối lại. LabFlow giữ các sự kiện cuối trong vòng đệm <code>ring</code> (id là chuỗi số, cũ trước; nó đã chứa mọi sự kiện đã phát, kể cả những sự kiện tới trong lúc handler đang phát bù). Handler đăng ký nghe <b>trước</b> khi phát bù, nên sự kiện tới giữa lúc phát bù cũng nằm trong <code>held</code>. Trả những gì cần gửi:</p><ul><li><code>lastEventId === null</code> (kết nối mới) ⇒ <code>{ reset: false, send: held }</code>;</li><li>vòng đệm khác rỗng và <code>lastEventId &lt; id đầu − 1</code> (sự kiện đã rơi khỏi vùng giữ) ⇒ <code>{ reset: true, latest: &lt;id cuối của ring&gt;, send: &lt;các id trong held lớn hơn lastEventId&gt; }</code>;</li><li>ngược lại ⇒ <code>{ reset: false, send }</code>: các id trong ring lớn hơn <code>lastEventId</code>, rồi các id trong held lớn hơn id vừa gửi cuối cùng — mỗi id tối đa một lần, đúng thứ tự.</li></ul><p>So id như <b>số</b>.</p>`,
  dauVao: ['ring — string[] (ascending numeric ids); lastEventId — string | null; held — string[]', 'ring — string[] (id số tăng dần); lastEventId — chuỗi | null; held — string[]'],
  dauRa: ['{ reset: false, send } | { reset: true, latest, send }', '{ reset: false, send } | { reset: true, latest, send }'],
  goiY: [['A gap means the first id you still have is not lastEventId + 1 or less.', 'Có khoảng hở nghĩa là id đầu còn giữ lớn hơn lastEventId + 1.'], ['Track the last id sent; the held list then filters itself.', 'Theo dõi id đã gửi cuối; danh sách held tự lọc theo nó.']],
  loi: [['Comparing ids as strings: "10" &lt; "9", so event 10 is never replayed.', 'So id như chuỗi: "10" &lt; "9", nên sự kiện 10 không bao giờ được phát bù.'], ['Appending held to the replay without filtering — the events of the replay window arrive twice.', 'Nối held vào phần phát bù mà không lọc — sự kiện trong lúc phát bù tới hai lần.']],
  gt: ['perf/sse-resume.mjs with EVENTS_KEEP=20: no Last-Event-ID ⇒ only 11 and 12 (bk_6…bk_10 silently lost); Last-Event-ID: 5 ⇒ all 7 in order; too old ⇒ one reset {"latest":"42"}, and the client reloads state from the REST API.', 'perf/sse-resume.mjs với EVENTS_KEEP=20: không Last-Event-ID ⇒ chỉ 11 và 12 (bk_6…bk_10 mất âm thầm); Last-Event-ID: 5 ⇒ đủ 7 theo thứ tự; quá cũ ⇒ một sự kiện reset {"latest":"42"}, client tải lại trạng thái từ REST API.'],
  kn: ['realtime', 'SSE', 'reliability'],
  tns: [tn('ring buffer', 'vòng đệm'), tn('replay', 'phát bù'), tn('reset', 'báo client tải lại trạng thái')],
  dau: `/** what to send to a reconnecting SSE client */
function resume(ring, lastEventId, held) {
  // Write your solution here
  return { reset: false, send: ring.filter((id) => id > (lastEventId || '')).concat(held) };
}
`,
  giai: '// Reference solution\n' + nguon(resume),
  cases: [
    { goi: goi('resume', R(1, 12), '5', []), moTa: ['(b) Last-Event-ID: 5', '(b) Last-Event-ID: 5'] },
    { goi: goi('resume', R(23, 42), '5', []), moTa: ['(c) too old, EVENTS_KEEP=20', '(c) quá cũ, EVENTS_KEEP=20'] },
    { goi: goi('resume', R(1, 12), null, ['11', '12']), an: true },
    { goi: goi('resume', R(41, 50), '45', ['49', '50']), an: true },
    { goi: goi('resume', R(6, 12), '9', []), an: true },
    { goi: goi('resume', R(6, 12), '5', ['12']), an: true },
    { goi: goi('resume', R(6, 12), '12', []), an: true },
    { goi: goi('resume', R(30, 49), '7', ['48', '49']), an: true },
  ],
});

export default doiDau({ slug: 'api-10-3-realtime', ten: '10.4 Realtime: polling, SSE or WebSocket', khoa: KHOA, baiHoc: 'api-10-3-realtime', de: [E1, E2, E3] });
