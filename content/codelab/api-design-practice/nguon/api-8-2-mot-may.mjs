/** API Design · 8.2 — Test tải và nút thắt đầu tiên: bẫy 429, định luật Little, event loop bị scryptSync chặn (output thật bài 8.2). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Bottleneck 1 — What the 07:00 test showed', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 8.2 (autocannon 8.0.0 and perf/mixed.mjs on LabFlow).',
  vi: 'Những điều từ bài 8.2 (autocannon 8.0.0 và perf/mixed.mjs trên LabFlow).',
  cau: [
    q('c1', ['autocannon on GET /v2/labs: 8,258 req/s, 116 2xx, 82,460 non-2xx. What was measured?', 'autocannon vào GET /v2/labs: 8.258 req/s, 116 lần 2xx, 82.460 lần không phải 2xx. Đã đo cái gì?'],
      ['How fast LabFlow answers 429 from its own per-IP limit', 'The real capacity of the lab list', 'A crash after 116 requests', 'The speed of autocannon itself'],
      ['The limit is 100/min per IP (5.3). Always read the status codes; with the limit raised for the test: 9,414 req/s, all 2xx.', 'Giới hạn là 100 lần/phút mỗi IP (5.3). Luôn đọc mã trạng thái; nâng giới hạn khi test: 9.414 req/s, toàn 2xx.']),
    q('c2', ['With scryptSync, logins ran at 30.2 req/s. Why about 30?', 'Với scryptSync, đăng nhập chạy 30,2 req/s. Vì sao khoảng 30?'],
      ['One scrypt takes ~31 ms on the only JavaScript thread: 1000 ÷ 31 ≈ 32', 'The rate limit allows 30 logins per second', 'autocannon used 30 connections', 'PostgreSQL can only answer 30 queries per second'],
      ['Synchronous work runs at the speed of one core, whatever the machine has.', 'Việc đồng bộ chạy với tốc độ một nhân, máy có bao nhiêu nhân cũng vậy.']),
    q('c3', ['After switching to the asynchronous scrypt, logins went to 113.6 req/s. What limits it now?', 'Sau khi đổi sang scrypt bất đồng bộ, đăng nhập lên 113,6 req/s. Giờ cái gì giới hạn nó?'],
      ['libuv’s threadpool: 4 threads by default × ~32/s', 'The event loop, which is still blocked', 'The 10 connections of autocannon', 'Compression of the response'],
      ['UV_THREADPOOL_SIZE=8 gave 193/s — and made the bystander a bit slower on the same laptop.', 'UV_THREADPOOL_SIZE=8 cho 193/s — và làm người đứng ngoài chậm hơn chút trên cùng laptop.']),
  ],
  goiY: [['Check the 2xx count first.', 'Xem số 2xx trước.'], ['1000 ms ÷ time per job = jobs per second per thread.', '1000 ms ÷ thời gian mỗi việc = số việc mỗi giây mỗi luồng.']],
  loi: [['Reporting req/s without the status codes.', 'Báo req/s mà không kèm mã trạng thái.'], ['Thinking async makes scrypt itself faster.', 'Tưởng bất đồng bộ làm bản thân scrypt nhanh hơn.']],
  tns: [tn('event loop', 'luồng duy nhất chạy JavaScript'), tn('threadpool', 'các luồng phụ của libuv')],
  kn: ['load testing', 'event loop'],
});

function littleLatencyMs(inFlight, reqPerSec) {
  if (!(reqPerSec > 0)) return null;
  return Math.round((inFlight / reqPerSec) * 1000 * 100) / 100;
}
const E2 = jsBai({
  ten: 'Bottleneck 2 — Write littleLatencyMs(inFlight, reqPerSec)', kho: 'EASY', phut: 8,
  en: `<p>Little’s law: requests in flight = throughput × time per request. Given how many requests are always in flight (autocannon’s connections) and the measured throughput, return the average time per request in <strong>milliseconds</strong>, rounded to 2 decimals. Throughput 0 or negative ⇒ <code>null</code>.</p>`,
  vi: `<p>Định luật Little: số request đang xử lý = thông lượng × thời gian mỗi request. Cho số request luôn đang xử lý (số kết nối của autocannon) và thông lượng đo được, trả về thời gian trung bình mỗi request tính bằng <strong>mili giây</strong>, làm tròn 2 chữ số. Thông lượng 0 hoặc âm ⇒ <code>null</code>.</p>`,
  dauVao: ['inFlight — number; reqPerSec — number', 'inFlight — số; reqPerSec — số'],
  dauRa: ['ms per request (2 decimals) or null', 'ms mỗi request (2 chữ số) hoặc null'],
  goiY: [['time = inFlight ÷ throughput, in seconds.', 'thời gian = inFlight ÷ thông lượng, tính bằng giây.'], ['Math.round(x * 100) / 100 for 2 decimals.', 'Math.round(x * 100) / 100 để lấy 2 chữ số.']],
  loi: [['Forgetting × 1000 (seconds vs milliseconds).', 'Quên × 1000 (giây với mili giây).'], ['Dividing the wrong way round.', 'Chia ngược.']],
  gt: ['10 connections at 1,083.7 req/s ⇒ 9.23 ms; autocannon reported 8.7 ms on average — the test is consistent.', '10 kết nối với 1.083,7 req/s ⇒ 9,23 ms; autocannon báo trung bình 8,7 ms — bài test nhất quán.'],
  kn: ['load testing'],
  tns: [tn('Little’s law', 'định luật Little'), tn('throughput', 'thông lượng')],
  dau: `/** average ms per request from Little's law */
function littleLatencyMs(inFlight, reqPerSec) {
  // Write your solution here
  return reqPerSec / inFlight;
}
`,
  giai: '// Reference solution\n' + nguon(littleLatencyMs),
  cases: [
    { goi: goi('littleLatencyMs', 10, 1083.7), moTa: ['Bookings list, lesson 8.2', 'Danh sách đặt phòng, bài 8.2'] },
    { goi: goi('littleLatencyMs', 10, 9414.19), moTa: ['Lab list', 'Danh sách phòng'] },
    { goi: goi('littleLatencyMs', 10, 0), an: true },
    { goi: goi('littleLatencyMs', 100, 136), an: true },
  ],
});

function queueWait(jobs) {
  let free = 0;                                   // lúc luồng duy nhất rảnh lại
  return jobs.map(({ at, cost }) => {
    const start = Math.max(at, free);
    free = start + cost;
    return start + cost - at;                     // tổng thời gian chờ + làm của request này
  });
}
const E3 = jsBai({
  ten: 'Bottleneck 3 — Write queueWait(jobs): one thread, synchronous work', kho: 'MEDIUM', phut: 15,
  en: `<p>Simulate Node’s single JavaScript thread when every handler is <em>synchronous</em>. <code>jobs</code> arrive in order; each has an arrival time <code>at</code> (ms) and a <code>cost</code> (ms of CPU). A job starts when it has arrived <em>and</em> the thread is free, then holds the thread for <code>cost</code>. Return, for each job, its response time = finish − arrival.</p>`,
  vi: `<p>Mô phỏng luồng JavaScript duy nhất của Node khi mọi handler đều <em>đồng bộ</em>. <code>jobs</code> tới theo thứ tự; mỗi việc có thời điểm tới <code>at</code> (ms) và <code>cost</code> (ms CPU). Một việc bắt đầu khi nó đã tới <em>và</em> luồng rảnh, rồi giữ luồng trong <code>cost</code>. Trả về, cho từng việc, thời gian trả lời = lúc xong − lúc tới.</p>`,
  dauVao: ['jobs — [{ at, cost }] sorted by at', 'jobs — [{ at, cost }] đã sắp theo at'],
  dauRa: ['number[] — response time of each job', 'number[] — thời gian trả lời của từng việc'],
  goiY: [['Track when the thread becomes free.', 'Theo dõi lúc luồng rảnh lại.'], ['start = max(at, free).', 'start = max(at, free).']],
  loi: [['Returning only cost — ignoring the queue in front.', 'Chỉ trả cost — bỏ qua hàng đợi phía trước.'], ['Letting a job start before it arrives.', 'Cho việc bắt đầu trước khi nó tới.']],
  gt: ['A 1 ms lab-list request behind a few 31 ms logins answers in tens of ms — the shape of lesson 8.2’s p99 463 ms.', 'Một request danh sách phòng 1 ms đứng sau vài lượt đăng nhập 31 ms trả lời sau hàng chục ms — đúng dáng p99 463 ms của bài 8.2.'],
  kn: ['event loop'],
  tns: [tn('blocking', 'chặn luồng'), tn('queueing delay', 'thời gian xếp hàng')],
  dau: `/** response time of each job on ONE thread */
function queueWait(jobs) {
  // Write your solution here
  return jobs.map((j) => j.cost);
}
`,
  giai: '// Reference solution\n' + nguon(queueWait),
  cases: [
    { goi: goi('queueWait', [{ at: 0, cost: 31 }, { at: 5, cost: 1 }, { at: 6, cost: 31 }]), moTa: ['A lab-list request behind a login', 'Danh sách phòng đứng sau một lượt đăng nhập'] },
    { goi: goi('queueWait', [{ at: 0, cost: 2 }, { at: 10, cost: 2 }]), moTa: ['The thread is free in between', 'Luồng rảnh ở giữa'] },
    { goi: goi('queueWait', []), an: true },
    { goi: goi('queueWait', [{ at: 0, cost: 31 }, { at: 0, cost: 31 }, { at: 0, cost: 31 }, { at: 1, cost: 1 }]), an: true },
    { goi: goi('queueWait', [{ at: 3, cost: 0 }, { at: 3, cost: 4 }, { at: 100, cost: 1 }]), an: true },
  ],
});

export default doiDau({ slug: 'api-8-2-mot-may', ten: '8.2 Load tests and the first bottleneck', khoa: KHOA, baiHoc: 'api-8-2-mot-may', de: [E1, E2, E3] });
