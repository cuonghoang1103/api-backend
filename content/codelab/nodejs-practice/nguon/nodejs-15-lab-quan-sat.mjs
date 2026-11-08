/** Node.js · Lab 15 — Quan sát Notes API: vòng điều tra metric → trace → log, middleware access log có request id + che token + bỏ probe, báo cáo RED + cảnh báo. */
import { modul, cs, ord, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const L1 = cs({
  ten: 'Lab 15 · 1 — Walk the incident: /feed p95 from 120 ms to 900 ms at 14:05', kho: 'EASY', phut: 6, loai: 'order', dangBai: 'lab',
  en: 'Put the investigation loop of chapter 15 in order, from the alert to the proof that the fix worked.',
  vi: 'Sắp vòng điều tra của chương 15 theo đúng thứ tự, từ cảnh báo tới bằng chứng rằng bản sửa có tác dụng.',
  cau: [
    ord('o1', ['The p95 alert fired. Order the steps.', 'Cảnh báo p95 đã bật. Sắp các bước.'], [
      'Read the metric: which route, since when (/feed, p95 120 → 900 ms at 14:05)',
      'Open a handful of slow traces in that window (route = /feed, duration > 500 ms)',
      'Read the tree’s shape: one long span, or twenty short identical ones?',
      'Take the trace_id and grep the logs for that request’s parameters',
      'Fix the cause the shape points to (e.g. batch the N+1 with = ANY($1))',
      'Watch the same metric: if p95 does not fall, you fixed the wrong thing',
    ], ['Metric (that) → trace (where) → log (what) → metric again (did it work). Starting from logs means searching text forever; starting from metrics alone is impossible, because a metric holds no single request.', 'Metric (có chuyện) → trace (ở đâu) → log (chuyện gì) → lại metric (đã khỏi chưa). Bắt đầu từ log là tìm chữ mãi mãi; chỉ dùng metric là bất khả, vì metric không chứa request riêng lẻ nào.']),
    ord('o2', ['Before the first deploy of the Notes API, in order of value per hour of work (lesson 15.6).', 'Trước lần deploy đầu của Notes API, theo thứ tự giá trị trên mỗi giờ công (bài 15.6).'], [
      'JSON logs with a request id',
      'Error tracking (Sentry)',
      'An external uptime check on a real URL',
      'Disk and memory alerts',
      '/metrics and a RED dashboard',
      'Tracing with OpenTelemetry',
    ], ['A few hours, an afternoon, ten minutes, ten minutes, a day, days plus a real overhead (−17.6% req/s) — tracing waits for the second service.', 'Vài giờ, một buổi chiều, mười phút, mười phút, một ngày, vài ngày cộng chi phí thật (−17,6% req/s) — tracing đợi tới khi có dịch vụ thứ hai.']),
  ],
  goiY: [['That → where → what.', 'Có chuyện → ở đâu → chuyện gì.'], ['The cheapest items with the biggest coverage come first.', 'Thứ rẻ nhất mà phủ rộng nhất đứng trước.']],
  loi: [['Starting the investigation in the logs.', 'Bắt đầu điều tra từ log.'], ['Shipping a fix without re-reading the metric that fired.', 'Đưa bản sửa lên mà không đọc lại metric đã bật cảnh báo.']],
  tns: [tn('investigation loop', 'vòng điều tra'), tn('golden signals', 'bốn tín hiệu vàng', 'latency, traffic, errors, saturation')],
  kn: ['observability'],
});

function accessLogger({ gen, now, out }) {
  const TOKEN = /([?&])(token|code)=([^&#]*)/g;
  return (req, res, next) => {
    const path = req.url.split('?')[0];
    if (path.startsWith('/health')) return next();            // probe: không có dòng log nào (8.640 dòng rỗng/ngày/container)
    const inbound = req.headers['x-request-id'];
    const reqId = typeof inbound === 'string' && inbound.length > 0 && inbound.length <= 64 ? inbound : gen();
    req.id = reqId;
    res.setHeader('X-Request-ID', reqId);
    const t0 = now();
    res.on('finish', () => {                                  // đọc status SAU khi response đã gửi xong
      out.push({
        level: res.statusCode >= 500 ? 'error' : 'info',
        reqId,
        method: req.method,
        url: req.url.replace(TOKEN, '$1$2=[REDACTED]'),         // không bao giờ ghi token ra log
        status: res.statusCode,
        durationMs: now() - t0,
      });
    });
    next();
  };
}
const RES_EV = `const mkRes = () => { const r = { statusCode: 200, headers: {}, _l: {} };
  r.setHeader = (k, v) => { r.headers[String(k).toLowerCase()] = v; return r; };
  r.status = (s) => { r.statusCode = s; return r; };
  r.on = (ev, fn) => { (r._l[ev] ||= []).push(fn); return r; };
  r.end = () => { (r._l.finish || []).forEach((fn) => fn()); return r; };
  return r; };`;
const run = (reqs) => `${RES_EV} let t = 1000; let n = 0; const out = []; const mw = accessLogger({ gen: () => 'gen' + (++n), now: () => t, out });
  const nexts = []; for (const [method, url, hdr, status, ms] of ${JSON.stringify(reqs)}) { const req = { method, url, headers: hdr }; const res = mkRes(); mw(req, res, () => nexts.push(url)); t += ms; res.status(status).end(); }`;
const L2 = await jsBai({
  ten: 'Lab 15 · 2 — accessLogger({ gen, now, out }): one structured line per request, id in, token out, probes skipped', kho: 'HARD', phut: 25, dangBai: 'lab',
  en: '<p>Write the access-log middleware of the Notes API, combining 15.1–15.3 and 15.6. <code>accessLogger({ gen, now, out })</code> returns <code>(req, res, next)</code>:</p><ol><li>if the path (the part of <code>req.url</code> before <code>?</code>) starts with <code>/health</code>: just call <code>next()</code> — no id, no line;</li><li>otherwise pick the request id (reuse <code>req.headers["x-request-id"]</code> if a non-empty string ≤ 64 chars, else <code>gen()</code>), set <code>req.id</code> and the <code>X-Request-ID</code> response header;</li><li>remember <code>t0 = now()</code>, and register <code>res.on("finish", …)</code> that pushes into <code>out</code>:<br><code>{ level, reqId, method, url, status, durationMs }</code> — <code>level</code> is <code>"error"</code> for status ≥ 500 else <code>"info"</code>; <code>url</code> with the values of <code>token</code> and <code>code</code> replaced by <code>[REDACTED]</code>; <code>status = res.statusCode</code> read at finish; <code>durationMs = now() − t0</code>;</li><li>call <code>next()</code>.</li></ol><p>In the tests, <code>res.end()</code> fires the <code>finish</code> listeners, and the injected clock advances between <code>next()</code> and <code>end()</code>.</p>',
  vi: '<p>Viết middleware access log của Notes API, gộp 15.1–15.3 và 15.6. <code>accessLogger({ gen, now, out })</code> trả về <code>(req, res, next)</code>:</p><ol><li>nếu đường dẫn (phần của <code>req.url</code> trước <code>?</code>) bắt đầu bằng <code>/health</code>: chỉ gọi <code>next()</code> — không id, không dòng log;</li><li>không thì chọn request id (dùng lại <code>req.headers["x-request-id"]</code> nếu là chuỗi khác rỗng ≤ 64 ký tự, không thì <code>gen()</code>), đặt <code>req.id</code> và header response <code>X-Request-ID</code>;</li><li>nhớ <code>t0 = now()</code>, và đăng ký <code>res.on("finish", …)</code> đẩy vào <code>out</code>:<br><code>{ level, reqId, method, url, status, durationMs }</code> — <code>level</code> là <code>"error"</code> khi status ≥ 500, không thì <code>"info"</code>; <code>url</code> với giá trị của <code>token</code> và <code>code</code> thay bằng <code>[REDACTED]</code>; <code>status = res.statusCode</code> đọc lúc finish; <code>durationMs = now() − t0</code>;</li><li>gọi <code>next()</code>.</li></ol><p>Trong các kiểm, <code>res.end()</code> kích hoạt listener <code>finish</code>, và đồng hồ tiêm vào chạy tới giữa <code>next()</code> và <code>end()</code>.</p>',
  yc: [['One line per non-probe request, written at finish (not at the start).', 'Mỗi request không phải probe đúng một dòng, ghi lúc finish (không phải lúc bắt đầu).'], ['Never write a token or an OAuth code into out.', 'Không bao giờ ghi token hay mã OAuth vào out.']],
  goiY: [['The status is only known at finish: a handler may call res.status(500) long after your middleware ran.', 'Status chỉ biết được lúc finish: handler có thể gọi res.status(500) rất lâu sau khi middleware chạy.'], ['Reuse your 15.1 regex: /([?&])(token|code)=([^&#]*)/g.', 'Dùng lại regex bài 15.1: /([?&])(token|code)=([^&#]*)/g.']],
  loi: [['Logging at the start of the request: status and duration do not exist yet.', 'Ghi log lúc request bắt đầu: khi đó status và thời lượng chưa tồn tại.'], ['Skipping probes by exact match on "/health" only: /health/live and /health/ready flood the log anyway.', 'Bỏ probe bằng so khớp đúng "/health": /health/live và /health/ready vẫn làm ngập log.']],
  gt: ['This is the website’s morgan setup rebuilt with structure: the url token redefined so ?token= never reaches the log, probes skipped, plus the request id of 15.2 on every line so one grep rebuilds one request — and level error only where someone has to act.', 'Đây là cấu hình morgan của website dựng lại có cấu trúc: token url được định nghĩa lại để ?token= không bao giờ vào log, bỏ qua probe, cộng request id của 15.2 trên mọi dòng để một lệnh grep dựng lại một request — và cấp error chỉ ở chỗ có người phải hành động.'],
  kn: ['middleware', 'logging', 'request id'],
  tns: [tn('finish event', 'sự kiện finish', 'emitted when the response has been sent'), tn('probe', 'probe')],
  dau: `/** structured access log */
function accessLogger({ gen, now, out }) {
  return (req, res, next) => {
    // Write your solution here
    const reqId = req.headers['x-request-id'] || gen();
    res.setHeader('X-Request-ID', reqId);
    out.push({ level: 'info', reqId, method: req.method, url: req.url, status: res.statusCode, durationMs: 0 });
    next();
  };
}
`,
  giai: '// Reference solution\n' + nguon(accessLogger),
  cases: [
    { chuanBi: run([['GET', '/api/v1/notes?page=2', {}, 200, 12], ['GET', '/health/live', {}, 200, 1]]), goi: '({ out, nexts })', moTa: ['A request and a probe', 'Một request và một probe'] },
    { chuanBi: run([['GET', '/api/v1/ai/stream?token=eyJ.FAKE.sig&lesson=3', { 'x-request-id': 'from-nginx-7f3a' }, 200, 840]]), goi: 'out', moTa: ['SSE with a token, id from nginx', 'SSE có token, id từ nginx'] },
    { chuanBi: run([['POST', '/api/v1/notes', { 'x-request-id': 'x'.repeat(70) }, 500, 33], ['GET', '/health/ready?full=1', {}, 503, 800], ['GET', '/api/v1/auth/google/callback?state=s&code=4/0Ab', {}, 302, 95]]), goi: '({ out, nexts })', an: true },
    { chuanBi: `${run([['GET', '/api/v1/notes/7', {}, 404, 4]])} const req2 = { method: 'GET', url: '/x', headers: {} }; const res2 = mkRes(); mw(req2, res2, () => {});`, goi: '({ out, id: req2.id, hdr: res2.headers["x-request-id"] })', an: true },
  ],
});

function redReport(records, { windowSec, sloMs, maxErrorRatio }) {
  const by = {};
  for (const r of records) (by[r.route] ||= []).push(r);
  const routes = {};
  const alerts = [];
  for (const route of Object.keys(by).sort()) {
    const rs = by[route];
    const ds = rs.map((r) => r.durationMs).sort((a, b) => a - b);
    const p95 = ds[Math.ceil(0.95 * ds.length) - 1];                    // hạng gần nhất
    const errors = rs.filter((r) => r.status >= 500).length;            // chỉ 5xx — 4xx là lỗi của client
    const errorRatio = errors / rs.length;
    routes[route] = { rps: Number((rs.length / windowSec).toFixed(2)), errorRatio: Number(errorRatio.toFixed(4)), p95 };
    if (errorRatio > maxErrorRatio) alerts.push(`${route}: error ratio ${(errorRatio * 100).toFixed(1)}% > ${maxErrorRatio * 100}%`);
    if (p95 > sloMs) alerts.push(`${route}: p95 ${p95} ms > SLO ${sloMs} ms`);
  }
  return { routes, alerts };
}
const rec = (route, n, f) => Array.from({ length: n }, (_, i) => ({ route, ...f(i) }));
const WIN = [
  ...rec('/notes/:id', 200, (i) => ({ status: i % 50 === 0 ? 500 : i % 9 === 0 ? 404 : 200, durationMs: 4 + (i % 20) })),
  ...rec('/feed', 60, (i) => ({ status: 200, durationMs: i < 50 ? 100 + i : 400 + i })),
  ...rec('/auth/login', 40, (i) => ({ status: i % 10 === 0 ? 502 : 401, durationMs: 280 + i })),
];
const L3 = await jsBai({
  ten: 'Lab 15 · 3 — redReport(records, opts): Rate, Errors, Duration per route, and which alerts fire', kho: 'HARD', phut: 25, dangBai: 'lab',
  en: '<p>From the structured lines of Lab 15 · 2 (here reduced to <code>{ route, status, durationMs }</code>) collected over <code>windowSec</code> seconds, build the RED view. For each route (sorted alphabetically) compute:</p><ul><li><code>rps</code> = requests ÷ windowSec, rounded to 2 decimals;</li><li><code>errorRatio</code> = share of responses with status ≥ 500 (4xx do not count), rounded to 4 decimals;</li><li><code>p95</code> = nearest-rank 95th percentile of <code>durationMs</code> (element at <code>ceil(0.95 × n)</code>, counting from 1, of the ascending list).</li></ul><p>Then, per route in the same order, add alert strings: <code>"&lt;route&gt;: error ratio &lt;x&gt;% &gt; &lt;max&gt;%"</code> when the (unrounded) ratio exceeds <code>maxErrorRatio</code> (x = ratio × 100 with 1 decimal, max = maxErrorRatio × 100), and <code>"&lt;route&gt;: p95 &lt;p95&gt; ms &gt; SLO &lt;sloMs&gt; ms"</code> when p95 exceeds <code>sloMs</code>. Return <code>{ routes, alerts }</code>.</p>',
  vi: '<p>Từ các dòng có cấu trúc của Lab 15 · 2 (ở đây rút gọn còn <code>{ route, status, durationMs }</code>) gom trong <code>windowSec</code> giây, dựng góc nhìn RED. Với mỗi route (sắp theo bảng chữ cái) tính:</p><ul><li><code>rps</code> = số request ÷ windowSec, làm tròn 2 chữ số;</li><li><code>errorRatio</code> = tỉ lệ response có status ≥ 500 (4xx không tính), làm tròn 4 chữ số;</li><li><code>p95</code> = bách phân vị 95 hạng gần nhất của <code>durationMs</code> (phần tử thứ <code>ceil(0,95 × n)</code>, đếm từ 1, của danh sách tăng dần).</li></ul><p>Rồi, theo cùng thứ tự route, thêm chuỗi cảnh báo: <code>"&lt;route&gt;: error ratio &lt;x&gt;% &gt; &lt;max&gt;%"</code> khi tỉ lệ (chưa làm tròn) vượt <code>maxErrorRatio</code> (x = tỉ lệ × 100 với 1 chữ số thập phân, max = maxErrorRatio × 100), và <code>"&lt;route&gt;: p95 &lt;p95&gt; ms &gt; SLO &lt;sloMs&gt; ms"</code> khi p95 vượt <code>sloMs</code>. Trả về <code>{ routes, alerts }</code>.</p>',
  goiY: [['Group by route first, then compute the three numbers per group.', 'Nhóm theo route trước, rồi tính ba con số cho mỗi nhóm.'], ['Sort route names with .sort() and durations with (a, b) => a - b; compare the unrounded ratio against the threshold.', 'Sắp tên route bằng .sort() và thời lượng bằng (a, b) => a - b; so tỉ lệ chưa làm tròn với ngưỡng.']],
  loi: [['Counting 401/404 as errors: an expired token is “an ordinary Tuesday”, and the alert fires every morning.', 'Tính 401/404 là lỗi: token hết hạn là “một ngày thứ Ba bình thường”, và cảnh báo bật mỗi sáng.'], ['Using the average duration: /feed’s 10 slow requests disappear into a healthy-looking mean.', 'Dùng thời lượng trung bình: 10 request chậm của /feed biến mất trong một trung bình trông khoẻ.']],
  gt: ['Rate tells you something is arriving, Errors (as a ratio of 5xx) whether it works, Duration (a percentile against an SLO) whether it is fast enough — three numbers per route from one middleware, without knowing what any route does. /auth/login is a good test: 90% of its answers are 401 and it is healthy; its 502s are what matter.', 'Rate cho biết có thứ đang tới, Errors (tỉ lệ 5xx) cho biết nó có chạy không, Duration (bách phân vị so với SLO) cho biết có đủ nhanh không — ba con số mỗi route từ một middleware, không cần biết route làm gì. /auth/login là phép thử hay: 90% câu trả lời là 401 mà nó vẫn khoẻ; các 502 mới là thứ quan trọng.'],
  kn: ['metrics', 'RED', 'alerting'],
  tns: [tn('RED method', 'phương pháp RED'), tn('SLO', 'mục tiêu dịch vụ')],
  dau: `/** RED per route + alerts */
function redReport(records, { windowSec, sloMs, maxErrorRatio }) {
  // Write your solution here
  const routes = {};
  const alerts = [];
  for (const r of records) {
    const g = routes[r.route] || (routes[r.route] = { n: 0, err: 0, sum: 0 });
    g.n++; g.sum += r.durationMs; if (r.status >= 400) g.err++;
  }
  for (const [route, g] of Object.entries(routes)) {
    routes[route] = { rps: g.n / windowSec, errorRatio: g.err / g.n, p95: g.sum / g.n };
  }
  return { routes, alerts };
}
`,
  giai: '// Reference solution\n' + nguon(redReport),
  cases: [
    { goi: goi('redReport', WIN, { windowSec: 60, sloMs: 300, maxErrorRatio: 0.02 }), moTa: ['One minute of the Notes API', 'Một phút của Notes API'] },
    { goi: goi('redReport', rec('/notes', 20, (i) => ({ status: 200, durationMs: i + 1 })), { windowSec: 10, sloMs: 300, maxErrorRatio: 0.02 }), moTa: ['A quiet, healthy route', 'Một route yên tĩnh, khoẻ'] },
    { goi: goi('redReport', WIN, { windowSec: 300, sloMs: 500, maxErrorRatio: 0.05 }), an: true },
    { goi: goi('redReport', [...rec('/b', 3, () => ({ status: 503, durationMs: 9 })), ...rec('/a', 1, () => ({ status: 200, durationMs: 301 }))], { windowSec: 1, sloMs: 300, maxErrorRatio: 0.02 }), an: true },
    { goi: goi('redReport', [], { windowSec: 60, sloMs: 300, maxErrorRatio: 0.02 }), an: true },
  ],
});

export default modul('nodejs-15-lab-quan-sat', 'Lab 15 — Observing the Notes API: access log, RED and alerts', [L1, L2, L3]);
