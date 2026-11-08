/**
 * node-12-5 — Node.js · Chapter 12 · Lesson 12.5 "Pub/Sub and Streams: the message that vanished" (slide EN, đợt 9b — 01/11/2026).
 * MỘT deck, HAI tập: node-12-5 (slide 1–11) · node-12-5-2 (slide 12–22).
 *   A: nhắc adapter chương 11 = Pub/Sub · ví dụ đời thường (đài phát thanh vs cuốn nhật ký) · Pub/Sub (thật: 3/3, PUBLISH 0, mất tin lúc offline) · khi nào đúng · sai thảm hoạ cho việc ·
 *      bẫy 1 (thật: "Connection in subscriber mode…") · bẫy 2 (thật: handler 3 lần ⇒ 1 tin thành 3) · Stream (thật: XLEN 5, id <ms>-<seq>) · id và ?since (11.3) · bảng phần A
 *   B: consumer group (thật: 3 + 2, PENDING 2, XAUTOCLAIM 2, PENDING 0) · vòng lặp worker · BLOCK + XACK sau khi xong · stream không tự dọn (thật: 50.000 ⇒ ~1000 còn 40.000) · MAXLEN/MINID ·
 *      ba cách chuyển tin (thật: 13,5 / 22,6 / 27,8 ms; RAM 0,19 / 0,07 MB) · chọn theo ngữ nghĩa · BullMQ · persistence không cứu Pub/Sub · website · bốn ý · bài tập · tóm tắt
 * Nguồn: nodejs-12-5-pubsub-streams. Output THẬT: that/c12/{pubsub,streams} (Node 22.23.3, ioredis 5.11.1, Redis 7.4.9 Docker node12-redis).
 * Khác web: tốc độ 13,5 / 22,6 / 27,8 ms (web 27,9 / 22,6 / 31,2) · RAM 50.000 mục 0,87 MB (web 1,17) · bẫy 2 dựng lại với 3 lần đăng ký ⇒ 3 bản (web 2) ·
 *   web ghi "bài 11.4" cho mẫu ?since và vụ mất năm tin ⇒ thật ra là 11.3 (đã sửa web).
 */
import { lamDeck, two, box, cards, flow, bang, vsd, J, TT, thanh, dong } from './_c9-chung.mjs';

export const deck = { key: 'node-12-5', code: 'NODE 12.5', title: 'Pub/Sub and Streams: the message that vanished', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c12/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const SP = ['PUBLISH \\(0', 'XADD \\(stream', 'LPUSH \\(list'].map((k) => num(R('streams', new RegExp(`^${k}`)), /\s([\d.]+) ms/));
const RAM = { st: num(R('streams', /^RAM: stream/), /stream ([\d.]+) MB/), ls: num(R('streams', /^RAM: stream/), /list ([\d.]+) MB/) };
const TR = { full: num(R('streams', /untrimmed/), /RAM=([\d.]+) MB/), approx: num(R('streams', /MAXLEN ~ 1000\s+:/), /XLEN=(\d+)/) };

const radioSvg = `<svg data-k="radio" viewBox="0 0 1100 210" width="1100" height="210" font-family="Arial">
<rect x="10" y="20" width="520" height="170" rx="16" fill="${CAM}12" stroke="${CAM}" stroke-width="3"/>
<text x="80" y="95" font-size="56">📻</text><text x="160" y="80" font-size="24" font-weight="700" fill="${CAM}">Pub/Sub = a radio broadcast</text>
<text x="160" y="116" font-size="20" fill="#444">whoever is tuned in NOW hears it;</text><text x="160" y="144" font-size="20" fill="#444">nobody records it; switch on later =</text><text x="160" y="172" font-size="20" fill="#444">you missed it</text>
<rect x="570" y="20" width="520" height="170" rx="16" fill="${NODE}12" stroke="${NODE}" stroke-width="3"/>
<text x="640" y="95" font-size="56">📔</text><text x="720" y="80" font-size="24" font-weight="700" fill="${NODE}">Stream = a journal</text>
<text x="720" y="116" font-size="20" fill="#444">every entry is written down with a</text><text x="720" y="144" font-size="20" fill="#444">number; read from any page, any time;</text><text x="720" y="172" font-size="20" fill="#444">tick off what you have done</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 12 — Redis: caching, TTL and atomicity', bai: '12.5' }, [
  { cover: true, t: 'Pub/Sub and Streams:<br>the message<br>that vanished', sub: 'Chapter 11 used Redis Pub/Sub without explaining it. This lesson explains what you bought there — and why the very same mechanism is completely wrong for a job queue.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>What Pub/Sub really promises: delivery to whoever is listening NOW, and nothing else</li>
<li>Two traps, each worth an afternoon: the subscribed connection, the doubled handler</li>
<li>Streams: an append-only journal with ids you can resume from</li>
<li>Consumer groups: share work, then PROVE no job was lost</li>
<li>Trimming a stream, and choosing between Pub/Sub, a List and a Stream</li>
</ul>` + box('Why it matters to you', 'Use Pub/Sub for a job queue and an email, a payment or a thumbnail silently disappears the first time a worker restarts. The choice is decided by what you are allowed to lose.', 'lam') },

  { t: 'You have used Pub/Sub already: chapter 11', to: true, giua: true, body: flow([
    { t: 'process B', s: 'io.to(room).emit', mau: NODE }, { t: 'Redis PUBLISH', s: 'to a channel', mau: DO }, { t: 'process A', s: 'SUBSCRIBEd, receives', mau: NODE }, { t: 'A\'s sockets', s: 'get the message', mau: LAM }], { h: 140 }) +
    two(box('The Socket.IO Redis adapter IS Pub/Sub', 'Lesson 11.4: two processes, one room. B publishes the broadcast, A\'s subscriber receives it and delivers to its local sockets.', 'lam'),
      box('And it is the right tool there', 'A dropped broadcast is harmless: the client treats the socket as a SIGNAL and re-fetches over REST (lesson 11.3).', 'xanh')) +
    box('Today', 'What exactly did that buy — and why would the same thing lose a job?', 'cam') },

  { t: 'An everyday picture: a radio or a journal', to: true, giua: true, body: radioSvg + two(box('Fine for a radio', '"Cache key X changed — drop your copy", "Alice is online": missing one is harmless; whoever was away will read the truth from the database.', 'xanh'),
    box('Fatal for work', '"Send this email", "charge this card", "make this thumbnail": missing one means the work never happens — and nobody notices.', 'do2')) },

  { t: 'Pub/Sub: an offline subscriber loses everything', to: true, giua: true, body: TT('c12/pubsub', 2, 5, 'node pubsub.mjs · one channel, the subscriber disconnects for one message · real', { hl: [3, 4], n: 104, sm: false }) +
    two(box('PUBLISH returns the number of receivers', '0 is not an error. The message was handed to whoever listened at that instant — nobody — and then it was gone.', 'lam'),
      box('No storage, no queue, no replay', 'Redis never knew you wanted to keep it. Reconnecting does not bring it back.', 'do2')) +
    flow([{ t: 'msg-1 … msg-3', s: 'subscriber listening: 3/3', mau: NODE }, { t: 'subscriber drops', s: 'a deploy, a network blip', mau: CAM }, { t: 'msg-while-offline', s: 'PUBLISH → 0: gone', mau: DO }, { t: 'msg-4', s: 'received after reconnect', mau: NODE }], { h: 130 }) },

  { t: 'When Pub/Sub is exactly right', to: true, giua: true, body: cards([
    ['Cross-process cache invalidation', '"key X changed, drop your local copy": a missed message costs one stale read.'],
    ['Socket.IO broadcasts', 'The adapter of chapter 11: the socket is a signal, REST is the truth.'],
    ['Presence', '"who is online" heartbeats: the next one arrives in seconds anyway.'],
  ], 3) + vsd('<p>Send an email, charge a card, make a thumbnail through Pub/Sub.</p><p>A worker restarting during a deploy = jobs silently skipped.</p>', '<p>Fan out an ephemeral signal to whoever listens now.</p><p>A dead subscriber re-reads the database when it comes back.</p>', '✗ Catastrophically wrong', '✓ Exactly right') },

  { t: 'Trap 1 — a subscribed connection cannot work', to: true, giua: true, body: TT('c12/pubsub', 6, 7, 'node pubsub.mjs · [2] GET on the connection that called SUBSCRIBE · real', { hl: [2], n: 104, sm: false }) +
    J(`const redis = getRedis();          // the shared client of lesson 12.1
const sub = redis.duplicate();      // ✓ a SECOND connection, only for listening
await sub.subscribe('cache-invalidate');
// redis.subscribe(...) here would break every other command in the app`, { sm: false, hl: [2] }) +
    box('You need two clients', 'After SUBSCRIBE, Redis only accepts subscribe-family commands on that connection. Share the singleton and every other Redis call in your app starts throwing — the same rule as the adapter\'s pub and sub in 11.4.', 'do2') },

  { t: 'Trap 2 — the handler registered on every reconnect', to: true, giua: true, body: TT('c12/pubsub', 8, 9, 'node pubsub.mjs · [3] the "on reconnect" path calls sub.on(\'message\', handler) again · real', { hl: [2], n: 104, sm: false }) +
    vsd(J(`sub.on('ready', () => {
  sub.on('message', handler);
  sub.subscribe('chat');
});  // listener added again`, { sm: false, hl: [2] }), J(`sub.on('message', handler);
sub.on('ready', () => {
  sub.subscribe('chat');
});  // listener added ONCE`, { sm: false, hl: [1] }), '✗ one message, N copies', '✓ one message, one copy') +
    box('How one message becomes eight', 'A long-lived service that re-subscribes on every reconnect adds one more listener each time. After a week of bad network, every message runs eight times. The web lesson\'s author hit exactly this while writing it.', 'cam') },

  { t: 'Streams: a journal that remembers', to: true, giua: true, body: TT('c12/streams', 2, 5, 'node streams.mjs · [4] XADD jobs * job thumbnail-N, five times · real', { hl: [2, 3], n: 104, sm: false }) +
    J(`await redis.xadd('jobs', '*', 'job', 'thumbnail-1');   // '*' = let Redis pick the id
await redis.xrange('jobs', '-', '+');                     // read everything, any time`, { sm: false, hl: [1] }) +
    two(box('Entries stay until YOU remove them', 'An append-only log: XLEN 5, and they are still there tomorrow.', 'xanh'), box('The id is a timestamp', '&lt;milliseconds&gt;-&lt;sequence&gt;: increasing, sortable, range-scannable, resumable.', 'lam')) +
    box('Compare with slide 5', 'Pub/Sub kept nothing for a subscriber that was away. A stream keeps every entry for every reader, until you trim it.', 'cam') },

  { t: 'The id format is quietly useful', to: true, giua: true, body: flow([
    { t: 'remember last id', s: 'e.g. 1793…6579-0', mau: LAM }, { t: 'connection drops', s: 'entries keep arriving', mau: DO }, { t: 'XRANGE (lastId +', s: 'everything AFTER it', mau: NODE }, { t: 'nothing missed', s: 'resume exactly', mau: NODE }], { h: 140 }) +
    two(box('The same pattern as ?since=&lt;last id&gt;', 'Lesson 11.3 needed it after every socket reconnect: fetch exactly what was missed.', 'lam'),
      box('API Design 10.4 builds on it', 'A Redis Stream as the event log for SSE replay with Last-Event-ID — measured there: two instances, 0 → 10 of 10 bookings seen. Not re-measured here.', 'xanh')) +
    box('Pub/Sub has no id at all', 'Nothing to resume from: a gap is simply a gap.', 'do2') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'Pub/Sub', 'Stream'], [
    ['subscriber offline', 'the message is LOST (PUBLISH → 0)', 'kept: read it later'],
    ['stored in Redis?', 'never', 'until you trim it'],
    ['the connection', 'a dedicated subscriber connection', 'a normal connection'],
    ['resume after a gap', 'impossible: no ids', 'from the last id you saw'],
  ], { co: 22 }) + cards([['PUBLISH / SUBSCRIBE', 'broadcast, no memory'], ['XADD / XRANGE', 'append, read any range'], ['duplicate()', 'one connection just to listen']], 3) + two(box('Remember', 'Pub/Sub delivers to whoever listens NOW. A Stream is a journal.', 'xanh'), box('Next', 'Part 2: consumer groups that prove no job was lost, trimming, and choosing.', 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'Consumer groups: share the work, prove nothing is lost', to: true, giua: true, body: TT('c12/streams', 6, 10, 'node streams.mjs · [5] group g1: A and B read, B crashes, C claims · real', { hl: [2, 3, 4, 5], n: 104, sm: false }) +
    cards([['One entry → ONE consumer', 'XREADGROUP with ">" hands each new entry to exactly one member of the group.'], ['Delivered ≠ done', 'Until XACK, the entry sits in the group\'s PENDING list, owned by its consumer.'], ['A consumer dies', 'XAUTOCLAIM lets another worker take over entries idle for longer than N ms.']], 3) },

  { t: 'The worker loop', to: true, giua: true, body: J(`await redis.xgroup('CREATE', 'jobs', 'g1', '0', 'MKSTREAM').catch(() => {}); // exists: fine
while (running) {
  const res = await redis.xreadgroup('GROUP', 'g1', process.env.WORKER_ID,
    'COUNT', 10, 'BLOCK', 5000,          // sleep INSIDE Redis up to 5 s: no busy loop
    'STREAMS', 'jobs', '>');            // '>' = only entries nobody has received yet
  if (!res) continue;                   // 5 s with no work
  for (const [id, fields] of res[0][1]) {
    try {
      await handle(fields);
      await redis.xack('jobs', 'g1', id);   // ACK ONLY after the work succeeded
    } catch (err) {
      logger.error('job failed', { id, err }); // no XACK: stays pending, can be claimed
    }
  }
}`, { sm: false, hl: [4, 10] }) +
    two(box('BLOCK 5000', 'Sleeps inside Redis: no polling.', 'xanh'), box('XACK after, never before', 'Early ack = a crash drops the job.', 'do2')) },

  { t: 'A stream never cleans up after itself', to: true, giua: true, body: TT('c12/streams', 11, 16, 'node streams.mjs · [6] 50,000 entries, three ways to trim to 1,000 · real', { hl: [3], n: 104, sm: false }) +
    two(box(`MAXLEN ~ 1000 left ${TR.approx.toLocaleString('en-US')} entries`, '"~" means approximately: Redis removes whole NODES only (100 entries each), and by default limits how many it scans per call — so it stopped early.', 'do2'),
      box('Use the exact form, or add LIMIT 0', 'Both left exactly 1,000 entries here. Unlike a cache key, a stream has no TTL to save you: untrimmed, it grows forever.', 'xanh')) },

  { t: 'Trim by size, by age, or at write time', to: true, giua: true, body: J(`await redis.xtrim('log', 'MAXLEN', 10000);                 // keep the newest 10,000
await redis.xtrim('log', 'MINID', idOf7DaysAgo);            // drop everything older than 7 days
await redis.xadd('jobs', 'MAXLEN', '~', 10000, '*', 'job', 'x'); // trim while writing`, { sm: false, hl: [3] }) +
    cards([['MAXLEN', 'when you care about memory'], ['MINID', 'when you care about time (an id IS a timestamp)'], ['XADD … MAXLEN', 'the option that can never be forgotten in a cron job']], 3) +
    box('Pick one on day one', `50,000 small entries already took ${TR.full} MB here. A busy stream with no trimming is a slow leak you find at maxmemory.`, 'cam') },

  { t: 'Three ways to move a message, measured', to: true, giua: true, body: TT('c12/streams', 17, 21, 'node streams.mjs · [7] pipeline of 10,000, median of 5 · real', { hl: [2, 3, 4], n: 104, sm: false }) +
    thanh([['PUBLISH', SP[0], CAM, `${SP[0]} ms`], ['XADD', SP[1], NODE, `${SP[1]} ms · keeps ${RAM.st} MB`], ['LPUSH', SP[2], LAM, `${SP[2]} ms · keeps ${RAM.ls} MB`]], { w: 1100, x0: 200, wMax: 520, h0: 52, chu: 22, ghi: '10,000 messages · real' }) +
    box('Speed is not the argument', 'All three are one round trip per pipeline (12.1). Choose by what the message must survive.', 'lam') },

  { t: 'Choose by semantics', to: true, giua: true, body: cards([
    ['Pub/Sub', 'Fan out to EVERYONE listening, store nothing. Cache invalidation, Socket.IO adapter. Losing a message is normal.'],
    ['List + BRPOP', 'The simplest queue: one message to one worker, lightest on RAM. NO acknowledgement: a worker that dies mid-job loses it.'],
    ['Stream + consumer group', 'One message to one worker WITH acknowledgement, claiming of abandoned work, and replayable history. The choice for work that must be done.'],
  ], 3) + box('Real background jobs: BullMQ (chapter 13)', 'Retries with backoff, delayed and repeated jobs, priorities, a dashboard — built on Redis. Everything in this lesson is what BullMQ does underneath; knowing it is how you debug BullMQ when it misbehaves.', 'xanh') },

  { t: 'Persistence does not make Pub/Sub reliable', to: true, giua: true, body: two(box('Persistence saves KEYS', 'RDB snapshots and the AOF log (lesson 12.6) store keys. A published message was never a key.', 'lam'),
    box('Even with appendfsync always', 'A message published while the subscriber was disconnected is still gone. The log recorded nothing to replay.', 'do2')) +
    flow([{ t: 're-publish', s: 'you start buffering', mau: CAM }, { t: 'add ids', s: 'you invent offsets', mau: CAM }, { t: 'track readers', s: 'you invent groups', mau: DO }, { t: 'use a Stream', s: 'it already exists', mau: NODE }], { h: 140 }) +
    box('If you catch yourself re-publishing on reconnect', 'You have started building a stream, badly. Use the real one.', 'cam') },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: two(box('Socket.IO across processes = Pub/Sub', 'attachRedisAdapter duplicates the shared node-redis client into pub + sub (lesson 11.4). A dropped broadcast is harmless: clients re-fetch over REST.', 'lam'),
    box('Work that must happen is not Pub/Sub', 'Chapter 13 moves image processing, e-mail and reports onto a queue with acknowledgements — the job of a Stream or BullMQ, never a broadcast.', 'xanh')) +
    bang(['need', 'here', 'why'], [['realtime room broadcast', 'Redis Pub/Sub (adapter)', 'loss is harmless, lowest overhead'], ['events with replay (API Design 10.4)', 'Redis Stream', 'Last-Event-ID needs ids'], ['background work (ch. 13)', 'a queue with acks', 'a lost job is a lost email']], { co: 21 }) },

  { t: 'Decided by what you are allowed to lose', to: true, giua: true, body: flow([
    { t: '1 Pub/Sub', s: 'to whoever listens NOW', mau: CAM }, { t: '2 subscribed = deaf', s: 'needs a 2nd connection', mau: DO }, { t: '3 Streams KEEP', s: 'a journal with ids', mau: NODE }, { t: '4 groups share', s: 'pending = at-least-once', mau: NODE }], { h: 140 }) +
    box('At-least-once, not exactly-once', 'A claimed job may run twice (the first worker might have finished just before dying). Make handlers idempotent — the same advice as locks in 12.4.', 'cam') +
    box('Rule of thumb', 'Ask: "if this message disappears, does anything break?" No ⇒ Pub/Sub. Yes ⇒ Stream (or BullMQ).', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'An app needs: (1) tell every API process to drop its in-memory copy of the settings when an admin edits them; (2) generate a PDF invoice after each payment, with 3 worker processes, surviving a deploy; (3) keep the last 7 days of audit events and let a dashboard resume after a disconnect. Pick Pub/Sub, a List or a Stream for each, and name the commands.', '') +
    `<div data-k="dapan">${box('Answer', '(1) Pub/Sub: PUBLISH settings-changed on save, each process SUBSCRIBEs on a duplicate() connection; a missed message ⇒ the next read reloads anyway (or add a short TTL). (2) Stream + consumer group: XADD invoices; workers XREADGROUP … BLOCK 5000, XACK after the PDF is stored; XAUTOCLAIM for crashed workers; idempotent by payment id. (3) Stream: XADD audit MAXLEN ~ or XTRIM MINID &lt;7 days ago&gt;; the dashboard keeps its last id and reads XRANGE audit (lastId +.', 'xanh')}</div>` },

  { t: 'Pub/Sub and Streams — in one table', to: true, giua: true, body: bang(['', 'measured here', 'the rule'], [
    ['offline subscriber', 'PUBLISH → 0, message lost', 'Pub/Sub only for losable signals'],
    ['GET on a subscribed connection', '"Connection in subscriber mode"', 'a dedicated subscriber client'],
    ['handler registered 3 times', '1 message delivered 3 times', 'register listeners once'],
    ['B crashes holding 2 jobs', 'PENDING 2 → XAUTOCLAIM → 0', 'XACK after success, claim abandoned work'],
    ['XTRIM MAXLEN ~ 1000', `${TR.approx.toLocaleString('en-US')} entries left`, 'exact, LIMIT 0, or trim on XADD'],
  ], { co: 21 }) + box('Next: 12.6 — running Redis in production', 'The commands that freeze everything: KEYS vs SCAN, DEL vs UNLINK, what happens when Redis is full, and persistence.', 'lam') },
]);
