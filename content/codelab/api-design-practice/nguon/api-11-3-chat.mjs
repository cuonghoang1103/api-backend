/** API Design · 11.5 — Chat: clientMessageId chống trùng, seq của server, đồng bộ nhiều thiết bị (output thật bài 11.5: interview/chat). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Chat 1 — Duplicates, order and devices, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 11.5: interview/chat/server.mjs with DROP_EVERY=4 and send.mjs from a phone (clock 2 minutes slow) and a laptop.',
  vi: 'Những điều từ bài 11.5: interview/chat/server.mjs với DROP_EVERY=4 và send.mjs từ điện thoại (đồng hồ chậm 2 phút) và laptop.',
  cau: [
    q('c1', ['Every fourth request is stored and then the connection is cut. Without deduplication, 200 messages became…', 'Cứ request thứ tư thì lưu xong rồi cắt kết nối. Không chống trùng, 200 tin thành…'],
      ['266 stored messages — 66 duplicates', '200 stored messages — TCP retransmits safely', '150 stored messages — the cut requests were lost', '400 stored messages — every retry doubles'],
      ['The phone cannot know whether a timed-out request was stored, so it sends again; with clientMessageId the server replayed instead (0 duplicates).', 'Điện thoại không biết request hết giờ đã được lưu chưa, nên gửi lại; có clientMessageId thì server phát lại (0 tin trùng).']),
    q('c2', ['Sorted by the client’s sentAt, how many of the 200 messages were out of place?', 'Sắp theo sentAt của client, bao nhiêu trong 200 tin sai chỗ?'],
      ['All 200 — every phone message jumped ahead of the laptop’s', 'None — the phone’s clock was only two minutes off', 'Exactly 100 — only the phone’s messages', 'About 66 — the retried ones'],
      ['Order comes from the server’s per-conversation seq; client time is only displayed.', 'Thứ tự lấy từ seq theo cuộc trò chuyện của server; giờ client chỉ để hiển thị.']),
    q('c3', ['A laptop reconnects after a week. How does it catch up?', 'Laptop nối lại sau một tuần. Nó bắt kịp bằng cách nào?'],
      ['GET …/messages?after={last seq it has} page by page, then the socket again', 'Wait for the server to push every missed message over the socket', 'Download the whole conversation and diff it locally', 'Ask the phone to forward what it received'],
      ['The socket is for live messages; history and gaps are fetched with a cursor.', 'Socket dành cho tin trực tiếp; lịch sử và phần hở lấy bằng cursor.']),
    q('c4', ['A late “seen up to 100” arrives after “seen up to 120”. What should PUT …/read-cursor do?', '“Đã xem tới 100” tới muộn sau “đã xem tới 120”. PUT …/read-cursor nên làm gì?'],
      ['Keep 120 — the read cursor only moves forward', 'Set 100 — the last request always wins', 'Return 409, because the two requests conflict', 'Store both, one per device'],
      ['Monotonic cursors make out-of-order requests harmless.', 'Con trỏ chỉ đi tới làm request sai thứ tự trở nên vô hại.']),
  ],
  goiY: [['A lost response is not a lost request.', 'Mất phản hồi không có nghĩa là mất request.'], ['Who owns the clock that orders messages?', 'Đồng hồ của ai quyết định thứ tự tin?']],
  loi: [['Trusting TCP to prevent duplicate messages.', 'Tin TCP sẽ chặn tin trùng.'], ['Sorting by device timestamps.', 'Sắp theo giờ của thiết bị.']],
  tns: [tn('clientMessageId', 'id tin do client tạo'), tn('seq', 'số thứ tự của server'), tn('read cursor', 'con trỏ đã đọc')],
  kn: ['reliability', 'realtime'],
});

function accept(state, cid, msg) {
  const key = `${cid}|${msg.clientMessageId}`;
  if (state.byKey[key] !== undefined) return { status: 200, seq: state.byKey[key], state };   // gửi lại ⇒ phát lại
  const seq = (state.lastSeq[cid] || 0) + 1;
  return {
    status: 201, seq,
    state: { lastSeq: { ...state.lastSeq, [cid]: seq }, byKey: { ...state.byKey, [key]: seq } },
  };
}
const S0 = { lastSeq: {}, byKey: {} };
const E2 = jsBai({
  ten: 'Chat 2 — Write accept(state, cid, msg): dedupe and assign seq', kho: 'MEDIUM', phut: 15,
  en: `<p>The server keeps <code>state = { lastSeq: {cid: n}, byKey: {"cid|clientMessageId": seq} }</code>. For a message <code>{ clientMessageId, text }</code> in conversation <code>cid</code>:</p><ul><li>if this conversation already has this clientMessageId ⇒ <code>{ status: 200, seq: &lt;the stored seq&gt;, state }</code> (unchanged state);</li><li>otherwise seq = last seq of <b>this conversation</b> + 1 ⇒ <code>{ status: 201, seq, state: &lt;new state&gt; }</code>.</li></ul><p>Do not mutate the input state.</p>`,
  vi: `<p>Server giữ <code>state = { lastSeq: {cid: n}, byKey: {"cid|clientMessageId": seq} }</code>. Với tin <code>{ clientMessageId, text }</code> trong cuộc trò chuyện <code>cid</code>:</p><ul><li>nếu cuộc trò chuyện này đã có clientMessageId đó ⇒ <code>{ status: 200, seq: &lt;seq đã lưu&gt;, state }</code> (state giữ nguyên);</li><li>ngược lại seq = seq cuối của <b>cuộc trò chuyện này</b> + 1 ⇒ <code>{ status: 201, seq, state: &lt;state mới&gt; }</code>.</li></ul><p>Không sửa state đầu vào.</p>`,
  dauVao: ['state — object; cid — string; msg — {clientMessageId, text}', 'state — object; cid — chuỗi; msg — {clientMessageId, text}'],
  dauRa: ['{ status: 200 | 201, seq: number, state }', '{ status: 200 | 201, seq: number, state }'],
  goiY: [['Key by conversation AND clientMessageId — two chats may reuse an id.', 'Khoá theo cuộc trò chuyện VÀ clientMessageId — hai cuộc trò chuyện có thể trùng id.'], ['Spread objects to build the new state.', 'Dùng spread để dựng state mới.']],
  loi: [['One global seq for all conversations.', 'Một seq chung cho mọi cuộc trò chuyện.'], ['Giving a retry a new seq.', 'Cấp seq mới cho lần gửi lại.']],
  gt: ['This is the server of 11.5 without the network: with it, 250 calls stored exactly 200 messages; the 50 retries came back as 200 with Idempotent-Replayed.', 'Đây là server của bài 11.5 bỏ phần mạng: có nó, 250 lần gọi lưu đúng 200 tin; 50 lần gửi lại nhận 200 kèm Idempotent-Replayed.'],
  kn: ['reliability', 'idempotency'],
  tns: [tn('replay', 'phát lại'), tn('sequence', 'dãy số thứ tự')],
  dau: `/** dedupe + sequence */
function accept(state, cid, msg) {
  // Write your solution here
  const seq = Object.keys(state.byKey).length + 1;
  return { status: 201, seq, state: { lastSeq: { ...state.lastSeq, [cid]: seq }, byKey: { ...state.byKey, [msg.clientMessageId]: seq } } };
}
`,
  giai: '// Reference solution\n' + nguon(accept),
  cases: [
    { goi: goi('accept', S0, 'c_1', { clientMessageId: 'm-1', text: 'tin 1' }), moTa: ['First message of a conversation', 'Tin đầu của một cuộc trò chuyện'] },
    { goi: goi('accept', { lastSeq: { c_1: 1 }, byKey: { 'c_1|m-1': 1 } }, 'c_1', { clientMessageId: 'm-1', text: 'tin 1' }), moTa: ['The same message sent again', 'Cùng tin đó gửi lại'] },
    { goi: goi('accept', { lastSeq: { c_1: 7, c_2: 3 }, byKey: { 'c_1|m-1': 1 } }, 'c_2', { clientMessageId: 'm-1', text: 'khác' }), an: true },
    { goi: goi('accept', { lastSeq: { c_1: 7 }, byKey: { 'c_1|m-9': 5 } }, 'c_1', { clientMessageId: 'm-9', text: 'tin 5' }), an: true },
    { goi: goi('accept', { lastSeq: { c_1: 7 }, byKey: {} }, 'c_1', { clientMessageId: 'm-8', text: 'tin 8' }), an: true },
  ],
});

function applyPush(have, pushed) {
  const all = [...new Set([...have, ...pushed])].sort((a, b) => a - b);
  let contiguous = 0;
  while (all.includes(contiguous + 1)) contiguous++;
  const max = all.length ? all[all.length - 1] : 0;
  const gaps = [];
  for (let s = contiguous + 1; s <= max; s++) if (!all.includes(s)) gaps.push(s);
  return { messages: all, lastContiguous: contiguous, fetch: gaps.length ? { after: contiguous, missing: gaps } : null };
}
const E3 = jsBai({
  ten: 'Chat 3 — Write applyPush(have, pushed): sync one device', kho: 'HARD', phut: 20,
  en: `<p>A device has the seqs <code>have</code> of one conversation; pushes arrive with seqs <code>pushed</code> (any order, maybe duplicates). Return:</p><ul><li><code>messages</code> — all seqs, unique, ascending;</li><li><code>lastContiguous</code> — the largest n such that 1…n are all present (0 if seq 1 is missing);</li><li><code>fetch</code> — <code>null</code> if nothing is missing up to the largest seq, otherwise <code>{ after: lastContiguous, missing: [the missing seqs between lastContiguous and the largest seq] }</code> — what the device asks with <code>GET …?after=</code>.</li></ul>`,
  vi: `<p>Một thiết bị có các seq <code>have</code> của một cuộc trò chuyện; tin đẩy tới mang các seq <code>pushed</code> (thứ tự bất kỳ, có thể trùng). Trả về:</p><ul><li><code>messages</code> — mọi seq, không trùng, tăng dần;</li><li><code>lastContiguous</code> — n lớn nhất mà 1…n đều có (0 nếu thiếu seq 1);</li><li><code>fetch</code> — <code>null</code> nếu không thiếu gì tới seq lớn nhất, ngược lại <code>{ after: lastContiguous, missing: [các seq thiếu giữa lastContiguous và seq lớn nhất] }</code> — thứ thiết bị hỏi bằng <code>GET …?after=</code>.</li></ul>`,
  dauVao: ['have — number[]; pushed — number[]', 'have — number[]; pushed — number[]'],
  dauRa: ['{ messages: number[], lastContiguous: number, fetch: null | {after, missing} }', '{ messages: number[], lastContiguous: number, fetch: null | {after, missing} }'],
  goiY: [['Union with a Set, then sort numerically.', 'Hợp bằng Set, rồi sắp theo số.'], ['Walk up from 1 while the next seq exists.', 'Đi lên từ 1 trong khi seq kế tiếp còn có.']],
  loi: [['Trusting the socket: showing 7 after 5 without fetching 6.', 'Tin socket: hiện 7 sau 5 mà không lấy 6.'], ['Sorting numbers as strings: 10 before 9.', 'Sắp số như chuỗi: 10 trước 9.']],
  gt: ['Lesson 11.5: a pushed seq that is not exactly last + 1 means something was missed — fetch the gap with ?after= instead of trusting the push. The same idea as Last-Event-ID in 10.4.', 'Bài 11.5: seq được đẩy tới mà không đúng bằng cuối + 1 nghĩa là đã lỡ gì đó — lấy phần hở bằng ?after= thay vì tin tin đẩy. Cùng ý với Last-Event-ID ở bài 10.4.'],
  kn: ['realtime', 'reliability'],
  tns: [tn('gap', 'phần hở'), tn('contiguous', 'liền mạch')],
  dau: `/** merge pushes into a device's copy */
function applyPush(have, pushed) {
  // Write your solution here
  const all = have.concat(pushed).sort();
  return { messages: all, lastContiguous: all[all.length - 1] || 0, fetch: null };
}
`,
  giai: '// Reference solution\n' + nguon(applyPush),
  cases: [
    { goi: goi('applyPush', [1, 2, 3, 4, 5], [7]), moTa: ['Seq 6 was missed', 'Lỡ mất seq 6'] },
    { goi: goi('applyPush', [1, 2, 3], [4, 4, 5]), moTa: ['A duplicate push', 'Một tin đẩy trùng'] },
    { goi: goi('applyPush', [], [3, 1]), an: true },
    { goi: goi('applyPush', [1, 2, 9, 10], [11, 8]), an: true },
    { goi: goi('applyPush', [], []), an: true },
    { goi: goi('applyPush', [2, 3], []), an: true },
  ],
});

export default doiDau({ slug: 'api-11-3-chat', ten: '11.5 Interview: a chat', khoa: KHOA, baiHoc: 'api-11-3-chat', de: [E1, E2, E3] });
