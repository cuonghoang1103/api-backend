/**
 * sio-08-3 — Socket.IO · Chapter 8 · Lesson 8.3 "The Yjs binary sync protocol" (deck video + web, 14/11/2026).
 * Bài web: io-8-3-protocol. Output THẬT (scratchpad/sio/demo/n8-3.txt · lab ~/.rtq-sio/lab/c8/hp83.mjs + do83.mjs · @hocuspocus/server + provider 2.15.3 · yjs 13.6.32):
 * mo: mở note:1 (10 KB) — Auth token 16 B · step1 11 B (state vector 1 B) · authenticated "read-write" · server step1 18 B · step2 10.266 B.
 * go: 1 ký tự ⇒ ↑34 B; server gửi lại CẢ người gõ (34 B) + SyncStatus 9 B; con trỏ ⇒ người nhận GỬI LẠI awareness (provider không lọc origin).
 * nhom: N = 2/3/5. io: cùng update 15 B qua socket.emit = 2 khung 44 + 15 B. khoa: /mo không onAuthenticate ⇒ ai cũng sửa; token giả ⇒ permission-denied 27 B.
 * nghi: ngồi im 65 s — Hocuspocus gửi khung ping điều khiển mỗi 30 s; socket.io ping/pong 25 s. kho: debounce 1500 / maxDebounce 10000, chỉ extension Redis, 0 sanitize.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-3:mo": "$ node hp83.mjs &   node do83.mjs mo-dau     # An mở note:1 — server đã có 10 KB chữ; giải mã từng khung\n── An mở note:1 (server đã có 10 KB chữ) ⇒ synced · An có 10240 ký tự\n  An    ↑       16 B  note:1 · Auth token\n  An    ↑       11 B  note:1 · Sync step1 · state vector 1 B\n  An    ↑       19 B  note:1 · Awareness · 10 B trạng thái\n  An    ↓       20 B  note:1 · Auth authenticated \"read-write\"\n  An    ↓       18 B  note:1 · Sync step1 · state vector 8 B\n  An    ↑       12 B  note:1 · Sync step2 · update 2 B\n  An    ↓    10266 B  note:1 · Sync step2 · update 10255 B\n  tổng: An ↑58 B ↓10304 B\n$ node do83.mjs go                         # Bình cùng mở; An gõ MỘT ký tự rồi di con trỏ một lần\n── An gõ MỘT ký tự (Bình cùng mở)\n  An    ↑       34 B  note:1 · Sync update · update 24 B\n  An    ↓       34 B  note:1 · Sync update · update 24 B\n  An    ↓        9 B  note:1 · SyncStatus đã nhận ✓\n  Bình  ↓       34 B  note:1 · Sync update · update 24 B\n  tổng: An ↑34 B ↓43 B · Bình ↑0 B ↓34 B\n── An di con trỏ một lần\n  An    ↑       49 B  note:1 · Awareness · 40 B trạng thái\n  An    ↓       49 B  note:1 · Awareness · 40 B trạng thái\n  Bình  ↓       49 B  note:1 · Awareness · 40 B trạng thái\n  Bình  ↑       49 B  note:1 · Awareness · 40 B trạng thái\n  tổng: An ↑49 B ↓49 B · Bình ↑49 B ↓49 B\n$ node do83.mjs nhom                       # N = 2, 3, 5 người cùng mở — đếm mọi khung qua server\nN=2: gõ 1 ký tự ⇒ ↑1 khung 34 B · ↓3 khung 77 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑2 khung 98 B (người nhận gửi lại: 1) · ↓2 khung 98 B\nN=3: gõ 1 ký tự ⇒ ↑1 khung 33 B · ↓4 khung 108 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑3 khung 144 B (người nhận gửi lại: 2) · ↓3 khung 144 B\nN=5: gõ 1 ký tự ⇒ ↑1 khung 34 B · ↓6 khung 179 B (An tự nhận lại 1) │ di con trỏ 1 lần ⇒ ↑5 khung 245 B (người nhận gửi lại: 4) · ↓5 khung 245 B\n$ node do83.mjs io                         # cùng update Yjs gửi bằng socket.emit\ncùng update Yjs 15 B gửi bằng socket.emit('update', u): xem log server ↑ (hai khung)\n$ # log server\n[hp] :19905 · Hocuspocus /notes-collaboration (có token) + /mo (không) · socket.io\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · Bình\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · Bình\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · Bình\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · Bình\n[hp] onAuthenticate note:1 · An\n[hp] onAuthenticate note:1 · Bình\n[hp] onAuthenticate note:1 · An\n[io] nhận khung 2 B: 40\n[io] nhận khung 44 B: 451-[\"update\",{\"_placeholder\":true,\"num\":0}]\n[io] nhận khung 15 B: <nhị phân>",
 "n8-3:khoa": "$ node do83.mjs khoa     # /mo không có onAuthenticate · /notes-collaboration với token giả\n/mo (không onAuthenticate), không token, mở note:123 ⇒ synced, sửa được\n── /notes-collaboration, token giả ⇒ authenticationFailed: permission-denied\n  Lạ    ↑       17 B  note:1 · Auth token\n  Lạ    ↑       11 B  note:1 · Sync step1 · state vector 1 B\n  Lạ    ↑       19 B  note:1 · Awareness · 10 B trạng thái\n  Lạ    ↓       27 B  note:1 · Auth permission-denied \"permission-denied\"\n  Lạ    ↑       21 B  note:1 · Awareness · 12 B trạng thái\n  tổng: Lạ ↑68 B ↓27 B\n$ # log server\n[hp] :19905 · Hocuspocus /notes-collaboration (có token) + /mo (không) · socket.io\n[hp /mo] note:123 bị sửa: \"ai đó không đăng nhập\"\n[onAuthenticate] token không hợp lệ",
 "n8-3:kho": "$ cd ~/api-backend && grep -n \"debounce:\\|maxDebounce:\\|extensions:\\|connection.readOnly =\" src/socket/notes-collaboration.gateway.ts\n197:    debounce: 1500,\n198:    maxDebounce: 10000,\n199:    extensions: [redisExtension],\n204:      connection.readOnly = !canEditSharedNote(context.permission);\n224:      connection.readOnly = !canEditSharedNote(access.permission);\n$ grep -n \"timeout: 30000\\|debounce: 2000\\|maxDebounce: 10000\" node_modules/@hocuspocus/server/dist/hocuspocus-server.cjs   # mặc định 2.15.3\n2420:    timeout: 30000,\n2421:    debounce: 2000,\n2422:    maxDebounce: 10000,\n$ grep -rn \"sanitize\\|Throttle\\|extension-database\\|extension-logger\" src/socket/notes-collaboration.gateway.ts src/services/notesRealtime*.ts | wc -l\n       0\n$ grep -n \"broadcast: true\\|token: refreshToken\" frontend/src/components/notes/NoteRealtimeEditor.tsx\n146:          token: refreshToken,\n148:          broadcast: true,",
 "n8-3:nghi": "$ node do83.mjs nghi     # ngồi im 65 s: Hocuspocus vs socket.io (pingInterval 25 s như kho)\n  -0.004 s  ↓      9 B  note:1 · SyncStatus đã nhận ✓\n  14.99 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái\n  14.995 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái\n  29.993 s  ping   0 B  khung ping điều khiển WebSocket (Hocuspocus, timeout 30 s)\n  29.996 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái\n  29.997 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái\n  45.007 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái\n  45.008 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái\n  59.995 s  ping   0 B  khung ping điều khiển WebSocket (Hocuspocus, timeout 30 s)\n  60.015 s  ↑     19 B  note:1 · Awareness · 10 B trạng thái\n  60.015 s  ↓     19 B  note:1 · Awareness · 10 B trạng thái\nngồi im 65 s · Hocuspocus: 9 khung dữ liệu, 2 khung ping điều khiển (WebSocket, 2 B + pong tự động) · socket.io (pingInterval 25 s như kho): 4 gói engine.io, 4 B (ping \"2\" / pong \"3\")"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tsx, tn, seq } from './_sio-chung.mjs';

export const deck = { key: 'sio-08-3', code: 'SIO 8.3', title: 'The Yjs binary sync protocol', sub: 'Chapter 8 · Lesson 8.3' };
const O = (k) => { const v = DU_LIEU[`n8-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const MO = O('mo'), KHOA = O('khoa'), NGHI = O('nghi'), KHO = O('kho');
const ex = (t) => t.split('\n').map((l) => l.replace(/^\$ (node (?:hp83\.mjs &\s+)?(?:node )?do83\.mjs \w+)\s+#.*$/, '$ $1')).join('\n');
const doan = (tieu, het) => { const a = MO.indexOf(tieu); const b = het ? MO.indexOf(het, a + 1) : -1; return MO.slice(a, b < 0 ? undefined : b).trimEnd(); };
const MODAU = doan('── An mở note:1', '$ node do83.mjs go'), GO = doan('── An gõ MỘT', '── An di'), CT = doan('── An di', '$ node do83.mjs nhom');
const step2 = m(/↓\s+(\d+) B\s+note:1 · Sync step2/, MODAU)[1], sv = m(/↓\s+(\d+) B\s+note:1 · Sync step1 · state vector (\d+) B/, MODAU);
const N = [...MO.matchAll(/^N=(\d+): gõ 1 ký tự ⇒ ↑(\d+) khung (\d+) B · ↓(\d+) khung (\d+) B.*di con trỏ 1 lần ⇒ ↑(\d+) khung (\d+) B \(người nhận gửi lại: (\d+)\) · ↓(\d+) khung (\d+) B/gm)]
  .map((x) => x.slice(1).map(Number));
const IO = [...MO.matchAll(/\[io\] nhận khung (\d+) B: (.*)$/gm)].filter((x) => x[2] !== '40').map((x) => [+x[1], x[2]]);
const ng = m(/Hocuspocus: (\d+) khung dữ liệu, (\d+) khung ping.*?socket\.io.*?: (\d+) gói engine\.io, (\d+) B/, NGHI);
const awT = [...NGHI.matchAll(/^\s+([\d.]+) s\s+↑\s+(\d+) B\s+note:1 · Awareness/gm)].map((x) => Math.round(+x[1]));
const NGHI_G = NGHI.split('\n').filter((l) => !/^\s+-/.test(l) && !/^ngồi im/.test(l) && !/\s↓\s/.test(l)).map((l) => l.replace(/\s+#.*$/, '')).join('\n');
const vn = (n) => Number(n).toLocaleString('en-US');

/** Giải phẫu một khung Hocuspocus: byte thật từ trình duyệt (8.1) — "note:1" + Sync + step1 + state vector rỗng. */
function giaiPhau() {
  const o = [['06', 'length 6', '#7c3aed'], ['6e 6f 74 65 3a 31', '"note:1" = document name', '#7c3aed'], ['00', 'type 0: Sync', '#0e7490'], ['00', 'sub 0: step1', '#0e7490'], ['01 00', '', '#b85a2b']];
  let x = 10, s = `<svg viewBox="0 0 1110 150" width="1110" height="150" font-family="Arial">`;
  o.forEach(([b, t, mau], i) => { const w = 28 + b.length * 14; s += `<rect x="${x}" y="10" width="${w}" height="54" rx="8" fill="${mau}18" stroke="${mau}" stroke-width="2.5"/><text x="${x + w / 2}" y="45" text-anchor="middle" font-family="Consolas,monospace" font-size="22" font-weight="700" fill="${mau}">${b}</text>`;
    s += `${t ? `<line x1="${x + w / 2}" y1="66" x2="${x + w / 2}" y2="${i % 2 ? 98 : 74}" stroke="${mau}" stroke-width="1.5"/>` : ''}<text x="${x + w / 2}" y="${i % 2 ? 114 : 90}" text-anchor="middle" font-size="16" font-weight="700" fill="${mau}">${t}</text>`; x += w + 12; });
  return s + `<text x="602" y="34" font-size="17" font-weight="700" fill="#b85a2b">← state vector: 1 byte long, 0 authors</text><text x="602" y="58" font-size="16" fill="#64748b">11 bytes, captured in Chromium (lesson 8.1)</text></svg>`;
}

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.3', t: 'The Yjs binary sync protocol', sub: 'Every frame of a real Hocuspocus session, decoded byte by byte — open, type, move the cursor, sit idle.',
    en: 'Lesson eight point three: the Yjs binary sync protocol. Every frame of a real Hocuspocus session, decoded: opening a document, typing, moving the cursor, and sitting idle.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The shape of every frame: document name, message type, payload</li>
    <li>Opening a document: Auth, SyncStep1 (state vector), SyncStep2 (what you lack) — measured</li>
    <li>One keystroke and one cursor move, counted frame by frame for 2, 3 and 5 people</li>
    <li>Idle traffic, and the same update sent over socket.io for comparison</li>
    <li>What the repo configures — and a Hocuspocus server with no auth, measured</li></ul>`,
    en: 'Five takeaways: the shape of every frame; opening a document; one keystroke and one cursor move counted for two, three and five people; idle traffic and socket.io for comparison; and the repo configuration plus the no-auth trap.' },
  { t: 'Anatomy of a frame', body: giaiPhau() + cmp(['type', 'name', 'what it carries'], [
      ['0', 'Sync', 'sub-type 0 step1 (state vector) · 1 step2 (missing updates) · 2 update'], ['1', 'Awareness', 'cursor, name, colour — the whole local state'],
      ['2', 'Auth', '0 token · 1 permission-denied (reason) · 2 authenticated (scope)'], ['8', 'SyncStatus', 'server: “your update was applied” (✓ / ✗)'],
      ['3 · 4 · 5 · 7', 'QueryAwareness · SyncReply · Stateless · CLOSE', 'less common; the web page lists only the first four ideas'],
    ], { hl: [0] }),
    en: 'Anatomy of a frame: a length-prefixed document name, a message type, then the payload. Type zero is sync with three sub-types, one is awareness, two is auth, eight is sync status.' },
  { t: 'Opening a document, measured', body: two(
      seq(['provider', 'Hocuspocus'], [[0, 1, 'Auth · token (16 B)'], [0, 1, 'Sync step1 · my state vector (1 B)'], [0, 1, 'Awareness (19 B)'],
        [1, 0, 'Auth · authenticated "read-write"', '#1f8a3b'], [1, 0, `Sync step1 · server state vector (${sv[2]} B)`, '#1f8a3b'], [0, 1, 'Sync step2 · what you lack: nothing (2 B)'],
        [1, 0, `Sync step2 · what you lack: ${vn(step2)} B`, '#1f8a3b']], { w: 520, rh: 40, fs: 14 }),
      tn(ex(MODAU), { fs: 13, wrap: 64 }), 'r46') +
      box('Versus the web page', `“SyncStep1 ~50 bytes” — measured <b>1 B</b> (new client, nothing yet) and <b>${sv[2]} B</b> (server, one author). It holds one (clientID, clock) pair per author. Step2 carried the whole 10 KB document: <b>${vn(step2)} B</b>.`, 'info'),
    en: 'Opening a document, measured: the provider sends its token, its state vector and its awareness. The server answers authenticated, its own state vector, and then step two with everything the client lacks: ten kilobytes here.' },
  { t: 'The state vector: “what I already have”', body: two(tsx(`// state vector = for each author: the next clock I expect
{ 1: 10240 }          // server: client 1 wrote 10,240 items
{ }                   // new client: nothing yet  → 1 byte

// step1 →  "here is my vector"
// step2 ←  Y.encodeStateAsUpdate(doc, theirVector)
//          = only the items they do not have`, { fs: 15 }),
      box('Why it is cheap', `Instead of “send me everything”, each side sends a tiny summary and receives only the difference. Reconnect after a short drop and step2 is a few bytes, not the document. It is the vector clock of distributed systems, one counter per writer.`, 'ok'), 'r64') +
      box('Both directions', `Sync runs both ways at once: the client also answers the server's step1 with its own step2 — that is how edits made offline reach the server after a reconnect.`, 'info'),
    en: 'The state vector says what I already have: one clock per author. Each side receives only the difference, so a reconnect costs a few bytes, and sync runs both ways, which is how offline edits get back to the server.' },
  { t: 'One keystroke, frame by frame', body: two(tn(ex(GO), { fs: 14, wrap: 64 }), tn(ex(CT), { fs: 14, wrap: 64 })) +
      two(box('Typing', `An sends <b>34 B</b>. Hocuspocus 2.15.3 broadcasts the update to <b>every</b> connection of the document — Binh <b>and An himself</b> — then sends An a <b>9 B</b> SyncStatus ✓. The page's “20 bytes × (N−1) peers” is really N copies plus one status.`, 'info'),
        box('Cursor', `An's awareness (49 B) reaches Binh, and Binh's provider <b>sends it back up</b>: its awareness handler forwards every change, local or remote. The server ignores the echo (same clock), but the upload is spent.`, 'bad')),
    en: 'One keystroke, frame by frame: thirty four bytes up, then the server sends the update to everyone including the sender, plus a nine byte sync status. A cursor move is echoed back up by every receiver.' },
  { t: 'Two, three, five people', body: cmp(['people', 'type 1 char: up', 'down (all clients)', 'move cursor: up', 'of which echoes', 'down'], N.map((r) => [`N = ${r[0]}`, `${r[1]} frame · ${r[2]} B`, `${r[3]} frames · ${r[4]} B`, `${r[5]} frames · ${r[6]} B`, String(r[7]), `${r[8]} frames · ${r[9]} B`]), { hl: [2] }) +
      two(box('Read it', `Typing: down = <b>N</b> update copies (sender included) + 1 status. Cursor: up = 1 + (N−1) echoes, down = N. Both are linear in N per action — but every action fans out to everyone, so a busy room is N² overall, exactly like presence in 4.1.`, 'info'),
        box('Versus the web page', `“Cursor ~150 B (throttled ~100 ms)” — measured ${N[0][6] / N[0][5]} B per frame here. The provider does not throttle awareness by itself; the editor (Tiptap collaboration cursor) decides how often it calls it.`, 'ok')),
    en: 'Two, three, five people: every keystroke becomes N copies down plus a status, every cursor move N frames up and N down. Linear per action, but in a busy room that fans out to N squared, like presence in lesson four point one.' },
  { t: 'Idle, and the same update over socket.io', body: two(tn(NGHI_G + '\n(each ↑ awareness is echoed back ↓ 19 B — lines omitted)', { fs: 13, wrap: 60 }), tn(MO.split('\n').filter((l) => /^\[io\]|\$ node do83\.mjs io/.test(l)).map((l) => l.replace(/\s+#.*$/, '')).join('\n'), { fs: 13, wrap: 56 })) +
      two(box('Idle is not zero', `The page says “idle: 0 traffic”. Measured over 65 s with nobody typing: the provider <b>renews its awareness every 15 s</b> (${awT.join(', ')} s; 19 B up + 19 B echo) and Hocuspocus sends a WebSocket <b>ping frame every 30 s</b>. socket.io (repo settings): ${ng[3]} packets, ${ng[4]} B. Small, never zero.`, 'info'),
        box('Same bytes, socket.io envelope', `A ${IO[1] ? IO[1][0] : '?'} B Yjs update sent with ${c("socket.emit('update', u)")}: <b>two</b> frames — ${IO[0][0]} B placeholder + ${IO[1][0]} B binary = ${IO[0][0] + IO[1][0]} B. Hocuspocus: one frame, update + 7 B document name + 3 B header.`, 'ok')),
    en: 'Idle is not zero: the provider renews its awareness every fifteen seconds and Hocuspocus sends a WebSocket ping control frame every thirty seconds; socket.io pings every twenty five. And the same Yjs update over socket dot emit becomes two frames.' },
  { t: 'What the repo actually configures', body: cmp(['Web page says', 'Repo (measured)'], [
        ['Redis + Database + Logger + Throttle extensions', `only ${c('extensions: [redisExtension]')} (gateway.ts:199); storage in ${c('onStoreDocument')}`],
        ['“default saves every 2 s, repo 5 s”', `default ${c('debounce: 2000')} / ${c('maxDebounce: 10000')} (Hocuspocus 2.15.3); repo <b>1500</b> / 10000 (:197–198)`],
        ['sanitize HTML on save', `<b>${m(/\|\s*wc -l\n\s*(\d+)/, KHO)[1]}</b> matches for sanitize / Throttle / Database / Logger`],
        ['live permission check', `${c('connection.readOnly')} set at auth (:204) and re-checked every 5 s (:224) — lesson 8.5`],
      ]) + box('Frontend', `${c('broadcast: true')} also syncs tabs of the same browser over BroadcastChannel; ${c('token: refreshToken')} fetches a fresh 5-minute token on every reconnect (8.5).`, 'info'),
    en: 'What the repo actually configures: only the Redis extension, storage in on store document with a debounce of one and a half seconds and a ten second maximum, no sanitize step, and read only set at authentication.' },
  { t: 'Trap: a Hocuspocus server with no auth', body: tn(ex(KHOA), { fs: 14, wrap: 100 }) + two(
      box('Measured', `With no ${c('onAuthenticate')} hook, a client with <b>no token</b> opened ${c('note:123')} and its edit landed on the server. With the hook, a fake token got a <b>27 B</b> ${c('Auth · permission-denied')} frame — and the document never synced to it.`, 'bad'),
      tsx(`new Hocuspocus({
  async onAuthenticate({ token, documentName }) {
    const ctx = await verify(token, documentName);
    if (!ctx) throw new Error('forbidden');
    return ctx;  // context for every hook
  },
});`, { fs: 13 })),
    en: 'The trap: a Hocuspocus server without an on authenticate hook lets anyone open any document name and edit it. With the hook, a fake token gets a permission denied frame and never syncs.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Frame', 'document name + message type + payload'), kw('SyncStep1', 'my state vector — what I already have'),
      kw('SyncStep2', 'exactly the items the other side lacks'), kw('Update', 'one edit, broadcast to every connection'),
      kw('SyncStatus', 'server ✓ for the sender'), kw('Awareness', 'whole cursor/name state, resent each change'),
      kw('State vector', 'one clock per author'), kw('Ping frame', 'WebSocket control frame every 30 s'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: frame; sync step one; sync step two; update; sync status; awareness; state vector; and ping frame.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run a Hocuspocus server; open a doc from a provider and log every frame',
      'Decode: document name, type, sub-type, payload size',
      'Type one character with 2 and 5 clients open; count frames up and down',
      'Remove onAuthenticate and open any document without a token',
    ]), box('Keep these', `<ul><li>Every frame starts with the document name</li><li>Open = Auth + step1/step2 both ways</li><li>An update goes to N connections + 1 status</li><li>Awareness is resent whole, and echoed</li><li>Idle still pings; no auth = open doors</li></ul>`, 'info'), ''),
    en: 'Your turn: run a server, log and decode every frame, count frames for two and five clients, and try a server with no authentication.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Collaborative editing: when NOT to use socket.io', bai: '8.3' }, S);
