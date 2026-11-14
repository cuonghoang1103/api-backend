/**
 * sio-09-1 — Socket.IO · Chapter 9 · Lesson 9.1 "Why device.gateway.ts is 1,113 lines" (deck video + web, 14/11/2026).
 * Bài web: io-9-1-vi-sao. Output THẬT (scratchpad/sio/demo/n9-1.txt · lab ~/.rtq-sio/lab/c9 · device.gateway.ts CHÉP NGUYÊN TỪ KHO, Prisma giả):
 * kho: 668 / 306 / 1.113 dòng (web: 518 / 300 / 1.035); 1.113 = 668 mã + 356 chú thích + 89 trống; "Nói theo dòng" 264 + "Sending" 127 = tiếng nói.
 * fw: firmware dùng links2004/WebSockets 2.7.3 — thư viện ĐÓ có sẵn SocketIOclient (mặc định EIO=3) ⇒ "không có socket.io C++ client" SAI.
 * chay: bo mạch giả (giao thức main.cpp) ⇒ gateway kho ⇒ room maker:device:<id> ⇒ Live Console (socket.io) — trễ 0–2 ms; thiết bị của Bình An không thấy.
 * day: cùng tin telemetry: ws thô 58 B/tin = socket.io 58 B/tin (web: "overhead 60 %").
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-1:kho": "$ wc -l src/socket/messaging.socket.ts src/socket/notes-collaboration.gateway.ts src/socket/device.gateway.ts\n     668 src/socket/messaging.socket.ts\n     306 src/socket/notes-collaboration.gateway.ts\n    1113 src/socket/device.gateway.ts\n    2087 total\n$ node dem91.mjs src/socket/device.gateway.ts      # đếm theo từng mục \"// ─── …\" của chính tệp\nmục                                 dòng   mã   chú thích  trống\n(đầu tệp: mô tả giao thức + import)    67    10        55      2   (1-67)\nTunables                              14     6         7      1   (68-81)\nConnection registry                   42    21        18      3   (82-123)\nFan-out to the browser console (socket.io)    12     8         1      3   (124-135)\nSending to a device                  127    97        19     11   (136-262)\nNói theo dòng                        264   122       122     20   (263-526)\nDevice event handlers                226   155        49     22   (527-752)\nMessage router                        87    64        19      4   (753-839)\nAuth on upgrade                       87    48        31      8   (840-926)\nLifecycle                            187   137        35     15   (927-1113)\nTỔNG                                1113   668       356     89",
 "n9-1:fw": "$ grep -n \"WebSocketsClient ws\\|setExtraHeaders\\|setReconnectInterval\\|enableHeartbeat\" firmware/mini-me-robot/src/main.cpp\n54:static WebSocketsClient ws;\n1137:      ws.enableHeartbeat(15000, 3000, 2);\n1611:  ws.setExtraHeaders(\n1619:  ws.setReconnectInterval(WS_RECONNECT_BASE_MS);\n$ grep -n \"links2004/WebSockets\" firmware/mini-me-robot/platformio.ini\n77:    links2004/WebSockets@^2.6.1          ; plain RFC-6455 client → /device-ws\n$ ls .pio/libdeps/mini-me/WebSockets/src/ | grep -i socketio      # thư viện firmware ĐANG DÙNG\nSocketIOclient.cpp\nSocketIOclient.h\n$ grep -n \"void begin(const char\" .pio/libdeps/mini-me/WebSockets/src/SocketIOclient.h\n50:    void begin(const char * host, uint16_t port, const char * url = \"/socket.io/?EIO=3\", const char * protocol = \"ard",
 "n9-1:chay": "$ node bo.mjs 1 19910 3.2                       # bo mạch 1 (của An) nối, gửi hello + telemetry\n 0.14 s [bo 1] nối được sau 142 ms (lần thử 1)\n 0.14 s [bo 1] ↓ {\"t\":\"welcome\",\"deviceId\":1,\"serverTime\":1794608748440}\n$ node bo.mjs 2 19910 1.5                       # bo mạch 2 (của Bình)\n 0.08 s [bo 2] nối được sau 78 ms (lần thử 1)\n 0.08 s [bo 2] ↓ {\"t\":\"welcome\",\"deviceId\":2,\"serverTime\":1794608751651}\n$ # Live Console của An\n 0.02 s [An] nối socket.io · join maker:device:1, maker:device:2\n 0.70 s [An] ← maker:device:status {\"deviceId\":1,\"status\":\"ONLINE\",\"lastSeenAt\":\"2026-11-13T22:25:48.440Z\",\"batteryPct\":null}\n 0.71 s [An] ← maker:device:status {\"deviceId\":1,\"status\":\"ONLINE\",\"lastSeenAt\":\"2026-11-13T22:25:48.444Z\",\"firmwareVersion\":\n 1.71 s [An] ← maker:device:telemetry {\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":1,\"gui\":1794608749445},\"recordedA · trễ 1 ms\n 2.71 s [An] ← maker:device:telemetry {\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":2,\"gui\":1794608750447},\"recordedA · trễ 2 ms\n 3.71 s [An] ← maker:device:telemetry {\"deviceId\":1,\"payload\":{\"temp\":25.3,\"rssi\":-58,\"uptime\":3,\"gui\":1794608751449},\"recordedA · trễ 0 ms\n 3.77 s [An] ← maker:device:status {\"deviceId\":1,\"status\":\"OFFLINE\"}\n 6.00 s [An] tổng: {\"maker:device:status\":3,\"maker:device:telemetry\":3}\n$ # log server\n[logger.info] MakerLab device gateway listening on /device-ws\n[may9] :19910 · device.gateway.ts của kho trên /device-ws · socket.io có · 3 thiết bị\n[logger.info] MakerLab device connected {\"deviceId\":1,\"key\":\"mk_lab_1\"}\n[logger.info] MakerLab thiết bị khai báo định dạng âm thanh {\"deviceId\":1,\"format\":\"pcm\"}\n[logger.info] MakerLab device disconnected {\"deviceId\":1}\n[logger.info] MakerLab device connected {\"deviceId\":2,\"key\":\"mk_lab_2\"}\n[logger.info] MakerLab thiết bị khai báo định dạng âm thanh {\"deviceId\":2,\"format\":\"pcm\"}\n[logger.info] MakerLab device disconnected {\"deviceId\":2}",
 "n9-1:day": "$ node do91.mjs        # cùng 10 tin telemetry: ws thô tới gateway kho  vs  socket.io-client — đếm byte trên dây\nmột tin, phần JSON trong khung:\n  ws thô    {\"t\":\"telemetry\",\"temp\":25.3,\"rssi\":-58,\"uptime\":12}   52 B (+6 B đầu khung WS có mặt nạ)\n  socket.io 42[\"telemetry\",{\"temp\":25.3,\"rssi\":-58,\"uptime\":12}]   52 B (+6 B)\nđo trên dây (proxy TCP), 10 tin:\n  ws thô    bắt tay ↑285 ↓129 B (HTTP 101) · hello ↑50 B, welcome ↓57 B · 10 telemetry ↑580 B (58 B/tin) ↓0 B\n  socket.io bắt tay ↑280 ↓304 B (HTTP + gói 0 OPEN + 40 CONNECT) · 10 telemetry ↑580 B (58 B/tin) ↓0 B",
 "n9-1:ma": "$ sed -n '6,19p' src/socket/device.gateway.ts\n * The channel physical boards (ESP32 & friends) use to reach the\n * backend. Deliberately NOT socket.io:\n *\n *   1. Microcontroller WebSocket libraries (arduinoWebSockets,\n *      esp_websocket_client) speak plain RFC-6455. Socket.IO adds\n *      its own handshake/packet framing on top, which costs flash,\n *      RAM and debugging time on a device that has little of each.\n *   2. We stream raw audio both ways. Binary frames straight off\n *      the wire beat base64-in-JSON by ~33% bandwidth and a lot of\n *      CPU on a 240 MHz chip.\n *\n * Browsers keep using socket.io as everywhere else on the site;\n * this gateway fans every device event out to the room\n * `maker:device:<id>` so the Live Console updates in real time.\n$ sed -n '124,134p' src/socket/device.gateway.ts\n// ─── Fan-out to the browser console (socket.io) ────────────\n\nfunction room(deviceId: number): string {\n  return `maker:device:${deviceId}`;\n}\n\nfunction emitToConsole(deviceId: number, event: string, payload: unknown): void {\n  const io = getIO();\n  if (!io) return;\n  io.to(room(deviceId)).emit(event, payload);\n}"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, bars, tiers, path } from './_sio-chung.mjs';

export const deck = { key: 'sio-09-1', code: 'SIO 9.1', title: 'Why device.gateway.ts is 1,113 lines', sub: 'Chapter 9 · Lesson 9.1' };
const O = (k) => { const v = DU_LIEU[`n9-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHO = O('kho'), FW = O('fw'), CHAY = O('chay'), DAY = O('day');
const wc = (f) => Number(m(new RegExp(`(\\d+) src/socket/${f}`), KHO)[1]);
const L = { msg: wc('messaging.socket.ts'), notes: wc('notes-collaboration.gateway.ts'), dev: wc('device.gateway.ts') };
const MUC = [...KHO.matchAll(/^(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s+\((\d+)-(\d+)\)$/gm)].map((x) => ({ ten: x[1].trim(), dong: +x[2], ma: +x[3], cmt: +x[4], trong: +x[5], tu: +x[6], den: +x[7] }));
const TONG = m(/^TỔNG\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)$/m, KHO).slice(1).map(Number);
const muc = (p) => MUC.find((x) => x.ten.startsWith(p)) ?? (() => { throw new Error('thiếu mục ' + p); })();
const NOI = muc('Nói theo dòng'), GUI = muc('Sending'), FAN = muc('Fan-out'), XU = muc('Device event'), DT = muc('Message router'), AUTH = muc('Auth'), VONG = muc('Lifecycle');
const amThanh = NOI.dong + GUI.dong;
const B = [...DAY.matchAll(/10 telemetry ↑(\d+) B \((\d+) B\/tin\)/g)].map((x) => +x[2]);
const bt = [...DAY.matchAll(/bắt tay ↑(\d+) ↓(\d+) B/g)].map((x) => [+x[1], +x[2]]);
const treMax = Math.max(...[...CHAY.matchAll(/trễ (\d+) ms/g)].map((x) => +x[1]));
const ex = (txt, bo = [], n = 999) => txt.split('\n').filter((l) => !bo.some((r) => r.test(l))).map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.1', t: 'Why device.gateway.ts<br>is 1,113 lines', sub: 'Raw WebSocket for an ESP32 robot — counted line by line, and run for real.',
    en: 'Lesson nine point one: why the device gateway is one thousand one hundred and thirteen lines. We count it line by line and run it for real.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Where the 1,113 lines really go — counted by the file’s own sections</li>
    <li>How much of it socket.io would actually have saved (not “everything”)</li>
    <li>The repo’s gateway running: board → raw ws → socket.io room → Live Console</li>
    <li>Bytes on the wire: raw ws vs socket.io for the same telemetry</li>
    <li>The real reasons the repo chose raw ws — in its own words</li></ul>`,
    en: 'Five takeaways: where the lines really go; how much socket.io would have saved; the gateway running end to end; bytes on the wire; and the real reasons for raw ws.' },
  { t: 'Three socket files, measured today', body: bars([
      ['messaging.socket.ts (socket.io)', L.msg, '#0e7490', 'web: 518'], ['notes-collaboration.gateway.ts (Hocuspocus)', L.notes, '#7c3aed', 'web: 300'],
      ['device.gateway.ts (raw ws)', L.dev, '#e0590b', 'web: 1,035']], { don: '', rh: 70, nhan: 450, fs: 18 }) +
      two(box('Read it', `${c('wc -l')} on today’s repo: the device gateway is <b>${L.dev.toLocaleString('en-US')}</b> lines, ${(L.dev / L.msg).toFixed(1)}× the socket.io file. The web page’s numbers are from an older revision.`, 'info'),
        box('The real question', `Is it big <b>because</b> raw ws makes you rewrite everything socket.io does — reconnect, heartbeat, rooms, framing, auth? Count before you believe it.`, 'warn')),
    en: 'Measured today: the device gateway is one thousand one hundred and thirteen lines, about one point seven times the socket.io file. The page says it is big because raw ws makes you rewrite everything socket.io does. Let us count.' },
  { t: 'Where the 1,113 lines go', body: bars(MUC.map((x) => [x.ten.replace(' (socket.io)', '').replace('(đầu tệp: mô tả giao thức + import)', 'file header: protocol doc + imports').replace('Nói theo dòng', 'Streaming speech (“Nói theo dòng”)'), x.dong,
        /Nói|Sending/.test(x.ten) ? '#e0590b' : /Fan-out/.test(x.ten) ? '#1f8a3b' : '#0e7490', `${x.ma} code`]), { don: '', rh: 39, nhan: 400, fs: 17 }) +
      box('Read it', `${TONG[0].toLocaleString('en-US')} = <b>${TONG[1]} code</b> + <b>${TONG[2]} comment</b> + ${TONG[3]} blank. Audio (orange): <b>${amThanh}</b> lines, ${Math.round(amThanh / TONG[0] * 100)}%. Fan-out to socket.io (green): <b>${FAN.dong}</b>.`, 'ok'),
    en: 'Counted by the file’s own section headers. Six hundred and sixty-eight lines of code, three hundred and fifty-six of comments. The two audio sections are over a third of the file. The fan-out to socket.io is twelve lines.' },
  { t: 'What socket.io would really have saved', body: cmp(['Job', 'In device.gateway.ts', 'With socket.io'], [
      ['Reconnect', '<b>0 lines</b> — the board does it (firmware main.cpp:1619, one call)', 'client built-in — still the board’s job'],
      ['Heartbeat', `setInterval + alive flag + pong (1017–1032, 1083–1085) ≈ 19 lines`, 'pingInterval / pingTimeout — free'],
      ['Event routing', `JSON.parse + switch on ${c('t')} (${DT.tu}–${DT.den}) ≈ 70 lines`, 'one socket.on per event'],
      ['Room fan-out', `${FAN.dong} lines — <b>already socket.io</b>`, 'same'],
      ['Auth', `header/query/ticket + bcrypt (${AUTH.tu}–${AUTH.den}) ${AUTH.dong} lines`, 'io.use — the secret check stays'],
      ['Audio, TTS pacing, subtitles, commands, logs, telemetry', `${amThanh + XU.dong} lines`, '<b>exactly the same</b>'],
    ], { hl: [5] }) + box('Verdict', `Roughly <b>90 lines (~8%)</b> are protocol plumbing socket.io would have given for free. The rest is the robot’s own business — it would be there on any transport.`, 'bad'),
    en: 'What socket.io would really have saved: reconnect is zero lines on the server; heartbeat about nineteen; the event switch about seventy. Fan-out is already socket.io, and audio, commands and logs would be identical. About ninety lines, eight percent.' },
  { t: 'Measured: the repo’s gateway, end to end', body: tn(ex(CHAY, [/^\[logger\.info\] MakerLab thiết bị khai báo/, /^\$ # log server/, /^\[logger|^\[may9\]/, /"firmwareVe/], 108), { fs: 13, wrap: 120 }) +
      two(box('Read it', `A fake board (firmware protocol: key header, ${c('hello')}, telemetry 1 Hz) ⇒ the repo’s gateway ⇒ room ${c('maker:device:1')} ⇒ An’s console, <b>0–${treMax} ms</b> later.`, 'ok'),
        box('Notice', `An also joined ${c('maker:device:2')} (Binh’s board). ${c('messaging.socket.ts:546')} checks the owner and <b>silently</b> ignores it: nothing from board 2, no error.`, 'info')),
    en: 'The repo’s gateway end to end: a fake board speaking the firmware protocol, the gateway, the socket.io room, and the Live Console, a couple of milliseconds later. An also asked for Binh’s board and silently got nothing.' },
  { t: 'Bytes on the wire: raw ws vs socket.io', body: tn(DAY, { fs: 14, wrap: 118 }) + two(
      cmp(['', 'raw ws', 'socket.io'], [['one telemetry (JSON in the frame)', `${B[0] - 6} B`, `${B[1] - 6} B`], ['on the wire, per message', `<b>${B[0]} B</b>`, `<b>${B[1]} B</b>`], ['handshake, down', `${bt[0][1]} B`, `${bt[1][1]} B (once)`]], { hl: [1] }),
      box('Versus the web page', `“socket.io framing overhead … 60% is too much” — measured: <b>0 bytes</b> more per message. ${c('42["telemetry",{…}]')} just moves the type from a ${c('"t"')} field into the event name. The cost is a slightly bigger handshake, once per connection.`, 'bad'), 'r64'),
    en: 'Same ten telemetry messages through a byte-counting proxy: fifty-eight bytes per message on both paths. The page’s sixty percent overhead is not there; socket.io just moves the type field into the event name.' },
  { t: 'Does the ESP32 really have no socket.io client?', body: tn(ex(FW, [], 104), { fs: 15, wrap: 120 }) +
      two(box('Versus the web page', `“No socket.io C++ client.” The firmware’s <b>own</b> library ships ${c('SocketIOclient')} — default ${c('?EIO=3')}, the old protocol; socket.io 4 needs ${c('EIO=4')} (lesson 9.5).`, 'bad'),
        box('Firmware facts', `Plain ${c('WebSocketsClient')}, keys in headers, a <b>fixed</b> reconnect interval, library ping every 15 s. Lesson 9.2 measures that policy.`, 'info')),
    en: 'The firmware’s own library, links two thousand and four WebSockets, ships a socket.io client. Its default speaks the old protocol version three; socket.io four needs version four. So the reason is not “no client exists”.' },
  { t: 'The real reasons — in the repo’s own words', body: icards([
      ['cpu', 'Plain RFC 6455 on a small chip', '“Socket.IO adds its own handshake/packet framing … which costs flash, RAM and debugging time on a device that has little of each.”'],
      ['pulse', 'Raw audio both ways', '“Binary frames straight off the wire beat base64-in-JSON by ~33% bandwidth.” A socket.io binary event is two frames (placeholder + bytes, lesson 2.5).'],
      ['search', 'One protocol to debug', 'A serial log of JSON lines you can read; no engine.io handshake, no polling fallback that a board cannot use anyway.'],
      ['bolt', 'Browsers stay on socket.io', '“Browsers keep using socket.io … this gateway fans every device event out to the room maker:device:&lt;id&gt;.”'],
    ], 2),
    en: 'The real reasons, from the comment at the top of the file: plain WebSocket on a small chip; raw audio both ways as binary frames; one simple protocol to debug; and browsers stay on socket.io.' },
  { t: 'Three tiers, one bridge', body: path([{ t: 'ESP32 board', s: 'JSON + raw PCM' }, { t: 'device.gateway.ts', s: '/device-ws · raw ws', on: true }, { t: 'socket.io room', s: 'maker:device:<id>' }, { t: 'Live Console', s: 'browser · socket.io-client' }],
        { h: 190, fs: 21, nhan: ['raw ws', 'io.to()', 'emit'] }) +
      two(box('The bridge is small', `${c('emitToConsole()')} is <b>${FAN.dong - 2} lines</b>: ${c('io.to(`maker:device:${id}`).emit(event, payload)')}. Every device event — status, telemetry, log, transcript — goes through it.`, 'ok'),
        box('Versus the web page', `The page calls the room ${c('device:${id}')} and the auth “a POST for a token, then ?token=”. The repo: room ${c('maker:device:<id>')}; the board sends ${c('X-Device-Key')} / ${c('X-Device-Secret')} headers (query string still accepted for old firmware), bcrypt-checked.`, 'bad')),
    en: 'Three tiers and one bridge: the board on raw ws, the gateway, a socket.io room named maker device id, and the browser console. The bridge itself is ten lines.' },
  { t: 'Why not MQTT instead?', body: cmp(['', 'raw ws + socket.io bridge (this repo)', 'MQTT broker (Mosquitto, EMQX)'], [
      ['Built for', 'one backend talking to its own boards', 'many devices, topics, QoS levels, retained messages'],
      ['Extra infrastructure', 'none — same Node process, same port', 'a broker to run, secure and monitor'],
      ['Browser side', 'socket.io, already on the site', 'MQTT-over-WebSocket, a second layer'],
      ['Audio streaming', 'binary frames, paced by the server', 'possible, but not what brokers are tuned for'],
    ], { hl: [1] }) + box('Trade-off, not a rule', `At a handful of boards the repo needs no broker. With thousands of devices, fleet features (QoS, retained state, topic ACLs) start to pay for the broker. The page’s “~1000 devices” threshold is a rule of thumb, not something measured here.`, 'info'),
    en: 'Why not MQTT? It is the IoT standard with topics, QoS and retained messages, but it is a broker to run and a second layer for the browser. At a handful of boards the repo does not need it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Raw WebSocket', 'plain RFC 6455 frames, nothing on top'), kw('Device tier', 'ESP32 firmware with WebSocketsClient'),
      kw('Gateway', 'device.gateway.ts on /device-ws'), kw('Bridge', 'emitToConsole: raw ws event ⇒ socket.io room'),
      kw('Dashboard tier', 'the browser Live Console, plain socket.io'), kw('maker:device:&lt;id&gt;', 'the room a console joins'),
      kw('Protocol plumbing', 'heartbeat, routing — ~8% of the file'), kw('Count before you believe', 'wc -l + sections, not a claim'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: raw WebSocket; device tier; gateway; bridge; dashboard tier; the maker device room; protocol plumbing; and count before you believe.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Count device.gateway.ts by its own section headers (code vs comment)',
      'Mark each section: would socket.io have replaced it, or not?',
      'Run a fake board against the gateway and watch a console room receive it',
      'Send the same telemetry over raw ws and socket.io; count the bytes',
    ]), box('Keep these', `<ul><li>1,113 lines ≠ “rewrote socket.io”: ~8% is plumbing</li><li>Over a third is audio — the robot’s own job</li><li>Bridge = ${FAN.dong - 2} lines of io.to(room).emit</li><li>Same bytes per message on both paths</li><li>The library has a socket.io client; raw ws is a choice</li></ul>`, 'info'), ''),
    en: 'Your turn: count the file by its sections, mark what socket.io would replace, run a fake board through the gateway, and compare the bytes.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Raw WebSocket: when socket.io is not available', bai: '9.1' }, S);
