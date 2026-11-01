/** API Design · 9.2 — Cache phía server bằng Redis, cú giẫm đạp và single-flight (output thật bài 9.2). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Server cache 1 — Redis in front of a slow query', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 9.2 (GET /v2/stats/labs over 1,000,000 bookings, Redis 8.2).',
  vi: 'Những điều từ bài 9.2 (GET /v2/stats/labs trên 1.000.000 lượt đặt, Redis 8.2).',
  cau: [
    q('c1', ['The key stats:labs:v1 had TTL 11 although the code asked for 10. Why?', 'Khoá stats:labs:v1 có TTL 11 dù code xin 10. Vì sao?'],
      ['Up to 10% jitter so keys written together do not expire together', 'Redis rounds every TTL up to the next odd number', 'The first request took one second to finish', 'node-redis adds a safety margin of one second'],
      ['Jitter spreads expiries; it reduces synchronized misses but does not replace single-flight.', 'Jitter rải các lần hết hạn; nó giảm trượt đồng loạt nhưng không thay được single-flight.']),
    q('c2', ['50 requests hit an expired key. Plain cache-aside caused 32 database queries. Why not 1?', '50 request gặp khoá hết hạn. Cache-aside thường gây 32 truy vấn CSDL. Sao không phải 1?'],
      ['Every request arriving before the first load finished also missed and started its own load', 'Redis lost the key 31 times during the test', 'The pool of 10 connections retried each query three times', 'autocannon sent duplicate requests on purpose'],
      ['Single-flight makes concurrent misses wait for one promise: 1 query, p50 92 ms.', 'Single-flight bắt các lần trượt đồng thời chờ chung một promise: 1 truy vấn, p50 92 ms.']),
    q('c3', ['Why is the key named stats:labs:v1 and not just stats?', 'Vì sao khoá tên stats:labs:v1 mà không chỉ là stats?'],
      ['The key must contain everything that changes the answer, including a shape version', 'Redis requires at least two colons in every key', 'Short keys are slower to look up', 'The version is the TTL in minutes'],
      ['Change the response shape ⇒ change v1 to v2, or old and new code read each other’s values.', 'Đổi hình dạng response ⇒ đổi v1 thành v2, nếu không code cũ và mới đọc nhầm giá trị của nhau.']),
  ],
  goiY: [['When does a request see a hit?', 'Khi nào một request trúng cache?'], ['What else changes the answer?', 'Còn gì làm đổi câu trả lời?']],
  loi: [['Thinking a longer TTL prevents stampedes.', 'Tưởng TTL dài hơn chặn được giẫm đạp.'], ['Forgetting the cache must fail open to the database.', 'Quên rằng cache hỏng thì phải lùi về CSDL.']],
  tns: [tn('cache-aside', 'đọc cache, trượt thì nạp'), tn('single-flight', 'dùng chung một lần nạp')],
  kn: ['caching'],
});

function countLoads(arrivals, loadMs, singleFlight) {
  let filledAt = Infinity;                 // lúc giá trị có trong cache
  let inflightEnd = null;                  // lần nạp đang chạy kết thúc lúc nào
  let loads = 0;
  for (const t of arrivals) {
    if (t >= filledAt) continue;           // trúng
    if (singleFlight && inflightEnd !== null && t < inflightEnd) continue;   // chờ chung lần nạp đang chạy
    loads++;
    const end = t + loadMs;
    if (inflightEnd === null || end < inflightEnd) inflightEnd = end;
    filledAt = Math.min(filledAt, end);
  }
  return loads;
}
const E2 = jsBai({
  ten: 'Server cache 2 — Write countLoads(arrivals, loadMs, singleFlight)', kho: 'MEDIUM', phut: 15,
  en: `<p>Simulate an empty cache key. <code>arrivals</code> are request times (ms, sorted). A request that misses starts a database load taking <code>loadMs</code>; when a load finishes, the value is in the cache and every later request hits. With <code>singleFlight</code>, a request that arrives while a load is already running waits for it instead of starting its own. Return how many loads ran.</p>`,
  vi: `<p>Mô phỏng một khoá cache đang rỗng. <code>arrivals</code> là thời điểm các request tới (ms, đã sắp). Request trượt thì bắt đầu một lần nạp CSDL mất <code>loadMs</code>; khi một lần nạp xong, giá trị nằm trong cache và mọi request sau đó đều trúng. Với <code>singleFlight</code>, request tới lúc đã có lần nạp đang chạy thì chờ nó thay vì tự nạp. Trả về số lần nạp đã chạy.</p>`,
  dauVao: ['arrivals — number[] sorted; loadMs — number; singleFlight — boolean', 'arrivals — number[] đã sắp; loadMs — số; singleFlight — boolean'],
  dauRa: ['number of loads', 'số lần nạp'],
  goiY: [['Track when the first load finishes (the cache is filled).', 'Theo dõi lúc lần nạp đầu xong (cache có giá trị).'], ['A request at exactly the fill time is a hit.', 'Request tới đúng lúc cache có giá trị là trúng.']],
  loi: [['Counting every request as a load.', 'Đếm mọi request là một lần nạp.'], ['With single-flight, still starting a load while one is running.', 'Với single-flight vẫn tự nạp khi đã có lần nạp đang chạy.']],
  gt: ['50 arrivals within the first 30 ms and a 100 ms load: plain cache-aside 50 loads, single-flight 1 — the shape of lesson 9.2’s 50 → 32 → 1.', '50 request trong 30 ms đầu và lần nạp 100 ms: cache-aside thường 50 lần nạp, single-flight 1 — đúng dáng 50 → 32 → 1 của bài 9.2.'],
  kn: ['caching', 'concurrency'],
  tns: [tn('stampede', 'giẫm đạp cache'), tn('in-flight', 'đang chạy')],
  dau: `/** how many database loads for these arrivals? */
function countLoads(arrivals, loadMs, singleFlight) {
  // Write your solution here
  return singleFlight ? 1 : arrivals.length;
}
`,
  giai: '// Reference solution\n' + nguon(countLoads),
  cases: [
    { goi: goi('countLoads', [0, 10, 20, 150], 100, false), moTa: ['Plain cache-aside', 'Cache-aside thường'] },
    { goi: goi('countLoads', [0, 10, 20, 150], 100, true), moTa: ['Single-flight', 'Single-flight'] },
    { goi: goi('countLoads', [], 100, true), an: true },
    { goi: goi('countLoads', [0, 100, 200], 100, false), an: true },
    { goi: goi('countLoads', [5, 5, 5, 5, 104, 105], 100, false), an: true },
  ],
});

export default doiDau({ slug: 'api-9-1-server-cache', ten: '9.2 Server-side caching and the stampede', khoa: KHOA, baiHoc: 'api-9-1-server-cache', de: [E1, E2] });
