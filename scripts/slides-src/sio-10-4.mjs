/**
 * sio-10-4 — Socket.IO · Chapter 10 · Lesson 10.4 "Q3 and Q4: the handler and the side effect" (deck video + web, 14/11/2026).
 * Bài web: io-10-4-q34. Output THẬT (scratchpad/sio/demo/n10-4.txt · lab ~/.rtq-sio/lab/c10: q34.mjs (server fork :19973), tsphong/phong.ts, kho104.mjs; Chromium thật spec sio-10-4: React 18.3.1 của frontend):
 * muon: gắn handler ngay ⇒ 1 · sau 200 ms ⇒ 0. strict: off(arrow mới) ⇒ 2 socket, handler ×2 · off(cùng hàm) không disconnect ⇒ 2 socket ×1 · + disconnect ⇒ 1 socket ×1.
 * nem: handler async ném trước ack ⇒ có process handler (kho index.ts:882): log, client timeout 3 s · không handler: server THOÁT mã 1, mọi client "transport close".
 * undef: tsc --strict 0 lỗi cho `user:${order.userId}` (userId?: number); eslint kho chỉ eslint:recommended. React: push tại chỗ ⇒ 0 tin trên màn hình khi cha không render lại; cha render lại ⇒ lỗi bị che.
 * kho: 12 handler async, 1 await ngoài try không .catch (doiKhang.socket.ts:524 dk:ghep).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-4:muon": "$ node q34.mjs muon      # server phát 'chao' ngay lúc connection · client gắn handler ngay vs sau 200 ms\ngắn handler NGAY khi tạo socket      ⇒ 'chao' chạy 1 lần\ngắn handler SAU 200 ms (await trước) ⇒ 'chao' chạy 0 lần (khung đã tới lúc chưa ai nghe)",
 "n10-4:strict": "$ node q34.mjs strict    # giả React StrictMode (mount → cleanup → mount), ba kiểu cleanup\ncleanup: off(arrow MỚI), không disconnect    ⇒ server thấy 2 socket · một sự kiện ⇒ handler chạy 2 lần\ncleanup: off(cùng hàm), không disconnect     ⇒ server thấy 2 socket · một sự kiện ⇒ handler chạy 1 lần\ncleanup: off(cùng hàm) + disconnect()        ⇒ server thấy 1 socket · một sự kiện ⇒ handler chạy 1 lần",
 "n10-4:nem": "$ node q34.mjs nem       # handler async ném lỗi DB TRƯỚC khi ack · có / không có process.on('unhandledRejection')\n— server CÓ process.on(\"unhandledRejection\") như src/index.ts:882\n  [server] handler chat:send fired\n  [server] UNHANDLED REJECTION (kept process alive) PrismaClientKnownRequestError: Foreign key constraint failed on the field: `thread_id`\n  [client] emitWithAck.timeout(3000) ⇒ operation has timed out @3020 ms\n  [client] disconnect: io client disconnect @3322 ms\n  [server] tiến trình THOÁT, mã null\n— server KHÔNG có handler đó\n  [server] handler chat:send fired\n\nError: PrismaClientKnownRequestError: Foreign key constraint failed on the field: `thread_id`\n\n  [client] disconnect: transport close @35 ms\n  [client] emitWithAck.timeout(3000) ⇒ socket has been disconnected @35 ms\n  [server] tiến trình THOÁT, mã 1",
 "n10-4:undef": "$ cat phong.ts\n// phong.ts — TypeScript có bắt room `user:undefined` không? (tsc --strict, như tsconfig của kho)\ntype Server = { to(room: string): { emit(ev: string, data: unknown): boolean } };\ndeclare const io: Server;\ntype Order = { id: number; userId?: number };                // select thiếu userId ⇒ kiểu cho phép undefined\ndeclare function layDon(id: number): Order;\nconst order = layDon(7);\nio.to(`user:${order.userId}`).emit('shop:don-doi-trang-thai', { id: order.id });   // ⇒ \"user:undefined\" khi thiếu\n$ npx tsc -p .           # strict: có bắt room `user:undefined` không?\ntsc mã thoát 0 — 0 lỗi\n$ grep -n \"extends\" -A3 .eslintrc.json      # eslint của kho có luật restrict-template-expressions không?\n6:  \"extends\": [\n7-    \"eslint:recommended\"\n8-  ],\n9-  \"parser\": \"@typescript-eslint/parser\",\n.eslintrc.json:0\nfrontend/.eslintrc.json:0",
 "n10-4:kho": "$ node kho104.mjs        # mọi handler async trong src/socket: await nào nằm ngoài try mà không .catch\nmessaging.socket.ts:546    maker:device:join    try có    · await ngoài try 0 · trong đó không .catch 0\ndoiKhang.socket.ts:369     dk:tao               try có    · await ngoài try 0 · trong đó không .catch 0\ndoiKhang.socket.ts:382     dk:vao               try có    · await ngoài try 0 · trong đó không .catch 0\ndoiKhang.socket.ts:422     dk:moi               try có    · await ngoài try 0 · trong đó không .catch 0\ndoiKhang.socket.ts:475     dk:tra-loi-moi       try KHÔNG · await ngoài try 1 · trong đó không .catch 0\ndoiKhang.socket.ts:509     dk:ghep              try KHÔNG · await ngoài try 1 · trong đó không .catch 1  ⚠\ndoiKhang.socket.ts:646     dk:ban-online        try có    · await ngoài try 0 · trong đó không .catch 0\nwork.socket.ts:41          work:join            try có    · await ngoài try 0 · trong đó không .catch 0\nwork.socket.ts:78          work:presence        try KHÔNG · await ngoài try 1 · trong đó không .catch 0\nwork.socket.ts:100         work:chat:join       try có    · await ngoài try 0 · trong đó không .catch 0\nwork.socket.ts:125         work:chat:typing     try KHÔNG · await ngoài try 1 · trong đó không .catch 0\nwork.socket.ts:149         work:feed:subscribe  try có    · await ngoài try 0 · trong đó không .catch 0\n$ sed -n '512,516p;524,530p' src/socket/doiKhang.socket.ts\n    const hang = (hangGhep.get(tro) ?? []).filter((h) => h.userId !== user.id && io.sockets.sockets.has(h.socketId));\n    const doiThu = hang.shift();\n    if (!doiThu) {\n      hang.push({ userId: user.id, socketId: socket.id });\n      hangGhep.set(tro, hang);\n    await Promise.all([ngoiVao(p, 0, a), ngoiVao(p, 1, b)]);\n    p.ghe.forEach((g) => { g.sanSang = true; });\n    p.nghe.set(socket.id, user.id); void socket.join(khoa(p.ma));\n    const s2 = io.sockets.sockets.get(doiThu.socketId);\n    if (s2) { p.nghe.set(s2.id, doiThu.userId); void s2.join(khoa(p.ma)); }\n    io.to(doiThu.socketId).emit('dk:ghep-xong', { maPhong: p.ma });\n    traLoi(cb, { ok: true, maPhong: p.ma });"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, tsx, path, meter, br } from './_sio-chung.mjs';

export const deck = { key: 'sio-10-4', code: 'SIO 10.4', title: 'Q3 and Q4: the handler and the side effect', sub: 'Chapter 10 · Lesson 10.4' };
const O = (k) => { const v = DU_LIEU[`n10-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const MUON = O('muon'), STRICT = O('strict'), NEM = O('nem'), UNDEF = O('undef'), KHO = O('kho');
const st = [...STRICT.matchAll(/server thấy (\d+) socket · một sự kiện ⇒ handler chạy (\d+) lần/g)].map((x) => ({ s: +x[1], h: +x[2] }));

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.4', t: 'Q3 and Q4:<br>the handler and the side effect', sub: 'The frame arrived. Did your code run — and did it change anything? Measured on a real server, a real React page, and this repo’s handlers.',
    en: 'Lesson ten point four: questions three and four. The frame arrived; did your code run, and did it change anything?' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Q3: one log line at the top of the handler — and the three reasons it stays silent</li>
    <li>A handler registered 200 ms late, and React StrictMode’s second socket — measured</li>
    <li>An async handler that throws: what the server, the client and the ack do</li>
    <li>Q4: the room called <code>user:undefined</code>, which TypeScript does not catch</li>
    <li>A React list that ignores three real events — and why it sometimes doesn’t</li></ul>`,
    en: 'Five takeaways: the one log line and why it stays silent; late handlers and StrictMode; a throwing async handler; the undefined room; and a React list that ignores events.' },
  { t: 'Q3 in one log line — and what each outcome means', to: true, body: two(tsx(`socket.on('chat:send', async (data, ack) => {
  console.log('chat:send fired', data);        // Q3
  try {
    const msg = await prisma.message.create({ data });
    console.log('created', msg.id);           // Q4, part 1
    io.to(\`thread:\${data.threadId}\`).emit('chat:new-message', msg);
    ack({ ok: true, id: msg.id });
  } catch (err) {
    console.error('chat:send', err);
    ack({ ok: false });              // never leave it waiting
  }
});`, { sm: true, hl: [2, 9, 10] }),
      '<div>' + 
      cmp(['you see', 'it means'], [
        ['no “fired”', 'name / namespace / socket / timing — back to Q2'],
        ['“fired”, no “created”', 'the await threw — a swallowed rejection'],
        ['both lines', 'the server side is done ⇒ Q4: room, frame, UI state'],
      ]) + '</div>', 'r64') + box('In this repo', `Nothing logs at the top of a socket handler today — lesson 10.2 counted <b>0</b> logger calls in the connection path. Add it as ${c('logger.debug')} with the event name, so it costs nothing in production until you turn it on.`, 'info'),
    en: 'Q3 in one log line at the top of the handler. No fired means name, namespace, socket or timing. Fired but not created means the await threw. Both means the server is done: move on to Q4.' },
  { t: 'Measured: a handler registered 200 ms late', to: true, body: tn(MUON, { fs: 17, wrap: 110 }) +
      path([{ t: 'connect', s: '0 ms' }, { t: "server emits 'chao'", s: 'in io.on(connection)', on: true }, { t: 'frame arrives', s: 'nobody listening' }, { t: '.on(chao)', s: '+200 ms — too late', mau: '#c0392b' }], { h: 150, fs: 19 }) +
      two(box('Read it', `The server emits in ${c("io.on('connection')")}. The frame arrives ~immediately; a handler attached after an ${c('await')} finds nothing to catch. socket.io <b>does not buffer</b> incoming events for listeners that do not exist yet.`, 'bad'),
        box('The fix', `Attach every ${c('.on()')} <b>synchronously</b> right after ${c('io()')}, before any ${c('await')} — or have the client ask for the data (${c("emit('ready')")}, lesson 1.5) once its handlers exist.`, 'ok')),
    en: 'A handler attached two hundred milliseconds late catches nothing: the frame arrived before anyone listened, and socket.io does not buffer events for listeners that do not exist yet.' },
  { t: 'Measured: React StrictMode mounts your effect twice', body: tn(STRICT, { fs: 15, wrap: 120 }) +
      two(meter([['off(new arrow)', st[0].h, '#c0392b'], ['off(same fn)', st[1].h, '#e0590b'], ['off + disconnect', st[2].h, '#1f8a3b']], { don: '×', nhan: 200, w: 520, rh: 40, fs: 16 }),
        box('Read it', `${c('off()')} with a <b>new</b> arrow removes nothing ⇒ every event runs twice. Same function but no ${c('disconnect()')} ⇒ handler OK, but <b>${st[1].s}</b> sockets per tab, forever. Only the third cleans up. (This repo shares one socket via ${c('connectSocket()')} and passes a <i>named</i> function to ${c('off')} in 38 places — none with an inline arrow.)`, 'info'), 'r46'),
    en: 'StrictMode runs mount, cleanup, mount. Off with a new arrow removes nothing: every event runs twice. The same function without disconnect leaves two sockets per tab. Only off plus disconnect cleans up.' },
  { t: 'Measured: an async handler that throws before the ack', body: tn(NEM, { fs: 12, wrap: 130 }) +
      two(box('With a process handler (this repo)', `socket.io does <b>not</b> catch async handlers. The rejection reaches ${c("process.on('unhandledRejection')")} (src/index.ts:882): one log line, process alive, and the ack <b>never</b> comes — only the client’s ${c('.timeout()')} ends the wait.`, 'info'),
        box('Without one', `Node 22 treats it as fatal: the server <b>exits with code 1</b> and every client sees ${c('"transport close"')}. One bad payload, everybody disconnected.`, 'bad')),
    en: 'An async handler that throws before the ack. socket.io does not catch it. With the repo’s process handler: one log line, and the ack never comes. Without it: the server exits, and every client is disconnected.' },
  { t: 'Q4: did the effect really happen? Check four places', body: icards([
      ['db', 'The row', 'SELECT it. An <code>ok</code> ack is not a written row (10.1, bug q4).'],
      ['users', 'The room', 'Log the room name and size before the emit. <code>user:undefined</code> has nobody in it.'],
      ['eye', 'The frame', 'Back to Q2: Messages tab on the receiver.'],
      ['layers', 'The UI state', 'React DevTools: did the state change, and did the component re-render?'],
    ], 2),
    en: 'Q4: did the effect really happen? Check four places: the row, the room, the frame, and the UI state.' },
  { t: 'Measured: TypeScript does not save you from user:undefined', body: two(tn(UNDEF, { fs: 12, wrap: 84 }),
      '<div>' + box('Read it', `${c('--strict')}: <b>0 errors</b>, the room becomes ${c('"user:undefined"')}. The repo’s ESLint is ${c('eslint:recommended')} only.`, 'bad') +
        box('Cheap guards', `One helper that throws on a bad id (${c('roomUser(id)')}), or the lint rule ${c('restrict-template-expressions')}. This repo hand-builds 21 room names (10.3).`, 'ok') + '</div>', 'r64'),
    en: 'TypeScript compiles a possibly undefined id inside a template string with zero errors, and the repo’s lint rules don’t catch it either. Build room names in one helper that refuses a bad id.' },
  { t: 'Measured in Chromium: the handler ran three times, the list shows nothing', body: br('sio-10-4', 'react', { url: 'localhost:19972/q4.html', vp: 1100, h: 140, w: 1110 }) +
      br('sio-10-4', 'reactcha', { url: 'localhost:19972/q4.html?cha=1', vp: 1100, h: 140, w: 1110 }) +
      box('Read it', `React 18.3.1 (the repo’s). ${c('push')} + same array ⇒ React skips the render: 3 events, <b>0</b> on screen. A parent that re-renders anyway <b>hides</b> the bug.`, 'bad'),
    en: 'In Chromium with React eighteen: pushing into the same array and returning it means React skips the render. Three events, nothing on screen. When a parent re-renders, the bug hides.' },
  { t: 'Measured: this repo’s async socket handlers', body: tn(KHO.split('\n').filter((l) => !/^\s+(const doiThu|if \(!doiThu|hangGhep\.set|p\.ghe\.forEach|p\.nghe\.set|const s2|if \(s2\))/.test(l)).join('\n'), { fs: 11, wrap: 140 }) +
      two(box('Read it', `12 async handlers; 4 without ${c('try')}, 3 of them end the ${c('await')} in ${c('.catch()')}. Not ${c('dk:ghep')} (line 524).`, 'info'),
        box('Latent bug: dk:ghep', `DB error in ${c('ngoiVao')} ⇒ the opponent is already off the queue, never gets ${c('dk:ghep-xong')}; the caller gets no ack (gives up at 6 s).`, 'bad')),
    en: 'This repo’s twelve async handlers: one has an await outside try with no catch, the match-making handler. If its database call fails, the opponent has already left the queue and is never told.' },
  { t: 'The trap: logging the handler, not the effect', to: true, body: path([
      { t: 'handler', s: '“fired”' }, { t: 'DB write', s: '“created id”' }, { t: 'emit', s: 'room + size', on: true }, { t: 'frame', s: 'Messages tab' }, { t: 'UI state', s: 'React DevTools' }],
      { h: 170, fs: 20, nhan: ['', '', '', ''] }) +
      two(box('What goes wrong', `“done” logged at the end of the handler means the handler <b>returned</b>. It says nothing about the emit reaching anyone, or the UI changing.`, 'bad'),
        box('Log every layer', `One line per arrow above. When the bug comes back, the first missing line names the layer — the tree again, in your logs.`, 'ok')) +
      icards([['code', 'Server (example lines)', `${c("chat:send fired")} · ${c("created 512")} · ${c("emit thread:42 size 2")}`], ['eye', 'Client (example)', `Messages: ${c('42["chat:new-message",…]')} · DevTools: state length 3 ⇒ 4`]], 2),
    en: 'The trap: logging the handler but not the effect. Log every layer: handler, DB write, emit with room size, frame, and UI state. The first missing line names the layer.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Q3 log line', 'first line of the handler'), kw('Late registration', 'no buffering for future listeners'), kw('StrictMode', 'mount → cleanup → mount'),
      kw('off(new arrow)', 'removes nothing'), kw('Floating rejection', 'async handler throws, ack never comes'), kw('user:undefined', 'a room nobody is in'),
      kw('Same-reference state', 'React skips the render'), kw('Log every layer', 'the first missing line names it'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the Q3 log line; late registration; StrictMode; off with a new arrow; a floating rejection; user undefined; same-reference state; and logging every layer.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Emit on connection; attach the handler after an await; count',
      'Simulate StrictMode; fix the cleanup until one socket, one run',
      'Throw in an async handler; add try/catch + an error ack',
      'Push into React state in place; fix it with a new array',
    ]), box('Keep these', `<ul><li>One log line at the top answers Q3</li><li>Attach handlers before any await</li><li>Cleanup = off(same fn) + disconnect</li><li>Every async handler: try/catch + ack</li><li>An ok ack ≠ a row ≠ a frame ≠ a re-render</li></ul>`, 'info'), ''),
    en: 'Your turn: a late handler, a StrictMode cleanup, a throwing handler, and an in-place state update — then fix each one.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Diagnosis cookbook', bai: '10.4' }, S);
