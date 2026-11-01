// metrics.js — bài 12.7: số đo cho Prometheus (định dạng văn bản 0.0.4), tự viết ~60 dòng để thấy bên trong có gì.
// Dự án thật dùng thư viện prom-client; ý tưởng giống hệt. Phục vụ ở CỔNG RIÊNG (METRICS_PORT), không ra Internet.
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { poolStats } from './pg.js';
import { config } from './config.js';

const BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5];
const counts = new Map();                      // 'GET|/v2/bookings|200' ⇒ số request
const hist = new Map();                        // 'GET|/v2/bookings' ⇒ { b: [..], sum, n }
const loop = monitorEventLoopDelay({ resolution: 10 });
loop.enable();

// Nhãn route = MẪU route ("/v2/bookings/:id"), KHÔNG phải URL thật ("/v2/bookings/bk_123"): mỗi id một nhãn là nổ bộ nhớ Prometheus
// baseUrl của router lồng (/v2/devices/dev_1/issues) là URL THẬT ⇒ đổi mọi id dạng xxx_123 thành :id
export const routeOf = (req) => (req.route
  ? `${req.baseUrl}${req.route.path === '/' ? '' : req.route.path}`.replace(/\/[a-z]+_\d+(?=\/|$)/g, '/:id') : 'unmatched');

export function metricsMiddleware(req, res, next) {
  const t0 = performance.now();
  res.once('finish', () => {
    const route = routeOf(req), s = (performance.now() - t0) / 1000;
    const ck = `${req.method}|${route}|${res.statusCode}`;
    counts.set(ck, (counts.get(ck) ?? 0) + 1);
    const hk = `${req.method}|${route}`;
    const h = hist.get(hk) ?? { b: BUCKETS.map(() => 0), sum: 0, n: 0 };
    BUCKETS.forEach((le, i) => { if (s <= le) h.b[i]++; });
    h.sum += s; h.n++;
    hist.set(hk, h);
  });
  next();
}

export async function renderMetrics(extra = async () => []) {
  const L = [];
  L.push('# HELP labflow_http_requests_total Requests by method, route template and status', '# TYPE labflow_http_requests_total counter');
  for (const [k, v] of counts) { const [m, r, s] = k.split('|'); L.push(`labflow_http_requests_total{method="${m}",route="${r}",status="${s}"} ${v}`); }
  L.push('# HELP labflow_http_request_duration_seconds Request latency', '# TYPE labflow_http_request_duration_seconds histogram');
  for (const [k, h] of hist) {
    const [m, r] = k.split('|'), lab = `method="${m}",route="${r}"`;
    BUCKETS.forEach((le, i) => L.push(`labflow_http_request_duration_seconds_bucket{${lab},le="${le}"} ${h.b[i]}`));
    L.push(`labflow_http_request_duration_seconds_bucket{${lab},le="+Inf"} ${h.n}`,
      `labflow_http_request_duration_seconds_sum{${lab}} ${h.sum.toFixed(6)}`, `labflow_http_request_duration_seconds_count{${lab}} ${h.n}`);
  }
  if (config.store === 'pg') {
    const p = poolStats();
    L.push('# HELP labflow_pg_pool_connections Connections in this instance pool', '# TYPE labflow_pg_pool_connections gauge',
      `labflow_pg_pool_connections{state="total"} ${p.total}`, `labflow_pg_pool_connections{state="idle"} ${p.idle}`,
      `labflow_pg_pool_connections{state="waiting"} ${p.waiting}`, `labflow_pg_pool_max ${p.max}`);
  }
  L.push('# HELP labflow_event_loop_delay_p99_seconds Event loop delay p99 since start', '# TYPE labflow_event_loop_delay_p99_seconds gauge',
    `labflow_event_loop_delay_p99_seconds ${(loop.percentile(99) / 1e9).toFixed(6)}`,
    '# TYPE process_resident_memory_bytes gauge', `process_resident_memory_bytes ${process.memoryUsage().rss}`);
  L.push(...await extra());
  return `${L.join('\n')}\n`;
}
