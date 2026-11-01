/** API Design · 10.3 — Hợp đồng sự kiện: CloudEvents, mỏng/dày, phiên bản, consumer chống trùng, outbox (output thật bài 10.3). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Event contracts 1 — Thin, fat, duplicates and lost events', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 10.3: events/thin-vs-fat.mjs, events/redelivery.mjs (1,000 events, 2% crash at each dangerous moment) and events/outbox.mjs (Redis cut off for 1.5 s).',
  vi: 'Những điều từ bài 10.3: events/thin-vs-fat.mjs, events/redelivery.mjs (1.000 sự kiện, 2% chết ở mỗi thời điểm nguy hiểm) và events/outbox.mjs (Redis rớt 1,5 s).',
  cau: [
    q('c1', ['Thin events were 39% smaller (203 vs 330 B). What did they cost the email consumer?', 'Sự kiện mỏng nhỏ hơn 39% (203 so với 330 B). Consumer gửi email phải trả giá gì?'],
      ['200 call-backs to LabFlow, and 100 “confirmed” emails that read today’s CANCELLED', 'Nothing measurable: the call-backs were cached by the CDN in front of LabFlow', 'The consumer had to keep a copy of every booking in its own database first', 'Every thin event had to be signed twice, which doubled the broker’s CPU time'],
      ['A thin event says that something changed; you learn what only by asking now — and now may be later.', 'Sự kiện mỏng nói rằng có gì đó đã đổi; muốn biết đổi gì phải hỏi lúc này — mà lúc này có thể đã muộn.']),
    q('c2', ['With MODE=mark-first (“remember the id, then send”), what did 1,000 events with crashes give?', 'Với MODE=mark-first (“ghi nhớ id rồi mới gửi”), 1.000 sự kiện có sự cố cho kết quả gì?'],
      ['21 lost: a crash after the mark left events marked as done but never sent', '17 duplicates: the mark is checked after the notification is already sent', 'Exactly 1,000: marking first is the textbook idempotent consumer pattern', '342 lost: the consumer could not reach Redis while it was writing the mark'],
      ['none: 17 duplicates · mark-first: 21 lost · same-tx (mark + send in one transaction): exactly 1,000.', 'none: 17 trùng · mark-first: mất 21 · same-tx (đánh dấu + gửi trong một transaction): đúng 1.000.']),
    q('c3', ['Redis was down for 1.5 s while 1,000 bookings were written. Dual write lost 342 events; the outbox lost 0. What did the outbox pay?', 'Redis sập 1,5 s khi ghi 1.000 lượt đặt. Ghi kép mất 342 sự kiện; outbox mất 0. Outbox phải trả gì?'],
      ['Delay (p50 118 ms, p99 1.6 s) and 18 duplicates when the relay died before marking', 'A distributed transaction across PostgreSQL and Redis that doubled the write time', 'The bookings were refused with 503 for as long as Redis was unreachable', 'Every event had to be published twice, once by the API and once by the relay'],
      ['The relay may publish twice, so consumers must be idempotent — and the outbox gives each event its own id (evt_42) before publishing, so a duplicate keeps it.', 'Relay có thể phát hai lần, nên consumer phải chống trùng — và outbox gán id riêng (evt_42) trước khi phát, nên bản trùng giữ nguyên id.']),
  ],
  goiY: [['Ask: what can happen between two steps that are not in one transaction?', 'Hỏi: điều gì có thể xảy ra giữa hai bước không cùng một transaction?'], ['Duplicates can be filtered; losses cannot be undone.', 'Bản trùng lọc được; mất thì không lấy lại được.']],
  loi: [['“Mark first” — it turns duplicates into silent losses.', '“Đánh dấu trước” — biến bản trùng thành mất âm thầm.'], ['Saving the row, then publishing the event (dual write).', 'Lưu dòng rồi mới phát sự kiện (ghi kép).']],
  tns: [tn('thin / fat event', 'sự kiện mỏng / dày'), tn('dual write', 'ghi kép'), tn('transactional outbox', 'hộp thư đi trong transaction')],
  kn: ['events', 'reliability'],
});

function checkEnvelope(e) {
  const problems = [];
  for (const k of ['id', 'source', 'specversion', 'type']) {
    if (typeof e[k] !== 'string' || e[k] === '') problems.push(`missing ${k}`);   // bốn thuộc tính bắt buộc của CloudEvents 1.0
  }
  if (typeof e.specversion === 'string' && e.specversion !== '' && e.specversion !== '1.0') problems.push('specversion must be 1.0');
  if (typeof e.type === 'string' && e.type !== '' && !/\.v\d+$/.test(e.type)) problems.push('type needs a version');
  const data = e.data && typeof e.data === 'object' ? e.data : {};
  for (const k of ['email', 'name', 'userId']) if (k in data) problems.push(`PII in data: ${k}`);   // sự kiện tới MỌI subscriber
  return problems;
}
const EV = { id: '1', specversion: '1.0', type: 'labflow.booking.created.v1', source: '/labflow/v2', subject: 'bk_1', time: '2026-11-01T01:28:47.355Z', datacontenttype: 'application/json', data: { id: 'bk_1', labId: 'lab_2', period: { start: '2026-12-01T01:00:00.000Z', end: '2026-12-01T03:00:00.000Z' }, status: 'PENDING', version: 1 } };
const E2 = jsBai({
  ten: 'Event contracts 2 — Write checkEnvelope(e) for LabFlow events', kho: 'EASY', phut: 12,
  en: `<p>Check an event before it is published. Return the list of problems, in this order (empty list = valid):</p><ol><li>for each of <code>id</code>, <code>source</code>, <code>specversion</code>, <code>type</code> (the four required CloudEvents attributes) that is not a non-empty string: <code>"missing &lt;name&gt;"</code>;</li><li><code>specversion</code> present but not <code>"1.0"</code>: <code>"specversion must be 1.0"</code>;</li><li><code>type</code> present but not ending in <code>.v&lt;digits&gt;</code>: <code>"type needs a version"</code>;</li><li>for each of <code>email</code>, <code>name</code>, <code>userId</code> that is a key of <code>data</code>: <code>"PII in data: &lt;key&gt;"</code>.</li></ol>`,
  vi: `<p>Kiểm một sự kiện trước khi phát. Trả danh sách vấn đề, theo thứ tự (danh sách rỗng = hợp lệ):</p><ol><li>với mỗi <code>id</code>, <code>source</code>, <code>specversion</code>, <code>type</code> (bốn thuộc tính bắt buộc của CloudEvents) không phải chuỗi khác rỗng: <code>"missing &lt;tên&gt;"</code>;</li><li>có <code>specversion</code> nhưng khác <code>"1.0"</code>: <code>"specversion must be 1.0"</code>;</li><li>có <code>type</code> nhưng không kết thúc bằng <code>.v&lt;chữ số&gt;</code>: <code>"type needs a version"</code>;</li><li>với mỗi <code>email</code>, <code>name</code>, <code>userId</code> là khoá của <code>data</code>: <code>"PII in data: &lt;khoá&gt;"</code>.</li></ol>`,
  dauVao: ['e — object (data may be missing)', 'e — object (data có thể thiếu)'],
  dauRa: ['string[]', 'string[]'],
  goiY: [['Loop over the four required names first, then the two format rules.', 'Duyệt bốn tên bắt buộc trước, rồi hai luật định dạng.'], ['/\\.v\\d+$/ checks the version suffix; "k in data" checks a key.', '/\\.v\\d+$/ kiểm hậu tố phiên bản; "k in data" kiểm một khoá.']],
  loi: [['Reporting “type needs a version” for a missing type as well.', 'Báo “type needs a version” cả khi type bị thiếu.'], ['Treating labName as PII — only the exact keys email, name, userId count here.', 'Coi labName là PII — ở đây chỉ đúng các khoá email, name, userId.']],
  gt: ['Required by CloudEvents 1.0: id, source, specversion, type (source + id unique per distinct event). The version lives in the type (.v1), and LabFlow’s booking events carry no user id, name or email because every subscriber receives them.', 'Bắt buộc theo CloudEvents 1.0: id, source, specversion, type (source + id duy nhất cho mỗi sự kiện khác nhau). Phiên bản nằm trong type (.v1), và sự kiện lượt đặt của LabFlow không mang id, tên hay email người dùng vì mọi subscriber đều nhận được.'],
  kn: ['events', 'CloudEvents'],
  tns: [tn('envelope', 'phong bì sự kiện'), tn('PII', 'thông tin định danh cá nhân')],
  dau: `/** problems of a CloudEvents envelope */
function checkEnvelope(e) {
  // Write your solution here
  return ['id', 'type'].filter((k) => !e[k]).map((k) => 'missing ' + k);
}
`,
  giai: '// Reference solution\n' + nguon(checkEnvelope),
  cases: [
    { goi: goi('checkEnvelope', EV), moTa: ['The real event of lesson 10.3', 'Sự kiện thật của bài 10.3'] },
    { goi: goi('checkEnvelope', { id: '7', type: 'labflow.booking.created', data: { id: 'bk_7', email: 'an@fpt.edu.vn' } }), moTa: ['Three things wrong', 'Ba chỗ sai'] },
    { goi: goi('checkEnvelope', { ...EV, specversion: '0.3' }), an: true },
    { goi: goi('checkEnvelope', { ...EV, id: '', data: { ...EV.data, userId: 'u_an', name: 'An' } }), an: true },
    { goi: goi('checkEnvelope', { specversion: '1.0', source: '/labflow/v2', id: '9', type: 'labflow.booking.cancelled.v12' }), an: true },
    { goi: goi('checkEnvelope', {}), an: true },
  ],
});

function nextType(type, oldFields, newFields) {
  const removedOrChanged = Object.keys(oldFields).some((k) => newFields[k] !== oldFields[k]);   // mất trường / đổi kiểu
  const added = Object.keys(newFields).some((k) => !(k in oldFields));
  if (removedOrChanged) {
    const m = /^(.*)\.v(\d+)$/.exec(type);
    return { change: 'breaking', type: `${m[1]}.v${Number(m[2]) + 1}` };                       // loại MỚI, phát song song
  }
  return { change: added ? 'additive' : 'same', type };
}
const V1 = { id: 'string', labId: 'string', 'period.start': 'string', 'period.end': 'string', status: 'string', version: 'number' };
const E3 = jsBai({
  ten: 'Event contracts 3 — Write nextType(type, oldFields, newFields)', kho: 'MEDIUM', phut: 12,
  en: `<p>The payload of an event type is described as a map <code>field path ⇒ type</code>. When the producer changes it, classify the change and return the type to publish:</p><ul><li>a field of <code>oldFields</code> is missing or has another type in <code>newFields</code> ⇒ <code>{ change: "breaking", type }</code> with the version bumped (<code>…created.v1</code> ⇒ <code>…created.v2</code>, <code>.v9</code> ⇒ <code>.v10</code>);</li><li>otherwise, new fields only ⇒ <code>{ change: "additive", type }</code> (same type);</li><li>identical ⇒ <code>{ change: "same", type }</code>.</li></ul>`,
  vi: `<p>Payload của một loại sự kiện được mô tả bằng map <code>đường dẫn trường ⇒ kiểu</code>. Khi bên phát đổi nó, phân loại thay đổi và trả loại sự kiện cần phát:</p><ul><li>một trường của <code>oldFields</code> bị mất hoặc đổi kiểu trong <code>newFields</code> ⇒ <code>{ change: "breaking", type }</code> với phiên bản tăng (<code>…created.v1</code> ⇒ <code>…created.v2</code>, <code>.v9</code> ⇒ <code>.v10</code>);</li><li>ngược lại, chỉ thêm trường ⇒ <code>{ change: "additive", type }</code> (giữ loại);</li><li>giống hệt ⇒ <code>{ change: "same", type }</code>.</li></ul>`,
  dauVao: ['type — string ending in .v&lt;n&gt;; oldFields, newFields — { path: typeName }', 'type — chuỗi kết thúc bằng .v&lt;n&gt;; oldFields, newFields — { đường dẫn: tên kiểu }'],
  dauRa: ['{ change: "same" | "additive" | "breaking", type }', '{ change: "same" | "additive" | "breaking", type }'],
  goiY: [['Check removals and type changes first — they win over additions.', 'Xét mất trường và đổi kiểu trước — chúng thắng việc thêm trường.'], ['/^(.*)\\.v(\\d+)$/ splits the name and the number; Number() before +1.', '/^(.*)\\.v(\\d+)$/ tách tên và số; Number() trước khi +1.']],
  loi: [['Bumping the version for an added field — every v1 subscriber is cut off for nothing.', 'Tăng phiên bản khi chỉ thêm trường — mọi subscriber v1 bị cắt vô cớ.'], ['String concatenation: "1" + 1 = "11".', 'Nối chuỗi: "1" + 1 = "11".']],
  gt: ['events/versions.mjs: adding purposeCategory kept labflow.booking.created.v1 (the strict reader broke, the tolerant reader did not); replacing period with startAt/endAt made …created.v2, published in parallel (139 B + 132 B per booking) until nobody subscribes to v1.', 'events/versions.mjs: thêm purposeCategory giữ labflow.booking.created.v1 (bên đọc chặt vỡ, bên đọc khoan dung thì không); thay period bằng startAt/endAt thành …created.v2, phát song song (139 B + 132 B mỗi lượt đặt) tới khi không ai còn nghe v1.'],
  kn: ['events', 'versioning'],
  tns: [tn('additive change', 'thay đổi chỉ thêm'), tn('breaking change', 'thay đổi phá vỡ'), tn('tolerant reader', 'bên đọc khoan dung')],
  dau: `/** classify a payload change and pick the event type */
function nextType(type, oldFields, newFields) {
  // Write your solution here
  const same = Object.keys(oldFields).length === Object.keys(newFields).length;
  return same ? { change: 'same', type } : { change: 'breaking', type: type.replace(/\\d+$/, (n) => n + 1) };
}
`,
  giai: '// Reference solution\n' + nguon(nextType),
  cases: [
    { goi: goi('nextType', 'labflow.booking.created.v1', V1, { ...V1, purposeCategory: 'string' }), moTa: ['Add purposeCategory', 'Thêm purposeCategory'] },
    { goi: goi('nextType', 'labflow.booking.created.v1', V1, { id: 'string', labId: 'string', startAt: 'string', endAt: 'string', status: 'string', version: 'number' }), moTa: ['period ⇒ startAt/endAt', 'period ⇒ startAt/endAt'] },
    { goi: goi('nextType', 'labflow.booking.cancelled.v1', V1, V1), an: true },
    { goi: goi('nextType', 'labflow.export.completed.v9', { jobId: 'string', bytes: 'number' }, { jobId: 'string', bytes: 'string' }), an: true },
    { goi: goi('nextType', 'labflow.report.ready.v1', { jobId: 'string', result: 'string' }, { jobId: 'string', expiresAt: 'string', owner: 'string' }), an: true },
  ],
});

function redeliver(mode, ids, crashes) {
  const left = new Set(crashes.map(([id, point]) => `${id}@${point}`));   // mỗi điểm chết chỉ xảy ra MỘT lần
  const crash = (id, point) => left.delete(`${id}@${point}`);
  const marks = new Set();                                                 // bảng processed_events
  const sent = {};
  let i = 0;
  while (i < ids.length) {                                                 // i = sự kiện đầu tiên chưa XACK
    const id = ids[i];
    const send = () => { sent[id] = (sent[id] || 0) + 1; };
    if (mode === 'none') {
      send();
      if (crash(id, 'afterSend')) continue;                                // chết trước XACK ⇒ giao lại
    } else if (mode === 'mark-first') {
      if (!marks.has(id)) {
        marks.add(id);                                                     // tự commit ngay
        if (crash(id, 'afterMark')) continue;                              // giao lại thấy đã đánh dấu ⇒ không bao giờ gửi
        send();
      }
      if (crash(id, 'afterSend')) continue;
    } else {
      if (!marks.has(id)) {
        if (crash(id, 'afterMark')) continue;                              // chết trước COMMIT ⇒ cả hai cùng mất, giao lại làm lại
        marks.add(id); send();                                             // COMMIT: đánh dấu + gửi cùng lúc
      }
      if (crash(id, 'afterSend')) continue;
    }
    i++;                                                                   // XACK
  }
  const distinct = Object.keys(sent).length;
  const sends = Object.values(sent).reduce((a, b) => a + b, 0);
  return { sends, duplicates: sends - distinct, lost: ids.length - distinct };
}
const IDS = ['evt_1', 'evt_2', 'evt_3', 'evt_4', 'evt_5', 'evt_6', 'evt_7', 'evt_8', 'evt_9', 'evt_10'];
const CR = [['evt_3', 'afterSend'], ['evt_7', 'afterMark']];
const E4 = jsBai({
  ten: 'Event contracts 4 — Write redeliver(mode, ids, crashes): 17 duplicates, 21 lost or exactly once', kho: 'HARD', phut: 25,
  en: `<p>Replay events/notifier.mjs. A consumer handles the events <code>ids</code> in order; a crash means the event was not acknowledged (no XACK), so the restarted consumer handles <b>the same event again</b>. Each <code>[id, point]</code> in <code>crashes</code> crashes the consumer once, the first time it reaches that point for that event. The modes:</p><ul><li><code>"none"</code>: send → (point <code>afterSend</code>) → ack.</li><li><code>"mark-first"</code>: if the id is not marked: mark (committed at once) → (point <code>afterMark</code>) → send. Then (point <code>afterSend</code>) → ack.</li><li><code>"same-tx"</code>: if the id is not marked: (point <code>afterMark</code> = crash before COMMIT: nothing is kept) → mark and send together. Then (point <code>afterSend</code>) → ack.</li></ul><p>Return <code>{ sends, duplicates, lost }</code>: total notifications sent, sends minus distinct ids sent, ids never sent. A point that a mode does not have is never reached.</p>`,
  vi: `<p>Dựng lại events/notifier.mjs. Một consumer xử lý các sự kiện <code>ids</code> theo thứ tự; chết nghĩa là sự kiện chưa được xác nhận (chưa XACK), nên consumer khởi động lại xử lý <b>lại đúng sự kiện đó</b>. Mỗi <code>[id, point]</code> trong <code>crashes</code> làm consumer chết một lần, ở lần đầu nó tới điểm đó với sự kiện đó. Các chế độ:</p><ul><li><code>"none"</code>: gửi → (điểm <code>afterSend</code>) → ack.</li><li><code>"mark-first"</code>: nếu id chưa được đánh dấu: đánh dấu (commit ngay) → (điểm <code>afterMark</code>) → gửi. Rồi (điểm <code>afterSend</code>) → ack.</li><li><code>"same-tx"</code>: nếu id chưa được đánh dấu: (điểm <code>afterMark</code> = chết trước COMMIT: không giữ lại gì) → đánh dấu và gửi cùng lúc. Rồi (điểm <code>afterSend</code>) → ack.</li></ul><p>Trả <code>{ sends, duplicates, lost }</code>: tổng số thông báo đã gửi, số lần gửi trừ số id khác nhau đã gửi, số id không bao giờ được gửi. Điểm nào chế độ không có thì không bao giờ tới.</p>`,
  dauVao: ['mode — "none" | "mark-first" | "same-tx"; ids — distinct strings; crashes — [id, "afterMark" | "afterSend"][]', 'mode — "none" | "mark-first" | "same-tx"; ids — chuỗi khác nhau; crashes — [id, "afterMark" | "afterSend"][]'],
  dauRa: ['{ sends, duplicates, lost }', '{ sends, duplicates, lost }'],
  goiY: [['Keep an index i of the first unacknowledged event; a crash is “continue without i++”.', 'Giữ chỉ số i của sự kiện đầu tiên chưa ack; chết là “continue mà không i++”.'], ['Use a Set of "id@point" and delete from it when a crash fires, so it fires once.', 'Dùng Set các "id@point" và xoá khi điểm chết xảy ra, để nó chỉ xảy ra một lần.']],
  loi: [['Skipping the event after a crash — the stream redelivers it, it is not lost by the broker.', 'Bỏ qua sự kiện sau khi chết — stream giao lại nó, broker không làm mất.'], ['In same-tx, keeping the mark when the crash happened before COMMIT.', 'Trong same-tx, vẫn giữ dấu dù chết trước COMMIT.']],
  gt: ['Same mechanics, 1,000 events with 2% crashes in lesson 10.3: none 1,017 sends (17 duplicates), mark-first 979 (21 lost), same-tx exactly 1,000. Recording the id in the same transaction as the effect is what makes an at-least-once channel give an exactly-once effect.', 'Cùng cơ chế, 1.000 sự kiện với 2% sự cố ở bài 10.3: none gửi 1.017 (17 trùng), mark-first 979 (mất 21), same-tx đúng 1.000. Ghi id trong cùng transaction với tác dụng là cách để kênh ít-nhất-một-lần cho tác dụng đúng-một-lần.'],
  kn: ['events', 'idempotency', 'reliability'],
  tns: [tn('at-least-once', 'ít nhất một lần'), tn('idempotent consumer', 'consumer chống trùng'), tn('XACK', 'xác nhận đã xử lý thông điệp')],
  dau: `/** replay a consumer that may crash, in one of three modes */
function redeliver(mode, ids, crashes) {
  // Write your solution here
  return { sends: ids.length, duplicates: 0, lost: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(redeliver),
  cases: [
    { goi: goi('redeliver', 'none', IDS, CR), moTa: ['none — two crashes', 'none — hai lần chết'] },
    { goi: goi('redeliver', 'mark-first', IDS, CR), moTa: ['mark-first — the same crashes', 'mark-first — cùng các lần chết'] },
    { goi: goi('redeliver', 'same-tx', IDS, CR), an: true },
    { goi: goi('redeliver', 'none', IDS, [['evt_1', 'afterSend'], ['evt_2', 'afterSend'], ['evt_2', 'afterMark']]), an: true },
    { goi: goi('redeliver', 'mark-first', IDS, [['evt_1', 'afterMark'], ['evt_5', 'afterMark'], ['evt_9', 'afterSend']]), an: true },
    { goi: goi('redeliver', 'same-tx', IDS, [['evt_1', 'afterMark'], ['evt_5', 'afterMark'], ['evt_9', 'afterSend']]), an: true },
    { goi: goi('redeliver', 'none', [], []), an: true },
  ],
});

export default doiDau({ slug: 'api-10-2-su-kien', ten: '10.3 Event contracts: payloads, versions and idempotent consumers', khoa: KHOA, baiHoc: 'api-10-2-su-kien', de: [E1, E2, E3, E4] });
