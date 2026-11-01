/** API Design · 10.1 — API bất đồng bộ: 202 Accepted, tài nguyên công việc, polling (output thật bài 10.1). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Async jobs 1 — What the 524 taught us', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 10.1: exporting every booking of the semester through perf/edge-proxy.mjs (gives up after 100 s), then the same export as a job.',
  vi: 'Những điều từ bài 10.1: xuất mọi lượt đặt của học kỳ qua perf/edge-proxy.mjs (bỏ cuộc sau 100 s), rồi cùng việc đó dưới dạng job.',
  cau: [
    q('c1', ['The client got 524 after 100.0 s. What did LabFlow’s own log show for the same request?', 'Client nhận 524 sau 100,0 s. Log của chính LabFlow cho cùng request đó ghi gì?'],
      ['It kept working until 114.8 s and built an 11.7 MB file that nobody received', 'It stopped the export at 100 s because the proxy closed the connection', 'It answered 504 at 100 s and rolled back the partial file it had written', 'It finished in 2.3 s; the 524 came from the attendance service being slow'],
      ['The server never learns that the client left. A second click ran the whole 114 s (and 428 attendance calls) again.', 'Server không biết client đã bỏ đi. Bấm lần hai chạy lại cả 114 s (và 428 lần gọi dịch vụ điểm danh).']),
    q('c2', ['Which answer to POST /v2/exports fits a two-minute export?', 'Câu trả lời nào cho POST /v2/exports hợp với một lượt xuất hai phút?'],
      ['202 Accepted, Location: /v2/jobs/job_1, Retry-After: 2 and the job body', '201 Created, Location: /v2/exports/exp_1, sent after the CSV is complete', '200 OK with the CSV, after raising the proxy timeout to 300 seconds', '303 See Other to /v2/jobs/job_1, with no body and no Retry-After'],
      ['RFC 9110: 202 = accepted, not finished; point to a status monitor. The POST took 17.1 ms on the server.', 'RFC 9110: 202 = đã nhận, chưa xong; chỉ tới chỗ theo dõi trạng thái. POST tốn 17,1 ms ở server.']),
    q('c3', ['An (tok_an) asks GET /v2/jobs/job_1, a job created by Cô Lan. What does LabFlow answer?', 'An (tok_an) hỏi GET /v2/jobs/job_1, việc do Cô Lan tạo. LabFlow trả gì?'],
      ['404 JOB_NOT_FOUND — someone else’s job must not even be confirmed to exist', '403 FORBIDDEN — the job exists, but it belongs to another user of LabFlow', '200 with progress only, because job progress is not sensitive information', '401 UNAUTHORIZED — job resources need a special scope in the token'],
      ['BOLA (6.2): answering 403 would confirm that job_1 exists.', 'BOLA (6.2): trả 403 là xác nhận job_1 tồn tại.']),
    q('c4', ['Cô Lan sends POST /v2/jobs/job_2/cancel while the export is running. What comes back?', 'Cô Lan gửi POST /v2/jobs/job_2/cancel khi lượt xuất đang chạy. Nhận lại gì?'],
      ['202 with status running and cancelRequested: true; the worker stops at the next batch', '200 with status cancelled, because the worker is killed at once by the API', '204 No Content; the job record is deleted together with its partial result', '409 JOB_RUNNING, because a running job can only be cancelled by an admin'],
      ['Cancel is a request: 261 ms later the job was cancelled at 6,000 of 213,749 rows. A second cancel ⇒ 409 JOB_FINISHED.', 'Huỷ là một yêu cầu: 261 ms sau việc dừng ở dòng 6.000/213.749. Huỷ lần hai ⇒ 409 JOB_FINISHED.']),
  ],
  goiY: [['Ask: who is still waiting, and who is still working?', 'Hỏi: ai còn đang chờ, ai còn đang làm?'], ['Each answer reuses a rule from Chapters 2–6.', 'Mỗi câu dùng lại một luật của Chương 2–6.']],
  loi: [['Raising the timeout instead of changing the contract.', 'Tăng timeout thay vì đổi hợp đồng.'], ['Answering 403 for another user’s job.', 'Trả 403 cho việc của người khác.']],
  tns: [tn('202 Accepted', 'đã nhận, chưa xong'), tn('job resource', 'tài nguyên công việc'), tn('proxy read timeout', 'thời gian proxy chờ server')],
  kn: ['async APIs'],
});

function canTransition(from, to) {
  const NEXT = {
    queued: ['running', 'cancelled'],
    running: ['succeeded', 'failed', 'cancelled', 'queued'],   // queued: chờ thử lại (backoff) hoặc bị bỏ dở (stalled)
    succeeded: [], failed: [], cancelled: [],                    // trạng thái cuối: không đi đâu nữa
  };
  return (NEXT[from] || []).includes(to);
}
const E2 = jsBai({
  ten: 'Async jobs 2 — Write canTransition(from, to)', kho: 'EASY', phut: 8,
  en: `<p>The status of a LabFlow job may only change along these arrows: <code>queued → running</code>, <code>queued → cancelled</code>, <code>running → succeeded | failed | cancelled</code>, and <code>running → queued</code> (BullMQ puts a job back in waiting before a retry or after a stall, and LabFlow shows waiting as <code>queued</code>). <code>succeeded</code>, <code>failed</code> and <code>cancelled</code> are final. Return <code>true</code> when the change is allowed; anything else — including the same status twice or an unknown status — is <code>false</code>.</p>`,
  vi: `<p>Trạng thái một việc của LabFlow chỉ được đổi theo các mũi tên: <code>queued → running</code>, <code>queued → cancelled</code>, <code>running → succeeded | failed | cancelled</code>, và <code>running → queued</code> (BullMQ đưa việc về hàng chờ trước một lần thử lại hoặc sau khi bị bỏ dở, LabFlow hiện hàng chờ là <code>queued</code>). <code>succeeded</code>, <code>failed</code>, <code>cancelled</code> là trạng thái cuối. Trả <code>true</code> khi được phép đổi; mọi thứ khác — kể cả hai lần cùng một trạng thái hay trạng thái lạ — là <code>false</code>.</p>`,
  dauVao: ['from, to — strings', 'from, to — chuỗi'],
  dauRa: ['true | false', 'true | false'],
  goiY: [['Write the arrows as a table: status ⇒ list of next statuses.', 'Viết các mũi tên thành bảng: trạng thái ⇒ danh sách trạng thái kế.'], ['Final statuses map to an empty list.', 'Trạng thái cuối ứng với danh sách rỗng.']],
  loi: [['Allowing succeeded → cancelled — LabFlow answers 409 JOB_FINISHED instead.', 'Cho succeeded → cancelled — LabFlow trả 409 JOB_FINISHED.'], ['Forgetting running → queued, so a retry looks like an illegal change.', 'Quên running → queued, nên một lần thử lại trông như đổi trạng thái sai luật.']],
  gt: ['The table is the contract a client can rely on: once final, the job never changes — that is why a poll client stops at the first final status.', 'Bảng này là hợp đồng client tin được: đã cuối thì không đổi nữa — vì thế client hỏi vòng dừng ở trạng thái cuối đầu tiên.'],
  kn: ['async APIs', 'state machines'],
  tns: [tn('final status', 'trạng thái cuối'), tn('stalled', 'bị bỏ dở (khoá hết hạn)')],
  dau: `/** may a job go from one status to another? */
function canTransition(from, to) {
  // Write your solution here
  return from !== to;
}
`,
  giai: '// Reference solution\n' + nguon(canTransition),
  cases: [
    { goi: goi('canTransition', 'queued', 'running'), moTa: ['The worker takes the job', 'Worker nhận việc'] },
    { goi: goi('canTransition', 'succeeded', 'cancelled'), moTa: ['Cancel after it finished', 'Huỷ sau khi đã xong'] },
    { goi: goi('canTransition', 'running', 'queued'), an: true },
    { goi: goi('canTransition', 'queued', 'succeeded'), an: true },
    { goi: goi('canTransition', 'running', 'running'), an: true },
    { goi: goi('canTransition', 'paused', 'running'), an: true },
    { goi: goi('canTransition', 'queued', 'cancelled'), an: true },
  ],
});

function resultResponse(job, userId, now) {
  if (!job || job.owner !== userId) return { status: 404, code: 'JOB_NOT_FOUND' };          // việc của người khác: như không có
  if (job.status !== 'succeeded') {
    const finished = job.status === 'failed' || job.status === 'cancelled';
    return finished ? { status: 409, code: 'JOB_NOT_FINISHED' } : { status: 409, code: 'JOB_NOT_FINISHED', retryAfter: 2 };
  }
  if (Date.parse(now) >= Date.parse(job.result.expiresAt)) return { status: 410, code: 'RESULT_EXPIRED' };  // đã từng có, nay hết hạn
  return { status: 200 };
}
const J = (status, extra) => ({ id: 'job_1', owner: 'u_lan', status, ...extra });
const DONE = { result: { href: '/v2/jobs/job_1/result', contentType: 'text/csv; charset=utf-8', bytes: 230490, expiresAt: '2026-11-01T01:05:39.249Z' } };
const E3 = jsBai({
  ten: 'Async jobs 3 — Write resultResponse(job, userId, now) for GET /jobs/{id}/result', kho: 'MEDIUM', phut: 12,
  en: `<p>Decide what <code>GET /v2/jobs/{id}/result</code> answers, in this order:</p><ol><li>no job, or <code>job.owner !== userId</code> ⇒ <code>{ status: 404, code: "JOB_NOT_FOUND" }</code>;</li><li>status <code>queued</code> or <code>running</code> ⇒ <code>{ status: 409, code: "JOB_NOT_FINISHED", retryAfter: 2 }</code>;</li><li><code>failed</code> or <code>cancelled</code> ⇒ <code>{ status: 409, code: "JOB_NOT_FINISHED" }</code> (no <code>retryAfter</code>: asking again will not help);</li><li><code>succeeded</code> but <code>now ≥ job.result.expiresAt</code> ⇒ <code>{ status: 410, code: "RESULT_EXPIRED" }</code>;</li><li>otherwise <code>{ status: 200 }</code>.</li></ol><p><code>now</code> and <code>expiresAt</code> are ISO 8601 strings.</p>`,
  vi: `<p>Quyết định <code>GET /v2/jobs/{id}/result</code> trả gì, theo thứ tự:</p><ol><li>không có việc, hoặc <code>job.owner !== userId</code> ⇒ <code>{ status: 404, code: "JOB_NOT_FOUND" }</code>;</li><li>trạng thái <code>queued</code> hoặc <code>running</code> ⇒ <code>{ status: 409, code: "JOB_NOT_FINISHED", retryAfter: 2 }</code>;</li><li><code>failed</code> hoặc <code>cancelled</code> ⇒ <code>{ status: 409, code: "JOB_NOT_FINISHED" }</code> (không có <code>retryAfter</code>: hỏi lại cũng vô ích);</li><li><code>succeeded</code> nhưng <code>now ≥ job.result.expiresAt</code> ⇒ <code>{ status: 410, code: "RESULT_EXPIRED" }</code>;</li><li>còn lại <code>{ status: 200 }</code>.</li></ol><p><code>now</code> và <code>expiresAt</code> là chuỗi ISO 8601.</p>`,
  dauVao: ['job — { id, owner, status, result? } | null; userId — string; now — ISO string', 'job — { id, owner, status, result? } | null; userId — chuỗi; now — chuỗi ISO'],
  dauRa: ['{ status, code?, retryAfter? }', '{ status, code?, retryAfter? }'],
  goiY: [['Check ownership first — a stranger must not learn the job’s status.', 'Kiểm chủ sở hữu trước — người lạ không được biết trạng thái việc.'], ['Compare times with Date.parse, not as strings of different formats.', 'So thời gian bằng Date.parse, đừng so chuỗi khác định dạng.']],
  loi: [['Answering 404 after expiry: the result existed, so 410 Gone tells the client to start a new job.', 'Trả 404 sau khi hết hạn: kết quả đã từng có, nên 410 Gone mới bảo client tạo việc mới.'], ['Sending Retry-After for a failed job, so the client polls forever.', 'Gửi Retry-After cho việc đã hỏng, nên client hỏi mãi.']],
  gt: ['This is routes/jobs.js of 10.1: 409 + Retry-After 2 while running (measured), 200 with 230,490 bytes, then 410 RESULT_EXPIRED 20 s later.', 'Đây là routes/jobs.js của bài 10.1: 409 + Retry-After 2 khi đang chạy (đo thật), 200 với 230.490 byte, rồi 410 RESULT_EXPIRED sau 20 s.'],
  kn: ['async APIs', 'status codes'],
  tns: [tn('410 Gone', 'đã từng có, nay không còn'), tn('retention', 'thời hạn giữ')],
  dau: `/** what does GET /v2/jobs/{id}/result answer? */
function resultResponse(job, userId, now) {
  // Write your solution here
  if (job.status === 'succeeded') return { status: 200 };
  return { status: 409, code: 'JOB_NOT_FINISHED' };
}
`,
  giai: '// Reference solution\n' + nguon(resultResponse),
  cases: [
    { goi: goi('resultResponse', J('running', { progress: { done: 7500, total: 20000 } }), 'u_lan', '2026-11-01T01:27:46.000Z'), moTa: ['Too early (4 s after POST)', 'Quá sớm (4 s sau POST)'] },
    { goi: goi('resultResponse', J('succeeded', DONE), 'u_lan', '2026-11-01T01:05:20.000Z'), moTa: ['Ready and not expired', 'Đã xong, chưa hết hạn'] },
    { goi: goi('resultResponse', J('succeeded', DONE), 'u_lan', '2026-11-01T01:06:00.000Z'), an: true },
    { goi: goi('resultResponse', J('succeeded', DONE), 'u_an', '2026-11-01T01:05:20.000Z'), an: true },
    { goi: goi('resultResponse', null, 'u_lan', '2026-11-01T01:05:20.000Z'), an: true },
    { goi: goi('resultResponse', J('cancelled'), 'u_lan', '2026-11-01T01:05:20.000Z'), an: true },
    { goi: goi('resultResponse', J('queued'), 'u_lan', '2026-11-01T01:05:20.000Z'), an: true },
    { goi: goi('resultResponse', J('succeeded', DONE), 'u_lan', '2026-11-01T01:05:39.249Z'), an: true },
  ],
});

function pollDelay(retryAfter, now, capSec) {
  const DEFAULT = 2;
  let sec = DEFAULT;
  if (typeof retryAfter === 'string' && /^\d+$/.test(retryAfter.trim())) sec = Number(retryAfter.trim());   // delta-seconds
  else if (typeof retryAfter === 'string' && !Number.isNaN(Date.parse(retryAfter))) {
    sec = Math.ceil((Date.parse(retryAfter) - Date.parse(now)) / 1000);                                      // HTTP-date
  }
  return Math.min(capSec, Math.max(1, sec));                                                                 // không dưới 1 s, không quá trần
}
const E4 = jsBai({
  ten: 'Async jobs 4 — Write pollDelay(retryAfter, now, capSec)', kho: 'MEDIUM', phut: 15,
  en: `<p>The poll client waits <code>Retry-After</code> seconds between status requests. Return the number of whole seconds to wait:</p><ul><li><code>Retry-After</code> may be <b>delta-seconds</b> (<code>"2"</code>) or an <b>HTTP-date</b> (<code>"Sun, 01 Nov 2026 01:27:48 GMT"</code>) — then wait until that date from <code>now</code> (ISO string), rounded <b>up</b> to whole seconds;</li><li>missing (<code>null</code>) or unreadable ⇒ <code>2</code>;</li><li>never less than <code>1</code> (no hammering every 50 ms, even if the date is in the past) and never more than <code>capSec</code>.</li></ul>`,
  vi: `<p>Client hỏi vòng chờ <code>Retry-After</code> giây giữa các lần hỏi trạng thái. Trả số giây nguyên phải chờ:</p><ul><li><code>Retry-After</code> có thể là <b>số giây</b> (<code>"2"</code>) hoặc <b>ngày HTTP</b> (<code>"Sun, 01 Nov 2026 01:27:48 GMT"</code>) — khi đó chờ tới thời điểm ấy tính từ <code>now</code> (chuỗi ISO), làm tròn <b>lên</b> giây nguyên;</li><li>thiếu (<code>null</code>) hoặc không đọc được ⇒ <code>2</code>;</li><li>không bao giờ dưới <code>1</code> (không dội request mỗi 50 ms, kể cả khi ngày đã qua) và không quá <code>capSec</code>.</li></ul>`,
  dauVao: ['retryAfter — string | null; now — ISO string; capSec — number', 'retryAfter — chuỗi | null; now — chuỗi ISO; capSec — số'],
  dauRa: ['integer seconds in [1, capSec]', 'số giây nguyên trong [1, capSec]'],
  goiY: [['/^\\d+$/ recognises delta-seconds; anything else, try Date.parse.', '/^\\d+$/ nhận ra số giây; còn lại thử Date.parse.'], ['Clamp last: Math.min(cap, Math.max(1, s)).', 'Kẹp sau cùng: Math.min(cap, Math.max(1, s)).']],
  loi: [['Number("Sun, 01 Nov …") is NaN, and NaN || 2 hides the HTTP-date form.', 'Number("Sun, 01 Nov …") là NaN, và NaN || 2 che mất dạng ngày HTTP.'], ['Rounding down: 1.4 s becomes 1 s and the client asks too early (409).', 'Làm tròn xuống: 1,4 s thành 1 s và client hỏi quá sớm (409).']],
  gt: ['RFC 9110 §10.2.3 allows both forms. With Retry-After: 2 the poll client of 10.1 made 7 status requests for a 10.2 s job; the cap is the practice task of the lesson (estimatedSecondsLeft capped at 10).', 'RFC 9110 §10.2.3 cho phép cả hai dạng. Với Retry-After: 2, client hỏi vòng của bài 10.1 gửi 7 lần hỏi cho việc 10,2 s; trần là bài thực hành của bài học (estimatedSecondsLeft, trần 10).'],
  kn: ['async APIs', 'HTTP headers'],
  tns: [tn('Retry-After', 'hỏi lại sau bao lâu'), tn('HTTP-date', 'ngày giờ theo định dạng HTTP')],
  dau: `/** how many seconds should the poll client wait? */
function pollDelay(retryAfter, now, capSec) {
  // Write your solution here
  return Number(retryAfter) || 2;
}
`,
  giai: '// Reference solution\n' + nguon(pollDelay),
  cases: [
    { goi: goi('pollDelay', '2', '2026-11-01T01:27:46.000Z', 10), moTa: ['LabFlow’s Retry-After: 2', 'Retry-After: 2 của LabFlow'] },
    { goi: goi('pollDelay', 'Sun, 01 Nov 2026 01:27:52 GMT', '2026-11-01T01:27:46.000Z', 10), moTa: ['An HTTP-date 6 s ahead', 'Ngày HTTP sau 6 s'] },
    { goi: goi('pollDelay', '120', '2026-11-01T01:27:46.000Z', 10), an: true },
    { goi: goi('pollDelay', null, '2026-11-01T01:27:46.000Z', 10), an: true },
    { goi: goi('pollDelay', 'Sun, 01 Nov 2026 01:27:47 GMT', '2026-11-01T01:27:45.600Z', 10), an: true },
    { goi: goi('pollDelay', 'Sun, 01 Nov 2026 01:20:00 GMT', '2026-11-01T01:27:46.000Z', 10), an: true },
    { goi: goi('pollDelay', '0', '2026-11-01T01:27:46.000Z', 10), an: true },
    { goi: goi('pollDelay', 'soon', '2026-11-01T01:27:46.000Z', 10), an: true },
  ],
});

export default doiDau({ slug: 'api-10-1-hang-doi', ten: '10.1 Asynchronous APIs: 202 Accepted, job resources and polling', khoa: KHOA, baiHoc: 'api-10-1-hang-doi', de: [E1, E2, E3, E4] });
