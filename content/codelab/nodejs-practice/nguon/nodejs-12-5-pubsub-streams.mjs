/** Node.js · 12.5 — Pub/Sub là phát thanh, không phải hộp thư; Streams + consumer group: chia việc, XACK sau khi xong, XAUTOCLAIM. */
import { modul, cs, q, tn, bang1, jsBai, c, TN } from './_node-c12-14.mjs';

const KIEU = ['Pub/Sub', 'List + BRPOP', 'Stream + consumer group'];
const E1 = cs({
  ten: '12.5 · Decide by what may be lost', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Speed is a non-argument — PUBLISH, XADD and LPUSH are all one round trip (22–31 ms for 10,000 in a pipeline). Choose on semantics: what happens to a message nobody was listening for, and to a job whose worker dies?',
  vi: 'Tốc độ không phải lý lẽ — PUBLISH, XADD và LPUSH đều một vòng đi-về (22–31 ms cho 10.000 trong một pipeline). Chọn theo ngữ nghĩa: tin nhắn không ai nghe thì sao, và job có worker chết giữa chừng thì sao?',
  bang: [bang1('b1', ['Scenario → mechanism', 'Tình huống → cơ chế'], [{ ma: 'x', ten: 'Scenario' }, { ma: 'm', ten: 'Mechanism', luaChon: KIEU }], [
    { o: { x: '“Key note:42 changed — drop your local copy” to every Node process' }, a: { m: 'Pub/Sub' } },
    { o: { x: 'Socket.IO room broadcast between two Node processes (the Redis adapter)' }, a: { m: 'Pub/Sub' } },
    { o: { x: 'Send the welcome email; a worker crash must not lose it' }, a: { m: 'Stream + consumer group' } },
    { o: { x: 'Charge a card; you must be able to see what was delivered and never acknowledged' }, a: { m: 'Stream + consumer group' } },
    { o: { x: 'A throw-away local queue of thumbnail jobs where losing one on a crash is acceptable, lightest on RAM' }, a: { m: 'List + BRPOP' } },
    { o: { x: 'Live “who is online” presence that every client re-fetches after reconnecting' }, a: { m: 'Pub/Sub' } },
  ], ['Pub/Sub delivers to whoever is listening at that instant and stores nothing — perfect when a missed message is harmless. List + BRPOP is one message to one worker with NO acknowledgement. A stream with a consumer group gives one message to one worker, a pending list for what was delivered and never acknowledged, and XAUTOCLAIM to reclaim it.', 'Pub/Sub giao cho ai đang nghe ngay lúc đó và không lưu gì — hoàn hảo khi lỡ một tin là vô hại. List + BRPOP là một tin cho một worker, KHÔNG xác nhận. Stream với consumer group cho một tin tới một worker, một danh sách chờ cho những gì đã giao mà chưa xác nhận, và XAUTOCLAIM để nhặt lại.'])],
  goiY: [['Ask: if the receiver is down for 5 seconds, is that message still needed?', 'Hỏi: nếu bên nhận tắt 5 giây, tin đó có còn cần không?'], ['“Must complete” ⇒ acknowledgement ⇒ stream.', '"Phải hoàn tất" ⇒ cần xác nhận ⇒ stream.']],
  loi: [['Using Pub/Sub for email jobs: PUBLISH returns 0 when no worker listens, and the email is simply gone.', 'Dùng Pub/Sub cho job email: PUBLISH trả 0 khi không worker nào nghe, và email biến mất.'], ['Using a List for payments: a worker that dies after BRPOP took the job loses it with no trace.', 'Dùng List cho thanh toán: worker chết sau khi BRPOP lấy job là mất job không dấu vết.']],
  tns: [tn('Pub/Sub', 'phát/đăng ký', 'phát cho ai đang nghe; không lưu, không lấy lại được'), tn('consumer group', 'nhóm tiêu thụ', 'mỗi tin tới đúng một thành viên, có danh sách chờ xác nhận')],
  kn: ['Pub/Sub', 'Streams'],
});

const E2 = cs({
  ten: '12.5 · The traps that cost an afternoon each', kho: 'MEDIUM', phut: 10,
  en: 'Each question is a real failure from the lesson’s measurements.',
  vi: 'Mỗi câu là một lỗi thật trong các phép đo của bài.',
  cau: [
    q('c1', ['A subscriber was disconnected while you published "tin-khi-offline". PUBLISH returned 0. Where is the message now?', 'Bên đăng ký bị rớt khi bạn phát "tin-khi-offline". PUBLISH trả về 0. Tin đó giờ ở đâu?'],
      ['Nowhere — it was delivered to zero subscribers and Redis never stored it', 'In a backlog that Redis replays when the subscriber reconnects', 'In the AOF file, so turning on persistence would recover it', 'In the subscriber’s socket buffer, delivered after reconnect'],
      ['0 is not an error, it is the number of receivers. Persistence saves keys; a published message was never a key.', '0 không phải lỗi, nó là số người nhận. Lưu bền lưu khoá; một tin đã phát chưa bao giờ là khoá.']),
    q('c2', ['You call redis.get() on the shared client after calling subscribe() on it. What happens?', 'Bạn gọi redis.get() trên client dùng chung sau khi đã gọi subscribe() trên nó. Chuyện gì xảy ra?'],
      ['It throws: a subscribed connection only runs subscribe commands', 'The GET is queued until you unsubscribe, then it runs', 'It works, but the reply arrives as a message event', 'Redis silently opens a second connection for the GET'],
      ['A subscribed connection can only run subscribe-family commands. Share the singleton of 12.1 for subscribe and every other Redis call starts throwing.', 'Kết nối đã subscribe chỉ chạy được lệnh họ subscribe. Dùng chung singleton của 12.1 để subscribe là mọi lệnh Redis khác bắt đầu ném lỗi.']),
    q('c3', ['After a reconnect your service received tin-4 TWICE. The cause in the lesson?', 'Sau khi nối lại, dịch vụ nhận tin-4 HAI lần. Nguyên nhân trong bài?'],
      ['sub.on(\'message\', handler) was called again on reconnect, so two handlers fired', 'Redis redelivers the last message after every reconnect', 'The publisher retried because PUBLISH returned 0', 'Two subscriber processes were in the same consumer group'],
      ['Register the listener ONCE, outside the reconnect path; on reconnect only re-subscribe. Otherwise one message becomes eight after a bad network week.', 'Đăng ký bộ nghe MỘT lần, ngoài đường nối lại; khi nối lại chỉ subscribe lại. Không thì một tin thành tám sau một tuần mạng xấu.']),
    q('c4', ['XTRIM jobs MAXLEN ~ 1000 on a stream of 50,000 left 40,000 entries. Why?', 'XTRIM jobs MAXLEN ~ 1000 trên stream 50.000 mục để lại 40.000 mục. Vì sao?'],
      ['~ trims only whole nodes and Redis caps how many it scans per call — use the exact form or LIMIT 0', 'The stream had a consumer group, and pending entries cannot be trimmed', 'MAXLEN counts bytes, not entries, so 1,000 meant 1 KB', 'The trim runs in the background and finishes a few seconds later'],
      ['The form every tutorial recommends freed almost nothing. Exact MAXLEN 1000 left 1,000 entries (0.03 MB). An untrimmed stream grows forever — it has no TTL to save you.', 'Dạng mọi hướng dẫn khuyên gần như không giải phóng gì. MAXLEN 1000 chính xác để lại 1.000 mục (0,03 MB). Stream không cắt sẽ lớn mãi — nó không có TTL nào cứu bạn.']),
    q('c5', ['In the worker loop, why does XACK go AFTER handle(fields), never before?', 'Trong vòng lặp worker, vì sao XACK đặt SAU handle(fields), không bao giờ trước?'],
      ['An early ACK turns a crash into a silently dropped job', 'XACK before the work blocks the stream for other consumers', 'Redis rejects XACK for an entry whose handler has not returned', 'Acknowledging first doubles the throughput but loses ordering'],
      ['Delivered-but-unacknowledged entries sit in the pending entries list; if the worker dies, another reclaims them with XAUTOCLAIM. ACK first and there is nothing left to reclaim.', 'Mục đã giao mà chưa xác nhận nằm trong danh sách chờ; worker chết thì worker khác nhặt lại bằng XAUTOCLAIM. ACK trước thì không còn gì để nhặt.']),
  ],
  goiY: [['Pub/Sub has no memory; streams are a log.', 'Pub/Sub không có trí nhớ; stream là một cuốn nhật ký.'], ['Anything registered on reconnect is registered N times after N reconnects.', 'Thứ gì đăng ký trong lúc nối lại sẽ bị đăng ký N lần sau N lần nối lại.']],
  loi: [['“We will re-publish on reconnect” — that is building a stream badly.', '"Nối lại thì phát lại" — đó là tự xây một stream dở.'], ['Trusting MAXLEN ~ to bound memory without measuring XLEN afterwards.', 'Tin MAXLEN ~ giới hạn được bộ nhớ mà không đo lại XLEN sau đó.']],
  tns: [tn('pending entries list (PEL)', 'danh sách chờ xác nhận', 'tin đã giao cho một consumer mà chưa XACK'), tn('XAUTOCLAIM', 'tự nhặt lại', 'chuyển tin chờ quá lâu sang consumer khác')],
  kn: ['Pub/Sub', 'Streams'],
});

/* ── stream giả có consumer group ── */
const FAKE_STREAM = `// fake-stream.js — PROVIDED by the exercise (loaded before answer.js). A Redis stream with ONE consumer group.
// Every call is async (one 1 ms round trip on the virtual clock).
//   await s.xadd({ job: 'mail-1' })                    → id '<ms>-<seq>'
//   await s.xreadgroup(consumer, count)                → [[id, fields], …] never delivered before ('>'); they become PENDING for consumer
//   await s.xack(...ids)                               → how many were removed from the pending list
//   await s.xautoclaim(consumer, minIdleMs, count)     → [[id, fields], …] pending for ≥ minIdleMs, now owned by consumer
//   await s.xpending()                                 → { count, byConsumer: { name: n } }
//   s.log  — what happened, for the tests
class FakeStream {
  constructor() { this.entries = []; this.lastMs = -1; this.seq = 0; this.next = 0; this.pending = new Map(); this.log = []; }
  _rt(v) { return new Promise((ok) => setTimeout(() => ok(v), 1)); }
  xadd(fields) {
    const ms = Date.now(); this.seq = ms === this.lastMs ? this.seq + 1 : 0; this.lastMs = ms;
    const id = ms + '-' + this.seq; this.entries.push([id, { ...fields }]); return this._rt(id);
  }
  xreadgroup(consumer, count) {
    const out = this.entries.slice(this.next, this.next + (count || 10)); this.next += out.length;
    for (const [id] of out) this.pending.set(id, { consumer, at: Date.now(), deliveries: 1 });
    this.log.push(consumer + ' read ' + out.length);
    return this._rt(out.map(([id, f]) => [id, { ...f }]));
  }
  xack(...ids) { let n = 0; for (const id of ids.flat()) if (this.pending.delete(id)) n++; this.log.push('ack ' + n); return this._rt(n); }
  xautoclaim(consumer, minIdleMs, count) {
    const now = Date.now(), out = [];
    for (const [id, p] of this.pending) {
      if (out.length >= (count || 10)) break;
      if (now - p.at >= minIdleMs) { p.consumer = consumer; p.at = now; p.deliveries++; out.push([id, { ...this.entries.find((e) => e[0] === id)[1] }]); }
    }
    this.log.push(consumer + ' claimed ' + out.length);
    return this._rt(out);
  }
  xpending() {
    const byConsumer = {}; for (const p of this.pending.values()) byConsumer[p.consumer] = (byConsumer[p.consumer] || 0) + 1;
    return this._rt({ count: this.pending.size, byConsumer });
  }
}
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;

const E3 = jsBai({
  ten: '12.5 · A stream worker that never drops a job', kho: 'HARD', phut: 20,
  en: `<p>The lesson’s worker loop reads with ${c('XREADGROUP … >')}, handles each entry, and acknowledges <b>only after the work succeeded</b>. Write two functions over the provided ${c('FakeStream')}:</p><ul><li>${c('workBatch(stream, consumer, handle)')} — read up to 10 new entries for ${c('consumer')}; for each, ${c('await handle(fields)')}; on success ${c('XACK')} it; on failure leave it pending and carry on with the next one. Resolve to ${c('{ done: [ids], failed: [ids] }')}.</li><li>${c('reclaim(stream, consumer, minIdleMs, handle)')} — take over entries that have been pending for at least ${c('minIdleMs')} (${c('xautoclaim')}, up to 10) and process them exactly like ${c('workBatch')}.</li></ul>`,
  vi: `<p>Vòng lặp worker của bài đọc bằng ${c('XREADGROUP … >')}, xử lý từng mục, và chỉ xác nhận <b>sau khi việc đã thành công</b>. Viết hai hàm trên ${c('FakeStream')} có sẵn:</p><ul><li>${c('workBatch(stream, consumer, handle)')} — đọc tối đa 10 mục mới cho ${c('consumer')}; với mỗi mục ${c('await handle(fields)')}; thành công thì ${c('XACK')}; hỏng thì để nó chờ và làm tiếp mục sau. Resolve ra ${c('{ done: [ids], failed: [ids] }')}.</li><li>${c('reclaim(stream, consumer, minIdleMs, handle)')} — nhận lại các mục đã chờ ít nhất ${c('minIdleMs')} (${c('xautoclaim')}, tối đa 10) và xử lý y như ${c('workBatch')}.</li></ul>`,
  yc: [['XACK only after handle resolved.', 'Chỉ XACK sau khi handle đã resolve.'], ['One failing entry does not stop the batch, and is NOT acknowledged.', 'Một mục hỏng không dừng cả lô, và KHÔNG được xác nhận.'], ['Share the processing code between the two functions.', 'Dùng chung phần xử lý cho cả hai hàm.']],
  dauVao: ['stream — FakeStream · consumer — string · handle — async (fields) => any · minIdleMs — number', 'stream — FakeStream · consumer — chuỗi · handle — async (fields) => any · minIdleMs — số'],
  dauRa: ['Promise<{ done: string[], failed: string[] }>', 'Promise<{ done: string[], failed: string[] }>'],
  goiY: [['Write one helper process(stream, entries, handle) that loops: try { await handle(f); await stream.xack(id); done.push(id) } catch { failed.push(id) }.', 'Viết một hàm phụ process(stream, entries, handle) lặp: try { await handle(f); await stream.xack(id); done.push(id) } catch { failed.push(id) }.'], ['workBatch = process(await stream.xreadgroup(consumer, 10)); reclaim = process(await stream.xautoclaim(consumer, minIdleMs, 10)).', 'workBatch = process(await stream.xreadgroup(consumer, 10)); reclaim = process(await stream.xautoclaim(consumer, minIdleMs, 10)).']],
  loi: [['XACK right after reading “so the stream does not redeliver”: a crash in handle silently drops the job.', 'XACK ngay sau khi đọc "để stream khỏi giao lại": sập trong handle là job mất lặng lẽ.'], ['Letting one exception escape the loop: the rest of the batch stays pending even though it was never tried.', 'Để một ngoại lệ thoát khỏi vòng lặp: phần còn lại của lô nằm chờ dù chưa từng được thử.'], ['Processing a batch with Promise.all and acknowledging all ids at the end: one failure makes you choose between losing it and redoing the others.', 'Xử lý lô bằng Promise.all rồi xác nhận tất cả cuối cùng: một mục hỏng buộc bạn chọn giữa làm mất nó và làm lại các mục khác.']],
  gt: ['An entry is acknowledged only once its work is done, so every failure — an exception or a dead worker — leaves it in the pending list, where XAUTOCLAIM can hand it to another consumer. That is the lesson’s “A gets 3, B gets 2, B crashes ⇒ PENDING 2, C reclaims both ⇒ PENDING 0”: at-least-once delivery, nothing lost.', 'Một mục chỉ được xác nhận khi việc của nó đã xong, nên mọi kiểu hỏng — ngoại lệ hay worker chết — đều để nó lại trong danh sách chờ, nơi XAUTOCLAIM có thể giao cho consumer khác. Đó là "A nhận 3, B nhận 2, B sập ⇒ PENDING 2, C nhặt lại cả hai ⇒ PENDING 0" của bài: giao ít nhất một lần, không mất gì.'],
  kn: ['consumer group', 'at-least-once'], tns: [TN.atLeastOnce, tn('XACK', 'xác nhận', 'báo đã làm xong — mục rời danh sách chờ'), tn('XAUTOCLAIM', 'tự nhặt lại', 'chuyển tin chờ quá lâu sang consumer khác')],
  gia: { 'fake-stream.js': FAKE_STREAM },
  dau: `/** Read up to 10 new entries and process them. */
async function workBatch(stream, consumer, handle) {
  // Write your solution here — this acknowledges BEFORE the work
  const entries = await stream.xreadgroup(consumer, 10);
  const done = [], failed = [];
  for (const [id, fields] of entries) {
    await stream.xack(id);
    try { await handle(fields); done.push(id); } catch (e) { failed.push(id); }
  }
  return { done, failed };
}

/** Take over entries pending for at least minIdleMs and process them. */
async function reclaim(stream, consumer, minIdleMs, handle) {
  return { done: [], failed: [] };
}
`,
  giai: `/** Process entries: acknowledge ONLY after the work succeeded. */
async function processEntries(stream, entries, handle) {
  const done = [], failed = [];
  for (const [id, fields] of entries) {
    try {
      await handle(fields);
      await stream.xack(id);           // the job is finished — only now may it leave the pending list
      done.push(id);
    } catch (e) {
      failed.push(id);                 // NOT acknowledged: it stays pending and can be reclaimed later
    }
  }
  return { done, failed };
}

/** Read up to 10 new entries ('>') and process them. */
async function workBatch(stream, consumer, handle) {
  return processEntries(stream, await stream.xreadgroup(consumer, 10), handle);
}

/** Take over entries pending for at least minIdleMs (their worker probably died) and process them. */
async function reclaim(stream, consumer, minIdleMs, handle) {
  return processEntries(stream, await stream.xautoclaim(consumer, minIdleMs, 10), handle);
}
`,
  chung: `const s = new FakeStream();
for (let i = 1; i <= 5; i++) await s.xadd({ job: 'mail-' + i });
const sent = [];
const ok = async (f) => { await sleep(5); sent.push(f.job); };
const failOn = (bad) => async (f) => { await sleep(5); if (f.job === bad) throw new Error('SMTP 421'); sent.push(f.job); };`,
  cases: [
    { goi: `[await workBatch(s, 'A', ok).then((r) => [r.done.length, r.failed.length]), sent, (await s.xpending()).count]`, moTa: ['Five jobs, all succeed → pending 0', 'Năm job, đều thành công → còn chờ 0'] },
    { goi: `[await workBatch(s, 'A', failOn('mail-3')).then((r) => r.failed.length), sent, await s.xpending()]`, moTa: ['mail-3 fails → it stays pending, the others are done', 'mail-3 hỏng → nó vẫn chờ, các job khác xong'] },
    { goi: `await (async () => { await s.xreadgroup('B', 2); await sleep(60); const r = await reclaim(s, 'C', 50, ok); const rest = await workBatch(s, 'A', ok); return [r.done.length, rest.done.length, sent.length, (await s.xpending()).count]; })()`, moTa: ['B read 2 and died; C reclaims them after 50 ms idle', 'B đọc 2 rồi chết; C nhặt lại chúng sau 50 ms nhàn rỗi'] },
    { goi: `await (async () => { await s.xreadgroup('B', 3); await sleep(10); const early = await reclaim(s, 'C', 50, ok); await sleep(50); const late = await reclaim(s, 'C', 50, ok); return [early.done.length, late.done.length, (await s.xpending()).count]; })()`, an: true },
    { goi: `await (async () => { const first = await workBatch(s, 'A', failOn('mail-2')); await sleep(100); const again = await reclaim(s, 'A', 50, ok); return [first.failed, again.done.length === 1 && again.done[0] === first.failed[0], sent.filter((x) => x === 'mail-2').length, (await s.xpending()).count]; })()`, an: true },
  ],
});

const FAKE_PUBSUB = `// fake-pubsub.js — PROVIDED by the exercise (loaded before answer.js). Pub/Sub with a subscriber that can drop.
//   const bus = new FakeBus(); const sub = bus.client();
//   sub.on('message', (channel, message) => …)   sub.on('ready', () => …)   sub.listenerCount(event)
//   await sub.subscribe(channel)                 sub.drop() (connection lost)   sub.reconnect() (emits 'ready', NOT re-subscribed)
//   await bus.publish(channel, message)          → number of subscribers that received it (0 is not an error)
class FakeBus {
  constructor() { this.clients = []; }
  client() {
    const bus = this, ls = {};
    const sub = {
      connected: true, channels: new Set(),
      on(ev, fn) { (ls[ev] = ls[ev] || []).push(fn); return sub; },
      listenerCount(ev) { return (ls[ev] || []).length; },
      emit(ev, ...a) { for (const fn of ls[ev] || []) fn(...a); },
      subscribe(ch) { sub.channels.add(ch); return new Promise((ok) => setTimeout(() => ok(sub.channels.size), 1)); },
      drop() { sub.connected = false; sub.channels.clear(); },
      reconnect() { sub.connected = true; setTimeout(() => sub.emit('ready'), 1); },
    };
    bus.clients.push(sub);
    setTimeout(() => sub.emit('ready'), 1);    // the first connection also announces 'ready'
    return sub;
  }
  publish(ch, msg) {
    let n = 0;
    for (const s of this.clients) if (s.connected && s.channels.has(ch)) { n++; setTimeout(() => s.emit('message', ch, msg), 1); }
    return new Promise((ok) => setTimeout(() => ok(n), 1));
  }
}
var sleep = typeof sleep === 'function' ? sleep : (ms) => new Promise((ok) => setTimeout(ok, ms));
`;

const E4 = jsBai({
  ten: '12.5 · Re-subscribe on reconnect without doubling the handler', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson’s own bug: on reconnect it called ${c("sub.on('message', handler)")} again, so after one reconnect every message fired twice (${c('[tin-1, tin-2, tin-3, tin-4, tin-4]')}). A reconnected Redis connection is NOT subscribed any more, so you do have to subscribe again — but only subscribe. Write ${c('listen(sub, channel, handler)')}:</p><ul><li>register ONE ${c("'message'")} listener that calls ${c('handler(message)')} only for messages of ${c('channel')};</li><li>on every ${c("'ready'")} event (the first connection and each reconnect), subscribe to ${c('channel')} again;</li><li>return nothing.</li></ul><p>Messages published while the subscriber is down are lost — that is Pub/Sub, not a bug to fix here.</p>`,
  vi: `<p>Lỗi của chính bài học: khi nối lại nó gọi ${c("sub.on('message', handler)")} thêm lần nữa, nên sau một lần nối lại mỗi tin chạy hai lần (${c('[tin-1, tin-2, tin-3, tin-4, tin-4]')}). Kết nối Redis vừa nối lại KHÔNG còn subscribe nữa, nên bạn vẫn phải subscribe lại — nhưng chỉ subscribe. Viết ${c('listen(sub, channel, handler)')}:</p><ul><li>đăng ký MỘT bộ nghe ${c("'message'")} chỉ gọi ${c('handler(message)')} cho tin của ${c('channel')};</li><li>ở mỗi sự kiện ${c("'ready'")} (kết nối đầu và mỗi lần nối lại), subscribe lại ${c('channel')};</li><li>không trả về gì.</li></ul><p>Tin phát lúc bên đăng ký đang rớt sẽ mất — đó là Pub/Sub, không phải lỗi cần sửa ở đây.</p>`,
  yc: [['Exactly one "message" listener, however many reconnects.', 'Đúng một bộ nghe "message", dù nối lại bao nhiêu lần.'], ['Subscribe again on every "ready".', 'Subscribe lại ở mọi sự kiện "ready".'], ['Ignore messages of other channels.', 'Bỏ qua tin của kênh khác.']],
  dauVao: ['sub — subscriber client · channel — string · handler — (message) => void', 'sub — client đăng ký · channel — chuỗi · handler — (message) => void'],
  dauRa: ['undefined', 'undefined'],
  goiY: [['Two registrations at the top level of listen: sub.on(\'message\', …) and sub.on(\'ready\', …).', 'Hai lần đăng ký ở cấp ngoài cùng của listen: sub.on(\'message\', …) và sub.on(\'ready\', …).'], ['Inside the ready handler there is exactly one line: sub.subscribe(channel).', 'Bên trong bộ nghe ready chỉ có đúng một dòng: sub.subscribe(channel).']],
  loi: [['Registering the message listener inside the ready handler: N reconnects ⇒ N + 1 copies of every message.', 'Đăng ký bộ nghe message bên trong bộ nghe ready: N lần nối lại ⇒ mỗi tin N + 1 bản.'], ['Subscribing only once at start: after the first reconnect the client hears nothing, forever, with no error.', 'Chỉ subscribe một lần lúc đầu: sau lần nối lại đầu tiên client không nghe gì nữa, mãi mãi, không báo lỗi.'], ['Forgetting the channel check when one client listens to several channels.', 'Quên kiểm kênh khi một client nghe nhiều kênh.']],
  gt: ['Listeners belong to the client object and survive a reconnect; subscriptions belong to the connection and do not. So the listener is registered once and the subscription is renewed on every ready event. The test drops the connection, publishes (PUBLISH returns 0, the message is gone), reconnects and expects each later message exactly once.', 'Bộ nghe thuộc về đối tượng client và sống qua lần nối lại; đăng ký kênh thuộc về kết nối và không sống qua. Nên bộ nghe đăng ký một lần, còn đăng ký kênh được làm lại ở mỗi sự kiện ready. Kiểm rớt kết nối, phát tin (PUBLISH trả 0, tin biến mất), nối lại và chờ mỗi tin sau đó đúng một lần.'],
  kn: ['Pub/Sub', 'reconnect'], tns: [tn('listener', 'bộ nghe', 'hàm gắn vào sự kiện của client — sống qua lần nối lại'), tn('subscription', 'đăng ký kênh', 'thuộc về KẾT NỐI — mất khi kết nối rớt')],
  gia: { 'fake-pubsub.js': FAKE_PUBSUB },
  dau: `/** Listen to one channel, surviving reconnects. */
function listen(sub, channel, handler) {
  // Write your solution here — the lesson's first version
  sub.on('ready', () => {
    sub.subscribe(channel);
    sub.on('message', (ch, msg) => { if (ch === channel) handler(msg); });
  });
}
`,
  giai: `/** Listen to one channel, surviving reconnects. */
function listen(sub, channel, handler) {
  // the LISTENER belongs to the client object: register it once, outside the reconnect path
  sub.on('message', (ch, msg) => {
    if (ch === channel) handler(msg);          // one client may hear several channels
  });
  // the SUBSCRIPTION belongs to the connection: a reconnected connection must subscribe again
  sub.on('ready', () => {
    sub.subscribe(channel);
  });
}
`,
  chung: `const bus = new FakeBus();
const sub = bus.client();
const got = [];`,
  cases: [
    { goi: `await (async () => { listen(sub, 'notes', (m) => got.push(m)); await sleep(5); for (const m of ['tin-1', 'tin-2', 'tin-3']) await bus.publish('notes', m); await sleep(5); return got; })()`, moTa: ['Three messages while listening → three received', 'Ba tin lúc đang nghe → nhận ba'] },
    { goi: `await (async () => { listen(sub, 'notes', (m) => got.push(m)); await sleep(5); for (const m of ['tin-1', 'tin-2', 'tin-3']) await bus.publish('notes', m); sub.drop(); const lost = await bus.publish('notes', 'tin-khi-offline'); sub.reconnect(); await sleep(5); await bus.publish('notes', 'tin-4'); await sleep(5); return [got, lost, sub.listenerCount('message')]; })()`, moTa: ['The lesson’s run: offline message lost (0), tin-4 exactly once', 'Lần chạy của bài: tin lúc rớt mất (0), tin-4 đúng một lần'] },
    { goi: `await (async () => { listen(sub, 'notes', (m) => got.push(m)); await sleep(5); await bus.publish('other', 'x'); await bus.publish('notes', 'y'); await sleep(5); return got; })()`, moTa: ['Messages of other channels are ignored', 'Tin của kênh khác bị bỏ qua'] },
    { goi: `await (async () => { listen(sub, 'inv', (m) => got.push(m)); await sleep(5); for (let i = 0; i < 4; i++) { sub.drop(); sub.reconnect(); await sleep(5); } await bus.publish('inv', 'note:42'); await sleep(5); return [got, sub.listenerCount('message')]; })()`, an: true },
    { goi: `await (async () => { listen(sub, 'a', (m) => got.push('a:' + m)); listen(sub, 'b', (m) => got.push('b:' + m)); await sleep(5); sub.drop(); sub.reconnect(); await sleep(5); await bus.publish('a', 1); await bus.publish('b', 2); await sleep(5); return got; })()`, an: true },
  ],
});

const E5 = jsBai({
  ten: '12.5 · Resume after a stream id: compare ids as numbers', kho: 'EASY', phut: 10,
  en: `<p>Stream ids have the form ${c('<milliseconds>-<sequence>')} and are monotonic — which makes them the perfect “${c('?since=<last id>')}” cursor after a socket reconnect (lesson 11.3). Write ${c('entriesAfter(entries, lastId)')}: ${c('entries')} is an array of ${c('[id, fields]')} in stream order; return the ones whose id is strictly greater than ${c('lastId')}. ${c("'0'")} or ${c("'0-0'")} means “from the beginning”. An id without a sequence part (${c("'1785182199789'")}) means sequence 0.</p><p>Compare the two parts as NUMBERS: as strings, ${c("'999-0' > '1000-0'")} and ${c("'5-10' < '5-9'")}.</p>`,
  vi: `<p>Id của stream có dạng ${c('<mili-giây>-<số thứ tự>')} và tăng dần — nên nó là con trỏ "${c('?since=<id cuối>')}" hoàn hảo sau khi socket nối lại (bài 11.3). Viết ${c('entriesAfter(entries, lastId)')}: ${c('entries')} là mảng ${c('[id, fields]')} theo thứ tự stream; trả những mục có id lớn hơn hẳn ${c('lastId')}. ${c("'0'")} hoặc ${c("'0-0'")} nghĩa là "từ đầu". Id không có phần thứ tự (${c("'1785182199789'")}) nghĩa là thứ tự 0.</p><p>So hai phần dưới dạng SỐ: dạng chuỗi thì ${c("'999-0' > '1000-0'")} và ${c("'5-10' < '5-9'")}.</p>`,
  yc: [['Strictly greater than lastId (the client already has lastId).', 'Lớn hơn hẳn lastId (client đã có lastId rồi).'], ['Compare milliseconds first, then sequence, both as numbers.', 'So mili-giây trước, rồi số thứ tự, cả hai dạng số.'], ['Do not modify entries.', 'Không sửa entries.']],
  dauVao: ['entries — [id, fields][] · lastId — string', 'entries — [id, fields][] · lastId — chuỗi'],
  dauRa: ['[id, fields][]', '[id, fields][]'],
  goiY: [['const parse = (id) => { const [ms, seq = \'0\'] = String(id).split(\'-\'); return [Number(ms), Number(seq)]; };', 'const parse = (id) => { const [ms, seq = \'0\'] = String(id).split(\'-\'); return [Number(ms), Number(seq)]; };'], ['a is after b when a.ms > b.ms, or a.ms === b.ms and a.seq > b.seq.', 'a đứng sau b khi a.ms > b.ms, hoặc a.ms === b.ms và a.seq > b.seq.']],
  loi: [['Comparing ids as strings: "999-0" sorts after "1000-0", so a client that reconnects at the wrong moment skips or replays messages.', 'So id dạng chuỗi: "999-0" xếp sau "1000-0", nên client nối lại đúng lúc oan sẽ bỏ sót hoặc nhận lặp tin.'], ['Using >= instead of >: the last message the client already had is delivered again after every reconnect.', 'Dùng >= thay vì >: tin cuối client đã có bị giao lại sau mỗi lần nối lại.'], ['Comparing only the millisecond part: two entries in the same millisecond are both skipped or both resent.', 'Chỉ so phần mili-giây: hai mục cùng mili-giây cùng bị bỏ hoặc cùng bị gửi lại.']],
  gt: ['An id is a timestamp plus a sequence for entries in the same millisecond, so ordering is lexicographic on the PAIR of numbers. Parsing both parts with Number() makes 999 < 1000 and 9 < 10 as they should be. Real Redis does this comparison for you in XRANGE key (lastId +; doing it in JavaScript is where the string bug appears.', 'Id là mốc thời gian cộng số thứ tự cho các mục cùng mili-giây, nên thứ tự là thứ tự từ điển trên CẶP số. Parse cả hai phần bằng Number() cho 999 < 1000 và 9 < 10 như đúng ra phải thế. Redis thật tự so cho bạn trong XRANGE key (lastId +; làm bằng JavaScript mới là chỗ lỗi so chuỗi xuất hiện.'],
  kn: ['stream id'], tns: [tn('stream id', 'id của stream', '<mili-giây>-<thứ tự>, tăng dần, dùng làm con trỏ tiếp tục')],
  dau: `/** Entries strictly after lastId. */
function entriesAfter(entries, lastId) {
  // Write your solution here
  if (lastId === '0') return entries.slice();
  return entries.filter(([id]) => id > lastId);
}
`,
  giai: `/** '<ms>-<seq>' → [ms, seq] as numbers ('1785…' alone means seq 0) */
function parseId(id) {
  const [ms, seq = '0'] = String(id).split('-');
  return [Number(ms), Number(seq)];
}

/** Entries strictly after lastId — compare (ms, seq) as numbers, never as strings. */
function entriesAfter(entries, lastId) {
  const [lm, ls] = parseId(lastId);             // '0' and '0-0' both become [0, 0]: everything is after it
  return entries.filter(([id]) => {
    const [m, s] = parseId(id);
    return m > lm || (m === lm && s > ls);      // strictly after: the client already has lastId
  });
}
`,
  chung: `const E = [['998-0', { t: 'a' }], ['999-0', { t: 'b' }], ['1000-0', { t: 'c' }], ['1000-1', { t: 'd' }], ['1000-9', { t: 'e' }], ['1000-10', { t: 'f' }], ['1001-0', { t: 'g' }]];
const ids = (r) => r.map(([id]) => id);`,
  cases: [
    { goi: `ids(entriesAfter(E, '999-0'))`, moTa: ['After 999-0: 1000-* and 1001-0 (string compare would return nothing)', 'Sau 999-0: các 1000-* và 1001-0 (so chuỗi sẽ không trả gì)'] },
    { goi: `ids(entriesAfter(E, '1000-9'))`, moTa: ['After 1000-9: 1000-10 comes next', 'Sau 1000-9: kế tiếp là 1000-10'] },
    { goi: `[entriesAfter(E, '0').length, entriesAfter(E, '0-0').length, entriesAfter(E, '1001-0').length]`, moTa: ['From the beginning, and nothing after the last', 'Từ đầu, và không có gì sau mục cuối'] },
    { goi: `ids(entriesAfter(E, '1000'))`, an: true },
    { goi: `[ids(entriesAfter([['1785182199789-0', {}], ['1785182199789-1', {}], ['1785182199790-0', {}]], '1785182199789-0')), E.length]`, an: true },
  ],
});

export default modul('nodejs-12-5-pubsub-streams', '12.5 Pub/Sub vs Streams: consumer groups, reclaim, reconnect', [E1, E2, E3, E4, E5]);
