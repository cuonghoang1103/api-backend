/**
 * sio-11-1 — Socket.IO · Chapter 11 · Lesson 11.1 "What survives measurement" (deck video + web, 14/11/2026).
 * Bài web: io-11-1-song-qua. Output THẬT (scratchpad/sio/demo/n11-1.txt · lab ~/.rtq-sio/lab/c11/song.mjs: socket.io 4.8.3 thật :19990/:19991 + đọc lại kho hôm nay):
 * A: hai sid ĐÚNG · polling trước CHỈ với client mặc định (kho: websocket trước) · to(A).to(B) 1 lần · sid đổi khi nối lại, TRỪ connectionStateRecovery (giữ, recovered=true) ·
 *    5 tin lúc rớt: mặc định 0/5, recovery 5/5. B: ping 25000/60000 · 4 điểm cuối WS (bài nói 3) · device.gateway 1.113 (bài 1.035) · gateway 4.000 dòng / 8 tệp.
 * so: sổ chạy thật của khoá — 50 bài có chỗ bị đo sửa, 32 chữ "SAI". kho: 3 commit sửa realtime sinh ra từ đo lường của khoá (13–14/11).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n11-1:song": "$ node song.mjs      # chạy lại các khẳng định của bài 11.1: socket.io 4.8.3 thật + kho hôm nay\nA engine.io sid ≠ socket.io id                         ⇒ lTJ0q2… ≠ j7c4zk… · ĐÚNG\nA \"luôn bắt đầu bằng polling\" — client mặc định        ⇒ transport mở đầu: polling\nC \"luôn bắt đầu bằng polling\" — client ['websocket','polling'] (kho) ⇒ transport mở đầu: websocket\nA io.to(A).to(B): socket ở cả A và B nhận mấy lần      ⇒ 1 lần\nA sid sau khi nối lại (mặc định)                       ⇒ ĐỔI · recovered=false\nA sid sau khi nối lại (connectionStateRecovery)        ⇒ GIỮ NGUYÊN · recovered=true\nA 5 tin phát lúc client đang rớt (mặc định)            ⇒ nhận 0/5\nA 5 tin phát lúc client đang rớt (connectionStateRecovery) ⇒ nhận 5/5\nB kho: pingInterval / pingTimeout                      ⇒ pingInterval: 25000 pingTimeout: 60000\nB kho: điểm cuối WebSocket gắn vào server HTTP         ⇒ 4 (bài 11.1 nói 3)\nB kho: device.gateway.ts                               ⇒ 1113 dòng (bài 11.1 nói 1.035)\nB kho: mọi tệp gateway (không tính test)               ⇒ 4000 dòng · 8 tệp",
 "n11-1:so": "$ awk '/^## 5\\./,/^## 6\\./' KE-HOACH-SOCKET-IO.md | grep -cE \"^- [0-9]+\\.[0-9]:\"     # sổ chạy thật của khoá: bao nhiêu bài có chỗ bị đo sửa\n50\n$ awk '/^## 5\\./,/^## 6\\./' KE-HOACH-SOCKET-IO.md | grep -oE \"\\bSAI\\b\" | wc -l     # bao nhiêu khẳng định bị ghi thẳng là SAI\n      32",
 "n11-1:kho": "$ git log --since=2026-11-13 --format='%h %ad %s' --date=short -- src/socket src/index.ts frontend/src/store/messagingStore.ts | grep fix | cut -c1-110\nce69e2c7f 2026-11-14 fix(shutdown): đóng cả hai kênh đồng soạn thảo Hocuspocus (ghi chú + Docs CT Work) khi tắ\n82084b1e2 2026-11-13 fix(realtime): không bao giờ gắn Redis adapter MUỘN (Redis tắt lúc khởi động ⇒ getRedis t\n3981e9a00 2026-11-13 fix(messenger): người bị chặn giữa phiên không còn nhận \"đã offline\" (lọc lại audience lú"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tn, icards, meter } from './_sio-chung.mjs';

export const deck = { key: 'sio-11-1', code: 'SIO 11.1', title: 'What survives measurement', sub: 'Chapter 11 · Lesson 11.1' };
const O = (k) => { const v = DU_LIEU[`n11-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const SONG = O('song'), SO = O('so'), KHO = O('kho');
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const soBai = +m(/grep -cE[^\n]*\n(\d+)/, SO)[1], soSai = +m(/wc -l[^\n]*\n\s*(\d+)/, SO)[1];
const A = SONG.split('\n').filter((l) => /^(A|C) /.test(l)).join('\n'), B = SONG.split('\n').filter((l) => /^B /.test(l)).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 11 · Lesson 11.1', t: 'What survives measurement', sub: 'Ten chapters of claims, sorted into three columns — and every column re-run today, against socket.io 4.8.3 and this repo.',
    en: 'Lesson eleven point one: what survives measurement. Ten chapters of claims sorted into three columns, and every column re-run today.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three columns: always true · true only when measured · intuition that lost</li>
    <li>Column A re-run live: which “laws” need a qualifier</li>
    <li>Column B re-read on today’s repo: the numbers already drifted</li>
    <li>Column C: one “wrong intuition” that was actually right for this repo</li>
    <li>How much of this course its own measurements corrected</li></ul>`,
    en: 'Five takeaways: the three columns; column A re-run; column B re-read; a column C item that was right after all; and how much of the course its measurements corrected.' },
  { t: 'Three columns', body: icards([
      ['shield', 'A · always true', 'Properties of socket.io 4.x itself. Carry them to any project — <b>with their condition</b>.'],
      ['eye', 'B · true when measured', 'Numbers of <b>this</b> repo: ping values, line counts, latencies. Re-run the probe on yours.'],
      ['alert', 'C · intuition that lost', 'What sounded right and failed a measurement. A checklist before you trust a gut feeling.'],
    ], 3) + box('The rule that ties them together', 'A number travels exactly as far as the sentence that says how it was measured. Lose the condition and an A becomes a C.', 'info'),
    en: 'Three columns: always true, true when measured, and intuition that lost. A number travels exactly as far as the sentence that says how it was measured.' },
  { t: 'Measured: column A re-run today', body: tn(A, { fs: 14, wrap: 120 }) +
      two(box('Survived', `Two sids; ${c('to(A).to(B)')} = union, each socket once; at-most-once <b>by default</b> (0/5 messages sent while the client was away).`, 'ok'),
        box('Needs its condition', `“Always starts with polling” — only with the <b>default</b> client; this repo’s client opens WebSocket first. “The sid changes on reconnect” and “nothing is replayed” — <b>unless</b> ${c('connectionStateRecovery')}: same sid, 5/5 delivered.`, 'bad')),
    en: 'Column A, re-run: two sids, union and at-most-once by default survive. Polling first holds only for the default client, and connection state recovery keeps the sid and delivers all five missed messages.' },
  { t: 'Column A, with the conditions written in', body: cmp(['claim', 'condition', 'measured', 'lesson'], [
      ['4 layers: wire → engine.io → socket.io → your code', '—', 'every chapter', '0.1'],
      ['engine.io sid ≠ socket.id', '—', 'different ids', '0.1 · 11.1'],
      ['client starts with polling', '<b>default</b> transports only', 'repo client: websocket first', '0.2 · 10.2'],
      ['at-most-once; reconnect does not replay', '<b>without</b> connectionStateRecovery', '0/5 vs 5/5', '6.1 · 11.1'],
      ['sid changes on reconnect', 'unless the session is <b>recovered</b>', 'changed vs kept', '1.3 · 11.1'],
      ['to(A).to(B) is a union', '—', '1 delivery', '3.1'],
      ['adapter ≠ sticky; a cluster needs both', 'polling clients (WebSocket-only needs no sticky)', '4/20 · 20/20', '2.3 · 10.5'],
      ['media never goes through socket.io', 'only signalling does', '28 frames, 30,622 B', '7.1'],
    ], { hl: [2, 3, 4] }),
    en: 'Column A with the conditions written in. Three rows needed one: polling first only by default; at-most-once and a new sid only without recovery.' },
  { t: 'Measured: column B, re-read on today’s repo', body: tn(B, { fs: 15, wrap: 120 }) +
      cmp(['page says', 'measured', 'when'], [
        ['3 WebSocket servers', '<b>4</b> endpoints (socket.io, 2× Hocuspocus, device ws)', '8.1 · today'],
        ['device.gateway.ts 1,035 lines', '<b>1,113</b>', '9.1 · today'],
        ['gateway code 2,430 lines', '3,935 (13/11) ⇒ <b>4,000</b> today, 8 files', '0.1 · today'],
        ['ping 25 s / timeout 60 s', 'same', 'today'],
        ['handshake “26 ms + 9 ms”', '5 events in 9 ms on this machine', '1.1'],
      ]),
    en: 'Column B, re-read today. Four WebSocket endpoints, not three. Eleven hundred thirteen lines, not ten thirty-five. Gateway code grew to four thousand lines in one day. Column B drifts; that is why it is column B.' },
  { t: 'Column C: one “wrong intuition” was right', body: cmp(['intuition', 'page’s verdict', 'measured'], [
        ['“the transports array decides the order”', 'wrong', '<b>right</b> for this repo: websocket first, and only the first is tried (10.2)'],
        ['“TCP makes socket.io reliable”', 'wrong', 'wrong ✓ — 0/5 while away'],
        ['“disconnect = offline”', 'wrong', 'wrong ✓ — tabs, workers (4.3, 10.5)'],
        ['“the adapter replaces sticky”', 'wrong', 'wrong ✓ — 4/20 without sticky'],
        ['“stream video through emit”', 'wrong', 'wrong ✓ — 10.3 Mbit / 20 s per viewer (7.1)'],
      ], { hl: [0] }) +
      box('Read it', `The page says the array “only declares what is allowed”. Run it: ${c("['websocket','polling']")} opens a WebSocket first, and with engine.io-client 6.6 a failed first transport is <b>not</b> followed by the second unless ${c('tryAllTransports')}. A column C entry that lost its own condition.`, 'bad'),
    en: 'Column C: four intuitions lose, as the page says. But one does not: the transports array does decide the order, and in this repo only the first is ever tried.' },
  { t: 'The measurement the page admits it got wrong', body: two(
      meter([['polling, sparse (bytes/msg)', 695, '#c0392b'], ['polling, bursty', 101, '#e0590b'], ['WebSocket', 36, '#1f8a3b']], { don: ' B', nhan: 260, w: 560, rh: 46, fs: 16 }),
      '<div>' + box('“133×”', `A multiplication, never run: 800 B of headers ÷ 6 B. Measured (0.2, 2.1): ~<b>10×</b> total bytes for 100 messages, and per message 36 B (WebSocket) vs 101–695 B (polling, bursty vs sparse) — a ratio that moves with the traffic pattern. Right direction, wrong number, wrong mechanism.`, 'info') +
      box('Why keep it', `It is the template for every other correction in this course: a number without its measurement sentence.`, 'ok') + '</div>', 'r46'),
    en: 'The measurement the page admits it got wrong: one hundred thirty-three times was a multiplication, never run. Measured: about ten times in total bytes, thirty-six versus one hundred one to six hundred ninety-five bytes per message.' },
  { t: 'Measured: how much the measurements corrected', body: tn(SO + '\n' + KHO, { fs: 14, wrap: 120 }) +
      two(box('In this course', `<b>${soBai}</b> lessons have at least one claim the run corrected; <b>${soSai}</b> are written down flat as wrong. Each one is in its lesson under “Measured”.`, 'info'),
        box('In the repo', `Three realtime fixes in two days came straight out of these measurements: late adapter attach (5.3), blocked user still told “offline” (4.2), Hocuspocus not closed on shutdown (8.4). More are open (10.2, 10.4).`, 'ok')),
    en: 'How much the measurements corrected: fifty lessons had at least one claim corrected by a run, and three real fixes landed in the repo in two days.' },
  { t: 'Using the three columns on your repo', body: steps([
      '<b>Column A</b>: apply it — but copy the <b>condition</b> with it (default client? recovery on? polling users?)',
      '<b>Column B</b>: re-run the probes of chapters 0–10 on your repo; your numbers will differ, the principle usually holds',
      '<b>Column C</b>: before a PR built on intuition, check it here — if it matches, measure first',
      '<b>Write the measurement sentence</b> next to every number you publish: payload, headers, pattern, version, machine',
    ]) + box('One sentence', 'Laws travel with their conditions; numbers travel with their measurement sentence; intuitions travel nowhere until measured.', 'info'),
    en: 'Using the columns: apply A with its condition; re-run B on your repo; check C before trusting intuition; and write the measurement sentence next to every number.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Column A', 'socket.io laws — with conditions'), kw('Column B', 'this repo’s numbers — re-run'), kw('Column C', 'intuitions that lost'),
      kw('Measurement sentence', 'payload · pattern · version · machine'), kw('connectionStateRecovery', 'same sid, missed events replayed'), kw('Drift', 'B numbers change with the repo'),
      kw('Kept mistake', '133× ⇒ ~10×'), kw('Portable claim', 'survives every condition you state'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: columns A, B and C; the measurement sentence; connection state recovery; drift; the kept mistake; and a portable claim.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Pick two column A laws; write their condition next to them',
      'Re-run one column B probe on your repo; write the measurement sentence',
      'Find one column C intuition in your own code review history',
      'Turn on connectionStateRecovery in a lab; count missed events before/after',
    ]), box('Keep these', `<ul><li>A laws carry conditions</li><li>B numbers drift — re-measure</li><li>C is a checklist before trusting a hunch</li><li>Recovery changes two A laws</li><li>A number = its measurement sentence</li></ul>`, 'info'), ''),
    en: 'Your turn: conditions for two laws, one probe re-run, one intuition from your history, and recovery on and off.' },
];
export const slides = lamDeck({ chuong: 'Chapter 11 — What survives measurement, and the final exam', bai: '11.1' }, S);
