/** API Design · 12.7 — Checklist triển khai: cấu hình hỏng sớm, readiness, tắt êm, log/metrics, sao lưu, smoke test (output thật bài 12.7). */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Deploy 1 — The checklist, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.7: the database stopped under a running instance, SIGTERM under load, logs, metrics and backups.',
  vi: 'Những điều từ bài 12.7: tắt CSDL dưới một instance đang chạy, SIGTERM khi có tải, log, metrics và sao lưu.',
  cau: [
    q('c1', ['PostgreSQL is stopped. What did /health and /ready answer?', 'PostgreSQL bị tắt. /health và /ready trả gì?'],
      ['/health 200 (alive, do not restart) and /ready 503 (do not send traffic)', '/health 503 and /ready 503, so the orchestrator restarts the process', '/health 200 and /ready 200, because the labs list was still cached', '/health 500 with the database error, /ready not reachable at all'],
      ['Restarting would not help a database outage; writes got 503 + Retry-After 5, cached reads 200.', 'Khởi động lại không giúp gì với sự cố CSDL; ghi nhận 503 + Retry-After 5, đọc có cache nhận 200.']),
    q('c2', ['SIGTERM to instance A while 20 clients loop through the proxy. Abrupt exit versus a 1.5 s drain?', 'SIGTERM tới instance A khi 20 client gọi liên tục qua proxy. Thoát ngay so với xả 1,5 s?'],
      ['622 × 502 and 2 broken sockets, versus zero errors', 'Zero errors both times, because the proxy retries every request', '622 × 502 both times, because the proxy checks health only every 500 ms', 'Zero errors abrupt, 622 × 503 graceful, because /ready said draining'],
      ['Readiness 503 ⇒ proxy removes A ⇒ A finishes in-flight work ⇒ exit 0 after 1,501 ms.', 'Readiness 503 ⇒ proxy gỡ A ⇒ A làm nốt việc dở ⇒ thoát 0 sau 1.501 ms.']),
    q('c3', ['The first proxy marked an instance dead after one /ready slower than 400 ms. What happened under load?', 'Proxy đầu tiên coi instance là chết sau một lần /ready chậm hơn 400 ms. Chuyện gì xảy ra khi có tải?'],
      ['B was removed in 0.5 s, A was then killed, and the proxy answered 503 to everything: 64,926 times', 'Nothing — a 400 ms timeout is the common default of real load balancers', 'B restarted itself three times because the proxy sent SIGTERM', 'The proxy kept sending traffic to A and B alternately, ignoring the checks'],
      ['Use seconds-long timeouts and several consecutive failures (nginx max_fails, HAProxy fall).', 'Dùng thời hạn tính bằng giây và nhiều lần trượt liên tiếp (nginx max_fails, HAProxy fall).']),
    q('c4', ['Which label is right for the request-count metric of GET /v2/devices/dev_1/issues?', 'Nhãn nào đúng cho metric đếm request của GET /v2/devices/dev_1/issues?'],
      ['route="/v2/devices/:id/issues" — the template, so the number of series stays bounded', 'route="/v2/devices/dev_1/issues" — the real URL, so you can find the device', 'user="usr_3" — the caller, so you can bill per user', 'path and query string together, so nothing is lost'],
      ['Prometheus: every label combination is a new time series; no user ids, no unbounded values.', 'Prometheus: mỗi tổ hợp nhãn là một chuỗi thời gian mới; không id người dùng, không giá trị không giới hạn.']),
  ],
  goiY: [['Alive and ready are different questions.', 'Còn sống và sẵn sàng là hai câu hỏi khác nhau.'], ['Think about who reads the metric and how many values a label can take.', 'Nghĩ xem ai đọc metric và một nhãn có bao nhiêu giá trị.']],
  loi: [['A /health that pings the database (restarts on every outage).', '/health ping CSDL (khởi động lại mỗi lần sự cố).'], ['Health checks that fail on one slow probe.', 'Kiểm sức khoẻ trượt chỉ vì một lần chậm.']],
  tns: [tn('readiness', 'sẵn sàng'), tn('draining', 'xả'), tn('cardinality', 'số giá trị nhãn')],
  kn: ['operations', 'observability'],
});

const E2 = cs({
  ten: 'Deploy 2 — Order the deploy day', kho: 'MEDIUM', phut: 6, loai: 'order',
  en: 'Put the steps of a LabFlow deploy in the order lesson 12.7 measured as safe.',
  vi: 'Xếp các bước triển khai LabFlow theo thứ tự bài 12.7 đã đo là an toàn.',
  cau: [
    ord('o1', ['Deploy-day order', 'Thứ tự ngày triển khai'], [
      'pg_dump backup, restored into a scratch database to prove it',
      'npm run db:migrate (one runner holds the advisory lock)',
      'start the new instances; they fail fast on bad config',
      'node ops/smoke.mjs against the public URL',
      'SIGTERM the old instances: /ready 503, drain, finish, exit 0',
    ], ['Backup before the schema changes; migrations before the code that needs them; smoke before the old instances leave.', 'Sao lưu trước khi đổi lược đồ; migration trước mã cần nó; smoke test trước khi instance cũ rời đi.']),
    ord('o2', ['Inside src/server.js on SIGTERM', 'Bên trong src/server.js khi nhận SIGTERM'], [
      'lifecycle.draining = true, so /ready answers 503',
      'wait SHUTDOWN_DRAIN_MS while still serving',
      'end SSE streams and close WebSockets with 1012',
      'server.close(): finish in-flight requests, accept nothing new',
      'close the PostgreSQL pool, then exit 0',
    ], ['Closing the pool first would fail every in-flight request that still needs the database.', 'Đóng pool trước sẽ làm hỏng mọi request đang dở còn cần CSDL.']),
  ],
  goiY: [['What must exist before the next step can work?', 'Cái gì phải có trước để bước sau chạy được?'], ['The load balancer needs time to notice.', 'Load balancer cần thời gian để nhận ra.']],
  loi: [['Migrating after the new code is already serving.', 'Migrate sau khi mã mới đã phục vụ.'], ['Closing the pool before in-flight requests finish.', 'Đóng pool trước khi request dở xong.']],
  tns: [tn('rolling deploy', 'triển khai cuốn chiếu'), tn('smoke test', 'kiểm khói')],
  kn: ['deployment'],
});

function checkConfig(env) {
  const out = [];
  const prod = env.NODE_ENV === 'production';
  if (prod) {
    if (!env.LABFLOW_JWT_SECRET) out.push('LABFLOW_JWT_SECRET');
    else if (env.LABFLOW_JWT_SECRET.length < 32) out.push('LABFLOW_JWT_SECRET too short');
    if (!env.DATABASE_URL) out.push('DATABASE_URL');
    if (!env.LABFLOW_REDIS) out.push('LABFLOW_REDIS');
    for (const v of ['LABFLOW_VULN', 'LABFLOW_CHAOS', 'LABFLOW_NOW']) if (env[v]) out.push(`${v} not allowed`);
  }
  return out;
}
const E3 = jsBai({
  ten: 'Deploy 3 — Write checkConfig(env): fail fast, list everything', kho: 'MEDIUM', phut: 12,
  en: `<p>Only when <code>NODE_ENV === 'production'</code>, return every problem in this order: <code>'LABFLOW_JWT_SECRET'</code> if missing, or <code>'LABFLOW_JWT_SECRET too short'</code> if under 32 characters; <code>'DATABASE_URL'</code> if missing; <code>'LABFLOW_REDIS'</code> if missing; then <code>'&lt;NAME&gt; not allowed'</code> for each of <code>LABFLOW_VULN</code>, <code>LABFLOW_CHAOS</code>, <code>LABFLOW_NOW</code> that is set. Outside production return <code>[]</code>.</p>`,
  vi: `<p>Chỉ khi <code>NODE_ENV === 'production'</code>, trả mọi vấn đề theo thứ tự: <code>'LABFLOW_JWT_SECRET'</code> nếu thiếu, hoặc <code>'LABFLOW_JWT_SECRET too short'</code> nếu ngắn hơn 32 ký tự; <code>'DATABASE_URL'</code> nếu thiếu; <code>'LABFLOW_REDIS'</code> nếu thiếu; rồi <code>'&lt;TÊN&gt; not allowed'</code> cho mỗi biến <code>LABFLOW_VULN</code>, <code>LABFLOW_CHAOS</code>, <code>LABFLOW_NOW</code> đang được đặt. Ngoài production trả <code>[]</code>.</p>`,
  dauVao: ['env — object of strings', 'env — object các chuỗi'], dauRa: ['string[]', 'mảng chuỗi'],
  goiY: [['Collect all problems, do not stop at the first.', 'Gom mọi vấn đề, đừng dừng ở cái đầu tiên.'], ['An empty string counts as missing.', 'Chuỗi rỗng coi như thiếu.']],
  loi: [['Throwing on the first missing variable (three failed deploys in a row).', 'Ném lỗi ở biến thiếu đầu tiên (ba lần triển khai hỏng liên tiếp).'], ['Checking learning switches outside production too.', 'Kiểm công tắc chỉ-để-học cả ngoài production.']],
  gt: ['12.7: NODE_ENV=production with nothing set printed three problems and exit 1; with LABFLOW_CHAOS=1 it refused to start. Exiting before the port opens never hurts a user.', '12.7: NODE_ENV=production không đặt gì in ba vấn đề và thoát 1; có LABFLOW_CHAOS=1 thì từ chối khởi động. Thoát trước khi mở cổng không hại ai.'],
  kn: ['configuration', 'deployment'], tns: [tn('fail fast', 'hỏng sớm'), tn('twelve-factor config', 'cấu hình kiểu twelve-factor')],
  dau: `/** problems with the production environment */
function checkConfig(env) {
  // Write your solution here
  if (!env.LABFLOW_JWT_SECRET) return ['LABFLOW_JWT_SECRET'];
  return [];
}
`,
  giai: '// Reference solution\n' + nguon(checkConfig),
  cases: [
    { goi: goi('checkConfig', { NODE_ENV: 'production' }), moTa: ['Nothing set', 'Không đặt gì'] },
    { goi: goi('checkConfig', { NODE_ENV: 'development' }), moTa: ['Development', 'Môi trường dev'] },
    { goi: goi('checkConfig', { NODE_ENV: 'production', LABFLOW_JWT_SECRET: 'short', DATABASE_URL: 'postgres://db/labflow', LABFLOW_REDIS: 'redis://r:6379' }), an: true },
    { goi: goi('checkConfig', { NODE_ENV: 'production', LABFLOW_JWT_SECRET: 'x'.repeat(64), DATABASE_URL: 'postgres://db/labflow', LABFLOW_REDIS: 'redis://r:6379', LABFLOW_CHAOS: '1' }), an: true },
    { goi: goi('checkConfig', { NODE_ENV: 'production', LABFLOW_JWT_SECRET: 'x'.repeat(40), DATABASE_URL: 'postgres://db/labflow', LABFLOW_REDIS: 'redis://r:6379' }), an: true },
  ],
});

export default doiDau({ slug: 'api-12-7-trien-khai', ten: '12.7 The deployment checklist', khoa: KHOA, baiHoc: 'api-12-7-trien-khai', de: [E1, E2, E3] });
