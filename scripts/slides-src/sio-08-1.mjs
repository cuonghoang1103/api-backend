/**
 * sio-08-1 — Socket.IO · Chapter 8 · Lesson 8.1 "Several WebSocket servers in one repo: why" (deck video + web, 14/11/2026).
 * Bài web: io-8-1-hai-ws. Output THẬT (scratchpad/sio/demo/n8-1.txt · lab ~/.rtq-sio/lab/c8 · socket.io 4.8.3 · @hocuspocus/server 2.15.3 · ws 8.21.2):
 * kho: src/index.ts gắn BỐN thứ lên một HTTP server (socket.io · notes Hocuspocus · work-docs Hocuspocus · device ws thô) — web nói ba, path /devices (thật /device-ws).
 * ba: một server, ba WebSocket, mỗi listener 'upgrade' lọc ĐÚNG pathname; đường lạ ⇒ engine.io destroyUpgrade cắt sau ~1 s.
 * bay: new WebSocketServer({ server, path }) ⇒ socket.io kẹt polling, Hocuspocus không bao giờ synced, đường lạ 400.
 * cham: xác thực thiết bị bất đồng bộ 0,9 s ⇒ mở; 1,5 s ⇒ "socket hang up" ở ~1,0 s (engine.io); bỏ socket.io ⇒ mở ở 1,5 s
 *   ⇒ device.gateway.ts có hạn 8 s cho xác thực nhưng engine.io cắt ở 1 s (lỗi tiềm ẩn của kho).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-1:kho": "$ cd ~/api-backend && grep -n \"initSocketServer(server)\\|initNotesCollaborationGateway(server)\\|initWorkDocsCollaborationGateway(server)\\|initDeviceGateway(server)\" src/index.ts\n751:const sio = initSocketServer(server);\n756:initNotesCollaborationGateway(server);\n758:await initWorkDocsCollaborationGateway(server);\n764:initDeviceGateway(server);\n$ grep -rn \"on('upgrade'\" src/socket/ | grep -v test     # + 1 listener engine.io tự gắn cho /socket.io/\nsrc/socket/device.gateway.ts:955:  httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {\nsrc/socket/notes-collaboration.gateway.ts:283:  httpServer.on('upgrade', (request, socket, head) => {\nsrc/socket/work-docs-collaboration.gateway.ts:379:  httpServer.on('upgrade', (request, socket, head) => {\n$ grep -n \"const WS_PATH =\\|WORK_COLLAB_PATH =\" src/socket/*.ts\nsrc/socket/device.gateway.ts:70:const WS_PATH = '/device-ws';\nsrc/socket/notes-collaboration.gateway.ts:22:const WS_PATH = '/notes-collaboration';\nsrc/socket/work-docs-collaboration.gateway.ts:36:export const WORK_COLLAB_PATH = '/notes-collaboration/work-docs';\n$ grep -n \"location /socket.io/\\|location /notes-collaboration\\|location /device-ws\" nginx/nginx.conf\n815:        location /socket.io/ {\n838:        location /notes-collaboration {\n866:        location /device-ws {\n$ wc -l src/socket/messaging.socket.ts src/socket/notes-collaboration.gateway.ts src/socket/work-docs-collaboration.gateway.ts src/socket/device.gateway.ts\n     668 src/socket/messaging.socket.ts\n     300 src/socket/notes-collaboration.gateway.ts\n     410 src/socket/work-docs-collaboration.gateway.ts\n    1113 src/socket/device.gateway.ts\n    2491 total",
 "n8-1:makho": "$ sed -n '281,293p' src/socket/notes-collaboration.gateway.ts\n\n  const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_DOCUMENT_BYTES });\n  httpServer.on('upgrade', (request, socket, head) => {\n    let pathname = '';\n    try {\n      pathname = new URL(request.url ?? '/', 'http://localhost').pathname;\n    } catch {\n      return;\n    }\n    if (pathname !== WS_PATH) return;\n    wss.handleUpgrade(request, socket, head, (websocket) => {\n      hocuspocus.handleConnection(websocket, request);\n    });\n$ sed -n '938,962p' src/socket/device.gateway.ts\n\n/**\n * Attach the gateway to the shared HTTP server.\n *\n * `noServer: true` + a manual upgrade listener rather than\n * `{ server, path }`: socket.io also listens for 'upgrade' on this\n * same server. Letting `ws` own the server would make the two fight\n * over every upgrade request. With noServer we only touch requests\n * whose path is exactly ours and leave the rest for socket.io —\n * which is why this listener must never destroy sockets it doesn't\n * recognise.\n */\nexport function initDeviceGateway(httpServer: HttpServer): WebSocketServer {\n  if (wss) return wss;\n\n  wss = new WebSocketServer({ noServer: true, maxPayload: MAX_FRAME_BYTES });\n\n  httpServer.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {\n    let url: URL;\n    try {\n      url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);\n    } catch {\n      return; // not parseable — not ours\n    }\n    if (url.pathname !== WS_PATH) return; // socket.io or something else: hands off",
 "n8-1:ba": "$ node ba.mjs &   node do81.mjs 19900 io notes device la\n/socket.io/              60 ms · nối bằng websocket → sau 1,5 s: websocket · hỏi → \"socket.io tra loi\"\n/notes-collaboration     21 ms · Hocuspocus: synced\n/device-ws               5 ms · 101 mở · trả: {\"t\":\"echo\",\"nhan\":{\"t\":\"hello\",\"may\":\"esp32\"}}\n/khong-ai-nhan        1018 ms · lỗi: socket hang up\n$ # log server\n[ba] :19900 · KIEU=dung · socket.io có · xác thực device 0 ms · listener 'upgrade' = 3",
 "n8-1:bay": "$ KIEU=bay node ba.mjs &   node do81.mjs 19900 io notes device la     # device: new WebSocketServer({ server, path: '/device-ws' })\n/socket.io/              29 ms · nối bằng polling → sau 1,5 s: polling · hỏi → \"socket.io tra loi\"\n/notes-collaboration   5008 ms · Hocuspocus: CHƯA synced sau 5 s (status connecting)\n/device-ws               4 ms · 101 mở · trả: {\"t\":\"echo\",\"nhan\":{\"t\":\"hello\",\"may\":\"esp32\"}}\n/khong-ai-nhan           1 ms · HTTP 400 (không nâng cấp)\n$ # log server\n[ba] :19900 · KIEU=bay · socket.io có · xác thực device 0 ms · listener 'upgrade' = 3",
 "n8-1:cham": "$ TRE_AUTH=900 node ba.mjs &    node do81.mjs 19900 device       # xác thực thiết bị mất 0,9 s\n/device-ws             918 ms · 101 mở · trả: {\"t\":\"echo\",\"nhan\":{\"t\":\"hello\",\"may\":\"esp32\"}}\n$ TRE_AUTH=1500 node ba.mjs &   node do81.mjs 19900 device la    # 1,5 s — như Prisma cạn pool\n/device-ws            1005 ms · lỗi: socket hang up\n/khong-ai-nhan        1004 ms · lỗi: socket hang up\n$ IO=0 TRE_AUTH=1500 node ba.mjs &   node do81.mjs 19900 device la   # bỏ socket.io đi\n/device-ws            1510 ms · 101 mở · trả: {\"t\":\"echo\",\"nhan\":{\"t\":\"hello\",\"may\":\"esp32\"}}\n/khong-ai-nhan        5003 ms · lỗi: Opening handshake has timed out\n$ grep -n \"destroyUpgrade\" node_modules/engine.io/build/server.js\n668:        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;\n697:                else if (false !== options.destroyUpgrade) {\n710:                    }, destroyUpgradeTimeout);\n$ grep -n \"auth timeout 8s\\|destroyUpgrade\" ~/api-backend/src/socket/device.gateway.ts ~/api-backend/src/socket/messaging.socket.ts\nsrc/socket/device.gateway.ts:972:            setTimeout(() => rej(new Error('auth timeout 8s')), 8_000).unref?.(),"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tsx, tn, icards, esc, br, seq, hub } from './_sio-chung.mjs';

export const deck = { key: 'sio-08-1', code: 'SIO 8.1', title: 'Several WebSocket servers in one repo: why', sub: 'Chapter 8 · Lesson 8.1' };
const O = (k) => { const v = DU_LIEU[`n8-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const KHO = O('kho'), BA = O('ba'), BAY = O('bay'), CHAM = O('cham'), MAKHO = O('makho');
const dong = (p) => Number(m(new RegExp(`(\\d+) src/socket/${p}`), KHO)[1]);
const L = { msg: dong('messaging.socket.ts'), notes: dong('notes-collaboration.gateway.ts'), work: dong('work-docs-collaboration.gateway.ts'), dev: dong('device.gateway.ts') };
const msOf = (txt, duong, i = 0) => Number([...txt.matchAll(new RegExp(`^${duong.replace(/\//g, '\\/')}\\s+(\\d+) ms`, 'gm'))][i][1]);
const laMs = msOf(BA, '/khong-ai-nhan');
const c9 = msOf(CHAM, '/device-ws', 0), c15 = msOf(CHAM, '/device-ws', 1), c15io0 = msOf(CHAM, '/device-ws', 2), laIo0 = msOf(CHAM, '/khong-ai-nhan', 1);
const lineAuth = m(/device\.gateway\.ts:(\d+):.*auth timeout 8s/, CHAM)[1];
const nUpg = m(/listener 'upgrade' = (\d+)/, BA)[1];
const ex = (txt) => txt.split('\n').filter((l) => !/^\$ # log/.test(l)).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.1', t: 'Several WebSocket servers<br>in one repo: why', sub: 'One HTTP server, one port, one “upgrade” event — and a protocol per job. Measured.',
    en: 'Lesson eight point one: several WebSocket servers in one repo, and why. One HTTP server, one port, one upgrade event, and a different protocol for each job.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What this repo really mounts on its one HTTP server — four WebSocket endpoints, not three</li>
    <li>How several servers share one “upgrade” event: each listener claims only its own path</li>
    <li>The classic mistake — ${c('new WebSocketServer({ server, path })')} — measured breaking the others</li>
    <li>A hidden one-second deadline from engine.io, and a latent bug it causes in this repo</li>
    <li>Why notes use Yjs/Hocuspocus and devices use raw ws instead of socket.io</li></ul>`,
    en: 'Five takeaways: what the repo really mounts; how several servers share one upgrade event; the classic mistake measured; a hidden one-second deadline; and why notes and devices do not use socket.io.' },
  { t: 'One HTTP server, four WebSocket endpoints', body: hub('HTTP server :3000\n“upgrade”', [
        ['bolt', 'socket.io', `/socket.io/ · ${L.msg} lines`], ['page', 'Notes (Yjs)', `/notes-collaboration · ${L.notes}`],
        ['layers', 'CT Work docs (Yjs)', `…/work-docs · ${L.work} lines`], ['cpu', 'Devices (raw ws)', `/device-ws · ${L.dev} lines`],
      ], { w: 1110, h: 300 }) +
      box('Versus the web page', `The page lists three servers and a ${c('/devices')} path. ${c('src/index.ts')} mounts <b>four</b> endpoints (lines ${[...KHO.matchAll(/^(\d+):(?:const sio = |await )?init/gm)].map((x) => x[1]).join(', ')}) — CT Work docs added a second Hocuspocus on ${c('/notes-collaboration/work-docs')} — and the device path is ${c('/device-ws')}. nginx has one ${c('location')} per path; still one port.`, 'bad'),
    en: 'One HTTP server, four WebSocket endpoints. src slash index dot ts mounts socket.io, two Hocuspocus servers and a raw ws gateway. The web page said three, and a devices path; the real path is device dash ws.' },
  { t: 'How four servers share one “upgrade” event', body:
      seq(['client', 'HTTP server', 'engine.io', 'notes gateway', 'device gateway'], [[0, 1, 'GET /notes-collaboration · Upgrade: websocket'],
        [1, 2, 'not /socket.io/ ⇒ start a 1 s timer', '#7c3aed'], [1, 3, 'pathname === ours ⇒ handleUpgrade', '#1f8a3b'],
        [1, 4, 'not ours ⇒ return, touch nothing', '#64748b'], [3, 0, '101 Switching Protocols (timer finds bytes written ⇒ leaves it)', '#1f8a3b']], { w: 1110, rh: 50, fs: 16 }) +
      box('The rule', `Node calls <b>every</b> ${c("'upgrade'")} listener for every request. Each one checks the pathname and <b>returns without touching the socket</b> if it is not its own. ${c('noServer: true')} is what lets a ${c('ws')} server play by that rule.`, 'ok'),
    en: 'Node calls every upgrade listener for every request. Each gateway checks the exact pathname and returns without touching the socket if the path is not its own. noServer true is what lets ws play by that rule.' },
  { t: 'Measured: one port, three WebSockets', body: br('sio-08-1', 'ba', { url: 'localhost:19900/ba.html', vp: 1280, h: 600, w: 1000 }),
    en: 'Measured in a real browser: one page, one origin, three WebSockets. socket.io frames are text starting with packet digits; Hocuspocus frames are binary and every one starts with the document name; the device gateway speaks plain JSON.' },
  { t: 'Measured from Node: who answers which path', body: tn(ex(BA), { fs: 15, wrap: 100 }) +
      two(box('Read it', `Each path reaches exactly its server. A path nobody owns is not refused by anyone — engine.io ends it after <b>${laMs} ms</b> (${c('destroyUpgrade')}, default 1000 ms), because a socket nobody answers would hang forever.`, 'ok'),
        box('Listeners', `This lab: <b>${nUpg}</b> ${c("'upgrade'")} listeners (engine.io + 2). The repo: <b>4</b> (engine.io + notes + work-docs + device). Order does not matter while each one only claims its own path.`, 'info')),
    en: 'From Node: each path reaches exactly its server. A path that nobody owns is ended by engine.io after about one second, the destroy upgrade option.' },
  { t: 'The classic mistake: ws with { server, path }', body: tn(ex(BAY), { fs: 13, wrap: 110 }) + two(
      tsx(`// ✗ ws takes over every 'upgrade' (other path ⇒ 400)
new WebSocketServer({ server, path: '/device-ws' });
// ✓ the repo (device.gateway.ts:953)
const wss = new WebSocketServer({ noServer: true });
server.on('upgrade', (req, socket, head) => {
  if (pathOf(req) !== '/device-ws') return;
  wss.handleUpgrade(req, socket, head, onDevice);
});`, { fs: 13 }),
      box('Measured', `With the ${c('{ server, path }')} form, socket.io <b>never upgrades</b> (stays on polling), Hocuspocus <b>never syncs</b>, and an unknown path gets <b>HTTP 400</b>. Only the device path still works — so the bug looks like “the other features are slow”. The repo's comment at ${c('device.gateway.ts:938')} warns about exactly this.`, 'bad'), 'r64'),
    en: 'The classic mistake: passing server and path to ws. ws then answers every upgrade that is not its path with a 400. Measured: socket.io stays on polling, Hocuspocus never syncs. The repo uses noServer for exactly this reason.' },
  { t: 'A hidden one-second deadline', body: tn(ex(CHAM).split('\n').filter((l) => !/node_modules|engine\.io\/build|^\d+:|^\$ grep|^src\/socket|^\s+8_000/.test(l)).join('\n'), { fs: 14, wrap: 100 }) +
      two(cmp(['device auth takes', 'with socket.io', 'without socket.io'], [
        ['0.9 s', `opens (${c9} ms)`, 'opens'], ['1.5 s', `<b>socket hang up</b> at ${c15} ms`, `opens (${c15io0} ms)`], ['path nobody owns', `ended at ~1 s`, `<b>hangs</b> (${(laIo0 / 1000).toFixed(0)} s, client gave up)`]], { hl: [1] }),
        box('Latent bug in this repo', `${c('device.gateway.ts')} authenticates <b>before</b> ${c('handleUpgrade')} and allows <b>8 s</b> (${c(`:${lineAuth}`)}). But engine.io ends any upgrade socket with nothing written after <b>1 s</b>. When Prisma's pool is busy, the board gets a bare hang-up at 1 s — never the ${c('auth-timeout')} status line. Fix: ${c('destroyUpgrade: false')} plus a catch-all, or answer within 1 s.`, 'bad')),
    en: 'A hidden one-second deadline. engine.io ends any upgrade socket that nothing has written to after one second. The device gateway authenticates before upgrading and allows eight seconds; at one and a half seconds the device gets a bare hang up. That is a latent bug in this repo.' },
  { t: 'Why notes do not ride on socket.io', body: icards([
      ['code', 'Binary CRDT updates', 'A Yjs update is a Uint8Array. Measured frames: 9–40 B, each prefixed by the document name. socket.io would add an event envelope and, for binary, a second frame.'],
      ['merge', 'Order does not matter', 'CRDT updates commute: applied in any order they converge (lesson 8.2). socket.io acks and ordering would be paid for and never used.'],
      ['wrench', 'Hocuspocus is ready-made', 'Auth hook, per-document rooms, awareness, debounced storage, Redis for several workers — the repo uses it instead of rebuilding that on events.'],
      ['cpu', 'Devices: raw ws + JSON', 'ESP32 firmware has a WebSocket client, not socket.io-client. Plain JSON frames, nothing else to implement on a microcontroller (Chapter 9).'],
    ], 2),
    en: 'Why notes do not ride on socket.io: Yjs updates are small binary arrays; CRDT updates commute so acks and ordering are wasted; Hocuspocus already brings auth, rooms, awareness, storage and Redis. Devices use raw ws because the firmware has no socket.io client.' },
  { t: 'Which tool for which job', body: cmp(['Job', 'Tool', 'Why'], [
      ['Chat, calls, presence, notifications', 'socket.io', 'events + rooms + reconnect + polling fallback'],
      ['Several people editing one rich text', 'Yjs + Hocuspocus (+ Tiptap)', 'concurrent edits merge, no lock'],
      ['Figma-style canvas, whiteboard', 'Yjs (or another CRDT)', 'shapes and positions merge'],
      ['Offline-first notes', 'Yjs, local Y.Doc', 'sync when back online'],
      ['Microcontroller, tiny footprint', 'raw ws + JSON', 'no client library to port'],
    ], { hl: [1] }) + box('Trap', `Building collaborative editing on socket.io events — “user typed X at position Y”. Two people typing at the same spot apply each other's events at shifted positions and the copies drift apart (measured in 8.2). Do not reinvent a CRDT on an event bus.`, 'bad'),
    en: 'Which tool for which job: socket.io for chat, calls and presence; Yjs and Hocuspocus for shared documents, canvases and offline-first; raw ws for microcontrollers. Do not build collaborative editing on top of socket.io events.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('“upgrade” event', 'Node hands every WebSocket request to every listener'), kw('noServer: true', 'ws does not attach itself; you call handleUpgrade'),
      kw('Path routing', 'each listener claims one exact pathname'), kw('destroyUpgrade', 'engine.io ends unclaimed upgrades after 1 s'),
      kw('Hocuspocus', 'a Yjs WebSocket server with hooks'), kw('CRDT sync', 'binary updates that merge in any order'),
      kw('Raw ws', 'plain WebSocket + JSON, for firmware'), kw('Right tool per job', 'one port, a protocol per workload'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the upgrade event; noServer; path routing; destroy upgrade; Hocuspocus; CRDT sync; raw ws; and the right tool per job.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Find every ’upgrade’ listener and every path in src/socket and src/index.ts',
      'Run one HTTP server with socket.io + Hocuspocus + raw ws on three paths',
      'Break it with { server, path } and watch socket.io stay on polling',
      'Delay one gateway’s auth past 1 s and see engine.io hang it up',
    ]), box('Keep these', `<ul><li>One port, one “upgrade” event, many listeners</li><li>Claim only your own path — return otherwise</li><li>Never ${c('{ server, path }')} next to socket.io</li><li>engine.io ends unclaimed upgrades at 1 s</li><li>socket.io for events; Yjs for documents; raw ws for firmware</li></ul>`, 'info'), ''),
    en: 'Your turn: list the listeners and paths, run three servers on one port, break it with server and path, and push one gateway past the one-second deadline.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Collaborative editing: when NOT to use socket.io', bai: '8.1' }, S);
