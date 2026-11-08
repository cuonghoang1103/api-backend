/** Node.js 15.4 — Metric: bốn loại công cụ, RED, nhãn route theo mẫu, bùng nổ cardinality, histogram cộng dồn, p95 từ bucket. */
import { modul, cs, q, qn, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const LOAI = ['counter', 'gauge', 'histogram', 'summary'];
const E1 = cs({
  ten: 'Pick the instrument, and pick the labels you could write on paper', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Two tables from lesson 15.4: which prom-client type fits each measurement, and which values may become a label.',
  vi: 'Hai bảng của bài 15.4: loại prom-client nào hợp với từng phép đo, và giá trị nào được làm nhãn.',
  bang: [
    bang1('b1', ['Choose the instrument type for each measurement', 'Chọn loại công cụ cho từng phép đo'], [{ ma: 'x', ten: 'Measurement' }, { ma: 't', ten: 'Type', luaChon: LOAI }], [
      { o: { x: 'Total HTTP requests served (rate() gives req/s)' }, a: { t: 'counter' } },
      { o: { x: 'Bytes sent to clients since the process started' }, a: { t: 'counter' } },
      { o: { x: 'pool.waitingCount, read live from the pool at every scrape' }, a: { t: 'gauge' } },
      { o: { x: 'Heap memory in use right now' }, a: { t: 'gauge' } },
      { o: { x: 'Request duration, so Prometheus can compute p95 across 3 replicas' }, a: { t: 'histogram' } },
      { o: { x: 'Requests that finished (finished.inc() in finally) — in-flight = started − finished' }, a: { t: 'counter' } },
    ], ['Counter only goes up (use rate()); gauge moves freely but should be READ from the system, never kept by hand with inc/dec pairs that drift; histogram buckets are counters, so they add up across containers — a summary computes percentiles inside one process and cannot, which is why the lesson says avoid it.', 'Counter chỉ tăng (dùng rate()); gauge lên xuống tự do nhưng nên ĐỌC từ hệ thống, đừng tự giữ bằng cặp inc/dec dễ trôi; bucket của histogram là counter nên cộng được giữa các container — summary tính bách phân vị trong một tiến trình và không cộng được, nên bài bảo tránh nó.']),
    bang1('b2', ['May this value be a metric label?', 'Giá trị này có được làm nhãn metric không?'], [{ ma: 'x', ten: 'Label value' }, { ma: 'ok', ten: 'Label?', luaChon: ['yes', 'no'] }], [
      { o: { x: 'HTTP method (GET, POST, …)' }, a: { ok: 'yes' } },
      { o: { x: 'Route template /notes/:id' }, a: { ok: 'yes' } },
      { o: { x: 'req.originalUrl (/notes/1842)' }, a: { ok: 'no' } },
      { o: { x: 'Status code (200, 404, 500)' }, a: { ok: 'yes' } },
      { o: { x: 'user_id' }, a: { ok: 'no' } },
      { o: { x: 'err.message (“note 8412 not found”)' }, a: { ok: 'no' } },
      { o: { x: 'err.code ?? "UNKNOWN"' }, a: { ok: 'yes' } },
    ], ['A label value must come from a set you could write down on paper. Every distinct value is a new time series kept for the whole process lifetime: 100,000 user ids took RSS to 1,494 MB and a scrape to 1,473 ms. error_message is the sneaky one: it looks bounded until a message contains an id.', 'Giá trị nhãn phải thuộc một tập bạn viết ra được trên giấy. Mỗi giá trị khác nhau là một chuỗi thời gian mới giữ suốt đời tiến trình: 100.000 user id đẩy RSS lên 1.494 MB và một lần scrape mất 1.473 ms. error_message là cái lừa nhất: trông hữu hạn cho tới khi thông điệp chứa một id.']),
  ],
  goiY: [['Ask: does it only go up, move both ways, or need percentiles?', 'Hỏi: nó chỉ tăng, lên xuống, hay cần bách phân vị?'], ['For labels ask: could I list every possible value today?', 'Với nhãn hỏi: hôm nay tôi liệt kê được mọi giá trị có thể không?']],
  loi: [['A hand-managed gauge (inc on start, dec on finish): the first error path that skips dec() makes it wrong forever.', 'Gauge tự quản (inc lúc bắt đầu, dec lúc xong): đường lỗi đầu tiên bỏ qua dec() làm nó sai mãi mãi.'], ['Labelling by raw URL “just for one route”: 300 distinct notes became 4,268 series.', 'Gắn nhãn bằng URL thô “chỉ cho một route”: 300 ghi chú khác nhau thành 4.268 chuỗi.']],
  tns: [tn('time series', 'chuỗi thời gian', 'one metric name + one exact set of label values'), tn('cardinality', 'số giá trị khác nhau', 'how many distinct label combinations exist'), tn('scrape', 'lần thu thập', 'Prometheus fetching /metrics')],
  kn: ['metrics', 'Prometheus'],
});

const E2 = cs({
  ten: 'RED, pull, and who may read /metrics', kho: 'EASY', phut: 6,
  en: 'Questions on the rest of lesson 15.4.',
  vi: 'Câu hỏi về phần còn lại của bài 15.4.',
  cau: [
    q('c1', ['What does RED stand for, and which one is most worth alerting on?', 'RED là viết tắt của gì, và cái nào đáng cảnh báo nhất?'],
      ['Rate, Errors, Duration — the error ratio (5xx / total)', 'Requests, Events, Delay — the raw number of requests', 'Rate, Events, Disk — the free disk space on the host', 'Retries, Errors, Duration — the number of retries'],
      ['rate(http_requests_total[5m]), the same with status=~"5..", and histogram_quantile(0.95, …): three metrics, one middleware, every route.', 'rate(http_requests_total[5m]), cái đó với status=~"5..", và histogram_quantile(0.95, …): ba metric, một middleware, mọi route.']),
    q('c2', ['What decides how much Prometheus has to store for your app?', 'Điều gì quyết định Prometheus phải lưu bao nhiêu cho app của bạn?'],
      ['The number of distinct series (label combinations), not the traffic', 'The number of requests per second, since every request is stored', 'The size of each response body, since histograms keep the bytes', 'The scrape interval only, since each scrape stores a new copy of the app'],
      ['A counter incremented ten million times is the same 8 bytes as one incremented twice. The bill is decided when you design the labels.', 'Một counter tăng mười triệu lần vẫn là 8 byte như counter tăng hai lần. Hoá đơn được quyết định khi bạn thiết kế nhãn.']),
    q('c3', ['Where should /metrics be served?', '/metrics nên được phục vụ ở đâu?'],
      ['A second Express app on a second port bound to the private network', 'The public API port, because Prometheus needs to reach it from anywhere', 'The public port behind a robots.txt rule so search engines skip it', 'The frontend container, so the backend does not pay for building it'],
      ['Measured: public :4950/metrics → 404, private :4956/metrics → 200. Route names alone map your attack surface. Second best: deny at nginx; last resort: a bearer token.', 'Đo được: :4950/metrics công khai → 404, :4956/metrics riêng → 200. Chỉ tên route thôi đã vẽ ra bề mặt tấn công. Phương án hai: chặn ở nginx; cuối cùng: bearer token.']),
    qn('c4', ['Product asks “which users hit the 500s yesterday?”. Which pillars can answer? (choose all that apply)', 'Sản phẩm hỏi “hôm qua những người dùng nào gặp lỗi 500?”. Trụ cột nào trả lời được? (chọn mọi câu đúng)'],
      ['The logs (any field, searched with grep)', 'The traces (user.id as a span attribute)', 'A user_id label on http_requests_total', 'The event-loop lag metric of collectDefaultMetrics'],
      [0, 1],
      ['“How many?” is a metric question; “which ones?” is a log or trace question. Spans have no cardinality limit because each one is stored once and thrown away.', '“Bao nhiêu?” là câu hỏi cho metric; “những ai?” là câu hỏi cho log hoặc trace. Span không có giới hạn cardinality vì mỗi span lưu một lần rồi bỏ.']),
  ],
  goiY: [['The price of metrics is the number of series.', 'Giá của metric là số chuỗi thời gian.'], ['A trace or a log may carry ids; a metric label may not.', 'Trace hay log được mang id; nhãn metric thì không.']],
  loi: [['Putting /metrics on the public internet “because nothing is sensitive”.', 'Để /metrics trên internet công khai “vì chẳng có gì nhạy cảm”.'], ['Answering a “which users” question with a metric label.', 'Trả lời câu “những ai” bằng nhãn metric.']],
  tns: [tn('RED', 'RED', 'Rate, Errors, Duration'), tn('pull model', 'mô hình kéo', 'Prometheus fetches, the app does not push')],
  kn: ['metrics', 'security'],
});

function labelsFor(req, res) {
  // Đọc TRONG res.on('finish'): lúc đó Express đã định tuyến xong nên req.route có mẫu '/:id'.
  // Không khớp route nào (404) ⇒ một hằng số, TUYỆT ĐỐI không lùi về URL thô (mỗi URL một chuỗi thời gian).
  const route = req.route ? req.baseUrl + req.route.path : '(unmatched)';
  return { method: req.method, route, status: String(res.statusCode) };
}
const E3 = await jsBai({
  ten: 'labelsFor(req, res): the route template, never the raw URL', kho: 'EASY', phut: 8,
  en: '<p>Write the label function of the metrics middleware, called inside <code>res.on("finish")</code>. Return <code>{ method, route, status }</code>: <code>method</code> is <code>req.method</code>; <code>route</code> is <code>req.baseUrl + req.route.path</code> (e.g. <code>/api/v1/notes/:id</code>) when Express matched a route; when no route matched (<code>req.route</code> is undefined, e.g. a 404) it is the constant <code>"(unmatched)"</code>; <code>status</code> is <code>res.statusCode</code> as a <b>string</b>.</p>',
  vi: '<p>Viết hàm nhãn của middleware metric, được gọi trong <code>res.on("finish")</code>. Trả về <code>{ method, route, status }</code>: <code>method</code> là <code>req.method</code>; <code>route</code> là <code>req.baseUrl + req.route.path</code> (vd <code>/api/v1/notes/:id</code>) khi Express khớp được route; khi không khớp route nào (<code>req.route</code> là undefined, vd 404) thì là hằng <code>"(unmatched)"</code>; <code>status</code> là <code>res.statusCode</code> dạng <b>chuỗi</b>.</p>',
  goiY: [['req.route only exists after routing — that is why the lesson reads it on finish.', 'req.route chỉ có sau khi định tuyến — vì thế bài đọc nó lúc finish.'], ['String(res.statusCode) turns 404 into "404".', 'String(res.statusCode) biến 404 thành "404".']],
  loi: [['Falling back to req.originalUrl when there is no route: every scanner probing random paths creates a new series.', 'Lùi về req.originalUrl khi không có route: mỗi máy quét dò đường ngẫu nhiên tạo một chuỗi mới.'], ['Reading the label before routing (like the Sentry middleware the lesson found): req.route is empty, so the tag becomes the raw URL.', 'Đọc nhãn trước khi định tuyến (như middleware Sentry bài học phát hiện): req.route rỗng nên tag thành URL thô.']],
  gt: ['The single most important line of the lesson: the template /notes/:id gave 100 series and 9,807 B of /metrics for 300 notes; the raw URL gave 4,268 series and 390,366 B — 40× bigger with the same traffic.', 'Dòng quan trọng nhất của bài: mẫu /notes/:id cho 100 chuỗi và 9.807 B /metrics với 300 ghi chú; URL thô cho 4.268 chuỗi và 390.366 B — lớn gấp 40 lần với cùng lưu lượng.'],
  kn: ['metrics', 'Express routing'],
  tns: [tn('route template', 'mẫu route', '/notes/:id — the same for every note'), tn('req.baseUrl', 'req.baseUrl', 'the path where the router is mounted')],
  dau: `/** labels for http_requests_total */
function labelsFor(req, res) {
  // Write your solution here
  return { method: req.method, route: req.originalUrl, status: res.statusCode };
}
`,
  giai: '// Reference solution\n' + nguon(labelsFor),
  cases: [
    { goi: goi('labelsFor', { method: 'GET', baseUrl: '/api/v1/notes', route: { path: '/:id' }, originalUrl: '/api/v1/notes/1842' }, { statusCode: 200 }), moTa: ['GET /api/v1/notes/1842', 'GET /api/v1/notes/1842'] },
    { goi: goi('labelsFor', { method: 'GET', baseUrl: '', originalUrl: '/wp-login.php' }, { statusCode: 404 }), moTa: ['A scanner hits a path that does not exist', 'Máy quét gọi một đường không tồn tại'] },
    { goi: goi('labelsFor', { method: 'POST', baseUrl: '/api/v1/notes', route: { path: '/:id/share' }, originalUrl: '/api/v1/notes/7/share?x=1' }, { statusCode: 500 }), an: true },
    { goi: goi('labelsFor', { method: 'DELETE', baseUrl: '', route: { path: '/health/live' }, originalUrl: '/health/live' }, { statusCode: 204 }), an: true },
  ],
});

function countSeries(requests, opts) {
  // Một tổ hợp giá trị nhãn = một chuỗi. Histogram: mỗi tổ hợp có (số cạnh + 1) bucket (+Inf) + _sum + _count.
  const key = (r, labels) => JSON.stringify(labels.map((l) => r[l]));
  const c = new Set(requests.map((r) => key(r, opts.counterLabels)));
  const h = new Set(requests.map((r) => key(r, opts.histogramLabels)));
  const counter = requests.length ? c.size : 0;
  const histogram = (requests.length ? h.size : 0) * (opts.edges.length + 1 + 2);
  return { counter, histogram, total: counter + histogram };
}
const R = (n, f) => Array.from({ length: n }, (_, i) => f(i));
const EDGES = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];
const E4 = await jsBai({
  ten: 'countSeries(requests, opts): why 300 URLs became thousands of series', kho: 'MEDIUM', phut: 14,
  en: '<p>Predict how many time series a counter <code>http_requests_total</code> and a histogram <code>http_request_duration_seconds</code> create. <code>requests</code> are observed requests (objects with fields such as <code>method, route, url, status, userId</code>); <code>opts = { counterLabels, histogramLabels, edges }</code> name the label fields of each metric and the histogram bucket edges. A counter has one series per distinct combination of its label values. A histogram has, per distinct combination, one bucket series per edge, one for <code>+Inf</code>, plus <code>_sum</code> and <code>_count</code>. Return <code>{ counter, histogram, total }</code>.</p>',
  vi: '<p>Dự đoán một counter <code>http_requests_total</code> và một histogram <code>http_request_duration_seconds</code> tạo ra bao nhiêu chuỗi thời gian. <code>requests</code> là các request quan sát được (object có các trường như <code>method, route, url, status, userId</code>); <code>opts = { counterLabels, histogramLabels, edges }</code> nêu tên các trường nhãn của mỗi metric và các cạnh bucket. Counter có một chuỗi cho mỗi tổ hợp giá trị nhãn khác nhau. Histogram có, cho mỗi tổ hợp khác nhau, một chuỗi bucket cho mỗi cạnh, một cho <code>+Inf</code>, cộng <code>_sum</code> và <code>_count</code>. Trả về <code>{ counter, histogram, total }</code>.</p>',
  goiY: [['Build a key per request from the label values (JSON.stringify of an array works) and count distinct keys with a Set.', 'Dựng một khoá cho mỗi request từ giá trị nhãn (JSON.stringify một mảng là được) và đếm khoá khác nhau bằng Set.'], ['Per histogram combination: edges.length + 1 + 2 series. With 10 edges that is 13, so one new route value costs 14 series in total.', 'Mỗi tổ hợp histogram: edges.length + 1 + 2 chuỗi. Với 10 cạnh là 13, nên một giá trị route mới tốn tổng cộng 14 chuỗi.']],
  loi: [['Counting requests instead of distinct label combinations: traffic does not create series, distinct values do.', 'Đếm request thay vì tổ hợp nhãn khác nhau: lưu lượng không tạo chuỗi, giá trị khác nhau mới tạo.'], ['Forgetting +Inf, _sum and _count: the histogram is the amplifier.', 'Quên +Inf, _sum và _count: histogram chính là bộ khuếch đại.']],
  gt: ['300 requests to one template: 1 + 13 = 14 series. The same 300 by raw URL: 300 × 14 = 4,200. A user_id label on the counter only still made one counter series per user. Series never go away while the process lives — that is how 100,000 user ids reached 1,494 MB.', '300 request tới một mẫu: 1 + 13 = 14 chuỗi. Cùng 300 request theo URL thô: 300 × 14 = 4.200. Nhãn user_id chỉ trên counter vẫn tạo một chuỗi counter cho mỗi người dùng. Chuỗi không bao giờ mất khi tiến trình còn sống — đó là cách 100.000 user id lên tới 1.494 MB.'],
  kn: ['metrics', 'cardinality', 'Set'],
  tns: [tn('bucket', 'ngăn', 'a counter of observations ≤ an edge'), tn('label combination', 'tổ hợp nhãn')],
  dau: `/** how many series will these labels create? */
function countSeries(requests, opts) {
  // Write your solution here
  const counter = requests.length;
  const histogram = requests.length * opts.edges.length;
  return { counter, histogram, total: counter + histogram };
}
`,
  giai: '// Reference solution\n' + nguon(countSeries),
  cases: [
    { goi: goi('countSeries', R(300, (i) => ({ method: 'GET', route: '/notes/:id', url: `/notes/${i + 1}`, status: 200 })), { counterLabels: ['method', 'route', 'status'], histogramLabels: ['method', 'route', 'status'], edges: EDGES }), moTa: ['300 notes, template label', '300 ghi chú, nhãn theo mẫu'] },
    { goi: goi('countSeries', R(300, (i) => ({ method: 'GET', route: '/notes/:id', url: `/notes/${i + 1}`, status: 200 })), { counterLabels: ['method', 'url', 'status'], histogramLabels: ['method', 'url', 'status'], edges: EDGES }), moTa: ['300 notes, raw URL label', '300 ghi chú, nhãn URL thô'] },
    { goi: goi('countSeries', R(300, (i) => ({ method: 'GET', route: '/notes/:id', status: 200, userId: `u${i % 150}` })), { counterLabels: ['method', 'route', 'status', 'userId'], histogramLabels: ['method', 'route', 'status'], edges: EDGES }), an: true },
    { goi: goi('countSeries', [{ method: 'GET', route: '/a', status: 200 }, { method: 'GET', route: '/a', status: 500 }, { method: 'POST', route: '/a', status: 200 }, { method: 'GET', route: '/a', status: 200 }], { counterLabels: ['method', 'route', 'status'], histogramLabels: ['route'], edges: [0.1, 0.3, 1] }), an: true },
    { goi: goi('countSeries', [], { counterLabels: ['method'], histogramLabels: ['method'], edges: EDGES }), an: true },
  ],
});

function createHistogram(edges) {
  // Histogram KHÔNG giữ từng giá trị: nó là một hàng counter, mỗi cạnh một cái, cộng dồn (v ≤ cạnh).
  const counts = edges.map(() => 0);
  let sum = 0;
  let count = 0;
  return {
    observe(v) {
      for (let i = 0; i < edges.length; i++) if (v <= edges[i]) counts[i]++;   // cộng dồn: v vào MỌI bucket có cạnh ≥ v
      sum += v;
      count++;
    },
    render(name) {
      const lines = edges.map((e, i) => `${name}_bucket{le="${e}"} ${counts[i]}`);
      lines.push(`${name}_bucket{le="+Inf"} ${count}`);              // +Inf luôn bằng _count
      lines.push(`${name}_sum ${Number(sum.toFixed(6))}`);
      lines.push(`${name}_count ${count}`);
      return lines;
    },
  };
}
const E5 = await jsBai({
  ten: 'createHistogram(edges): cumulative buckets, _sum and _count as /metrics prints them', kho: 'HARD', phut: 18,
  en: '<p>A histogram is not a percentile calculator, it is a row of <b>cumulative</b> counters. Write <code>createHistogram(edges)</code> (edges ascending, in seconds) returning <code>{ observe(v), render(name) }</code>. <code>render</code> returns the exposition lines, in this order:</p><pre>&lt;name&gt;_bucket{le="&lt;edge&gt;"} &lt;observations ≤ edge&gt;   (one per edge)\n&lt;name&gt;_bucket{le="+Inf"} &lt;all observations&gt;\n&lt;name&gt;_sum &lt;sum of values, Number(sum.toFixed(6))&gt;\n&lt;name&gt;_count &lt;all observations&gt;</pre><p>An observation equal to an edge belongs to that bucket (<code>le</code> = less or equal). Print an edge with JavaScript’s default number-to-string (<code>0.005</code>, <code>1</code>).</p>',
  vi: '<p>Histogram không phải máy tính bách phân vị, nó là một hàng counter <b>cộng dồn</b>. Viết <code>createHistogram(edges)</code> (các cạnh tăng dần, đơn vị giây) trả về <code>{ observe(v), render(name) }</code>. <code>render</code> trả về các dòng xuất, theo thứ tự:</p><pre>&lt;name&gt;_bucket{le="&lt;cạnh&gt;"} &lt;số quan sát ≤ cạnh&gt;   (mỗi cạnh một dòng)\n&lt;name&gt;_bucket{le="+Inf"} &lt;mọi quan sát&gt;\n&lt;name&gt;_sum &lt;tổng giá trị, Number(sum.toFixed(6))&gt;\n&lt;name&gt;_count &lt;mọi quan sát&gt;</pre><p>Quan sát bằng đúng một cạnh thuộc bucket đó (<code>le</code> = nhỏ hơn hoặc bằng). In cạnh bằng cách đổi số sang chuỗi mặc định của JavaScript (<code>0.005</code>, <code>1</code>).</p>',
  goiY: [['Cumulative means one observation increments EVERY bucket whose edge is ≥ the value, not just the first one.', 'Cộng dồn nghĩa là một quan sát tăng MỌI bucket có cạnh ≥ giá trị, không chỉ bucket đầu tiên.'], ['The +Inf line is always equal to _count; sum ÷ count is the average.', 'Dòng +Inf luôn bằng _count; sum ÷ count là trung bình.']],
  loi: [['Non-cumulative buckets (each value in one bucket only): Prometheus’ histogram_quantile then computes nonsense.', 'Bucket không cộng dồn (mỗi giá trị chỉ vào một bucket): histogram_quantile của Prometheus sẽ tính ra vô nghĩa.'], ['Using < instead of <=: a request of exactly 10 ms falls into the 25 ms bucket.', 'Dùng < thay vì <=: một request đúng 10 ms rơi vào bucket 25 ms.']],
  gt: ['After 300 requests the lesson read 193 ≤ 5 ms, 297 ≤ 10 ms, 300 ≤ 25 ms, _sum 1.207…, _count 300. There is no percentile in the output: Prometheus computes it later from these counters, so its precision is only as good as your edges — put one exactly at your SLO.', 'Sau 300 request bài đọc được 193 ≤ 5 ms, 297 ≤ 10 ms, 300 ≤ 25 ms, _sum 1,207…, _count 300. Không có bách phân vị nào trong output: Prometheus tính sau từ các counter này, nên độ chính xác chỉ bằng các cạnh bạn chọn — hãy đặt một cạnh đúng ở SLO.'],
  kn: ['metrics', 'histograms', 'closures'],
  tns: [tn('cumulative', 'cộng dồn'), tn('exposition format', 'định dạng xuất', 'the text Prometheus scrapes'), tn('SLO', 'mục tiêu dịch vụ', 'e.g. 95% under 300 ms')],
  dau: `/** a prom-client style histogram */
function createHistogram(edges) {
  // Write your solution here
  const counts = edges.map(() => 0);
  let sum = 0, count = 0;
  return {
    observe(v) {
      const i = edges.findIndex((e) => v < e);
      if (i >= 0) counts[i]++;
      sum += v; count++;
    },
    render(name) {
      return [...edges.map((e, i) => name + '_bucket{le="' + e + '"} ' + counts[i]), name + '_sum ' + sum, name + '_count ' + count];
    },
  };
}
`,
  giai: '// Reference solution\n' + nguon(createHistogram),
  cases: [
    { chuanBi: 'const h = createHistogram([0.005, 0.01, 0.025]); for (const v of [0.003, 0.004, 0.007, 0.01, 0.02]) h.observe(v);', goi: 'h.render("http_request_duration_seconds")', moTa: ['Five requests, one exactly on an edge', 'Năm request, một cái đúng bằng cạnh'] },
    { chuanBi: 'const h = createHistogram([0.1, 0.3, 1]);', goi: 'h.render("d")', moTa: ['No observations yet', 'Chưa có quan sát nào'] },
    { chuanBi: 'const h = createHistogram([0.005, 0.01, 0.025]); for (let i = 0; i < 193; i++) h.observe(0.004); for (let i = 0; i < 104; i++) h.observe(0.006); for (let i = 0; i < 3; i++) h.observe(0.02);', goi: 'h.render("http_request_duration_seconds")', an: true },
    { chuanBi: 'const h = createHistogram([0.1, 0.3, 1]); [5, 0.3, 0.05, 2.5].forEach((v) => h.observe(v));', goi: 'h.render("x")', an: true },
  ],
});

function globalQuantile(q, replicas) {
  // 1) bucket là counter ⇒ CỘNG theo từng cạnh giữa các container ⇒ một histogram toàn cục.
  const merged = replicas[0].map(([le], i) => [le, replicas.reduce((s, r) => s + r[i][1], 0)]);
  const total = merged[merged.length - 1][1];                       // bucket +Inf = tổng số quan sát
  if (total === 0) return null;
  // 2) histogram_quantile: hạng = q × tổng, tìm bucket đầu tiên có số đếm ≥ hạng, nội suy tuyến tính trong bucket.
  const rank = q * total;
  const i = merged.findIndex(([, c]) => c >= rank);
  if (merged[i][0] === '+Inf') return merged[i - 1][0];             // rơi vào +Inf ⇒ trả cạnh hữu hạn lớn nhất
  const lower = i === 0 ? 0 : merged[i - 1][0];
  const below = i === 0 ? 0 : merged[i - 1][1];
  const inBucket = merged[i][1] - below;
  const v = lower + (merged[i][0] - lower) * ((rank - below) / inBucket);
  return Number(v.toFixed(6));
}
const B = (...cs) => [[0.005, cs[0]], [0.01, cs[1]], [0.025, cs[2]], ['+Inf', cs[3]]];
const E6 = await jsBai({
  ten: 'globalQuantile(q, replicas): add the buckets of three containers, then interpolate like histogram_quantile', kho: 'HARD', phut: 20,
  en: '<p>Histogram buckets are counters, so they add up across containers — the whole reason to avoid a Summary. Each replica gives its cumulative buckets as <code>[[le, count], …]</code>, the last one with <code>le = "+Inf"</code>; all replicas have the same edges. Write <code>globalQuantile(q, replicas)</code>:</p><ol><li>sum the counts of each <code>le</code> across replicas;</li><li><code>total</code> = the <code>+Inf</code> count; if 0 return <code>null</code>;</li><li><code>rank = q × total</code>; find the first bucket whose count ≥ rank;</li><li>if that is the <code>+Inf</code> bucket, return the largest finite edge;</li><li>otherwise interpolate linearly inside it: <code>lower + (upper − lower) × (rank − countBelow) / countInBucket</code>, where <code>lower</code> is the previous edge (0 for the first bucket);</li><li>round with <code>Number(v.toFixed(6))</code>.</li></ol>',
  vi: '<p>Bucket của histogram là counter nên cộng được giữa các container — đó là toàn bộ lý do tránh Summary. Mỗi bản sao cho bucket cộng dồn dạng <code>[[le, count], …]</code>, phần tử cuối có <code>le = "+Inf"</code>; mọi bản sao cùng các cạnh. Viết <code>globalQuantile(q, replicas)</code>:</p><ol><li>cộng số đếm của từng <code>le</code> qua các bản sao;</li><li><code>total</code> = số đếm của <code>+Inf</code>; bằng 0 thì trả <code>null</code>;</li><li><code>rank = q × total</code>; tìm bucket đầu tiên có số đếm ≥ rank;</li><li>nếu đó là bucket <code>+Inf</code>, trả cạnh hữu hạn lớn nhất;</li><li>không thì nội suy tuyến tính trong bucket: <code>lower + (upper − lower) × (rank − countBelow) / countInBucket</code>, với <code>lower</code> là cạnh trước (0 cho bucket đầu);</li><li>làm tròn bằng <code>Number(v.toFixed(6))</code>.</li></ol>',
  goiY: [['Merge first: replicas[0].map(([le], i) => [le, sum of r[i][1]]).', 'Gộp trước: replicas[0].map(([le], i) => [le, tổng r[i][1]]).'], ['countBelow and countInBucket come from the merged CUMULATIVE counts: inBucket = c[i] − c[i−1].', 'countBelow và countInBucket lấy từ số đếm CỘNG DỒN đã gộp: inBucket = c[i] − c[i−1].']],
  loi: [['Averaging each replica’s p95: the mean of three p95s is not the global p95 (one busy replica is diluted by two quiet ones).', 'Lấy trung bình p95 của từng bản sao: trung bình ba p95 không phải p95 toàn cục (một bản sao bận bị hai bản rảnh pha loãng).'], ['Treating cumulative counts as per-bucket counts when interpolating.', 'Coi số đếm cộng dồn là số đếm riêng của bucket khi nội suy.']],
  gt: ['This is how Prometheus answers histogram_quantile(0.95, sum by (le) (rate(…_bucket[5m]))). The interpolation is a guess inside one bucket — Prometheus cannot see inside it — so any p95 between 10 ms and 25 ms here is an estimate. Edges at your decision points make the guess irrelevant.', 'Đây là cách Prometheus trả lời histogram_quantile(0.95, sum by (le) (rate(…_bucket[5m]))). Phép nội suy là phỏng đoán bên trong một bucket — Prometheus không nhìn vào trong được — nên mọi p95 giữa 10 ms và 25 ms ở đây đều là ước lượng. Đặt cạnh ở đúng điểm bạn ra quyết định thì phỏng đoán không còn quan trọng.'],
  kn: ['metrics', 'percentiles', 'interpolation'],
  tns: [tn('histogram_quantile', 'histogram_quantile', 'PromQL function computing a percentile from buckets'), tn('interpolation', 'nội suy')],
  dau: `/** global percentile from replica buckets */
function globalQuantile(q, replicas) {
  // Write your solution here — this averages each replica's own estimate
  const per = replicas.map((b) => {
    const total = b[b.length - 1][1];
    const i = b.findIndex(([, c]) => c >= q * total);
    return b[i][0] === '+Inf' ? b[i - 1][0] : b[i][0];
  });
  return per.reduce((a, b) => a + b, 0) / per.length;
}
`,
  giai: '// Reference solution\n' + nguon(globalQuantile),
  cases: [
    { goi: goi('globalQuantile', 0.95, [B(193, 297, 300, 300)]), moTa: ['The lesson’s 300 requests, p95', '300 request của bài, p95'] },
    { goi: goi('globalQuantile', 0.5, [B(193, 297, 300, 300), B(150, 310, 318, 320), B(201, 288, 299, 300)]), moTa: ['Three replicas, p50', 'Ba bản sao, p50'] },
    { goi: goi('globalQuantile', 0.99, [B(10, 20, 30, 100), B(90, 95, 99, 100)]), an: true },
    { goi: goi('globalQuantile', 0.95, [B(0, 0, 0, 0), B(0, 0, 0, 0)]), an: true },
    { goi: goi('globalQuantile', 0.1, [B(40, 80, 100, 100)]), an: true },
  ],
});

export default modul('nodejs-15-4-metrics-prometheus', '15.4 Metrics with prom-client: types, labels, histograms', [E1, E2, E3, E4, E5, E6]);
