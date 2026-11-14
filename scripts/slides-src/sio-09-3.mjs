/**
 * sio-09-3 — Socket.IO · Chapter 9 · Lesson 9.3 "Message framing: JSON is not free" (deck video + web, 14/11/2026).
 * Bài web: io-9-3-framing. Output THẬT (scratchpad/sio/demo/n9-3.txt · lab ~/.rtq-sio/lab/c9 · Node 22.23.3 trên Mac — KHÔNG đo trên ESP32):
 * kho: firmware gửi telemetry JSON 1 Hz (main.cpp:489, ~14 trường) + tiếng PCM NHỊ PHÂN khối 2 KB (main.cpp:578); server JSON.parse lỗi ⇒ BỎ QUA (không đóng 1002).
 * khung: cùng gói telemetry 5 cách mã (JSON · MessagePack · CBOR · Protobuf · tự gói) — byte, µs, MB/ngày.
 * day: 1 giây tiếng: ws thô · socket.io nhị phân · socket.io base64.  gay: khung hỏng · 300 KB > maxPayload · lượt nghe > 30 s.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-3:kho": "$ grep -n \"static void sendTelemetry\\|StaticJsonDocument<256>\\|ws.sendTXT(out)\\|static uint8_t upBuf\\|ws.sendBIN\" firmware/mini-me-robot/src/main.cpp\n461:  StaticJsonDocument<256> doc;\n476:  ws.sendTXT(out);\n480:  StaticJsonDocument<256> doc;\n486:  ws.sendTXT(out);\n489:static void sendTelemetry() {\n490:  StaticJsonDocument<256> doc;\n556:  ws.sendTXT(out);\n567:  ws.sendTXT(out);\n578:static uint8_t upBuf[2048];\n589:  if (st.wsUp) ws.sendBIN(upBuf, upLen);\n$ sed -n '489,560p' firmware/mini-me-robot/src/main.cpp | grep -o 'doc\\[\"[a-zA-Z]*\"\\]' | tr '\\n' ' '     # các trường telemetry\ndoc[\"t\"] doc[\"rssi\"] doc[\"uptime\"] doc[\"heapKb\"] doc[\"psramKb\"] doc[\"micLevel\"] doc[\"turns\"] doc[\"hutDem\"] doc[\"hutMs\"] doc[\"roiByte\"] doc[\"ssid\"] doc[\"pingMs\"] doc[\"battery\"] doc[\"batV\"] \n$ sed -n '770,775p;73,80p' src/socket/device.gateway.ts\n/** 16-bit mono @16 kHz = 32 KB/s. 30s cap keeps one rogue device from eating RAM. */\nconst MAX_AUDIO_BYTES = 32_000 * 30;\n/** Telemetry arrives ~1 Hz; persisting every row would be 86k/day/device. */\nconst TELEMETRY_PERSIST_MS = 10_000;\n/** Keep the device log table from growing without bound. */\nconst LOG_RING_SIZE = 1000;\n/** One board, one socket. A reconnect kicks the stale one. */\nconst MAX_FRAME_BYTES = 256 * 1024;\n  let msg: Record<string, unknown>;\n  try {\n    msg = JSON.parse(raw.toString());\n  } catch {\n    return; // malformed frame: ignore, don't kill the link\n  }",
 "n9-3:day": "$ node do93.mjs      # 1 giây tiếng nói, khối 2 KB như firmware — ba đường, proxy đếm byte\n1 giây tiếng = 32.000 B PCM · 16 khối 2048 B (+ khung bắt đầu/kết thúc)\n  ws thô (kho): sendBIN               32.176 B trên dây · 18 khung · +0.6%\n  socket.io: emit('audio', Buffer)    32.956 B trên dây · 34 khung · +3.0%\n  socket.io: JSON base64              43.212 B trên dây · 18 khung · +35.0%",
 "n9-3:gay": "$ node gay93.mjs     # gateway KHO: khung hỏng · khung 300 KB · lượt nghe > 30 s\n1) khung chữ không phải JSON, rồi một tin hợp lệ:\n  388 ms   kết nối: VẪN MỞ\n2) một khung nhị phân 300.000 B (maxPayload = 256 KB):\n  392 ms   ✕ đóng 1009 \n3) một lượt nghe: 470 khối 2.048 B = 962.560 B (> 30 s tiếng = 960.000 B):\n  885 ms   ↓ {\"t\":\"error\",\"scope\":\"audio\",\"msg\":\"turn too long, buffer reset\"}\n 1386 ms   kết nối: VẪN MỞ",
 "n9-3:khung": "$ node khung93.mjs\nmột gói = 13 trường của firmware · đo 200.000 lần mã + giải\ncách             byte  ×JSON   mã+giải/gói   MB/ngày (1 Hz)  đọc bằng mắt\nJSON              186   1.00      2.17 µs        16.59       có\nMessagePack       138   0.74      4.30 µs        12.44       không\nCBOR              143   0.77      2.54 µs        12.87       không\nProtobuf           41   0.22      1.70 µs         4.06       không\ntự gói (struct)    40   0.22      1.19 µs         3.97       không\n(MB/ngày tính cả 6 B đầu khung WS có mặt nạ; chưa tính TCP/IP ~52 B mỗi gói nếu mỗi tin đi một gói riêng)\nhex tự gói: c3 9e 0e 00 00 76 00 a3 1e 38 01 0e 00 00 00 00 00 00 00 00 00 00 00 2a 00 57 3d 0a 3f 41 09 4e 68 61 2d 43 75 6f 6e 67"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, tsx, icards, bars } from './_sio-chung.mjs';

export const deck = { key: 'sio-09-3', code: 'SIO 9.3', title: 'Message framing: JSON is not free', sub: 'Chapter 9 · Lesson 9.3' };
const O = (k) => { const v = DU_LIEU[`n9-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHO = O('kho'), KHUNG = O('khung'), DAY = O('day'), GAY = O('gay');
const ex = (txt, bo = [], n = 999) => txt.split('\n').filter((l) => !bo.some((r) => r.test(l))).map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
const CACH = [...KHUNG.matchAll(/^(JSON|MessagePack|CBOR|Protobuf|tự gói \(struct\))\s+(\d+)\s+([\d.]+)\s+([\d.]+) µs\s+([\d.]+)/gm)].map((x) => ({ ten: x[1].replace('tự gói (struct)', 'custom struct'), b: +x[2], ti: +x[3], us: +x[4], mb: +x[5] }));
const J = CACH[0], P = CACH.find((x) => x.ten === 'Protobuf'), T = CACH.at(-1);
const AU = [...DAY.matchAll(/^\s+(.+?)\s{2,}([\d.]+) B trên dây · \s*(\d+) khung · \+([\d.]+)%/gm)].map((x) => ({ ten: x[1], b: Number(x[2].replace(/\./g, '')), k: +x[3], pt: +x[4] }));
const HEX = m(/hex tự gói: (.+)$/m, KHUNG)[1];

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.3', t: 'Message framing:<br>JSON is not free', sub: 'The robot’s real telemetry, five encodings, one second of audio — measured byte by byte.',
    en: 'Lesson nine point three: message framing, and why JSON is not free. The robot’s real telemetry in five encodings, and one second of audio, byte by byte.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What this repo actually puts on the wire: JSON text and binary audio</li>
    <li>One telemetry packet, five encodings: bytes, CPU, MB per day</li>
    <li>Audio: raw binary vs socket.io binary vs base64-in-JSON</li>
    <li>What the gateway does with a bad frame, a huge frame, a too-long turn</li>
    <li>A frequency threshold you can defend — and when not to switch</li></ul>`,
    en: 'Five takeaways: what the repo puts on the wire; one packet in five encodings; audio three ways; how the gateway handles bad and huge frames; and a threshold you can defend.' },
  { t: 'What the repo really sends', body: tn(ex(KHO, [/^4[68]\d:|^567:|^\/\*\* (Keep|One board|Telemetry)|^const (LOG_RING|MAX_FRAME|TELEMETRY)|^  let msg|^  try|^  \}/], 108), { fs: 14, wrap: 120 }) +
      two(box('Two streams, two framings', `<b>Telemetry</b>: 1 JSON text frame/s, 13 fields + ${c('t')}. <b>Voice</b>: raw PCM in <b>binary</b> 2 KB frames, ~16/s. The high-frequency stream is already binary.`, 'ok'),
        box('Versus the web page', `“invalid JSON ⇒ ${c('ws.close(1002)')}”. The repo <b>ignores</b> it — “don’t kill the link” (${c('device.gateway.ts:774')}).`, 'bad')),
    en: 'What the repo sends: telemetry as one JSON text frame per second, and voice as raw binary frames of two kilobytes, about sixteen per second. A bad JSON frame is ignored, not closed with ten oh two.' },
  { t: 'One telemetry packet, five encodings', body: tn(ex(KHUNG, [/^hex/], 112), { fs: 14, wrap: 120 }) +
      two(bars(CACH.map((x) => [x.ten, x.b, x.ten === 'JSON' ? '#e0590b' : '#0e7490', `${x.ti}× JSON`]), { don: 'B', rh: 44, nhan: 200, fs: 18, w: 640 }),
        box('Read it', `The real packet is <b>${J.b} B</b> of JSON. Protobuf ${P.b} B, a hand-packed struct ${T.b} B (${(J.b / T.b).toFixed(1)}× smaller). On the Mac every encoding costs a few <b>microseconds</b>. The page’s ESP32 parse times (5 ms / 2 ms / 0.1 ms) were not measured here.`, 'info'), 'r64'),
    en: 'The real telemetry packet is a couple of hundred bytes of JSON. Protobuf and a hand-packed struct are several times smaller, and on the Mac every encoding takes only microseconds.' },
  { t: 'What “smaller” is worth per day', body: cmp(['encoding', 'bytes/packet', 'MB/day at 1 Hz', 'readable in a log'], CACH.map((x) => [x.ten, `${x.b} B`, `${x.mb} MB`, x.ten === 'JSON' ? '<b>yes</b>' : 'needs a decoder']), { hl: [0] }) +
      two(box('Put it in proportion', `1 Hz JSON: <b>${J.mb} MB/day</b> per board. One second of the robot listening is 32,000 B of audio — so ${Math.round(J.mb * 1e6 / 32000)} s of speech already equals a whole day of JSON telemetry.`, 'ok'),
        box('And the database', `The gateway fans telemetry out live but <b>persists one row per 10 s</b> (${c('TELEMETRY_PERSIST_MS')}): 8,640 rows/day, not 86,400. The page’s “86,400 msg/day” is the wire, not the table.`, 'info')),
    en: 'Per day: JSON telemetry at one hertz is about sixteen megabytes per board, the same as nine minutes of the robot listening. And the gateway stores one telemetry row every ten seconds, not every message.' },
  { t: 'Binary loses the human reader', body: two(tsx(`// what you see in a log — JSON
{"t":"telemetry","rssi":-61,"uptime":3742,"heapKb":118,…}

// the same packet, hand-packed (${T.b} B)
${HEX.split(' ').slice(0, 14).join(' ')}
${HEX.split(' ').slice(14, 28).join(' ')}
${HEX.split(' ').slice(28).join(' ')}`, { fs: 18 }),
      box('The real cost of binary', `Change one field and every reader breaks unless you version the layout. A serial log, ${c('wscat')}, the browser’s Network tab — all show JSON as text; binary needs a decoder at each place you look. In this repo the firmware author chose JSON telemetry <b>on purpose</b>, to read it on the serial port.`, 'warn'), 'r64') + cmp(['where you look', 'JSON frame', 'packed binary frame'], [['board serial log', 'readable line', 'hex dump'], ['browser DevTools → Network → WS', 'text, searchable', '“Binary Message”, N bytes'], ['a 1-line Node test client', 'JSON.parse', 'a decoder that matches the layout version']], { hl: [0] }),
    en: 'Binary loses the human reader. JSON shows up readable in every log and in the browser; a packed struct is hex that needs a decoder everywhere, and a version plan.' },
  { t: 'Audio: one second, three ways', body: tn(DAY, { fs: 15, wrap: 120 }) +
      two(bars(AU.map((x) => [/base64/.test(x.ten) ? 'socket.io · base64 JSON' : /thô/.test(x.ten) ? 'raw ws (repo) · binary' : 'socket.io · binary event', x.b, /base64/.test(x.ten) ? '#c0392b' : /thô/.test(x.ten) ? '#1f8a3b' : '#0e7490', `+${x.pt}%`]), { don: 'B', rh: 52, nhan: 300, fs: 17, w: 640 }),
        box('Read it', `Raw binary frames: +${AU[0].pt}% (frame headers). socket.io binary: +${AU[1].pt}% — but <b>${AU[1].k} frames</b> instead of ${AU[0].k} (a placeholder text frame before every chunk, lesson 2.5). base64 in JSON: <b>+${AU[2].pt}%</b>. The repo’s “~33%” is the base64 line.`, 'ok'), 'r64'),
    en: 'One second of audio three ways: raw binary frames add a percent or two; socket.io binary adds a little more but doubles the frame count; base64 in JSON adds a third. That third is the repo’s thirty-three percent.' },
  { t: 'Measured: pushing the gateway’s limits', body: tn(GAY, { fs: 15, wrap: 120 }) +
      two(box('Read it', `A non-JSON frame is <b>ignored</b>, the link stays open. A 300 KB frame exceeds ${c('maxPayload')} (256 KB): ws closes the socket with <b>1009</b>. A turn longer than 30 s of audio (${c('MAX_AUDIO_BYTES')}) gets a JSON ${c('error')} and the buffer is reset — the connection survives.`, 'ok'),
        box('Why these choices', `Ignore garbage, so a flaky board is not disconnected for one bad frame; cap one frame and one turn, so “one rogue device” cannot eat the server’s RAM (comment at line 73).`, 'info')),
    en: 'Pushing the gateway: a non-JSON frame is ignored and the link stays open; a frame over the 256 kilobyte max payload closes with ten oh nine; a turn longer than thirty seconds gets an error and a reset buffer.' },
  { t: 'A threshold you can defend', body: cmp(['Rate per device', 'Format', 'Why'], [
      ['&lt; 1 msg/s (telemetry, logs, commands)', '<b>JSON</b>', 'readable everywhere; bytes are negligible'],
      ['1–10 msg/s, structured', 'MessagePack / CBOR', 'drop-in for JSON objects, ~25% smaller here'],
      ['&gt; 10 msg/s or large numeric arrays', 'Protobuf / custom binary', 'needs a schema and a version field'],
      ['A media stream (audio, video, files)', '<b>raw binary frames</b>', 'never base64 — +33%, and CPU on both ends'],
    ], { hl: [0, 3] }) + box('This repo is exactly this table', `JSON for 1 Hz telemetry, raw binary for 16 frames/s of voice. The page’s thresholds are a reasonable rule of thumb; only the byte counts above were measured.`, 'ok'),
    en: 'A threshold you can defend: JSON below one message per second, MessagePack or CBOR for structured traffic up to ten per second, a schema format above that, and raw binary for any media stream. The repo follows exactly this.' },
  { t: 'The schema trap', body: icards([
      ['type', 'v1 board, v2 server', 'A board in the field still sends layout v1 after the server ships v2. With JSON a missing field is undefined; with a packed struct every byte after it is wrong.'],
      ['flag', 'Put a version first', 'One leading byte (or a Protobuf field number you never reuse) lets the server read old and new boards side by side.'],
      ['shield', 'Validate, then trust', 'The repo reads only fields it knows, with types: typeof msg.battery === "number", clampPct(…). Do the same for any format.'],
      ['power', 'Boards update late', 'OTA is not instant; some boards run old firmware for months. The repo still accepts the query-string key for exactly that reason.'],
    ], 2),
    en: 'The schema trap: boards in the field keep old layouts for months. Put a version first, read only known fields with types, and keep old formats working until every board has updated.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Framing', 'how one message is laid out on the wire'), kw('Text frame', 'opcode 1 — JSON here'), kw('Binary frame', 'opcode 2 — raw PCM here'),
      kw('MessagePack / CBOR', 'binary JSON-like objects'), kw('Protobuf', 'schema + field numbers'), kw('Custom struct', 'smallest, most fragile'),
      kw('maxPayload', 'per-frame cap ⇒ close 1009'), kw('base64 tax', '+33% for media in JSON'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: framing; text frame; binary frame; MessagePack and CBOR; Protobuf; custom struct; max payload; and the base64 tax.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Encode the firmware’s telemetry five ways; compare bytes and µs',
      'Send one second of PCM raw, as socket.io binary, and as base64',
      'Send the gateway a bad frame, a 300 KB frame, a 31 s turn',
      'Write down which format you would use at 1, 10 and 100 msg/s',
    ]), box('Keep these', `<ul><li>Telemetry JSON: ~${J.b} B, readable, cheap at 1 Hz</li><li>Media: binary frames, never base64</li><li>Bad frame ⇒ ignore; huge frame ⇒ 1009</li><li>Binary needs a version byte</li><li>Measure on the real device before optimising</li></ul>`, 'info'), ''),
    en: 'Your turn: encode the telemetry five ways, send audio three ways, poke the gateway’s limits, and write down your thresholds.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Raw WebSocket: when socket.io is not available', bai: '9.3' }, S);
