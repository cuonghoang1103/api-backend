/**
 * sio-09-2 — Socket.IO · Chapter 9 · Lesson 9.2 "Manual reconnect logic" (deck video + web, 14/11/2026).
 * Bài web: io-9-2-reconnect. Output THẬT (scratchpad/sio/demo/n9-2.txt · lab ~/.rtq-sio/lab/c9 · device.gateway.ts CHÉP NGUYÊN TỪ KHO, bcryptjs 2.4.3 cost 10 như kho):
 * kho: firmware setReconnectInterval(3000) CỐ ĐỊNH; WS_RECONNECT_MAX_MS / HEARTBEAT_TIMEOUT_MS khai mà 0 chỗ dùng; thư viện chờ bắt tay 5 s; server kiểm bí mật bằng bcrypt.
 * bao: "điện lại" N bo cùng khởi động vào gateway kho: 100 cố định · 300 cố định (không hội tụ) · 300 lùi dần + rải · server sha256 1.000 bo.
 * tim: nhịp tim server 30 s + cờ alive: bo đóng băng ⇒ server cắt sau một lượt ping hụt.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-2:kho": "$ grep -n \"WS_RECONNECT\\|HEARTBEAT_TIMEOUT\" firmware/mini-me-robot/src/config.h\n433:#define WS_RECONNECT_BASE_MS 3000\n434:#define WS_RECONNECT_MAX_MS  30000\n436:#define HEARTBEAT_TIMEOUT_MS  90000  // 3 lần ping của server bị lỡ\n$ grep -rn \"WS_RECONNECT_MAX_MS\\|HEARTBEAT_TIMEOUT_MS\" firmware/mini-me-robot/src/ | grep -v \"config.h\" | wc -l     # chỗ DÙNG hai hằng số này\n       0\n$ sed -n '243,247p' .pio/libdeps/mini-me/WebSockets/src/WebSocketsClient.cpp     # vòng loop() của thư viện\n    if(!clientIsConnected(&_client)) {\n        // do not flood the server\n        if((millis() - _lastConnectionFail) < _reconnectInterval) {\n            return;\n        }\n$ grep -n \"WEBSOCKETS_TCP_TIMEOUT (\" .pio/libdeps/mini-me/WebSockets/src/WebSockets.h     # hạn chờ bắt tay\n125:#define WEBSOCKETS_TCP_TIMEOUT (5000)\n$ grep -n \"randomBytes(24)\\|secretHash = await bcrypt.hash\\|bcrypt.compare(secret, device\" src/services/makerlab/makerLab.service.ts src/socket/device.gateway.ts\nsrc/services/makerlab/makerLab.service.ts:115:  const secret = randomBytes(24).toString('base64url');\nsrc/services/makerlab/makerLab.service.ts:116:  const secretHash = await bcrypt.hash(secret, 10);\nsrc/services/makerlab/makerLab.service.ts:134:  const secret = randomBytes(24).toString('base64url');\nsrc/services/makerlab/makerLab.service.ts:135:  const secretHash = await bcrypt.hash(secret, 10);\nsrc/socket/device.gateway.ts:916:  const ok = await bcrypt.compare(secret, device.secretHash);",
 "n9-2:bao": "$ node bao.mjs 100 co-dinh        # \"điện lại\": 100 bo cùng khởi động · gateway KHO · nối lại cố định 3 s như firmware\nN=100 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho)\n    0 s  thử  100  nối    1  lỗi    0\n    5 s  thử    0  nối    0  lỗi   99\n    8 s  thử   99  nối    1  lỗi    0\n   11 s  thử    0  nối   51  lỗi    1\n   12 s  thử    0  nối   13  lỗi    0\n   13 s  thử    0  nối    1  lỗi   32\n   14 s  thử    1  nối    0  lỗi    0\n   15 s  thử    0  nối    1  lỗi    0\n   16 s  thử   32  nối    1  lỗi    0\n   18 s  thử    0  nối   31  lỗi    0\n⇒ ĐỦ 100/100 online sau 18.4 s · 232 lần thử · lỗi: {\"Opening handshake has timed out @5s\":131,\"ECONNRESET @4s\":1} · CPU server 0:17.29 · log warn/error 0 · event loop đứng tối đa 7216 ms\n$ node bao.mjs 300 co-dinh        # 300 bo, cùng chính sách\nN=300 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho)\n    0 s  thử  300  nối    1  lỗi    0\n    5 s  thử    0  nối    0  lỗi  299\n    8 s  thử  299  nối    0  lỗi  233\n   11 s  thử  233  nối    0  lỗi  233\n   13 s  thử    0  nối    0  lỗi   66\n   14 s  thử  233  nối    0  lỗi  233\n   16 s  thử   66  nối    0  lỗi   66\n  … (106 dòng)\n  125 s  thử  143  nối    0  lỗi  141\n  126 s  thử   71  nối    0  lỗi   72\n  127 s  thử   18  nối    0  lỗi   18\n  128 s  thử  141  nối    0  lỗi  141\n  129 s  thử   72  nối    0  lỗi   71\n⇒ sau 120 s mới 1/300 online · 10279 lần thử · lỗi: {\"Opening handshake has timed out @5s\":1664,\"ECONNRESET @0s\":8456,\"EPIPE @0s\":89} · CPU server 1:58.42 · log warn/error 1 · event loop đứng tối đa 17740 ms\n$ RAI=10 node bao.mjs 300 mu      # 300 bo: khởi động rải 0–10 s + lùi dần 1→30 s ±20 %\nN=300 · nối lại LÙI DẦN 1→30 s ±20 % · socket.io có (như kho) · khởi động rải 0–10 s\n    0 s  thử   29  nối   12  lỗi    0\n    1 s  thử   30  nối   14  lỗi    0\n    2 s  thử   40  nối   13  lỗi    0\n    3 s  thử   35  nối   12  lỗi    0\n    4 s  thử   30  nối   14  lỗi    0\n    5 s  thử   25  nối   14  lỗi    0\n    6 s  thử   30  nối   13  lỗi    0\n  … (70 dòng)\n   80 s  thử    4  nối    4  lỗi    0\n   81 s  thử    2  nối    2  lỗi    0\n   82 s  thử    1  nối    1  lỗi    0\n   83 s  thử    1  nối    1  lỗi    0\n   84 s  thử    2  nối    2  lỗi    0\n⇒ ĐỦ 300/300 online sau 84.2 s · 1285 lần thử · lỗi: {\"ECONNRESET @0s\":249,\"EPIPE @0s\":174,\"Opening handshake has timed out @5s\":562} · CPU server 1:03.24 · log warn/error 0 · event loop đứng tối đa 225 ms\n$ SUA=1 node bao.mjs 1000 co-dinh # server sửa ĐÚNG MỘT dòng: bcrypt.compare ⇒ sha256 (bí mật là 24 byte ngẫu nhiên)\nN=1000 · nối lại CỐ ĐỊNH 3 s (như firmware) · socket.io có (như kho) · server SỬA: sha256 thay bcrypt\n    0 s  thử 1000  nối  817  lỗi  183\n    3 s  thử  183  nối  183  lỗi    0\n⇒ ĐỦ 1000/1000 online sau 3.2 s · 1183 lần thử · lỗi: {\"ECONNRESET @0s\":183} · CPU server 0:00.85 · log warn/error 0 · event loop đứng tối đa 21 ms",
 "n9-2:tim": "$ sed -n '71,72p;1017,1031p' ~/api-backend/src/socket/device.gateway.ts\n/** Heartbeat: ping every 30s, drop a device that misses two. */\nconst HEARTBEAT_MS = 30_000;\n  heartbeat = setInterval(() => {\n    for (const conn of connections.values()) {\n      if (!conn.alive) {\n        conn.ws.terminate();\n        continue;\n      }\n      conn.alive = false;\n      sendJson(conn, { t: 'ping' });\n      try {\n        conn.ws.ping();\n      } catch {\n        /* socket already gone */\n      }\n    }\n  }, HEARTBEAT_MS);\n$ node tim92.mjs       # gateway KHO + proxy đọc từng khung · bo trả ping rồi bị kill -STOP\n  3.1 s [server] MakerLab device connected {\"deviceId\":1,\"key\":\"mk_lab_1\"}\n  3.1 s [bo 1] nối được (TELE=0: không telemetry, chỉ trả ping)\n 30.4 s   ↓ server→bo  14 B  chữ {\"t\":\"ping\"}\n 30.4 s   ↓ server→bo   2 B  PING (khung WS)\n 30.4 s   ↑ bo→server  18 B  chữ {\"t\":\"pong\"}\n 30.4 s   ↑ bo→server   6 B  PONG (khung WS)\n 34.5 s [lab] kill -STOP bo 1 — tiến trình treo, TCP vẫn mở, không ai trả ping\n 60.4 s   ↓ server→bo  14 B  chữ {\"t\":\"ping\"}\n 60.4 s   ↓ server→bo   2 B  PING (khung WS)\n 90.4 s [server] MakerLab device disconnected {\"deviceId\":1}\n 90.4 s [console An] thiết bị 1 OFFLINE — 55.9 s sau khi bo đóng băng"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, tsx, icards, bars, seq } from './_sio-chung.mjs';

export const deck = { key: 'sio-09-2', code: 'SIO 9.2', title: 'Manual reconnect logic — and the storm', sub: 'Chapter 9 · Lesson 9.2' };
const O = (k) => { const v = DU_LIEU[`n9-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHO = O('kho'), BAO = O('bao'), TIM = O('tim');
const ex = (txt, bo = [], n = 999) => txt.split('\n').filter((l) => !bo.some((r) => r.test(l))).map((l) => (l.length > n ? l.slice(0, n - 1) + '…' : l)).join('\n');
// mỗi lượt bão: dòng kết quả "⇒ …"
const LUOT = BAO.split(/^\$ /m).slice(1).map((k) => {
  const kq = m(/^⇒ (.+)$/m, k)[1];
  const du = /ĐỦ (\d+)\/(\d+) online sau ([\d.]+) s/.exec(kq), thieu = /sau (\d+) s mới (\d+)\/(\d+) online/.exec(kq);
  return { lenh: k.split('\n')[0], kq, n: Number(du?.[2] ?? thieu?.[3]), xong: du ? Number(du[3]) : null, online: Number(du?.[1] ?? thieu?.[2]), tran: thieu ? Number(thieu[1]) : null,
    thu: Number(m(/(\d+) lần thử/, kq)[1]), dung: Number(m(/event loop đứng tối đa (\d+) ms/, kq)[1]), cpu: m(/CPU server ([\d:.]+)/, kq)[1] };
});
const [L100, L300, LMU, LSUA] = LUOT;
const kq = (x) => (x.xong != null ? `${x.n}/${x.n} in ${x.xong} s` : `${x.online}/${x.n} after ${x.tran} s`);
const giay = (ms) => (ms / 1000).toFixed(1);
const gon = (txt, giu = 3) => txt.split(/^(?=\$ )/m).map((k) => { const L = k.replace(/\n$/, '').split('\n'); const kq = L.findIndex((l) => l.startsWith('⇒')); return [...L.slice(0, Math.min(giu + 2, kq)), ...(kq > giu + 2 ? ['   …'] : []), ...L.slice(kq)].join('\n'); }).join('\n');
const tomBao = (k) => BAO.split(/^\$ /m).slice(1).filter((x) => k.test(x.split('\n')[0])).map((x) => '$ ' + x.replace(/\n$/, '')).join('\n');
const tOff = Number(m(/OFFLINE — ([\d.]+) s sau khi bo đóng băng/, TIM)[1]);
const khung = [...TIM.matchAll(/(↓ server→bo|↑ bo→server)\s+(\d+) B\s+(.+)$/gm)].map((x) => ({ h: x[1], b: +x[2], ten: x[3] }));
const bJ = khung.find((k) => /"ping"/.test(k.ten))?.b, bW = khung.find((k) => /PING \(khung WS\)/.test(k.ten))?.b, bJp = khung.find((k) => /"pong"/.test(k.ten))?.b, bWp = khung.find((k) => /PONG \(khung WS\)/.test(k.ten))?.b;

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.2', t: 'Manual reconnect logic<br>— and the storm', sub: 'What the robot’s firmware really does, and what 300 boards do to the repo’s gateway. Measured.',
    en: 'Lesson nine point two: manual reconnect logic, and the reconnect storm. What the firmware really does, and what three hundred boards do to the gateway.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Who reconnects on raw ws — and what this repo’s firmware actually does</li>
    <li>A real reconnect storm against the repo’s gateway: 100, 300 and 1,000 boards</li>
    <li>Why it never converged — the cost is on the server, not the wire</li>
    <li>Backoff, jitter and a boot spread — measured, not assumed</li>
    <li>Heartbeat: how long a frozen board stays “online”</li></ul>`,
    en: 'Five takeaways: who reconnects; a real storm against the gateway; why it never converged; backoff and jitter measured; and how long a frozen board stays online.' },
  { t: 'On raw ws, reconnect is the board’s job', body: tn(ex(KHO, [/randomBytes|bcrypt|secretHash|makerLab\.service|device\.gateway\.ts:9/], 104), { fs: 14, wrap: 120 }) +
      two(box('Read it', `${c('setReconnectInterval(3000)')}: a <b>fixed 3 s</b>. MAX 30 s and HEARTBEAT 90 s are declared, used <b>0 times</b>. A handshake is abandoned after <b>5 s</b>.`, 'info'),
        box('Versus the web page', `“This repo: exponential + jitter ±20%.” Measured: <b>no backoff, no jitter</b> — every board retries every 3 s, forever.`, 'bad')),
    en: 'On raw ws the board reconnects. The firmware sets a fixed three-second interval; the max-delay and heartbeat constants are declared and never used. The page says exponential with jitter; there is none.' },
  { t: 'The experiment: “the power comes back”', body: two(steps([
      'Run the repo’s device.gateway.ts (copied verbatim) + socket.io, fake DB in RAM',
      'Device secrets bcrypt-hashed with cost 10 — exactly like makerLab.service.ts:116',
      'Start N fake boards at the same instant (all lose power, all boot together)',
      'Each board: 5 s handshake timeout + its reconnect policy; count per second',
      'Stop when all N are online — or give up after the time limit',
    ]), box('Why it is realistic', `Same server code path: header auth ⇒ ${c('prisma.makerDevice.findUnique')} ⇒ ${c('bcrypt.compare')} ⇒ ${c('handleUpgrade')}. Same client rules as ${c('arduinoWebSockets')} 2.7.3: fixed interval, 5 s ${c('WEBSOCKETS_TCP_TIMEOUT')}. The only fake part is the database (in RAM, so it is <b>faster</b> than production).`, 'info'), ''),
    en: 'The experiment: the repo’s gateway with a fake in-memory database and real bcrypt cost ten; N fake boards boot at the same instant with the library’s rules. Count every second until all are online.' },
  { t: 'Measured: 100 and 300 boards, fixed 3 s', body: tn(ex(gon(tomBao(/^node bao\.mjs (100|300) co-dinh/), 4), [], 108), { fs: 13, wrap: 120 }) +
      box('Read it', `100 boards: all time out at 5 s, retry together at 8 s, trickle in — online after <b>${L100.xong} s</b>. 300 boards: <b>${L300.online}/${L300.n} online after ${L300.tran} s</b>, ${L300.thu.toLocaleString('en-US')} attempts, the server’s event loop frozen up to <b>${giay(L300.dung)} s</b>. It never converges.`, 'bad'),
    en: 'One hundred boards: all time out at five seconds, retry together, and are online after about eighteen seconds. Three hundred boards: after two minutes, one is online, nearly ten thousand attempts, and the event loop frozen for over twenty seconds.' },
  { t: 'Why it never converges', body: seq(['300 boards', 'Node event loop', 'bcrypt (cost 10)'], [
        [0, 1, '300 upgrades in the same second'], [1, 2, 'each compare ≈ 75 ms of CPU, run in ONE setImmediate turn', '#c0392b'],
        [2, 1, '300 × 75 ms ≈ 22 s with nothing else running', '#c0392b'], [0, 0, '5 s handshake timeout ⇒ every board gives up', '#e0590b'],
        [0, 1, '3 s later: all retry together — the server is still busy', '#e0590b'], [1, 0, 'a 101 finally sent ⇒ socket already closed (EPIPE / ECONNRESET)', '#64748b']], { w: 1110, rh: 42, fs: 16 }) +
      two(box('The real cost', `One compare (~75 ms) fits in one bcryptjs chunk, so N queued compares run back to back — and <b>nothing</b> else runs: chat, pings, HTTP API.`, 'bad'),
        box('So the loop is', `give up at 5 s ⇒ retry in sync ⇒ the server still chews abandoned work. A fixed interval keeps the herd <b>synchronised</b>.`, 'warn')),
    en: 'Why: each bcrypt compare is about seventy-five milliseconds of CPU, and three hundred of them run back to back while nothing else in the process runs. Boards give up after five seconds and retry together, so the server keeps chewing abandoned work.' },
  { t: 'Two fixes, measured', body: tn(ex(gon(tomBao(/mu|SUA/), 2), [/^\s+…/], 108), { fs: 13, wrap: 120 }) +
      two(cmp(['run', 'all online', 'attempts', 'event loop stalled'], [
        ['300 · fixed 3 s (repo)', `<b>${kq(L300)}</b>`, L300.thu.toLocaleString('en-US'), `${giay(L300.dung)} s`],
        ['300 · backoff + jitter + boot spread', kq(LMU), LMU.thu.toLocaleString('en-US'), `${LMU.dung} ms`],
        ['1,000 · fixed 3 s · server sha256', `<b>${kq(LSUA)}</b>`, LSUA.thu.toLocaleString('en-US'), `${LSUA.dung} ms`]], { hl: [2] }),
        box('Read it', `A device secret is <b>24 random bytes</b>, not a human password: bcrypt’s slowness buys nothing. ${c('sha256')} + ${c('timingSafeEqual')} is enough.`, 'ok'), 'r64'),
    en: 'Two fixes. Backoff with jitter and a boot spread converges, slowly. Changing one server line, bcrypt to sha256 for a random twenty-four-byte secret, gets a thousand boards online in a fraction of a second.' },
  { t: 'Backoff done right — on the board', body: two(tsx(`// the idea (C++ on the board; JS here)
let delay = 1000;                    // first retry ≈ 1 s
function scheduleRetry() {
  const wait = Math.min(delay, 30000) // cap 30 s
    * (0.8 + Math.random() * 0.4);   // ±20 %
  delay = Math.min(delay * 2, 30000);
  setTimeout(connect, wait);
}
ws.on('open', () => { delay = 1000; }); // real open
// boot: random 0…10 s before the 1st try`, { fs: 15 }),
      cmp(['attempt', 'fixed (repo)', 'exponential + ±20 %'], [['1', '3 s', '0.8–1.2 s'], ['2', '3 s', '1.6–2.4 s'], ['3', '3 s', '3.2–4.8 s'], ['4', '3 s', '6.4–9.6 s'], ['6+', '3 s', '24–36 s → cap 30 s']], { hl: [0] }), 'r64') +
      box('Rules', `Exponential, capped, <b>jittered</b>, reset only after a connection that actually opened — and spread the first connect after boot. Jitter does nothing for boards that all boot in the same second unless the <b>first</b> attempt is spread too.`, 'ok'),
    en: 'Backoff done right: exponential, capped at thirty seconds, plus or minus twenty percent jitter, reset only after a real connection, and a random delay before the first connect after boot.' },
  { t: 'Heartbeat: how long does a frozen board stay “online”?', body: tn('$ node tim92' + TIM.split('$ node tim92')[1], { fs: 14, wrap: 120 }) +
      box('Read it', `Every 30 s the server sends <b>both</b> a JSON ${c('{"t":"ping"}')} and a WebSocket ping frame; <b>any</b> message or pong sets ${c('alive')}. Frozen right after a ping, the board stayed “online” <b>${tOff} s</b>: it is cut after missing <b>one</b> ping — the comment at line 71 says “misses two”.`, 'warn'),
    en: 'Heartbeat. Every thirty seconds the server sends a JSON ping and a WebSocket ping frame; any message marks the board alive. A board frozen right after a ping stayed online almost a minute; it is dropped after missing one ping, not two as the comment says.' },
  { t: 'WebSocket ping frame vs application ping', body: cmp(['', 'WebSocket ping frame', 'JSON {"t":"ping"}'], [
      ['bytes server → board (measured)', `<b>${bW} B</b>`, `<b>${bJ} B</b>`], ['bytes board → server, reply', `${bWp} B (pong, masked)`, `${bJp} B (masked)`],
      ['who answers', 'the WebSocket library, automatically', 'your firmware code (main.cpp:1181)'],
      ['proves', 'the TCP link and the library are alive', 'the firmware’s main loop is alive too'],
    ], { hl: [0] }) + two(box('Why the repo sends both', `A ping frame is answered by the library even if the main loop is stuck elsewhere; a JSON ping is only answered when ${c('ws.loop()')} and the handler run. The board also pings the server itself (${c('enableHeartbeat(15000, 3000, 2)')}).`, 'info'),
      box('Versus the web page', `“Some proxies strip ping frames” — not measured here; nginx in front of this repo forwards them. The page’s point stands: application pings always get through, at a few more bytes.`, 'warn')),
    en: 'A WebSocket ping frame is two bytes and the library answers it automatically; the JSON ping is a few more bytes but proves the firmware loop itself is alive. The repo sends both.' },
  { t: 'Seeing bad boards from the server', body: icards([
      ['list', 'What the repo logs today', `“MakerLab device connected” / “disconnected” with the device id — no gap, no attempt count. A storm shows up only as CPU.`],
      ['clock', 'Log the gap', 'Time since the last connect per device: a board reconnecting every 30 s has a flaky network; one silent for 5 minutes is dead.'],
      ['gauge', 'Watch the event loop', `The storm froze it ${giay(L300.dung)} s. Event-loop lag is the metric that would have shown it first (Node.js 2.4).`],
      ['shield', 'Bound the expensive part', 'Limit concurrent auth work and refuse fast (503) instead of letting every socket wait — or make the check cheap.'],
    ], 2),
    en: 'Seeing bad boards: the repo logs connects and disconnects only. Log the gap between reconnects, watch event-loop lag, and bound or cheapen the expensive auth step.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Manual reconnect', 'raw ws: the board’s own loop'), kw('Fixed interval', 'retry every 3 s — this firmware'),
      kw('Exponential backoff', '1 → 2 → 4 … capped'), kw('Jitter', '±20 % so boards spread out'),
      kw('Boot spread', 'random delay before the first connect'), kw('Reconnect storm', 'synchronised retries that keep a server down'),
      kw('Heartbeat', 'ping frame or JSON ping; one miss ⇒ cut'), kw('Event-loop lag', 'what a CPU-heavy handshake costs everyone'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: manual reconnect; fixed interval; exponential backoff; jitter; boot spread; reconnect storm; heartbeat; and event-loop lag.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Find the firmware’s reconnect call and its unused constants',
      'Boot 300 fake boards at once against the gateway; count per second',
      'Add backoff + jitter + a boot spread; run again',
      'Replace bcrypt for device secrets; run 1,000 boards',
    ]), box('Keep these', `<ul><li>Raw ws: reconnect is the board’s job</li><li>This firmware retries every 3 s, no jitter</li><li>300 boards + bcrypt ⇒ never converges</li><li>Jitter the first attempt too</li><li>Cheap checks for random secrets; watch event-loop lag</li></ul>`, 'info'), ''),
    en: 'Your turn: find the reconnect call, boot three hundred boards at once, add backoff and jitter, then replace bcrypt and try a thousand.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Raw WebSocket: when socket.io is not available', bai: '9.2' }, S);
