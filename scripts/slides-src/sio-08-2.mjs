/**
 * sio-08-2 — Socket.IO · Chapter 8 · Lesson 8.2 "CRDT vs events: why the merge is automatic" (deck video + web, 14/11/2026).
 * Bài web: io-8-2-crdt. Output THẬT (scratchpad/sio/demo/n8-2.txt · lab ~/.rtq-sio/lab/c8/crdt82.mjs · yjs 13.6.32 · y-protocols 1.0.7 · socket.io 4.8.3):
 * sukien: event "chèn ở pos" qua socket.io ⇒ 1 lần gõ mỗi bên đã lệch; 200 lần ⇒ 189 vị trí khác. yjs: mọi thứ tự áp ⇒ giống; tie theo clientID nhỏ đứng trước.
 * id: Item ID (client, clock) + origin. ngaunhien: 3 × 300 thao tác, 650 update xáo + trùng ⇒ giống hệt. kichthuoc: 1,00 B/ký tự (gõ cuối) · 16,86 (chỗ ngẫu nhiên)
 *   · xoá 9 KB vẫn 162 KB · dựng mới 1 KB nhưng bản cũ không ghép được · RAM 213× vs 11×. awareness 51/84/8 B, 30 s. json: 56 B ⇒ 464 B, đọc lại lỗi.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-2:sukien": "$ node crdt82.mjs sukien     # socket.io chuyển event \"chèn ch ở pos\" · mỗi bên áp tay mình ngay · trễ mạng 40 ms\n1 lần gõ mỗi bên:  An \"Hello world?!\"   Bình \"Hello world!?\"   giống nhau? false\n200 lần gõ xen kẽ (5 ms/lần, trễ 40 ms): dài 211/211 · khác nhau 186 vị trí · giống nhau? false",
 "n8-2:yjs": "$ node crdt82.mjs yjs        # cùng cảnh đó bằng Y.Doc: hai người chèn ở vị trí 11 cùng lúc, đổi thứ tự áp, đổi clientID\nclientID An=7 Bình=9 · áp An trước: An \"Hello world!?\"  Bình \"Hello world!?\"  giống? true · update của An 10 B\nclientID An=7 Bình=9 · áp Bình trước: An \"Hello world!?\"  Bình \"Hello world!?\"  giống? true · update của An 10 B\nclientID An=9 Bình=7 · áp An trước: An \"Hello world?!\"  Bình \"Hello world?!\"  giống? true · update của An 10 B\nclientID An=9 Bình=7 · áp Bình trước: An \"Hello world?!\"  Bình \"Hello world?!\"  giống? true · update của An 10 B\náp lại toàn bộ trạng thái 2 lần nữa (trùng lặp): \"Hello world!?\" — không đổi",
 "n8-2:id": "$ node crdt82.mjs id         # bên trong Y.Text: mỗi mẩu có ID (client, clock) + mẩu bên trái lúc chèn\nID (client 1, clock 0…10)  bên trái gốc —        nội dung \"Hello world\"\nID (client 7, clock 0)  bên trái gốc (1,10)   nội dung \"!\"\nID (client 9, clock 0)  bên trái gốc (1,10)   nội dung \"?\"\nthứ tự đọc: Hello world!?",
 "n8-2:ngaunhien": "$ node crdt82.mjs ngaunhien  # 3 người × 300 thao tác chèn/xoá đồng thời · nhận update xáo trộn + bản trùng\ntrước khi gặp nhau: người 1 dài 119 · người 2 dài 133 · người 3 dài 129\nngười 1: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378\nngười 2: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378\nngười 3: nhận 650 update (xáo trộn, 50 bản trùng) ⇒ dài 378\n3 bản giống hệt từng ký tự? true · đầu chuỗi: \"hjfskuvccnlzbuezcyziasrdspozksovjoupoesh…\"",
 "n8-2:kichthuoc": "$ node --expose-gc crdt82.mjs kichthuoc   # 10 KB chữ: byte trên đĩa (encodeStateAsUpdate) và RAM\ndán 10 KB một lần                            chữ  10240 ·      1 update, tổng   10.0 KB · trạng thái gộp  10.0 KB (1.00 B/ký tự)\ngõ 10 KB từng ký tự, cuối dòng               chữ  10240 ·  10240 update, tổng  199.7 KB · trạng thái gộp  10.0 KB (1.00 B/ký tự)\ngõ 10 KB từng ký tự, chỗ ngẫu nhiên          chữ  10240 ·  10240 update, tổng  268.5 KB · trạng thái gộp 168.6 KB (16.86 B/ký tự)\ngõ ngẫu nhiên rồi xoá 9 KB (gc: true, mặc định) chữ   1024 ·  19456 update, tổng  367.2 KB · trạng thái gộp 162.2 KB (162.19 B/ký tự)\ngõ ngẫu nhiên rồi xoá 9 KB (gc: false)       chữ   1024 ·  19456 update, tổng  367.2 KB · trạng thái gộp 171.2 KB (171.17 B/ký tự)\n\"nén\" bằng cách dựng tài liệu MỚI từ chữ hiện tại: 1.0 KB\nngười còn giữ bản cũ gõ 1 ký tự ⇒ áp vào tài liệu mới: chữ KHÔNG có 'X' · update treo chờ: có\nRAM: 20 Y.Doc, mỗi cái 10 KB gõ chỗ ngẫu nhiên ⇒ heap +2134 KB mỗi tài liệu (≈ 213× chữ)\nRAM: 20 Y.Doc, mỗi cái 10 KB gõ cuối dòng ⇒ heap +109 KB mỗi tài liệu (≈ 10.9× chữ)",
 "n8-2:awareness": "$ node crdt82.mjs awareness  # y-protocols/awareness: con trỏ + tên, KHÔNG nằm trong Y.Doc\nawareness An (tên + màu): 51 B · Bình giữ 2 trạng thái (An + chính mình)\ndi con trỏ 3 lần: mỗi lần gửi LẠI cả trạng thái 84 B (clock 4) — không ghép, không lưu lịch sử\nAn rời trang (setLocalState null): 8 B ⇒ Bình còn thấy An? không · hết hạn tự động khi im: 30 s · doc vẫn y nguyên: Y.Doc không chứa con trỏ",
 "n8-2:json": "$ node crdt82.mjs json       # bẫy: lưu update Yjs bằng JSON.stringify\nUint8Array: 56 B · JSON.stringify(Uint8Array): 464 B, bắt đầu {\"0\":1,\"1\":1,\"2\":169,\"3\":245,\"…\nJSON.stringify(Buffer): 219 B, bắt đầu {\"type\":\"Buffer\",\"data\":[1,1,169…\nđọc lại từ JSON: Error: Unexpected end of array\nđọc lại từ bytes (BYTEA/Buffer): \"Xin chào, đây là ghi chú cộng tác.\"",
 "n8-2:kho": "$ cd ~/api-backend && grep -n \"encodeStateAsUpdate\\|MAX_DOCUMENT_BYTES =\\|state: Buffer.from\" src/socket/notes-collaboration.gateway.ts\n23:const MAX_DOCUMENT_BYTES = 4 * 1024 * 1024;\n86:  const state = Y.encodeStateAsUpdate(document);\n110:        state: Buffer.from(state),\n116:        state: Buffer.from(state),\n$ grep -n \"  state  *Bytes\\|stateVector Bytes\" prisma/schema.prisma\n5087:  state       Bytes\n5088:  stateVector Bytes    @map(\"state_vector\")\n15279:  state          Bytes?\n$ grep -n \"setAwarenessField\\|onAwarenessChange\" frontend/src/components/notes/NoteRealtimeEditor.tsx\n163:          onAwarenessChange: ({ states }) => {\n187:        provider.setAwarenessField('user', localUser);"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tsx, tn, icards, seq, meter } from './_sio-chung.mjs';

export const deck = { key: 'sio-08-2', code: 'SIO 8.2', title: 'CRDT vs events: why the merge is automatic', sub: 'Chapter 8 · Lesson 8.2' };
const O = (k) => { const v = DU_LIEU[`n8-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const SK = O('sukien'), YJ = O('yjs'), ID = O('id'), NN = O('ngaunhien'), KT = O('kichthuoc'), AW = O('awareness'), JS = O('json'), KHO = O('kho');
const ex = (t) => t.split('\n').map((l) => l.replace(/^\$ (\S+ )*node (--expose-gc )?crdt82\.mjs (\w+)\s+#.*$/, '$ node crdt82.mjs $3')).join('\n');
const khac = m(/khác nhau (\d+) vị trí/, SK)[1], dai200 = m(/dài (\d+)\/(\d+)/, SK);
const kt = (ten) => { const x = m(new RegExp(`^${ten}.*?chữ\\s+(\\d+) ·\\s+(\\d+) update, tổng\\s+([\\d.]+) KB · trạng thái gộp\\s+([\\d.]+) KB \\(([\\d.]+) B\\/ký tự\\)`, 'm'), KT);
  return { chu: +x[1], n: +x[2], log: +x[3], st: +x[4], bpc: +x[5] }; };
const K1 = kt('dán 10 KB'), K2 = kt('gõ 10 KB từng ký tự, cuối'), K3 = kt('gõ 10 KB từng ký tự, chỗ'), K4 = kt('gõ ngẫu nhiên rồi xoá 9 KB \\(gc: true'), K5 = kt('gõ ngẫu nhiên rồi xoá 9 KB \\(gc: false');
const nen = m(/từ chữ hiện tại: ([\d.]+) KB/, KT)[1];
const ram = [...KT.matchAll(/heap \+(\d+) KB mỗi tài liệu \(≈ ([\d.]+)× chữ\)/g)].map((x) => [+x[1], x[2]]);
const aw = [m(/tên \+ màu\): (\d+) B/, AW)[1], m(/cả trạng thái (\d+) B/, AW)[1], m(/null\): (\d+) B/, AW)[1], m(/khi im: (\d+) s/, AW)[1]];
const js = [m(/Uint8Array: (\d+) B/, JS)[1], m(/JSON.stringify\(Uint8Array\): (\d+) B/, JS)[1], m(/đọc lại từ JSON: (.*)$/m, JS)[1]];
const v = (n) => String(n).replace('.', ',');

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.2', t: 'CRDT vs events:<br>why the merge is automatic', sub: 'Two people type at the same spot — events drift apart, a Y.Doc converges. Measured, with the cost.',
    en: 'Lesson eight point two: CRDT versus events, and why the merge is automatic. Two people type at the same spot: events drift apart, a Y.Doc converges. Measured, with the cost.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why “insert X at position 11” events break under concurrent edits — measured over socket.io</li>
    <li>What a CRDT stores instead of positions: an ID (client, clock) and a left neighbour</li>
    <li>Commute, measured: 3 people, 900 edits, shuffled and duplicated updates — one result</li>
    <li>The bill: bytes per character, RAM, deletions that never shrink the doc</li>
    <li>Awareness (cursors) is separate — and the JSON trap when you store a Y.Doc</li></ul>`,
    en: 'Five takeaways: why position events break; what a CRDT stores instead; commute measured; the bill in bytes and RAM; and awareness plus the JSON storage trap.' },
  { t: 'Events with positions: two copies drift apart', body: two(
      seq(['An', 'socket.io', 'Binh'], [[0, 1, 'insert(11,"!") · An: "Hello world!"'], [2, 1, 'insert(11,"?") · Binh: "Hello world?"', '#2563eb'],
        [1, 2, '→ Binh applies at 11: "Hello world!?"'], [1, 0, '→ An applies at 11: "Hello world?!"', '#2563eb']], { w: 560, rh: 48, fs: 14 }),
      tn(ex(SK), { fs: 14, wrap: 58 }), 'r46') +
      box('Measured', `One keystroke each at the same spot is enough: An reads <b>"Hello world?!"</b>, Binh <b>"Hello world!?"</b>. 200 interleaved keystrokes with 40 ms of network delay: both ${dai200[1]} characters long, <b>${khac}</b> positions differ. Nothing ever tells them they disagree.`, 'bad'),
    en: 'Events that carry positions drift apart. One keystroke each at the same spot already gives two different texts; two hundred interleaved keystrokes left one hundred and eighty nine positions different.' },
  { t: 'Two ways out: transform positions, or stop using them', body: icards([
      ['loop', 'Operational Transform (OT)', 'A central server orders every operation and rewrites positions (“your 11 is now 12”). Google Docs works this way. Needs that server on every edit, and the transform rules are notoriously hard.'],
      ['merge', 'CRDT (Yjs)', 'Every character gets an ID and remembers the ID on its left when inserted. An edit says “after (1,10)”, not “at 11”. Any replica can merge any update, in any order, offline included.'],
    ], 2) + box('Why “at 11” fails', `A position is a fact about <b>one</b> copy at <b>one</b> moment. The moment the other side inserts before it, the number points somewhere else. An ID never moves.`, 'info'),
    en: 'Two ways out. Operational transform keeps positions and lets a central server rewrite them. A CRDT stops using positions: every character has an ID and remembers its left neighbour.' },
  { t: 'Inside a Y.Text: ID (client, clock) + left origin', body: tn(ex(ID), { fs: 15, wrap: 110 }) + two(
      cmp(['IDs An / Binh', 'applied', 'both read'], YJ.split('\n').filter((l) => /^clientID/.test(l)).map((l) => {
        const x = m(/An=(\d+) Bình=(\d+) · áp (.*?): An "(.*?)"/, l); return [`${x[1]} / ${x[2]}`, x[3] === 'An trước' ? 'An first' : 'Binh first', `${x[4]}`]; }), { hl: [0] }),
      box('How the tie is broken', `“!” and “?” both say “after (1,10)”. Yjs puts the item with the <b>lower clientID</b> first (measured: 7 before 9, whichever arrives first). Not the web page's “id:100.A”: an ID is <b>(client, clock)</b> + left origin.`, 'ok'), 'r64'),
    en: 'Inside a Y.Text every run of characters has an ID: client and clock, plus the ID of its left neighbour when it was inserted. Two inserts after the same neighbour are ordered by client ID, lower first, whatever the arrival order.' },
  { t: 'Commute, measured on 900 edits', body: tn(ex(NN), { fs: 15, wrap: 100 }) + two(
      box('What was tested', `3 people, 300 random inserts and deletes each, nobody seeing anybody. Each then received the other two people's <b>600</b> updates in a shuffled order plus <b>50</b> duplicates.`, 'info'),
      box('Three properties', `<b>Commutative</b>: any order. <b>Associative</b>: any grouping (merge first or one by one). <b>Idempotent</b>: a duplicate changes nothing. So ${c('apply(apply(D, u), v) === apply(apply(D, v), u)')} — no lock, no server deciding.`, 'ok')),
    en: 'Commute, measured: three people, three hundred random edits each, every update delivered shuffled and with duplicates. All three copies ended identical, character for character.' },
  { t: 'The bill: bytes on disk, RAM in memory', body: cmp(['10 KB of text, typed…', 'updates sent', 'merged state (disk)', 'bytes / char', 'RAM while open'], [
      ['pasted at once', `${K1.n} · ${v(K1.log)} KB`, `${v(K1.st)} KB`, v(K1.bpc), '—'], ['char by char, at the end', `${K2.n} · ${v(K2.log)} KB`, `${v(K2.st)} KB`, v(K2.bpc), `${ram[1][0].toLocaleString('en-US')} KB (≈ ${ram[1][1]}×)`],
      ['char by char, random spots', `${K3.n} · ${v(K3.log)} KB`, `${v(K3.st)} KB`, `<b>${v(K3.bpc)}</b>`, `<b>${ram[0][0].toLocaleString('en-US')} KB (≈ ${ram[0][1]}×)</b>`],
    ], { hl: [2] }) + box('Why the patterns differ', `Characters typed one after another by the same client merge into <b>one run</b> (one ID range, one object). Typing all over the document splits runs, so nearly every character becomes its own item with its own ID and origin — on disk and, much heavier, as a JS object in RAM.`, 'ok') +
      box('Versus the web page', `“16 bytes per character … usually 2–3×” — both happen. Typing at the end merges into runs: <b>${v(K2.bpc)} B/char</b>. Editing all over the document: <b>${v(K3.bpc)} B/char</b> on disk and <b>~${ram[0][1]}×</b> in RAM while the doc is open.`, 'info'),
    en: 'The bill. Typed at the end, Yjs merges characters into runs: about one byte per character. Typed at random spots, about seventeen bytes per character on disk and two hundred times the text in RAM.' },
  { t: 'Deletes never shrink the doc — and “compaction” is not free', body: cmp(['After typing 10 KB at random, then deleting 9 KB', 'text left', 'merged state'], [
      ['gc: true (default) — deleted content dropped', `${K4.chu} chars`, `<b>${v(K4.st)} KB</b>`], ['gc: false (needed for version snapshots)', `${K5.chu} chars`, `${v(K5.st)} KB`],
      ['rebuilt as a NEW doc from the current text', `${K5.chu} chars`, `${v(nen)} KB`],
    ], { hl: [0] }) + two(box('Tombstones are structure', `${c('gc')} throws away the deleted <b>content</b>, but the IDs that ordered it stay, so a 1 KB text still weighs ~${Math.round(K4.st)} KB. Merging the update log is real compaction (${v(K2.log)} KB → ${v(K2.st)} KB above) — it is what the repo stores.`, 'info'),
      box('Rebuilding breaks merging', `A fresh doc is ${v(nen)} KB — but someone still holding the old doc typed one character and it <b>never appeared</b>: the update waits forever for IDs the new doc does not have. Rebuild only when nobody is connected.`, 'bad')),
    en: 'Deletes never shrink the doc: with garbage collection the content goes but the structure stays. Rebuilding a fresh doc is tiny, but anyone still holding the old one can no longer merge into it.' },
  { t: 'Awareness: cursors live outside the Y.Doc', body: tn(ex(AW), { fs: 15, wrap: 110 }) + two(
      tsx(`// y-protocols/awareness (Hocuspocus relays it)
awareness.setLocalStateField('user', { name, color });
awareness.setLocalStateField('cursor', { anchor, head });
awareness.on('change', () => draw(awareness.getStates()));
// repo: NoteRealtimeEditor.tsx:187
provider.setAwarenessField('user', localUser);`, { fs: 13 }),
      box('Measured', `Name + colour: <b>${aw[0]} B</b>. Every cursor move resends the <b>whole</b> state (${aw[1]} B) — no merge, no history. Leaving sends ${aw[2]} B; a silent peer expires after <b>${aw[3]} s</b>. It is presence from lesson 4.1, riding next to the CRDT.`, 'ok'), 'r64'),
    en: 'Awareness carries cursors and names. It is not part of the Y.Doc: each change resends the whole small state, nothing is merged or stored, and a silent peer expires after thirty seconds. It is presence from lesson four point one.' },
  { t: 'Trap: storing a Y.Doc as JSON', body: two(tn(ex(JS), { fs: 14, wrap: 58 }), tn(ex(KHO), { fs: 13, wrap: 58 })) +
      box('Measured', `${c('JSON.stringify')} of a ${js[0]} B update gives <b>${js[1]} B</b> of ${c('{"0":1,"1":1,…}')}, and reading it back fails: <b>${js[2]}</b>. Store the bytes: ${c('Buffer.from(Y.encodeStateAsUpdate(doc))')} into ${c('BYTEA')} — exactly the repo's ${c('state Bytes')} column, capped at 4 MB.`, 'bad'),
    en: 'The trap: JSON stringify of a Uint8Array becomes an object of numbered keys, eight times bigger, and Yjs cannot read it back. Store the raw bytes in a bytea column, as the repo does.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('CRDT', 'a data type whose updates merge in any order'), kw('Commute', 'order does not matter — no lock, no arbiter'),
      kw('Item ID', '(clientID, clock) — never a position'), kw('Origin', 'the ID on the left when a character was inserted'),
      kw('Tombstone', 'the ID of a deleted character, kept for ordering'), kw('gc', 'drops deleted content, keeps the structure'),
      kw('State update', 'Y.encodeStateAsUpdate — the merged bytes to store'), kw('Awareness', 'cursor/presence, ephemeral, outside the doc'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: CRDT; commute; item ID; origin; tombstone; garbage collection; state update; and awareness.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Two Y.Docs insert at the same spot; apply each other’s update in both orders',
      'Repeat with events carrying positions over socket.io; count positions that differ',
      'Type 10 KB at the end vs at random spots; compare encodeStateAsUpdate sizes',
      'Delete 90 % and check: does the merged state shrink?',
    ]), box('Keep these', `<ul><li>Positions drift; IDs do not</li><li>Yjs: ID = (client, clock) + left origin</li><li>Any order, any grouping, duplicates ⇒ same result</li><li>Cost: 1–17 B/char on disk, far more in RAM</li><li>Store bytes, never JSON</li></ul>`, 'info'), ''),
    en: 'Your turn: merge two docs in both orders, repeat with position events, compare sizes for different typing patterns, and check whether deleting shrinks the state.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Collaborative editing: when NOT to use socket.io', bai: '8.2' }, S);
