/**
 * sio-10-3 — Socket.IO · Chapter 10 · Lesson 10.3 "Q2: is the event on the wire?" (deck video + web, 14/11/2026).
 * Bài web: io-10-3-q2. Output THẬT (scratchpad/sio/demo/n10-3.txt · lab ~/.rtq-sio/lab/c10: may103.mjs (mọi socket vào thread:42; /phat?kieu=ok|ten|nsp|room), nam103.mjs,
 * q2tai.mjs (9 kiểu payload), cum.mjs (2 worker, có/không Redis adapter + PSUBSCRIBE); Chromium thật spec sio-10-3 ⇒ khung WS ws_ok/ws_ten/ws_nsp/ws_room):
 * A: 'Chat:new-message' ⇒ khung 42["chat:new-message",…] TỚI, handler 0 · namespace /chat ⇒ khung 42/chat,[…] tới socket b, handler trên a 0.
 * B: room thread:undefined ⇒ room size 0, KHÔNG khung nào. C: Date ⇒ chuỗi ISO · Map/Set ⇒ {} · undefined bị bỏ · NaN/Infinity ⇒ null · class ⇒ object thường ·
 * Buffer ⇒ 2 khung (51-… + nhị phân) · BigInt / vòng tham chiếu ⇒ emit NÉM ngay ở server. Cụm: không adapter 1/2, PSUBSCRIBE 0; Redis 2/2, kênh socket.io#/#thread:42#.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-3:room": "$ curl -s 'localhost:19971/phat?kieu=ok' ; curl -s 'localhost:19971/phat?kieu=room'      # room đúng · room dựng từ trường gõ sai\n(đã phát hai lần)\n$ # log server\nnghe :19971\nemitting chat:new-message → thread:42 · room size 1\nemitting chat:new-message → thread:undefined · room size 0\n$ # Nam nhận gì\n[Nam] connected · trong thread:42\n[Nam] 0.72 s ← chat:new-message {\"threadId\":42,\"text\":\"hi Nam\",\"from\":1}",
 "n10-3:tai": "$ node q2tai.mjs      # server emit chín kiểu giá trị — client nhận được gì, trên dây là gì\nDate               ⇒ client nhận string \"2026-11-14T08:00:00.000Z\"\n                     dây: 2[\"x\",\"2026-11-14T08:00:00.000Z\"]\nMap                ⇒ client nhận object {} · Object thường\n                     dây: 2[\"x\",{}]\nSet                ⇒ client nhận object {} · Object thường\n                     dây: 2[\"x\",{}]\n{ x: undefined }   ⇒ client nhận object {\"id\":7} · Object thường\n                     dây: 2[\"x\",{\"id\":7}]\nNaN, Infinity      ⇒ client nhận array [null,null]\n                     dây: 2[\"x\",[null,null]]\nclass TinNhan      ⇒ client nhận object {\"text\":\"hi\"} · Object thường\n                     dây: 2[\"x\",{\"text\":\"hi\"}]\nBuffer 4 B         ⇒ client nhận object \"<Buffer>\" · Buffer\n                     dây: 51-[\"x\",{\"_placeholder\":true,\"num\":0}]  +  <nhị phân 4 B>\nBigInt 10n         ⇒ emit NÉM TypeError: Do not know how to serialize a BigInt\nvòng tham chiếu    ⇒ emit NÉM RangeError: Maximum call stack size exceeded",
 "n10-3:cum": "$ node cum.mjs khong 2 ; node cum.mjs redis 2                       # cụm 2 worker: không adapter · có Redis adapter\nadapter KHÔNG gắn (RAM) · 2 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 0 ⇒ 1/2 người\nPSUBSCRIBE thấy 0 pmessage\nadapter Redis · 2 worker · worker 0 phát vào thread:42 ⇒ nhận: Nam-0 1 · Nam-1 1 ⇒ 2/2 người\nPSUBSCRIBE thấy 1 pmessage\n$ LC_ALL=C cat -v ps2.txt | cut -c1-60        # nguyên văn kênh lúc có adapter\npsubscribe\nsocket.io#*\n1\npmessage\nsocket.io#*\nsocket.io#/#thread:42#\nM-^SM-&2HsnkfM-^CM-$type^BM-$dataM-^RM-0chat:new-messageM-^B",
 "n10-3:kho": "$ grep -rnE '\\.to\\(`[a-zA-Z:_-]+:\\$\\{' src | grep -v test | wc -l      # room dựng từ biến (chỗ có thể thành :undefined)\n      21\n$ grep -rn \"volatile\" src/socket | wc -l ; grep -rnE \"rooms\\.get\\(.*\\)\\?\\.size\" src/socket | wc -l\n       0\n       0",
 "n10-3:ws_ok": "[{\"huong\":\"↓\",\"chu\":\"0{\\\"sid\\\":\\\"CNE1cBL8FGClACm8AAAA\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":60000,\\\"maxPayload\\\":1000000}\"},{\"huong\":\"↑\",\"chu\":\"40\"},{\"huong\":\"↓\",\"chu\":\"40{\\\"sid\\\":\\\"yPLY55fEi6kJQOS9AAAA\\\"}\"},{\"huong\":\"↓\",\"chu\":\"42[\\\"chat:new-message\\\",{\\\"threadId\\\":42,\\\"text\\\":\\\"hi Nam\\\",\\\"from\\\":1}]\"}]",
 "n10-3:ws_ten": "[{\"huong\":\"↓\",\"chu\":\"0{\\\"sid\\\":\\\"Hce0FG-PAuw-_gocAAAB\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":60000,\\\"maxPayload\\\":1000000}\"},{\"huong\":\"↑\",\"chu\":\"40\"},{\"huong\":\"↓\",\"chu\":\"40{\\\"sid\\\":\\\"l0na7WibaMuXYwlrAAAB\\\"}\"},{\"huong\":\"↓\",\"chu\":\"42[\\\"chat:new-message\\\",{\\\"threadId\\\":42,\\\"text\\\":\\\"hi Nam\\\",\\\"from\\\":1}]\"}]",
 "n10-3:ws_nsp": "[{\"huong\":\"↓\",\"chu\":\"0{\\\"sid\\\":\\\"rCzVlzWaD4xV-t2_AAAC\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":60000,\\\"maxPayload\\\":1000000}\"},{\"huong\":\"↑\",\"chu\":\"40\"},{\"huong\":\"↑\",\"chu\":\"40/chat,\"},{\"huong\":\"↓\",\"chu\":\"40{\\\"sid\\\":\\\"uqvN1wFiplQ1plEhAAAC\\\"}\"},{\"huong\":\"↓\",\"chu\":\"40/chat,{\\\"sid\\\":\\\"GqkQeWLzVXFzKs8iAAAD\\\"}\"},{\"huong\":\"↓\",\"chu\":\"42/chat,[\\\"chat:new-message\\\",{\\\"threadId\\\":42,\\\"text\\\":\\\"hi Nam\\\",\\\"from\\\":1}]\"}]",
 "n10-3:ws_room": "[{\"huong\":\"↓\",\"chu\":\"0{\\\"sid\\\":\\\"CmGU2iCcxP-6SlCSAAAD\\\",\\\"upgrades\\\":[],\\\"pingInterval\\\":25000,\\\"pingTimeout\\\":60000,\\\"maxPayload\\\":1000000}\"},{\"huong\":\"↑\",\"chu\":\"40\"},{\"huong\":\"↓\",\"chu\":\"40{\\\"sid\\\":\\\"6ByZ1DxgSc3dZGeCAAAE\\\"}\"}]"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, wire, br } from './_sio-chung.mjs';

export const deck = { key: 'sio-10-3', code: 'SIO 10.3', title: 'Q2: is the event on the wire?', sub: 'Chapter 10 · Lesson 10.3' };
const O = (k) => { const v = DU_LIEU[`n10-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const ROOM = O('room'), TAI = O('tai'), CUM = O('cum'), KHO = O('kho');
const W = (k) => JSON.parse(O('ws_' + k)).map((f) => [f.huong, f.chu]);
const bo = (txt, re) => txt.split('\n').filter((l) => !re.some((r) => r.test(l))).join('\n');
const soPhong = +/\n\s*(\d+)\n\$ grep -rn "volatile"/.exec(KHO)[1];

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.3', t: 'Q2: is the event on the wire?', sub: 'Read the Messages tab and it tells you which side to debug — measured in Chromium for every scenario.',
    en: 'Lesson ten point three: question two, is the event on the wire? The Messages tab tells you which side to debug.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Reading a frame: engine.io digit, socket.io digit, namespace, payload</li>
    <li>Three outcomes of Q2 and the side each one points to</li>
    <li>Scenario A in a real browser: the frame arrives, no handler runs</li>
    <li>Scenario B: no frame at all — and the one log line that proves it</li>
    <li>Scenario C: nine payloads, what actually arrives — and two that throw</li></ul>`,
    en: 'Five takeaways: reading a frame; the three outcomes of Q2; a frame with no handler; no frame at all; and what nine payload types turn into.' },
  { t: 'Reading the Messages tab — a healthy delivery, captured', body: two(
      wire(W('ok'), { fs: 16, max: 50, w: 600 }),
      '<div>' + box('Two digits, then the payload', `${c('42')} = engine <b>4</b> message + socket.io <b>2</b> EVENT. ${c('40')} CONNECT · ${c('44')} CONNECT_ERROR · ${c('43')} ACK. Another namespace: ${c('42/chat,[…]')}.`, 'info') +
      box('The noise', `Every 25 s: ${c('2')} ping ↓, ${c('3')} pong ↑ — even when nothing else works. Filter them; look for ${c('42')}.`, 'ok') + '</div>', 'r64'),
    en: 'Reading the Messages tab: forty-two means engine message plus socket event. Forty is connect, forty-four is connect error. Another namespace sits between the digits and the payload. Ping two and pong three are noise.' },
  { t: 'Three outcomes of Q2 — each points at one side', body: icards([
      ['eye', 'A · frame arrives, no handler runs', 'The emit side worked. Debug the <b>receive</b> side: the exact event name (case!), the namespace, which socket instance the handler is on.'],
      ['x', 'B · no frame at all', 'The receive side never got a chance. Debug the <b>emit</b> side: the room name, who is in the room, the adapter in a cluster.'],
      ['alert', 'C · frame arrives, payload is wrong', 'Both sides “worked”. Debug <b>serialization</b>: what JSON can and cannot carry.'],
    ], 3) + box('Why this saves time', 'Without the Messages tab, A and B look identical from the UI — “nothing happened”. With it, you open only one side’s code.', 'info'),
    en: 'Three outcomes. A frame with no handler points at the receive side. No frame points at the emit side. A frame with the wrong payload points at serialization.' },
  { t: 'Measured A: the frame arrives — the handler name differs by one letter', body: br('sio-10-3', 'ten', { url: 'localhost:19971/q2.html?kieu=ten', vp: 1100, h: 200, w: 1110 }) +
      two(wire(W('ten').slice(-1), { fs: 16, max: 62, w: 600 }), box('Read it', `The frame is on the wire; the handler listens for ${c("'Chat:new-message'")}. Names match <b>exactly</b>, case included. ${c('onAny')} shows what arrived.`, 'bad'), 'r64'),
    en: 'Scenario A, measured in Chromium: the frame is on the wire, but the handler listens for a name with a capital C. Names are compared exactly. onAny shows what really arrived.' },
  { t: 'Measured A: same connection, other namespace', body: br('sio-10-3', 'nsp', { url: 'localhost:19971/q2.html?kieu=nsp', vp: 1100, h: 200, w: 1110 }) +
      two(wire(W('nsp').slice(-4), { fs: 15, max: 60, w: 600 }), box('Read it', `One WebSocket, two namespaces. The server emitted on ${c('/chat')}: the frame ${c('42/chat,[…]')} goes to socket <b>b</b>; the handler is on socket <b>a</b>.`, 'bad'), 'r64'),
    en: 'Scenario A again, by namespace: one WebSocket carries both. The server emitted on slash chat, the frame is tagged slash chat, it reaches socket b — and the handler sits on socket a.' },
  { t: 'Measured B: no frame — the room had nobody in it', body: two(
      `<div>${wire(W('room'), { fs: 16, max: 46, w: 520 })}` + box('In Chromium', `Open, CONNECT, CONNECT ack — then <b>nothing</b>. No ${c('42')} ever arrives. From the UI this looks exactly like scenario A.`, 'info') + `</div>`,
      '<div>' + tn(bo(ROOM, [/^nghe/]), { fs: 13, wrap: 52 }) + box('The one log line', `Log the room and its size <b>before</b> the emit. ${c('thread:undefined · room size 0')} is the whole diagnosis: a misspelled field built the room name.`, 'ok') + '</div>', ''),
    en: 'Scenario B: no event frame at all. The server log printed before the emit says it: the room was thread undefined, with zero sockets. A misspelled field built the room name.' },
  { t: 'Measured C: what nine payloads turn into', body: two(tn(TAI, { fs: 12, wrap: 84 }),
      box('Read it', `JSON is the contract. ${c('Date')} ⇒ ISO string; ${c('Map')}/${c('Set')} ⇒ ${c('{}')}; ${c('undefined')} fields vanish; ${c('NaN')} ⇒ ${c('null')}; class methods are gone. A ${c('Buffer')} travels as <b>two</b> frames. ${c('BigInt')} and a circular object <b>throw at emit</b> — on the server, before any frame.`, 'bad'), 'r64'),
    en: 'Scenario C, nine payloads. Dates become strings, maps and sets become empty objects, undefined fields vanish, NaN becomes null, class methods are lost. A buffer travels as two frames. BigInt and circular objects throw at emit.' },
  { t: 'Cluster: is the adapter publishing? Ask Redis directly', body: tn(CUM, { fs: 13, wrap: 120 }) +
      two(box('Read it', `No adapter: worker 0 reaches only its own socket (1/2), and ${c("PSUBSCRIBE 'socket.io#*'")} sees <b>0</b> messages. With the Redis adapter: 2/2, one message on ${c('socket.io#/#thread:42#')}, payload in msgpack (binary).`, 'info'),
        box('How to use it', `Nothing on the channel ⇒ the adapter is not attached or not publishing. Something on the channel but a client still gets no frame ⇒ look at <b>that</b> worker: its subscription, its room.`, 'ok')),
    en: 'In a cluster, ask Redis directly. Without an adapter, PSUBSCRIBE sees nothing and only one of two users gets the event. With the adapter, one message appears on the thread channel.' },
  { t: 'Measured: where scenario B can hide in this repo', to: true, body: tn(KHO, { fs: 13, wrap: 124 }) +
      two(box('Read it', `<b>${soPhong}</b> emits build a room name from a variable (${c('`user:${id}`')}…): any ${c('undefined')} turns into a room nobody is in, silently. <b>0</b> places log the room size; <b>0</b> volatile emits.`, 'bad'),
        box('So in this repo', `A missing realtime event is far more likely a room name than a dropped frame. Add the size log (one line) where it matters — and lesson 10.4 shows why TypeScript does not save you.`, 'info')) +
      icards([['code', 'One of the 21, verbatim', `${c('src/services/shopFulfillment.ts:274')} — ${c('getIO()?.to(`user:${order.userId}`)')}: if ${c('order')} came from a query that did not select ${c('userId')}, this is ${c('user:undefined')}.`],
        ['eye', 'The size log', `${c('logger.debug(\'emit\', { room, size: io.sockets.adapter.rooms.get(room)?.size ?? 0 })')} — local worker only; in a cluster use PSUBSCRIBE.`]], 2),
    en: 'In this repo, twenty-one emits build a room name from a variable, and nowhere logs the room size. A missing event here is more likely a room name than a lost frame.' },
  { t: 'Q2 as a decision', to: true, body: cmp(['what the Messages tab shows', 'it means', 'open next'], [
      ['<b>42</b> with the right name and payload', 'emit + wire are fine', 'Q3: handler name, namespace, socket instance'],
      ['<b>42/other,</b>[…]', 'emitted on another namespace', 'io.of(…) on the server / io(url + nsp) on the client'],
      ['<b>no 42</b> at all', 'emit side', 'room name + size log; PSUBSCRIBE in a cluster'],
      ['<b>42</b> with a wrong payload', 'serialization', 'Date / Map / undefined / class / BigInt'],
      ['only <b>2</b> / <b>3</b> every 25 s', 'connection alive, nothing sent', 'the emit never ran (Q4 on the server)'],
    ], { hl: [2] }),
    en: 'Q2 as a decision table: a correct forty-two means go to Q3; another namespace means check io dot of; no forty-two means the emit side; a wrong payload means serialization.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Messages tab', 'every frame on the connection'), kw('42[…]', 'engine message + socket EVENT'), kw('42/chat,[…]', 'event on another namespace'),
      kw('Receive-side bug', 'frame present, no handler'), kw('Emit-side bug', 'no frame: room, adapter'), kw('Room size log', 'one line before emit'),
      kw('Serialization', 'what JSON can carry'), kw('PSUBSCRIBE', 'watch the adapter’s channel'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the Messages tab; forty-two; a namespaced frame; receive-side bug; emit-side bug; the room size log; serialization; and PSUBSCRIBE.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Break the handler name by one letter; find the frame anyway',
      'Emit on a second namespace; spot the /chat, prefix',
      'Build a room from a misspelled field; log the size before emit',
      'Send a Date, a Map and a BigInt; write down what arrives',
    ]), box('Keep these', `<ul><li>Frame + no handler ⇒ receive side</li><li>No frame ⇒ emit side: room, adapter</li><li>Wrong payload ⇒ JSON rules</li><li>Log room + size before emit</li><li>Cluster: PSUBSCRIBE before guessing</li></ul>`, 'info'), ''),
    en: 'Your turn: one-letter name, second namespace, misspelled room, and three payload types.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Diagnosis cookbook', bai: '10.3' }, S);
