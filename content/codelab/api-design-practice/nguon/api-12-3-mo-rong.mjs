/** API Design · 12.5 — Cache, transactional outbox, hàng đợi thông báo (output thật bài 12.5: event-lag, notify-cost, RELAY_CRASH). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Scale 1 — Cache, outbox and email, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.5: the labs cache, the outbox relay and email inside the request versus in a queue.',
  vi: 'Những điều từ bài 12.5: cache danh sách phòng, relay outbox và email trong request so với qua hàng đợi.',
  cau: [
    q('c1', ['Email sent inside POST /v2/bookings while the provider is down. What did the student see, and what was in the table?', 'Gửi email ngay trong POST /v2/bookings khi nhà cung cấp sập. Sinh viên thấy gì, bảng có gì?'],
      ['500 INTERNAL, while the table grew from 20 to 25 — the bookings were saved', '503 with Retry-After, and the bookings were rolled back with the email', '201, because Express ignores errors thrown after the database commit', '409 BOOKING_CONFLICT, because the outbox row already existed for that slot'],
      ['The retry then got 409 against the student’s own booking. In a queue: 201 in ~6 ms and the email retried to delivery.', 'Bấm lại thì nhận 409 với chính lượt của mình. Qua hàng đợi: 201 trong ~6 ms và email được thử lại tới khi giao.']),
    q('c2', ['From a 201 to the SSE event in the browser: p50 1.0 ms with LISTEN/NOTIFY. Without it (poll every second)?', 'Từ câu 201 tới sự kiện SSE ở trình duyệt: p50 1,0 ms với LISTEN/NOTIFY. Không có nó (hỏi vòng mỗi giây)?'],
      ['p50 946 ms — the relay noticed the row only at its next poll', 'p50 1.0 ms as well — the relay polls fast enough not to matter', 'Events were lost, because NOTIFY is the only way the relay reads rows', 'p50 about 50 ms — the SSE heartbeat sets the pace'],
      ['NOTIFY is delivered at COMMIT (never on ROLLBACK); the 1 s poll stays as a safety net.', 'NOTIFY được giao lúc COMMIT (không bao giờ khi ROLLBACK); hỏi vòng 1 s giữ làm lưới an toàn.']),
    q('c3', ['The relay died after XADD but before marking the row published. What did the stream and the mailbox contain?', 'Relay chết sau XADD nhưng trước khi đánh dấu đã phát. Stream và hộp thư có gì?'],
      ['21 events for 20 bookings, and exactly 20 emails with no duplicates', '20 events and 20 emails — the outbox transaction prevented the duplicate', '21 events and 21 emails, one booking notified twice', '19 events, because the crashed batch was rolled back and never sent'],
      ['Outbox is at-least-once; the job id ntf_bk_5_v1 makes BullMQ ignore the duplicate.', 'Outbox là ít nhất một lần; id job ntf_bk_5_v1 làm BullMQ bỏ qua bản trùng.']),
    q('c4', ['On one laptop a Redis cache hit for /v2/labs took 1.96 ms and PostgreSQL 1.87 ms. What is the cache for, then?', 'Trên một máy, trúng cache Redis cho /v2/labs mất 1,96 ms còn PostgreSQL 1,87 ms. Vậy cache để làm gì?'],
      ['Taking repeated identical reads off the database at peak — a thousand app starts cost one query', 'Making every single request faster, which it does on production hardware only', 'Keeping the labs list available when PostgreSQL loses data', 'Avoiding the HTTP ETag check, which is slower than Redis'],
      ['Measure honestly: both are a localhost hop. And any Redis error is a miss, so the cache can never take the API down.', 'Đo trung thực: cả hai đều là một vòng localhost. Và lỗi Redis nào cũng là trượt, nên cache không bao giờ làm sập API.']),
  ],
  goiY: [['Ask what is committed when the side effect fails.', 'Hỏi: cái gì đã commit khi việc phụ hỏng.'], ['At-least-once means duplicates are possible.', 'Ít nhất một lần nghĩa là có thể trùng.']],
  loi: [['Sending email inside the request.', 'Gửi email trong request.'], ['Assuming the outbox gives exactly-once delivery.', 'Tưởng outbox cho giao đúng một lần.']],
  tns: [tn('transactional outbox', 'hộp thư đi trong giao dịch'), tn('relay', 'bộ chuyển tiếp'), tn('at-least-once', 'ít nhất một lần')],
  kn: ['messaging', 'caching'],
});

function claimBatch(outbox, locked, limit) {
  return outbox.filter((r) => r.publishedAt === null && !locked.includes(r.id)).sort((a, b) => a.id - b.id).slice(0, limit).map((r) => r.id);
}
const OB = [
  { id: 4, publishedAt: null }, { id: 1, publishedAt: '2026-11-01T04:00:00Z' }, { id: 2, publishedAt: null },
  { id: 3, publishedAt: null }, { id: 5, publishedAt: null },
];
const E2 = jsBai({
  ten: 'Scale 2 — Write claimBatch(outbox, locked, limit): FOR UPDATE SKIP LOCKED', kho: 'MEDIUM', phut: 10,
  en: `<p>Model the relay’s query <code>SELECT … WHERE published_at IS NULL ORDER BY id LIMIT n FOR UPDATE SKIP LOCKED</code>. <code>outbox</code> rows are <code>{ id, publishedAt }</code>; <code>locked</code> lists ids another relay is holding. Return the ids this relay takes: unpublished, not locked, ascending id, at most <code>limit</code>.</p>`,
  vi: `<p>Mô phỏng câu truy vấn của relay <code>SELECT … WHERE published_at IS NULL ORDER BY id LIMIT n FOR UPDATE SKIP LOCKED</code>. Các dòng <code>outbox</code> là <code>{ id, publishedAt }</code>; <code>locked</code> liệt kê id mà relay khác đang giữ. Trả các id relay này lấy: chưa phát, không bị khoá, id tăng dần, tối đa <code>limit</code>.</p>`,
  dauVao: ['outbox — {id, publishedAt}[]; locked — number[]; limit — number', 'outbox — {id, publishedAt}[]; locked — mảng số; limit — số'], dauRa: ['number[]', 'mảng số'],
  goiY: [['Filter, then sort, then cut.', 'Lọc, rồi sắp, rồi cắt.'], ['A locked row is skipped, not waited for.', 'Dòng bị khoá thì bỏ qua, không chờ.']],
  loi: [['Taking rows another relay holds (double publishing).', 'Lấy dòng relay khác đang giữ (phát hai lần).'], ['Keeping the input order instead of id order.', 'Giữ thứ tự đầu vào thay vì thứ tự id.']],
  gt: ['SKIP LOCKED lets several relays share one table without waiting on each other — the PostgreSQL docs describe it for “queue-like tables” (12.5).', 'SKIP LOCKED cho nhiều relay dùng chung một bảng mà không chờ nhau — tài liệu PostgreSQL mô tả nó cho “bảng kiểu hàng đợi” (12.5).'],
  kn: ['messaging', 'databases'], tns: [tn('SKIP LOCKED', 'bỏ qua dòng bị khoá')],
  dau: `/** rows this relay may publish */
function claimBatch(outbox, locked, limit) {
  // Write your solution here
  return outbox.filter((r) => r.publishedAt === null).slice(0, limit).map((r) => r.id);
}
`,
  giai: '// Reference solution\n' + nguon(claimBatch),
  cases: [
    { goi: goi('claimBatch', OB, [], 2), moTa: ['Nothing locked', 'Không dòng nào bị khoá'] },
    { goi: goi('claimBatch', OB, [2, 3], 10), moTa: ['Another relay holds 2 and 3', 'Relay khác giữ 2 và 3'] },
    { goi: goi('claimBatch', OB, [2, 3, 4, 5], 10), an: true },
    { goi: goi('claimBatch', [], [], 5), an: true },
  ],
});

function mailJobs(events) {
  const seen = new Set();
  const out = [];
  for (const e of events) {
    const m = /^labflow\.booking\.(created|cancelled)\.v1$/.exec(e.type);
    if (!m) continue;
    const id = `ntf_${e.data.id}_v${e.data.version}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ id, kind: m[1] });
  }
  return out;
}
const EV = [
  { type: 'labflow.booking.created.v1', data: { id: 'bk_5', version: 1 } },
  { type: 'labflow.booking.checked_in.v1', data: { id: 'bk_4', version: 2 } },
  { type: 'labflow.booking.created.v1', data: { id: 'bk_5', version: 1 } },
  { type: 'labflow.booking.cancelled.v1', data: { id: 'bk_5', version: 2 } },
];
const E3 = jsBai({
  ten: 'Scale 3 — Write mailJobs(events): one email per booking version', kho: 'HARD', phut: 15,
  en: `<p>The worker reads booking events (at least once — duplicates happen). Return the email jobs to enqueue, in order: only <code>labflow.booking.created.v1</code> and <code>…cancelled.v1</code>; job <code>{ id: 'ntf_&lt;bookingId&gt;_v&lt;version&gt;', kind: 'created' | 'cancelled' }</code>; skip any id already produced.</p>`,
  vi: `<p>Worker đọc sự kiện lượt đặt (ít nhất một lần — có thể trùng). Trả các job email cần xếp hàng, đúng thứ tự: chỉ <code>labflow.booking.created.v1</code> và <code>…cancelled.v1</code>; job <code>{ id: 'ntf_&lt;bookingId&gt;_v&lt;version&gt;', kind: 'created' | 'cancelled' }</code>; bỏ qua id đã sinh rồi.</p>`,
  dauVao: ['events — {type, data:{id, version}}[]', 'events — {type, data:{id, version}}[]'], dauRa: ['{ id, kind }[]', '{ id, kind }[]'],
  goiY: [['The id is deterministic: same booking + version ⇒ same id.', 'Id là tất định: cùng lượt + version ⇒ cùng id.'], ['A Set remembers what you already produced.', 'Một Set nhớ những gì đã sinh.']],
  loi: [['Using the stream id as the job id — a re-published event gets a new stream id.', 'Dùng id của stream làm id job — sự kiện phát lại có id stream mới.'], ['Emailing on checked_in.', 'Gửi email cho checked_in.']],
  gt: ['12.5: a relay crash produced 21 events for 20 bookings and still exactly 20 emails, because BullMQ ignores a job whose id already exists and the provider receives the same id as idempotency key.', '12.5: relay sập sinh 21 sự kiện cho 20 lượt đặt mà vẫn đúng 20 email, vì BullMQ bỏ qua job có id đã tồn tại và nhà cung cấp nhận cùng id làm khoá idempotency.'],
  kn: ['messaging', 'idempotency'], tns: [tn('deterministic id', 'id tất định'), tn('deduplication', 'khử trùng')],
  dau: `/** email jobs to enqueue */
function mailJobs(events) {
  // Write your solution here
  return events.map((e) => ({ id: 'ntf_' + e.data.id + '_v' + e.data.version, kind: e.type.split('.')[2] }));
}
`,
  giai: '// Reference solution\n' + nguon(mailJobs),
  cases: [
    { goi: goi('mailJobs', EV), moTa: ['A duplicate and a check-in', 'Một bản trùng và một check-in'] },
    { goi: goi('mailJobs', EV.slice(0, 1)), moTa: ['One event', 'Một sự kiện'] },
    { goi: goi('mailJobs', [...EV, { type: 'labflow.booking.cancelled.v1', data: { id: 'bk_5', version: 2 } }, { type: 'labflow.export.completed.v1', data: { id: 'job_1', version: 1 } }]), an: true },
    { goi: goi('mailJobs', []), an: true },
  ],
});

export default doiDau({ slug: 'api-12-3-mo-rong', ten: '12.5 Making it scale: cache, outbox, notification queue', khoa: KHOA, baiHoc: 'api-12-3-mo-rong', de: [E1, E2, E3] });
