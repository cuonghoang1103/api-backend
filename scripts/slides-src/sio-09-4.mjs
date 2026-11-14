/**
 * sio-09-4 — Socket.IO · Chapter 9 · Lesson 9.4 "Bridging to socket.io: the dashboard tier" (deck video + web, 14/11/2026).
 * Bài web: io-9-4-bridge. Output THẬT (scratchpad/sio/demo/n9-4.txt · lab ~/.rtq-sio/lab/c9 · device.gateway.ts CHÉP NGUYÊN TỪ KHO + handler maker:device:join chép từ messaging.socket.ts:546-562):
 * kho: 5 loại event vào room maker:device:<id>; tên của bài web (device:${id}, device:status, maker:device:command) = 0 chỗ; lệnh đi REST POST /devices/:id/commands ⇒ pushCommand.
 * ai: An / Bình / user 3 cùng xin room ⇒ mỗi người chỉ nhận bo của mình; người lạ nhận 0 và KHÔNG có lỗi.
 * tre: cùng máy p50 5 ms; mỗi chặng 25 ms một chiều ⇒ p50 57 ms.
 * lenh: 3 lệnh PENDING, bo nối lại: DB 0 ms ⇒ mỗi lệnh 1 lần; DB 2–5 ms ⇒ mỗi lệnh 2 LẦN (handleHello chạy hai lần) — firmware không lọc trùng.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-4:kho": "$ grep -n \"emitToConsole(.*'maker:\" src/socket/device.gateway.ts | grep -o \"'maker:[a-z:]*'\" | sort | uniq -c\n   2 'maker:command:update'\n   1 'maker:device:log'\n   2 'maker:device:status'\n   1 'maker:device:telemetry'\n   2 'maker:device:transcript'\n$ sed -n '546,555p' src/socket/messaging.socket.ts\n    socket.on('maker:device:join', async (deviceId: number) => {\n      if (!Number.isInteger(deviceId) || deviceId <= 0) return;\n      try {\n        const device = await prisma.makerDevice.findUnique({\n          where: { id: deviceId },\n          select: { ownerId: true },\n        });\n        if (!device || device.ownerId !== user.id) return;\n        socket.join(`maker:device:${deviceId}`);\n      } catch {\n$ grep -rnE \"maker:device:command|'device:(status|telemetry)'|\\`device:\" src/ frontend/src/ | wc -l     # tên trong bài web\n       0\n$ grep -n \"pushCommand(params.deviceId\\|const delivered\" src/services/makerlab/makerLab.service.ts\n238:  const delivered = pushCommand(params.deviceId, {",
 "n9-4:ai": "$ node bo.mjs 1 & node bo.mjs 2        # hai bo mạch nối, telemetry mỗi giây\n2 bo đã chạy 3 s\n$ # Live Console của An\n 0.02 s [An] nối socket.io · join maker:device:1, maker:device:2\n 0.88 s [An] ← maker:device:status {\"deviceId\":1,\"status\":\"ONLINE\",\"lastSeenAt\":\"2026-11-13T23:01:16.879Z\",\"batteryPct\":null}\n 0.88 s [An] ← maker:device:status {\"deviceId\":1,\"status\":\"ONLINE\",\"lastSeenAt\":\"2026-11-13T23:01:16.882Z\",\"firmwareVersion\":\n 1.89 s [An] ← maker:device:telemetry {\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":1,\"gui\":1794610877882},\"recordedA · trễ 2 ms\n 2.89 s [An] ← maker:device:telemetry {\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":2,\"gui\":1794610878884},\"recordedA · trễ 1 ms\n 3.67 s [An] ← maker:device:status {\"deviceId\":1,\"status\":\"OFFLINE\"}\n 5.01 s [An] tổng: {\"maker:device:status\":3,\"maker:device:telemetry\":2}\n$ # Live Console của Bình\n 0.02 s [Bình] nối socket.io · join maker:device:1, maker:device:2\n 0.89 s [Bình] ← maker:device:status {\"deviceId\":2,\"status\":\"ONLINE\",\"lastSeenAt\":\"2026-11-13T23:01:16.879Z\",\"batteryPct\":null}\n 0.89 s [Bình] ← maker:device:status {\"deviceId\":2,\"status\":\"ONLINE\",\"lastSeenAt\":\"2026-11-13T23:01:16.885Z\",\"firmwareVersion\":\n 1.89 s [Bình] ← maker:device:telemetry {\"deviceId\":2,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":1,\"gui\":1794610877883},\"recordedA · trễ 1 ms\n 2.89 s [Bình] ← maker:device:telemetry {\"deviceId\":2,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":2,\"gui\":1794610878886},\"recordedA · trễ 2 ms\n 3.67 s [Bình] ← maker:device:status {\"deviceId\":2,\"status\":\"OFFLINE\"}\n 5.01 s [Bình] tổng: {\"maker:device:status\":3,\"maker:device:telemetry\":2}\n$ # user 3 xin vào room thiết bị 1\n 0.02 s [user 3] nối socket.io · join maker:device:1\n 5.01 s [user 3] tổng: {}",
 "n9-4:tre": "$ node tre94.mjs 0       # bo ⇒ gateway kho ⇒ room ⇒ console, cùng máy\nmạng mỗi chặng 0 ms một chiều · 20/20 tin tới console · trễ đầu-cuối p50 5 ms · nhỏ nhất 3 · lớn nhất 13 ms\n$ node tre94.mjs 25      # mỗi chặng mạng trễ 25 ms một chiều\nmạng mỗi chặng 25 ms một chiều · 20/20 tin tới console · trễ đầu-cuối p50 57 ms · nhỏ nhất 53 · lớn nhất 72 ms",
 "n9-4:lenh": "$ sed -n '613,621p;1070,1072p' ~/api-backend/src/socket/device.gateway.ts\n  // Flush anything queued while the board was away.\n  const pending = await prisma.makerCommand.findMany({\n    where: { deviceId: conn.deviceId, status: MakerCommandStatus.PENDING },\n    orderBy: { createdAt: 'asc' },\n    take: 20,\n  });\n  for (const cmd of pending) {\n    pushCommand(conn.deviceId, { id: cmd.id, type: cmd.type, payload: cmd.payload });\n  }\n  logger.info('MakerLab device connected', { deviceId: auth.deviceId, key: auth.deviceKey });\n  sendJson(conn, { t: 'welcome', deviceId: auth.deviceId, serverTime: Date.now() });\n  void handleHello(conn, {}).catch(() => undefined);\n$ grep -n \"static void handleCommand\" -A3 firmware/mini-me-robot/src/main.cpp     # firmware có lọc lệnh trùng không?\n862:static void handleCommand(JsonDocument& doc) {\n863-  const uint32_t id = doc[\"id\"] | 0;\n864-  const char* type = doc[\"type\"] | \"\";\n865-\n$ node lenh94.mjs 3 0      # 3 lệnh PENDING, bo nối lại · DB trả ngay\nlượt 1 · 3 lệnh PENDING · DB 0 ms/truy vấn ⇒ bo nhận 3 lệnh: #501×1 #502×1 #503×1\nlượt 2 · 3 lệnh PENDING · DB 0 ms/truy vấn ⇒ bo nhận 3 lệnh: #501×1 #502×1 #503×1\n$ node lenh94.mjs 3 2      # DB 2 ms mỗi truy vấn\nlượt 1 · 3 lệnh PENDING · DB 2 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2\nlượt 2 · 3 lệnh PENDING · DB 2 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2\n$ node lenh94.mjs 3 5      # DB 5 ms mỗi truy vấn (Postgres qua mạng)\nlượt 1 · 3 lệnh PENDING · DB 5 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2\nlượt 2 · 3 lệnh PENDING · DB 5 ms/truy vấn ⇒ bo nhận 6 lệnh: #501×2 #502×2 #503×2"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, seq, path } from './_sio-chung.mjs';

export const deck = { key: 'sio-09-4', code: 'SIO 9.4', title: 'Bridging to socket.io: the dashboard tier', sub: 'Chapter 9 · Lesson 9.4' };
const O = (k) => { const v = DU_LIEU[`n9-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHO = O('kho'), AI = O('ai'), TRE = O('tre'), LENH = O('lenh');
const ex = (txt, bo = [], n = 999) => txt.split('\n').filter((l) => !bo.some((r) => r.test(l))).map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const tre = [...TRE.matchAll(/mỗi chặng (\d+) ms .* p50 (\d+) ms · nhỏ nhất (\d+) · lớn nhất (\d+) ms/g)].map((x) => ({ d: +x[1], p50: +x[2], min: +x[3], max: +x[4] }));
const lan = [...LENH.matchAll(/DB (\d+) ms\/truy vấn ⇒ bo nhận (\d+) lệnh/g)].map((x) => ({ db: +x[1], nhan: +x[2] }));
const db0 = lan.find((x) => x.db === 0), db2 = lan.find((x) => x.db === 2), db5 = lan.find((x) => x.db === 5);

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.4', t: 'Bridging to socket.io:<br>the dashboard tier', sub: 'Board → raw ws → gateway → socket.io room → browser, and commands the other way. Run against the repo’s code.',
    en: 'Lesson nine point four: the bridge to socket.io for the dashboard tier. Events up from the board, commands down to it, run against the repo’s own code.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The bridge as the repo really wrote it: names, events, where the permission check lives</li>
    <li>Three consoles, two boards: who receives what — measured</li>
    <li>End-to-end latency through the bridge, with and without a network</li>
    <li>Commands going down: REST, a queue, and a duplicate we measured</li>
    <li>What breaks when you add a second server process</li></ul>`,
    en: 'Five takeaways: the bridge as written; who receives what; latency through it; commands going down, with a duplicate; and what breaks with a second process.' },
  { t: 'The bridge as the repo wrote it', body: tn(ex(KHO, [/^\s+(try|where|select|\}\);|\} catch|const device|if \(!Number)/], 104), { fs: 14, wrap: 120 }) +
      two(box('Read it', `5 event types, one room per board ${c('maker:device:<id>')}; the <b>owner</b> is re-checked on every join. Commands come over <b>REST</b> ⇒ ${c('pushCommand')}, not the socket.`, 'ok'),
        box('Versus the web page', `${c('device:${id}')}, ${c('device:status')}, ${c('maker:device:command')}: <b>0 occurrences</b> in the repo. Right pattern, wrong names and command path.`, 'bad')),
    en: 'The bridge as written: five event types through one room per board, maker device id. The join handler re-checks the owner. Commands come in over REST, not over the socket. The page’s names occur zero times in the repo.' },
  { t: 'Measured: three consoles, two boards', body: tn(ex(AI, [/^\$ # /, /firmwareVe/], 106), { fs: 13, wrap: 120 }) +
      two(box('Read it', `An and Binh both asked for <b>both</b> rooms. Each console receives only its own board — status, telemetry, OFFLINE. User 3 owns nothing: <b>0 events</b>.`, 'ok'),
        box('Notice', `A refused join is <b>silent</b> — safe, but an empty console then looks like a permission problem. The page emits ${c("'error'")}; the repo does not.`, 'warn')),
    en: 'Three consoles, two boards. Each owner receives only their own board; user three receives nothing. A refused join is silent, which is safe but makes an empty console hard to debug.' },
  { t: 'Why this pattern works', body: icards([
      ['cpu', 'The board knows nothing about viewers', 'It sends to one URL. Zero viewers or fifty — same firmware, same bytes.'],
      ['eye', 'The browser knows nothing about firmware', 'It speaks plain socket.io events. Swap the board for MQTT or HTTP polling and the dashboard does not change.'],
      ['layers', 'Fan-out N → M for free', 'One board, five open consoles: one io.to(room).emit, socket.io does the rest — across workers too, with the Redis adapter (Ch5).'],
      ['shield', 'One place for the rules', 'Owner check on join; device identity checked once at the upgrade (header key + bcrypt). Neither tier trusts the other.'],
    ], 2),
    en: 'Why it works: the board knows nothing about viewers, the browser nothing about firmware, fan-out is free, and the rules live in one place, the server.' },
  { t: 'Measured: end-to-end latency through the bridge', body: tn(TRE, { fs: 15, wrap: 120 }) +
      two(path([{ t: 'board', s: 'raw ws' }, { t: 'gateway', s: 'parse + emit', on: true }, { t: 'room', s: 'socket.io' }, { t: 'console', s: 'browser' }], { h: 170, fs: 20, nhan: [`${tre[1].d} ms`, '', `${tre[1].d} ms`], w: 640 }),
        box('Read it', `Same machine: p50 <b>${tre[0].p50} ms</b> — the bridge itself costs a few ms. With ${tre[1].d} ms one-way on each hop: p50 <b>${tre[1].p50} ms</b> = the two network hops + the same few ms. The page’s “20–100 ms” is simply your two network legs.`, 'ok'), 'r46'),
    en: 'Latency through the bridge: on one machine a few milliseconds; with twenty-five milliseconds on each hop, about fifty-seven. The bridge adds almost nothing; the network legs are the latency.' },
  { t: 'Commands go down a different road', body: seq(['browser', 'REST API', 'DB', 'gateway', 'board'], [
        [0, 1, 'POST /devices/:id/commands (owner checked)'], [1, 2, 'insert command · PENDING'], [1, 3, 'pushCommand(id) — board online?', '#0e7490'],
        [3, 4, '{t:"cmd", id, type, payload}', '#1f8a3b'], [3, 2, 'status ⇒ SENT', '#1f8a3b'], [4, 3, '{t:"ack", id, ok}', '#1f8a3b'],
        [3, 0, 'maker:command:update via the room', '#7c3aed']], { w: 1110, rh: 42, fs: 16 }) +
      box('Offline board', `${c('pushCommand')} returns ${c('false')}, the row stays <b>PENDING</b>, and the gateway flushes up to 20 pending commands the next time the board says ${c('hello')}. A queue in the database, not in RAM — it survives a restart.`, 'info'),
    en: 'Commands go down a different road: a REST call checks the owner, inserts a pending row, and pushes it if the board is online. Otherwise the row waits and is flushed at the next hello.' },
  { t: 'Measured: every queued command delivered twice', body: tn(ex(LENH, [/^\s+(where|orderBy|take|\}\);|for \(|\}$|logger|sendJson|\/\/ Flush)|^86[45]|^lượt 2/], 108), { fs: 13, wrap: 120 }) +
      two(box('Latent bug in this repo', `${c('acceptDevice')} calls ${c('handleHello(conn, {})')} itself (line 1072), and the board sends its own ${c('hello')} right after connecting. Both read the PENDING rows before either marks them SENT. DB at 0 ms: ${db0?.nhan ?? '?'} deliveries for 3 commands; at <b>2 ms: ${db2?.nhan}</b>; at 5 ms: ${db5?.nhan}.`, 'bad'),
        box('Why it matters', `${c('handleCommand')} in the firmware does not check ${c('id')}: a queued ${c('move')} runs <b>twice</b>. Fix: claim rows atomically (${c("UPDATE … SET status='SENT' WHERE status='PENDING' RETURNING")}), flush only on the board’s real hello, and let the board ignore an id it has already done.`, 'warn')),
    en: 'Measured: with a realistic database latency of two to five milliseconds, every queued command reaches the board twice, because hello is handled twice. The firmware does not deduplicate, so a queued move runs twice.' },
  { t: 'Add a second server process and…', body: cmp(['', 'one process (today)', 'two workers behind a balancer'], [
      ['board ⇒ console events', 'io.to(room).emit — fine', 'fine with the Redis adapter (Ch5)'],
      ['which process holds the board', 'the only one', 'one of them — a Map in its RAM (line 119)'],
      ['REST command on the other worker', '—', `${c('pushCommand')} finds no socket ⇒ <b>false</b> ⇒ stays PENDING until the board reconnects`],
      ['isDeviceOnline() for the device list', 'correct', 'wrong half the time'],
    ], { hl: [2] }) + box('Same shape as lesson 5.2', `${c('call.socket.ts:161')} read a local room; here ${c('connections')} is a local Map. Options: route device traffic to one gateway process, publish commands over Redis to whichever process holds the board, or keep the device set in Redis.`, 'info'),
    en: 'With a second server process, console events still work through the Redis adapter, but the board’s socket lives in one process’s memory. A command handled by the other process finds no socket and waits.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Bridge', 'raw ws event ⇒ io.to(room).emit'), kw('maker:device:&lt;id&gt;', 'one room per board'), kw('Owner check on join', 'a room name is not a capability'),
      kw('Silent refusal', 'no error event on a denied join'), kw('Command queue', 'PENDING rows, flushed on hello'), kw('Duplicate delivery', 'two hellos, two flushes'),
      kw('Idempotent command', 'board ignores an id it already ran'), kw('Process-local Map', 'breaks with a second worker'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: bridge; one room per board; owner check on join; silent refusal; command queue; duplicate delivery; idempotent command; and the process-local map.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Open three consoles for two boards; check who receives what',
      'Put 25 ms on each network hop; measure end-to-end latency',
      'Queue 3 commands, reconnect the board with a 2 ms DB; count deliveries',
      'Fix it: atomic claim + one flush + ignore repeated ids; count again',
    ]), box('Keep these', `<ul><li>Room per board; owner checked on every join</li><li>Refusals are silent — log them</li><li>Bridge ≈ a few ms; the network is the latency</li><li>Commands: REST + DB queue, flushed on hello</li><li>Two hellos ⇒ two deliveries; make commands idempotent</li></ul>`, 'info'), ''),
    en: 'Your turn: three consoles, network delay, a queued-command reconnect, and then the fix.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Raw WebSocket: when socket.io is not available', bai: '9.4' }, S);
