/**
 * sio-10-1 — Socket.IO · Chapter 10 · Lesson 10.1 "The decision tree" (deck video + web, 14/11/2026).
 * Bài web: io-10-1-cay. Output THẬT (scratchpad/sio/demo/n10-1.txt · lab ~/.rtq-sio/lab/c10: may10.mjs chat nhỏ socket.io 4.8.3 + Postgres sio-pg, 4 lỗi gài; cay.mjs đi cây tự động):
 * cay: không lỗi ⇒ 4 câu xanh · q1 quên token ⇒ đỏ ở Q1 (connect_error) · q2 room thread:undefined ⇒ Q2 (0 khung) · q3 nghe chat:new_message ⇒ Q3 (khung tới, handler 0) · q4 INSERT không await ⇒ Q4 (ack ok, DB 0 dòng).
 * log: DEBUG=socket.io*,engine* cho MỘT tin, hai client ⇒ ~150 dòng; tên gõ sai xuất hiện 0 lần.
 * kho: 5 commit sửa lỗi realtime thật của kho — mỗi cái đỏ ở một câu.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n10-1:cay": "$ node cay.mjs all      # 5 lượt: không lỗi + 4 lỗi gài sẵn · Hà gửi một tin vào thread:42, Nam phải thấy\n── lỗi gài: (không) · cây dừng ở đâu cả — mọi câu xanh · 1123 ms\n  Q1 ✓ Nam connected, sid Rw3GuP…\n  Q2 ✓ khung tới Nam: 2[\"chat:new-message\",{\"threadId\":42,\"text\":\"xi…\n  Q3 ✓ handler 'chat:new-message' chạy 1 lần\n  Q4 ✓ SELECT count(*) … = 1\n── lỗi gài: q1 · cây dừng ở Q1 · 220 ms\n  Q1 ✗ connect_error: \"No authentication token provided\"\n── lỗi gài: q2 · cây dừng ở Q2 · 1024 ms\n  Q1 ✓ Nam connected, sid bhg6u2…\n  Q2 ✗ 0 khung sự kiện tới Nam (ack của Hà: {\"ok\":true,\"id\":6})\n── lỗi gài: q3 · cây dừng ở Q3 · 1031 ms\n  Q1 ✓ Nam connected, sid 2T4n5m…\n  Q2 ✓ khung tới Nam: 2[\"chat:new-message\",{\"threadId\":42,\"text\":\"xi…\n  Q3 ✗ khung 'chat:new-message' tới nhưng handler 'chat:new_message' chạy 0 lần\n── lỗi gài: q4 · cây dừng ở Q4 · 1054 ms\n  Q1 ✓ Nam connected, sid 6vckPx…\n  Q2 ✓ khung tới Nam: 2[\"chat:new-message\",{\"threadId\":42,\"text\":\"xi…\n  Q3 ✓ handler 'chat:new-message' chạy 1 lần\n  Q4 ✗ SELECT count(*) … = 0 (ack của Hà vẫn {\"ok\":true})",
 "n10-1:log": "$ DEBUG='socket.io*,engine*' node cay.mjs q3 2> debug.txt      # phản xạ \"bật hết log\" cho đúng lỗi q3\n(xong)\n$ wc -l < debug.txt                       # bao nhiêu dòng cho MỘT tin nhắn, hai client\n     150\n$ grep -c 'chat:new-message' debug.txt    # tên server phát\n10\n$ grep -c 'chat:new_message' debug.txt    # tên client nghe (gõ sai) — chính là con lỗi\n0",
 "n10-1:kho": "$ git show -s --format='%h %ad %s' --date=short 110097d08 0852eb4ed 8a87e3298 82084b1e2 3981e9a00 | cut -c1-118\n110097d08 2026-09-17 fix(tin nhắn): app desktop \"ngoại tuyến mãi\" — socket CHƯA TỪNG nối được lần nào\n0852eb4ed 2026-08-21 fix(call): gọi người KHÔNG online thì im lặng đổ chuông vào hư không\n8a87e3298 2026-10-15 fix(messages): một người một hội thoại với admin + mỗi sự kiện socket chỉ tới một lần\n82084b1e2 2026-11-13 fix(realtime): không bao giờ gắn Redis adapter MUỘN (Redis tắt lúc khởi động ⇒ getRedis thử mãi, \n3981e9a00 2026-11-13 fix(messenger): người bị chặn giữa phiên không còn nhận \"đã offline\" (lọc lại audience lúc ngắt —"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, path, meter } from './_sio-chung.mjs';

export const deck = { key: 'sio-10-1', code: 'SIO 10.1', title: 'The decision tree', sub: 'Chapter 10 · Lesson 10.1' };
const O = (k) => { const v = DU_LIEU[`n10-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const CAY = O('cay'), LOG = O('log'), KHO = O('kho');
const soDong = +m(/wc -l < debug\.txt[^\n]*\n\s*(\d+)/, LOG)[1];
const tenPhat = +m(/'chat:new-message' debug\.txt[^\n]*\n(\d+)/, LOG)[1];
const tenSai = +m(/'chat:new_message' debug\.txt[^\n]*\n(\d+)/, LOG)[1];
const dung = [...CAY.matchAll(/lỗi gài: (\S+) · cây dừng ở (Q\d|đâu cả)[^·]*· (\d+) ms/g)].map((x) => ({ bug: x[1], o: x[2], ms: +x[3] }));
const ms = (b) => dung.find((d) => d.bug === b)?.ms;

export const S = [
  { cover: true, nhan: 'Chapter 10 · Lesson 10.1', t: 'The decision tree', sub: 'Four ordered questions instead of forty console.logs — walked by a script over four planted bugs.',
    en: 'Lesson ten point one: the decision tree. Four ordered questions instead of forty console logs, walked over four planted bugs.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four questions, in order, and the one tool that answers each</li>
    <li>A script walks the tree over four planted bugs: where each one stops</li>
    <li>What the “turn on every log” reflex really gives you — measured</li>
    <li>A symptom table: where to start, and which lesson explains it</li>
    <li>Five real bugs from this repo’s history, placed on the tree</li></ul>`,
    en: 'Five takeaways: the four questions and their tools; a script walking the tree; what the log reflex gives you; a symptom table; and real bugs from this repo, placed on the tree.' },
  { t: 'Four questions, one tool each — stop at the first red', to: true, body: path([
      { t: 'Q1 connected?', s: 'WS tab · connect_error', on: true }, { t: 'Q2 on the wire?', s: 'Messages: 42[…]' }, { t: 'Q3 handler ran?', s: 'one log at the top' }, { t: 'Q4 effect?', s: 'DB row · room · state' }],
      { h: 170, fs: 21, nhan: ['yes ⇒', 'yes ⇒', 'yes ⇒'] }) +
      two(box('Read it left to right', `Each question assumes every question to its left is <b>green</b>. A red at Q1 makes Q2–Q4 meaningless: an event cannot be on a wire that does not exist.`, 'info'),
        box('Each red names a layer', `Q1 red ⇒ connect / auth / proxy (lessons 1.4, 2.4). Q2 red ⇒ the emit side: room, adapter. Q3 red ⇒ the receive side: name, socket, timing. Q4 red ⇒ the effect: DB, room name, UI state.`, 'ok')),
    en: 'Four questions, one tool each. Is the client connected; is the event on the wire; did the handler run; did the effect happen. Stop at the first red: it names the layer.' },
  { t: 'Measured: a script walks the tree over four planted bugs', body: two(tn(CAY.replace(/^\$ [^\n]*\n/, ''), { fs: 13, wrap: 84 }),
      '<div>' + box('Read it', `No bug: four greens. Each planted bug stops at a <b>different</b> question — and the evidence printed is the fix: a missing token, a room nobody is in, a name with an underscore, an INSERT that failed after the ack.`, 'ok') +
        box('Notice q4', `Ha’s ack said <b>ok</b> and Nam saw the message — yet the database has <b>0 rows</b>. It vanishes on reload. Only Q4 catches it; every earlier question is green.`, 'bad') + '</div>', 'r64'),
    en: 'Measured: the script walks the tree. No bug gives four greens; each planted bug stops at a different question, and the evidence it prints points straight at the fix. Bug four is the nasty one: the ack said ok, the message appeared, but no row was written.' },
  { t: 'Measured: the “turn on every log” reflex', to: true, body: two(
      `<div>${tn(LOG.replace(/; echo "\(xong\)"/, '').replace(/\n\(xong\)/, ''), { fs: 13, wrap: 56 })}</div>`,
      `<div>${meter([['debug lines, one message', soDong, '#c0392b'], ['lines with the emitted name', tenPhat, '#475569'], ['lines with the typo', tenSai, '#0e7490']], { don: '', nhan: 270, w: 560, rh: 46, fs: 17 })}` +
      box('Read it', `Bug q3 is a typo in a <b>listener</b>. DEBUG logs what is sent and received — never what you <i>listen for</i>. ${soDong} lines, and the faulty name appears <b>${tenSai}</b> times. Q3 asks the one question that finds it: did <i>my</i> handler run?`, 'bad') + `</div>`, 'r46'),
    en: 'The reflex, measured: debug logging for one message and two clients prints about a hundred and fifty lines, and the misspelled listener name appears in none of them. Debug logs what moves, not what you listen for.' },
  { t: 'Symptom ⇒ where to start', body: cmp(['symptom', 'start at', 'usual cause', 'lesson'], [
      ['“client not receiving events”', 'Q1', 'auth fail ⇒ connect_error; proxy strips Upgrade', '1.4 · 2.4 · 10.2'],
      ['“some events reach, some don’t”', 'Q2', 'volatile emit; a reconnect gap (at-most-once)', '3.4 · 6.1'],
      ['“handler doesn’t fire”', 'Q3', 'name typo; handler registered late; another socket', '1.1 · 3.5 · 10.4'],
      ['“handler runs, no effect”', 'Q4', 'promise not awaited; room name with undefined; UI state', '10.4'],
      ['“presence flickers”', 'Q3–Q4', 'counting sockets, not users; per-process Map', '4.3 · 10.5'],
      ['“message duplicated” / “lost”', 'Q3 / Q2', 'retry without dedupe / Redis blip', '6.3 · 5.3'],
      ['“cluster: some users never get it”', 'Q2', 'adapter not attached (1/N of users)', '5.1 · 10.5'],
    ], { hl: [3] }) + box('About the “90%”', `The page says the tree catches “90% of bugs in 5 minutes”. That is an <b>estimate</b>, not a measurement — the measurable part is above: each planted bug was located in about ${ms('q3') ? Math.round(ms('q3') / 100) / 10 : 1} s by a script.`, 'info'),
    en: 'The symptom table: where to start, the usual cause, and the lesson that explains it. The page’s ninety percent is an estimate; what we measured is that each planted bug was located in about a second.' },
  { t: 'Measured: this repo’s own realtime bugs, placed on the tree', body: tn(KHO, { fs: 14, wrap: 120 }) + cmp(['commit', 'what users saw', 'first red'], [
      ['110097d08', 'desktop app “offline forever” — never connected once', '<b>Q1</b>'],
      ['0852eb4ed', 'calling an offline user rang into nothing', '<b>Q2</b> — emit into an empty room'],
      ['82084b1e2', 'adapter attached late ⇒ every socket lost its rooms', '<b>Q2</b> — no frame, no log'],
      ['8a87e3298', 'each socket event arrived twice', '<b>Q3</b> — handler ran ×2'],
      ['3981e9a00', 'hidden tab marked messages “seen”', '<b>Q4</b> — the effect, not the event'],
    ], { hl: [1, 2] }),
    en: 'This repo’s own realtime bugs, placed on the tree: one red at Q1, two at Q2, one at Q3, one at Q4. Each was fixed once someone asked the right question.' },
  { t: 'The trap: the tree is a checklist, not a ritual', body: two(
      box('Skip what you already know', `Saw ${c('42["chat:new-message",…]')} in the Messages tab? Q1 and Q2 are <b>green</b> — start at Q3. The order exists so you never skip a question, not so you replay all four every time.`, 'ok'),
      box('Never skip what you assumed', `“The UI shows data, so it’s connected” is not Q1 green — the data may have come from a REST ${c('fetch')}. A question is green only with its tool’s evidence: a 101, a frame, a log line, a row.`, 'bad')) +
      icards([['eye', 'Evidence, not belief', 'Every green above came from something you can point at.'], ['layers', 'One layer at a time', 'A red names a layer; you open only that layer’s code.']], 2),
    en: 'The trap: the tree is a checklist, not a ritual. Skip what you already have evidence for; never skip what you merely assumed. A question is green only with its tool’s evidence.' },
  { t: 'The next four lessons walk each branch', body: steps([
      '<b>10.2 — Q1</b>: is the client connected? DevTools WS, connect_error, the server log — and what this repo logs (very little)',
      '<b>10.3 — Q2</b>: is the event on the wire? Reading frames; three scenarios; Redis PSUBSCRIBE in a cluster',
      '<b>10.4 — Q3 + Q4</b>: did the handler run, did the effect happen? Typos, late handlers, floating promises, ${undefined} rooms',
      '<b>10.5 — cluster bugs</b>: 1/N users, HTTP 400 “Session ID unknown”, presence flicker — reproduced with two workers',
      '<b>10.6 — quiz</b>: six questions on the tree',
    ]),
    en: 'The next lessons walk each branch: connection, the wire, handler and effect, then the bugs only a cluster has, and a short quiz.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Decision tree', 'four ordered questions'), kw('Q1 connected', 'a 101, or a connect_error'), kw('Q2 on the wire', 'a 42[…] frame reached the client'),
      kw('Q3 handler', 'one log line at the top'), kw('Q4 side effect', 'row · room · UI state'), kw('First red', 'names the layer to open'),
      kw('Evidence', 'what turns a question green'), kw('console.log reflex', 'logs what moves, not what you listen for'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: the decision tree; Q1 connected; Q2 on the wire; Q3 handler; Q4 side effect; the first red; evidence; and the console log reflex.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run the planted-bug app; walk each bug through Q1 → Q4 by hand',
      'Write down the evidence that turned each question green or red',
      'Turn on DEBUG for bug q3; search the output for the typo',
      'Take one realtime bug you have met; find its first red',
    ]), box('Keep these', `<ul><li>Four questions, in order; stop at the first red</li><li>Each red names a layer</li><li>Green needs evidence: 101 · frame · log · row</li><li>DEBUG logs what moves, not what you listen for</li><li>An ok ack is not a written row</li></ul>`, 'info'), ''),
    en: 'Your turn: walk the planted bugs by hand, write down the evidence, search the debug output for the typo, and place one of your own bugs on the tree.' },
];
export const slides = lamDeck({ chuong: 'Chapter 10 — Diagnosis cookbook', bai: '10.1' }, S);
