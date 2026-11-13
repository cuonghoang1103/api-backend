/**
 * sio-08-4 — Socket.IO · Chapter 8 · Lesson 8.4 "Persistence: when to save a Y.Doc" (deck video + web, 14/11/2026).
 * Bài web: io-8-4-persist. Output THẬT (scratchpad/sio/demo/n8-4.txt · lab ~/.rtq-sio/lab/c8/hp84.mjs + do84.mjs · Hocuspocus 2.15.3 debounce 1500 / maxDebounce 10000 NHƯ KHO ·
 * Postgres sio-pg BYTEA · Redis sio-redis): lien 125 update ⇒ 3 lần lưu (10 s · 10 s · ~1,5 s sau phím cuối) · cum ⇒ 1 lần 1,5 s sau · roi ⇒ lưu ngay khi người cuối rời ·
 * tim ⇒ content_text có chữ sau ~1,5 s · tre: onChange chậm 500 ms ⇒ 0,8 ms (không chặn) · beforeHandleMessage 200 ms ⇒ 203 ms ·
 * sap: kill -9 trước hạn ⇒ DB trống; khởi động lại, tab còn mở tự đồng bộ lại ⇒ đủ · tat: shutdown như kho ⇒ ép thoát 8 s mã 1; closeConnections trước ⇒ 2 ms mã 0 ·
 * hai: 2 worker Redis ⇒ p50 6,5 ms (cùng worker 1,1 ms), chỉ một worker ghi DB. kho: materializeDocument = transaction 5–6 truy vấn + syncNoteReferences.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n8-4:lien": "$ node hp84.mjs &   node do84.mjs lien     # debounce 1500 / maxDebounce 10000 như kho · gõ đều 1 ký tự / 200 ms trong 25 s\n[khách]   0.02 s bắt đầu gõ: 1 ký tự / 200 ms trong 25 s\n[khách]  25.28 s ngừng gõ (125 ký tự)\n$ node do84.mjs cum                        # gõ nhanh 30 ký tự rồi ngừng\n[khách]   0.01 s gõ nhanh 30 ký tự rồi ngừng\n[khách]   0.68 s ngừng\n$ node do84.mjs roi                        # gõ 10 ký tự rồi đóng tab ngay\n[khách]   0.01 s gõ 10 ký tự rồi ĐÓNG tab ngay\n$ # log server\n[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000\n[w1]   1.94 s nạp note:42 từ DB: chưa có\n[w1]  12.06 s LƯU note:42: 51 update gộp thành 65 B · 51 ký tự · ghi DB 8 ms\n[w1]  22.37 s LƯU note:42: 51 update gộp thành 116 B · 102 ký tự · ghi DB 15 ms\n[w1]  28.51 s LƯU note:42: 23 update gộp thành 139 B · 125 ký tự · ghi DB 4 ms\n[w1]  30.21 s gỡ note:42 khỏi RAM (không còn ai mở)\n[w1]  30.30 s nạp note:42 từ DB: 139 B\n[w1]  32.45 s LƯU note:42: 30 update gộp thành 184 B · 155 ký tự · ghi DB 3 ms\n[w1]  33.97 s gỡ note:42 khỏi RAM (không còn ai mở)\n[w1]  34.05 s nạp note:42 từ DB: 184 B\n[w1]  34.06 s gỡ note:42 khỏi RAM (không còn ai mở)\n[w1]  34.06 s LƯU note:42: 10 update gộp thành 209 B · 165 ký tự · ghi DB 3 ms",
 "n8-4:tim": "$ node do84.mjs tim     # gõ một từ lạ ⇒ bao lâu thì cột content_text (để tìm kiếm) có nó\n[khách] gõ \"tuyetmat117\" ⇒ DB tìm thấy sau 1508 ms (cột content_text, cập nhật lúc LƯU)\n$ node do84.mjs tim\n[khách] gõ \"tuyetmat721\" ⇒ DB tìm thấy sau 1538 ms (cột content_text, cập nhật lúc LƯU)",
 "n8-4:tre": "$ node do84.mjs tre                          # bình thường\n[khách] An gõ ⇒ Bình thấy (cùng server): p50 0.8 ms · max 1.7 ms · 20 lần\n$ CHAM_CHANGE=500 node hp84.mjs &   node do84.mjs tre    # onChange await 500 ms (ghi DB ngay trong onChange)\n[khách] An gõ ⇒ Bình thấy (cùng server): p50 0.8 ms · max 1.8 ms · 20 lần\n$ CHAM_BEFORE=200 node hp84.mjs &   node do84.mjs tre    # beforeHandleMessage await 200 ms (truy vấn quyền)\n[khách] An gõ ⇒ Bình thấy (cùng server): p50 203.1 ms · max 204.1 ms · 20 lần",
 "n8-4:sap": "$ kill -9 <pid server>      # 0,8 s sau khi gõ — trước hạn debounce 1,5 s\n$ psql -tAc \"SELECT content_text FROM note_collab84 WHERE note_id = 42\"\n(DB chưa có gì)\n$ node hp84.mjs &      # khởi động lại — tab của khách VẪN MỞ, provider tự nối lại\n$ psql -tAc \"SELECT content_text FROM note_collab84 WHERE note_id = 42\"\nKKKKK\n$ # log server mới\n[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000\n[w1]   0.31 s nạp note:42 từ DB: chưa có\n[w1]   1.81 s LƯU note:42: 1 update gộp thành 19 B · 5 ký tự · ghi DB 3 ms\n$ # log khách\n[khách]   0.02 s gõ 5 chữ K, tab VẪN MỞ (bản sao trong RAM của trình duyệt)",
 "n8-4:tat": "$ kill -TERM <pid server>    # deploy: SIGTERM · shutdown chép khuôn src/index.ts:816-858\n$ # log server (TAT=kho)\n[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000\n[w1]   1.97 s nạp note:42 từ DB: chưa có\n[w1]   2.69 s SIGTERM (TAT=kho)\n[w1]   3.48 s LƯU note:42: 5 update gộp thành 18 B · 5 ký tự · ghi DB 4 ms\n[w1]  10.69 s còn kết nối dài ⇒ ÉP thoát sau 8003 ms, mã 1\n$ psql -tAc \"SELECT content_text FROM note_collab84 WHERE note_id = 42\"\nKKKKK\n$ kill -TERM <pid server>    # TAT=sua: hocuspocus.closeConnections() trước\n$ # log server (TAT=sua)\n[w1]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000\n[w1]   1.95 s nạp note:42 từ DB: chưa có\n[w1]   2.66 s SIGTERM (TAT=sua)\n[w1]   2.67 s HTTP server đóng xong sau 2 ms ⇒ thoát mã 0\n[w1]   2.67 s LƯU note:42: 5 update gộp thành 19 B · 5 ký tự · ghi DB 3 ms\n[w1]   2.67 s gỡ note:42 khỏi RAM (không còn ai mở)\n$ psql -tAc \"SELECT content_text FROM note_collab84 WHERE note_id = 42\"\nKKKKK",
 "n8-4:kho": "$ cd ~/api-backend && grep -n \"await tx\\.\\|\\$transaction\\|void syncNoteReferences\" src/socket/notes-collaboration.gateway.ts\n99:  await prisma.$transaction(async (tx) => {\n100:    const current = await tx.note.findFirst({\n106:    await tx.noteCollaborationDocument.upsert({\n123:    const updated = await tx.note.update({\n127:    const latest = await tx.noteVersion.findFirst({\n135:      await tx.noteVersion.update({\n146:      const numbered = await tx.note.update({\n150:      await tx.noteVersion.create({\n171:  void syncNoteReferences(noteId);\n$ grep -n \"sio?.engine?.close\\|8_000\\|Hocuspocus\\|closeConnections\" src/index.ts\n169:// CTW K-3b: đồng soạn thảo Docs của CT Work (Hocuspocus/Yjs) trên /notes-collaboration/work-docs\n754:// Dedicated Hocuspocus/Yjs protocol on /notes-collaboration. It shares the\n852: try { sio?.engine?.close(); } catch { /* bỏ qua */ }\n858: }, 8_000).unref();",
 "n8-4:hai": "$ REDIS=1 node hp84.mjs (:19906 wA, :19907 wB) &   node do84.mjs tre 19906 19907   # An ở worker A, Bình ở worker B\n[khách] An gõ ⇒ Bình thấy (An :19906, Bình :19907): p50 6.5 ms · max 36.1 ms · 20 lần\n$ node do84.mjs tre 19906 19906       # cùng worker, để so\n[khách] An gõ ⇒ Bình thấy (An :19906, Bình :19906): p50 1.1 ms · max 3.0 ms · 20 lần\n$ # log worker A\n[wA]   0.00 s nghe :19906 · debounce 1500 / maxDebounce 10000 · Redis\n[wA]   2.45 s nạp note:42 từ DB: chưa có\n[wA]   4.72 s LƯU note:42: 20 update gộp thành 186 B · 20 ký tự · ghi DB 2 ms\n[wA]   4.72 s gỡ note:42 khỏi RAM (không còn ai mở)\n[wA]   4.81 s nạp note:42 từ DB: 186 B\n[wA]   6.90 s LƯU note:42: 20 update gộp thành 373 B · 40 ký tự · ghi DB 7 ms\n[wA]   6.90 s gỡ note:42 khỏi RAM (không còn ai mở)\n$ # log worker B\n[wB]   0.00 s nghe :19907 · debounce 1500 / maxDebounce 10000 · Redis\n[wB]   2.47 s nạp note:42 từ DB: chưa có\n[wB]   4.72 s gỡ note:42 khỏi RAM (không còn ai mở)"
};
/*HET_DU_LIEU*/
import { lamDeck, cmp, box, two, steps, kw, c, tsx, tn, meter } from './_sio-chung.mjs';

export const deck = { key: 'sio-08-4', code: 'SIO 8.4', title: 'Persistence: when to save a Y.Doc', sub: 'Chapter 8 · Lesson 8.4' };
const O = (k) => { const v = DU_LIEU[`n8-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const LIEN = O('lien'), TIM = O('tim'), TRE = O('tre'), SAP = O('sap'), TAT = O('tat'), HAI = O('hai'), KHO = O('kho');
const ex = (t) => t.split('\n').filter((l) => !/nạp note:42 từ DB|gỡ note:42|nghe :1990/.test(l)).map((l) => l.replace(/^(\$ [^#]*?)\s+#.*$/, '$1')).join('\n');
const t0 = +m(/\[w1\]\s+([\d.]+) s nạp note:42 từ DB: chưa có/, LIEN)[1];
const LUU = [...LIEN.matchAll(/\[w1\]\s+([\d.]+) s LƯU note:42: (\d+) update gộp thành (\d+) B · (\d+) ký tự/g)].map((x) => ({ t: +x[1], n: +x[2], b: +x[3], chu: +x[4] }));
const tim = [...TIM.matchAll(/sau (\d+) ms/g)].map((x) => +x[1]);
const tre = [...TRE.matchAll(/p50 ([\d.]+) ms · max ([\d.]+) ms/g)].map((x) => [+x[1], +x[2]]);
const hai = [...HAI.matchAll(/p50 ([\d.]+) ms · max ([\d.]+) ms/g)].map((x) => [+x[1], +x[2]]);
const ep = m(/ÉP thoát sau (\d+) ms, mã (\d)/, TAT), em = m(/đóng xong sau (\d+) ms ⇒ thoát mã (\d)/, TAT);
const luuA = (HAI.match(/\[wA\][^\n]*LƯU/g) || []).length, luuB = (HAI.match(/\[wB\][^\n]*LƯU/g) || []).length;
const s1 = (x) => x.toFixed(1);

/** Dòng thời gian thật của 'lien': phím gõ đều 25 s, các lần lưu. */
function dongTG() {
  const W = 1110, H = 170, x = (t) => 40 + ((t - t0) / 30) * (W - 80);
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  s += `<line x1="40" y1="70" x2="${W - 40}" y2="70" stroke="#94a3b8" stroke-width="2"/>`;
  for (let i = 0; i < 125; i += 2) s += `<line x1="${x(t0 + i * 0.2)}" y1="56" x2="${x(t0 + i * 0.2)}" y2="70" stroke="#0e7490" stroke-width="2"/>`;
  s += `<text x="40" y="44" font-size="16" fill="#0e7490" font-weight="700">125 keystrokes, one every 200 ms (25 s)</text>`;
  for (const [i, l] of LUU.slice(0, 3).entries()) s += `<rect x="${x(l.t) - 8}" y="78" width="16" height="34" rx="4" fill="#c2410c"/><text x="${x(l.t)}" y="${i % 2 ? 160 : 136}" text-anchor="middle" font-size="16" fill="#c2410c" font-weight="700">save #${i + 1} · +${s1(l.t - t0)} s · ${l.n} upd</text>`;
  for (let k = 0; k <= 30; k += 5) s += `<text x="${x(t0 + k)}" y="92" text-anchor="middle" font-size="13" fill="#64748b">${k} s</text>`;
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 8 · Lesson 8.4', t: 'Persistence:<br>when to save a Y.Doc', sub: 'Hocuspocus configured like the repo, a real Postgres, a crash and a deploy — when does the document hit the disk?',
    en: 'Lesson eight point four: persistence, and when to save a Y.Doc. Hocuspocus configured like the repo, a real Postgres, a crash and a deploy: when does the document actually reach the disk?' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Debounce + maxDebounce + save on the last disconnect — measured, with the repo's numbers</li>
    <li>What one save costs in this repo, and how stale the search column gets</li>
    <li>Which hook sits on the sync hot path — and which does not</li>
    <li>A crash before the save, a deploy during editing, two workers with Redis</li>
    <li>Why the open tabs are your real backup</li></ul>`,
    en: 'Five takeaways: debounce, max debounce and save on disconnect measured; the cost of one save and search staleness; the hot path; a crash, a deploy and two workers; and why open tabs are your real backup.' },
  { t: 'Debounce with a ceiling: typing for 25 seconds', body: dongTG() + cmp(['web page strategy', 'what Hocuspocus does (measured, repo settings)'], [
      ['1 · debounce 5 s, “the repo uses it”', `${c('debounce: 1500')}: save 1.5 s after the last change… (repo, :197)`],
      ['2 · every N updates', `…but never wait longer than ${c('maxDebounce: 10000')} while typing goes on: saves at +${LUU.slice(0, 3).map((l) => s1(l.t - t0)).join(' / +')} s`],
      ['3 · interval save', 'not used — no edits, no saves'],
      ['4 · save on disconnect', 'last connection closed ⇒ saved at once, then unloaded from RAM'],
    ], { hl: [1] }),
    en: 'Debounce with a ceiling. Typing one key every two hundred milliseconds for twenty five seconds produced three saves: two forced by the ten second maximum, one a second and a half after the last key.' },
  { t: 'Measured: three typing patterns', body: tn(ex(LIEN), { fs: 13, wrap: 110 }) + two(
      box('Read it', `125 updates ⇒ <b>${Math.min(3, LUU.length)}</b> writes. 30 fast keys ⇒ <b>1</b> write, 1.5 s later. Closing the tab ⇒ written <b>at once</b>. ${LUU.at(-1).b} B for ${LUU.at(-1).chu} chars: the merged state is stored, not the log.`, 'ok'),
      box('Versus the web page', `“Debounce 5 s” ⇒ the repo uses <b>1.5 s</b>, ceiling <b>10 s</b> (default 2 s / 10 s). Strategies 1 + 4 are right; the numbers were not.`, 'info')),
    en: 'Three typing patterns, measured: continuous typing, a quick burst, and typing then closing the tab. The repo debounces one and a half seconds with a ten second ceiling, not five seconds.' },
  { t: 'What one save costs in this repo', body: tn(KHO.split('\n').slice(0, 10).join('\n'), { fs: 13, wrap: 110 }) + two(cmp(['step', 'why'], [
      ['find the note', 'deleted meanwhile ⇒ abort'], [`upsert collaboration state`, 'state + state vector, BYTEA'],
      [`${c('note.update')} JSON + HTML`, 'REST editor, search, export'], [`${c('noteVersion')} update / create`, 'AUTO_SAVE history (5 min)'],
      [`${c('syncNoteReferences')}`, '[[wiki]] backlinks, after commit'],
    ]), box('So the debounce matters', `One save = a transaction of 5–6 queries + HTML generation. Per keystroke that would be every key of every user; 1.5 s / 10 s turned 125 keys into 3 transactions.`, 'info'), 'r64'),
    en: 'What one save costs here: a transaction of five or six queries, the collaboration state, the note content as JSON and HTML, an auto-save version row, then the wiki backlinks. That is why the debounce matters.' },
  { t: 'The search column lags by the debounce', body: tn(TIM, { fs: 15, wrap: 100 }) + two(
      box('Measured', `A new word typed now is findable through ${c('content_text')} after <b>${tim.join(' ms / ')} ms</b> — the 1.5 s debounce plus a few ms of write. During non-stop typing the worst case is the 10 s ceiling.`, 'ok'),
      box('Versus the web page', `The page's example (5 s debounce, a word typed at 12 s missing until 15 s) has the right shape with the wrong numbers. Fine for notes; not for anything that must be searchable instantly.`, 'info')),
    en: 'The search column lags by the debounce: a new word became findable after about one and a half seconds. During non stop typing the worst case is the ten second ceiling.' },
  { t: 'Which hook is on the hot path?', body: meter([['normal', tre[0][0], '#0e7490', `p50 ${tre[0][0]} ms`], ['onChange awaits 500 ms', tre[1][0], '#1f8a3b', `p50 ${tre[1][0]} ms`], ['beforeHandleMessage awaits 200 ms', tre[2][0], '#c0392b']], { don: 'ms', nhan: 360, rh: 50, fs: 18 }) +
      two(box('Measured (Hocuspocus 2.15.3)', `A slow ${c('onChange')} does <b>not</b> delay the broadcast — the update has already gone out. A slow ${c('beforeHandleMessage')} delays <b>every</b> message by exactly that much. The web page's trap (“save inside onChange stalls sync”) points at the wrong hook.`, 'bad'),
        box('In the repo', `${c('beforeHandleMessage')} re-checks permission against the DB once every 5 s per connection (lesson 8.5): one message in that window pays the query latency. Storage itself runs in the debounced ${c('onStoreDocument')}, off the hot path.`, 'info')),
    en: 'Which hook is on the hot path? A slow on change did not delay the broadcast at all; a slow before handle message delayed every message by exactly its delay. In the repo, that is where the five second permission re check lives.' },
  { t: 'A crash before the save — and who saves you', body: tn(SAP, { fs: 14, wrap: 100 }) + two(
      box('Measured', `Five keys, then ${c('kill -9')} 0.8 s later — before the 1.5 s debounce. The database had <b>nothing</b>. The server restarted; the tab was still open; its provider reconnected, sent its step2, and the new server saved <b>KKKKK</b>.`, 'ok'),
      box('Why', `Every open tab holds a full replica of the Y.Doc. A crashed server loses only what <b>no</b> client still holds — data is gone only if the server and every tab that had it die inside the same debounce window.`, 'info')),
    en: 'A crash before the save: the database had nothing, but the tab was still open. After the restart the provider reconnected and pushed its copy, and the document was saved. Open tabs are replicas.' },
  { t: 'A deploy while someone is editing', body: tn(ex(TAT).split('\n').filter((l) => !/^\$ # log/.test(l)).join('\n'), { fs: 13, wrap: 110 }) + two(
      box('Repo shutdown (src/index.ts:816–858)', `Closes socket.io's engine but <b>not</b> Hocuspocus ⇒ ${c('server.close()')} waits on the open note ⇒ <b>forced out after ${s1(+ep[1] / 1000)} s, exit ${ep[2]}</b>. Saved only because the debounce fired inside those 8 s (it can be 10 s away).`, 'bad'),
      box('With closeConnections() first', `${c('closeConnections()')} first ⇒ last connection leaves ⇒ saved at once ⇒ closed in <b>${em[1]} ms</b>, exit ${em[2]}. Clients reconnect to the new container.`, 'ok')),
    en: 'A deploy while someone is editing: the repo shutdown closes socket.io but not Hocuspocus, so every deploy with an open note waits eight seconds and exits with code one. Closing the Hocuspocus connections first saves at once and exits in milliseconds.' },
  { t: 'Two workers: Redis relays, one worker writes', body: tn(ex(HAI), { fs: 13, wrap: 110 }) + two(
      box('Measured', `An on worker A, Binh on worker B (Redis extension, like the repo): An → Binh p50 <b>${hai[0][0]} ms</b> (same worker: ${hai[1][0]} ms). Both workers held the doc, but only <b>${luuA ? 'A' : 'B'}</b> wrote to Postgres (A ${luuA} saves, B ${luuB}): the extension takes a Redis lock before ${c('onStoreDocument')}.`, 'ok'),
      box('Same idea as 5.1', `Like the socket.io Redis adapter, every worker receives every update of the documents it has open. Here the CRDT makes double delivery harmless — and the lock keeps the DB from being written twice.`, 'info')),
    en: 'Two workers with the Redis extension: an update crossed workers in about six milliseconds, and although both workers held the document, only one wrote to Postgres, because the extension takes a lock before storing.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('debounce', 'save 1.5 s after the last change'), kw('maxDebounce', 'but at least every 10 s while typing'),
      kw('Unload save', 'last connection leaves ⇒ save now'), kw('onStoreDocument', 'the debounced hook that writes'),
      kw('Hot path', 'beforeHandleMessage — every message waits'), kw('Replica', 'every open tab holds the whole doc'),
      kw('Search lag', 'content_text is as fresh as the last save'), kw('Redis lock', 'one worker writes, all relay'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: debounce; max debounce; save on unload; on store document; hot path; replica; search lag; and the Redis lock.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run Hocuspocus with debounce 1500 / maxDebounce 10000 and a BYTEA table',
      'Type steadily for 25 s, then in a burst, then close the tab — log every save',
      'Slow down onChange, then beforeHandleMessage; measure peer latency',
      'kill -9 before the debounce with a tab open; restart and check the DB',
    ]), box('Keep these', `<ul><li>1.5 s debounce, 10 s ceiling, save on last leave</li><li>Store the merged state, not the log</li><li>Hot path = beforeHandleMessage, not onChange</li><li>Open tabs are replicas</li><li>closeConnections() before shutdown</li></ul>`, 'info'), ''),
    en: 'Your turn: configure the debounce, log every save for three typing patterns, slow down each hook, and crash the server with a tab still open.' },
];
export const slides = lamDeck({ chuong: 'Chapter 8 — Collaborative editing: when NOT to use socket.io', bai: '8.4' }, S);
