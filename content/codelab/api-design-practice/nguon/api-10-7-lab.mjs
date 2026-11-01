/** API Design · Lab 10 — Báo cáo dùng phòng thành việc nền có webhook: 202 + job, tiến độ, huỷ, thời hạn giữ, report.ready chỉ tới người tạo (output thật Lab 10). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = {
  ...cs({
    ten: 'Lab 10 · 1 — The starter, the traps and the reference run', kho: 'EASY', phut: 8,
    en: 'POST /v2/reports/usage/exports for 50 labs × up to 92 days, graded by lab/grade-lab10.mjs (starter 0/10, solution 10/10).',
    vi: 'POST /v2/reports/usage/exports cho 50 phòng × tối đa 92 ngày, chấm bằng lab/grade-lab10.mjs (bản khởi đầu 0/10, lời giải 10/10).',
    cau: [
      q('c1', ['The starter answered a 92-day report correctly in 23.3 s. Why did it still score 0/10?', 'Bản khởi đầu trả đúng báo cáo 92 ngày trong 23,3 s. Vì sao vẫn được 0/10?'],
        ['The contract was wrong: the client held the connection, a second click recomputed, nobody was told when it was done', 'The numbers did not match SQL, because the starter skipped the attendance service', 'The grader’s timeout is 10 s, so every check after the first one could not run at all', 'The starter returned CSV, while the rubric asks for application/json in every check'],
        ['The lab changes the contract, not the computation: 23.3 s of waiting became a 202 in 6 ms.', 'Lab đổi hợp đồng, không đổi phép tính: 23,3 s chờ thành 202 trong 6 ms.']),
      q('c2', ['Trap: the worker publishes labflow.report.ready.v1 without an owner. What does the dispatcher of 10.5 do?', 'Bẫy: worker phát labflow.report.ready.v1 mà không có owner. Bộ điều phối của bài 10.5 làm gì?'],
        ['Sends it to every manager subscribed to report.ready — the whole campus report leaks', 'Drops it, because events without an owner fail the AsyncAPI schema validation', 'Sends it only to the first subscription created, which is usually the admin', 'Queues it until the creator subscribes, and then delivers it exactly once'],
        ['WHERE … AND ($2 IS NULL OR owner_id = $2): no owner means no filter. Put the creator in the event, and keep the event thin — a link, not the rows.', 'WHERE … AND ($2 IS NULL OR owner_id = $2): không có owner là không lọc. Đưa người tạo vào sự kiện, và giữ sự kiện mỏng — một liên kết, không phải các dòng.']),
      q('c3', ['Why is report.ready thin (job id + result link) while booking events are fat?', 'Vì sao report.ready mỏng (id việc + liên kết kết quả) còn sự kiện lượt đặt thì dày?'],
        ['The report is 46–300 KB, private to its creator, and already at a URL that checks the token', 'Thin events are required by Standard Webhooks for any payload over 1 KB', 'Fat events cannot be signed with HMAC once the body is larger than 64 KB', 'The receiver would have to recompute the report to verify a fat event'],
        ['A webhook full of campus data would sit in the receiver’s logs for years.', 'Một webhook chứa đầy dữ liệu toàn trường sẽ nằm trong log của bên nhận nhiều năm.']),
      q('c4', ['Trap: cancel only removes the job from the queue. What happens to a running 92-day report?', 'Bẫy: huỷ chỉ xoá việc khỏi hàng đợi. Báo cáo 92 ngày đang chạy sẽ ra sao?'],
        ['It reports “cancelled” but keeps calling the attendance service for about 20 more seconds', 'BullMQ kills the worker process, so every other job on that worker is lost too', 'It stops at once, because removing a job also aborts the worker’s handler', 'It finishes and sends report.ready, because the webhook was queued in advance'],
        ['The task must look at the abort signal once per day; the reference stopped at 5% and the result answered 409.', 'Tác vụ phải xem tín hiệu huỷ mỗi ngày một lần; lời giải dừng ở 5% và kết quả trả 409.']),
    ],
    goiY: [['Read the trap boxes of the lab page.', 'Đọc các khung “Bẫy” của trang lab.'], ['Ask: who receives this, and what does it contain?', 'Hỏi: ai nhận được cái này, và nó chứa gì?']],
    loi: [['Publishing report.ready without the creator.', 'Phát report.ready mà không có người tạo.'], ['Cancelling only the queue entry.', 'Chỉ huỷ mục trong hàng đợi.']],
    tns: [tn('rubric', 'thang điểm'), tn('thin event', 'sự kiện mỏng — chỉ id + liên kết')],
    kn: ['async APIs', 'webhooks'],
  }),
  dangBai: 'lab',
};

function gradeStatus(trace) {
  const FINAL = ['succeeded', 'failed', 'cancelled'];
  const seen = [];
  for (const t of trace) if (seen[seen.length - 1] !== t.status) seen.push(t.status);   // gộp các lần hỏi liền nhau cùng trạng thái
  const problems = [];
  if (!trace.length || trace[trace.length - 1].status !== 'succeeded') problems.push('not succeeded');
  if (!seen.includes('running')) problems.push('never running');
  if (trace.some((t, i) => i > 0 && t.percent < trace[i - 1].percent)) problems.push('progress went back');
  if (trace.some((t) => !FINAL.includes(t.status) && !t.retryAfter)) problems.push('missing Retry-After');
  return { points: problems.length ? 0 : 1, seen: seen.join(' → '), problems };
}
const P = (status, percent, retryAfter) => ({ status, percent, retryAfter });
const E2 = jsBai({
  ten: 'Lab 10 · 2 — Write gradeStatus(trace): the “Status” check of grade-lab10.mjs', kho: 'MEDIUM', phut: 15, dangBai: 'lab',
  en: `<p>The grader polls <code>GET /v2/jobs/{id}</code> every 500 ms until a final status and records each answer as <code>{ status, percent, retryAfter }</code> (<code>retryAfter</code>: the header value or <code>null</code>). Grade the trace (1 point):</p><ul><li><code>seen</code> = the statuses with consecutive repeats collapsed, joined by <code>" → "</code>;</li><li><code>problems</code>, in this order: <code>"not succeeded"</code> (the last status is not <code>succeeded</code>, or the trace is empty), <code>"never running"</code>, <code>"progress went back"</code> (a percent lower than the one before it), <code>"missing Retry-After"</code> (a non-final answer without it; final = succeeded, failed, cancelled);</li><li><code>points</code> = 1 if there is no problem, else 0.</li></ul><p>Return <code>{ points, seen, problems }</code>.</p>`,
  vi: `<p>Bộ chấm hỏi <code>GET /v2/jobs/{id}</code> mỗi 500 ms tới khi gặp trạng thái cuối và ghi mỗi câu trả lời thành <code>{ status, percent, retryAfter }</code> (<code>retryAfter</code>: giá trị header hoặc <code>null</code>). Chấm dãy này (1 điểm):</p><ul><li><code>seen</code> = các trạng thái, gộp những lần lặp liền nhau, nối bằng <code>" → "</code>;</li><li><code>problems</code>, theo thứ tự: <code>"not succeeded"</code> (trạng thái cuối cùng không phải <code>succeeded</code>, hoặc dãy rỗng), <code>"never running"</code>, <code>"progress went back"</code> (một percent nhỏ hơn cái ngay trước), <code>"missing Retry-After"</code> (một câu trả lời chưa cuối mà thiếu nó; cuối = succeeded, failed, cancelled);</li><li><code>points</code> = 1 nếu không có vấn đề nào, ngược lại 0.</li></ul><p>Trả <code>{ points, seen, problems }</code>.</p>`,
  dauVao: ['trace — [{ status, percent, retryAfter: string | null }]', 'trace — [{ status, percent, retryAfter: chuỗi | null }]'],
  dauRa: ['{ points: 0 | 1, seen: string, problems: string[] }', '{ points: 0 | 1, seen: string, problems: string[] }'],
  goiY: [['Build seen by pushing a status only when it differs from the last one pushed.', 'Dựng seen bằng cách chỉ thêm trạng thái khi khác cái vừa thêm.'], ['Each problem is one .some(…) over the trace.', 'Mỗi vấn đề là một .some(…) trên dãy.']],
  loi: [['Requiring Retry-After on the final answer too — LabFlow stops sending it once the job is finished.', 'Đòi Retry-After cả ở câu trả lời cuối — LabFlow thôi gửi nó khi việc đã xong.'], ['Using a Set for seen: running → queued → running (a retry) would lose the second running.', 'Dùng Set cho seen: running → queued → running (một lần thử lại) mất running thứ hai.']],
  gt: ['Reference run: “✓ 1/1 … — running → succeeded”. A progress per day that never goes backwards and a Retry-After until the end are part of the contract of 10.1, not decoration.', 'Lần chạy tham khảo: “✓ 1/1 … — running → succeeded”. Tiến độ theo ngày không bao giờ lùi và Retry-After tới cuối là một phần hợp đồng của bài 10.1, không phải trang trí.'],
  kn: ['async APIs', 'testing'],
  tns: [tn('trace', 'dãy quan sát'), tn('monotonic', 'không giảm')],
  dau: `/** grade the polling trace of one job */
function gradeStatus(trace) {
  // Write your solution here
  const last = trace[trace.length - 1];
  const ok = last.status === 'succeeded';
  return { points: ok ? 1 : 0, seen: [...new Set(trace.map((t) => t.status))].join(' → '), problems: ok ? [] : ['not succeeded'] };
}
`,
  giai: '// Reference solution\n' + nguon(gradeStatus),
  cases: [
    { goi: goi('gradeStatus', [P('running', 0, '2'), P('running', 14, '2'), P('running', 57, '2'), P('succeeded', 100, null)]), moTa: ['The reference solution', 'Lời giải tham khảo'] },
    { goi: goi('gradeStatus', [P('queued', 0, null), P('succeeded', 100, null)]), moTa: ['Too fast to see running, no Retry-After', 'Quá nhanh nên không thấy running, thiếu Retry-After'] },
    { goi: goi('gradeStatus', [P('running', 40, '2'), P('queued', 0, '2'), P('running', 20, '2'), P('succeeded', 100, null)]), an: true },
    { goi: goi('gradeStatus', [P('running', 5, '2'), P('cancelled', 5, null)]), an: true },
    { goi: goi('gradeStatus', []), an: true },
    { goi: goi('gradeStatus', [P('queued', 0, '2'), P('queued', 0, '2'), P('running', 50, '2'), P('running', 50, '2'), P('succeeded', 100, null)]), an: true },
  ],
});

function dispatch(events, subscriptions) {
  const queued = [];
  for (const e of events) {
    const owner = e.data && e.data.owner ? e.data.owner : null;
    for (const s of subscriptions) {
      if (s.status !== 'active' || !s.events.includes(e.type)) continue;
      if (owner !== null && s.ownerId !== owner) continue;          // việc của ai ⇒ chỉ webhook của người đó
      const msgId = `msg_${e.id}_${s.id}`;
      if (!queued.includes(msgId)) queued.push(msgId);               // jobId = msgId: đọc lại sự kiện không xếp trùng
    }
  }
  return queued;
}
const SUBS = [
  { id: 'wh_lan', ownerId: 'u_lan', events: ['labflow.report.ready.v1', 'labflow.booking.cancelled.v1'], status: 'active' },
  { id: 'wh_hung', ownerId: 'u_hung', events: ['labflow.report.ready.v1'], status: 'active' },
  { id: 'wh_dept', ownerId: 'u_dept', events: ['labflow.booking.cancelled.v1'], status: 'active' },
  { id: 'wh_old', ownerId: 'u_lan', events: ['labflow.report.ready.v1'], status: 'disabled' },
];
const READY = { id: '1793497205314-0', type: 'labflow.report.ready.v1', data: { jobId: 'job_2', kind: 'usage-report', owner: 'u_lan', result: '/v2/jobs/job_2/result', expiresAt: '2026-11-01T02:33:25.814Z' } };
const CANCEL = { id: '1793497206001-0', type: 'labflow.booking.cancelled.v1', data: { id: 'bk_9', status: 'CANCELLED', version: 2 } };
const E3 = jsBai({
  ten: 'Lab 10 · 3 — Write dispatch(events, subscriptions): report.ready only to its creator', kho: 'HARD', phut: 20, dangBai: 'lab',
  en: `<p>The webhook dispatcher of src/worker.js. Events come from the stream in order (the same event may be read twice). For each event, for each subscription in order, queue one message when the subscription is <code>active</code>, lists the event’s <code>type</code>, and — if the event has <code>data.owner</code> — belongs to that owner (<code>ownerId</code>); events without an owner (booking events) go to every matching subscription. The message id is <code>msg_&lt;event id&gt;_&lt;subscription id&gt;</code> and is also the queue’s job id, so a message already queued is not added again. Return the queued message ids in order.</p>`,
  vi: `<p>Bộ điều phối webhook trong src/worker.js. Sự kiện tới từ stream theo thứ tự (cùng một sự kiện có thể bị đọc hai lần). Với mỗi sự kiện, với mỗi đăng ký theo thứ tự, xếp một thông điệp khi đăng ký đang <code>active</code>, có <code>type</code> của sự kiện trong danh sách, và — nếu sự kiện có <code>data.owner</code> — thuộc về đúng người đó (<code>ownerId</code>); sự kiện không có owner (sự kiện lượt đặt) tới mọi đăng ký khớp. Id thông điệp là <code>msg_&lt;id sự kiện&gt;_&lt;id đăng ký&gt;</code> và cũng là job id của hàng đợi, nên thông điệp đã xếp thì không thêm lần nữa. Trả các id thông điệp đã xếp theo thứ tự.</p>`,
  dauVao: ['events — [{ id, type, data }]; subscriptions — [{ id, ownerId, events, status }]', 'events — [{ id, type, data }]; subscriptions — [{ id, ownerId, events, status }]'],
  dauRa: ['string[] — message ids', 'string[] — id thông điệp'],
  goiY: [['Three filters per subscription: active, type, owner (only when the event has one).', 'Ba bộ lọc cho mỗi đăng ký: active, type, owner (chỉ khi sự kiện có owner).'], ['The dedupe key is the message id, not the event id: one event legitimately produces several messages.', 'Khoá chống trùng là id thông điệp, không phải id sự kiện: một sự kiện sinh ra nhiều thông điệp là đúng.']],
  loi: [['Ignoring the owner — the trap of the lab: the whole campus report goes to every manager.', 'Bỏ qua owner — bẫy của lab: báo cáo toàn trường tới mọi quản lý.'], ['Filtering by owner for booking events too, so the department’s subscription never gets a cancellation.', 'Lọc theo owner cả với sự kiện lượt đặt, nên đăng ký của phòng đào tạo không bao giờ nhận lệnh huỷ.']],
  gt: ['This is the SQL of the dispatcher — status = ’active’ AND $1 = ANY(events) AND ($2 IS NULL OR owner_id = $2) — plus jobId = msgId. In the reference run the grader’s receiver got exactly 1 webhook for the 14-day job, a valid signature, and nothing for the cancelled one.', 'Đây là câu SQL của bộ điều phối — status = ’active’ AND $1 = ANY(events) AND ($2 IS NULL OR owner_id = $2) — cộng jobId = msgId. Ở lần chạy tham khảo, bên nhận của bộ chấm nhận đúng 1 webhook cho việc 14 ngày, chữ ký hợp lệ, và không gì cho việc bị huỷ.'],
  kn: ['webhooks', 'authorization', 'idempotency'],
  tns: [tn('dispatcher', 'bộ điều phối'), tn('fan-out', 'một sự kiện tới nhiều đăng ký')],
  dau: `/** which webhook messages should be queued? */
function dispatch(events, subscriptions) {
  // Write your solution here
  const out = [];
  for (const e of events) {
    for (const s of subscriptions) {
      if (s.events.includes(e.type)) out.push('msg_' + e.id + '_' + s.id);
    }
  }
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(dispatch),
  cases: [
    { goi: goi('dispatch', [READY], SUBS), moTa: ['report.ready of Cô Lan’s job', 'report.ready của việc Cô Lan'] },
    { goi: goi('dispatch', [CANCEL], SUBS), moTa: ['A booking event has no owner', 'Sự kiện lượt đặt không có owner'] },
    { goi: goi('dispatch', [READY, CANCEL, READY], SUBS), an: true },
    { goi: goi('dispatch', [{ ...READY, id: '1793497300000-0', data: { ...READY.data, owner: 'u_hung' } }], SUBS), an: true },
    { goi: goi('dispatch', [{ id: '1793497300001-0', type: 'labflow.export.completed.v1', data: { jobId: 'job_3', owner: 'u_lan' } }], SUBS), an: true },
    { goi: goi('dispatch', [], SUBS), an: true },
  ],
});

export default doiDau({ slug: 'api-10-7-lab', ten: 'Lab 10 — The usage report as a background job with a webhook', khoa: KHOA, baiHoc: 'api-10-7-lab', de: [E1, E2, E3] });
