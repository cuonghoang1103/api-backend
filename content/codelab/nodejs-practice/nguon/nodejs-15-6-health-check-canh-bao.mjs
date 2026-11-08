/** Node.js 15.6 — Health check (liveness vs readiness), timeout cho DB bị kẹt, cache readiness, cảnh báo theo triệu chứng + thời lượng + tỉ lệ. */
import { modul, cs, q, qn, tn, jsBai, nguon, goi, RES_GIA } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Liveness vs readiness, the cascade, and alerts people still trust', kho: 'EASY', phut: 8,
  en: 'Questions on lesson 15.6.',
  vi: 'Câu hỏi về bài 15.6.',
  cau: [
    q('c1', ['The liveness probe runs SELECT 1 and the database has a 30-second hiccup. What happens on Kubernetes?', 'Liveness probe chạy SELECT 1 và CSDL trục trặc 30 giây. Trên Kubernetes chuyện gì xảy ra?'],
      ['Every container is killed and restarts cold, hammering the recovering DB: a long outage', 'Every container is removed from the load balancer until the database answers again', 'Nothing: liveness failures are only counted while the container is starting up', 'Only the container that ran the probe first is restarted, the others keep serving'],
      ['Liveness = “are you alive?”, failing means kill and restart, so it must touch nothing outside the process. Dependencies belong in readiness, whose failure only removes the container from the load balancer.', 'Liveness = “còn sống không?”, trượt nghĩa là giết và khởi động lại, nên nó không được đụng gì ngoài tiến trình. Phụ thuộc thuộc về readiness, trượt chỉ bị rút khỏi load balancer.']),
    q('c2', ['A TCP listener accepts the connection and never answers (a stuck DB). /ready without a timeout gives what?', 'Một TCP listener nhận kết nối rồi không bao giờ trả lời (CSDL bị kẹt). /ready không có timeout cho ra gì?'],
      ['No answer within 5,000 ms — the probe counts it as dead', 'A clean 503 after 809 ms, like with connectionTimeoutMillis: 800', 'A 200, because the connection itself was accepted', 'An immediate ECONNREFUSED, like a database that is down'],
      ['Down is easy, stuck is the killer: connectionTimeoutMillis: 0 (the default in several clients) waits forever. One line — connectionTimeoutMillis: 800 — turns the hang into a 503 in 809 ms.', 'Chết thì dễ, kẹt mới nguy: connectionTimeoutMillis: 0 (mặc định của nhiều client) chờ mãi mãi. Một dòng — connectionTimeoutMillis: 800 — biến cú treo thành 503 sau 809 ms.']),
    q('c3', ['With plain Docker (no Swarm, no Kubernetes), a container’s HEALTHCHECK fails 3 times. What does Docker do?', 'Với Docker thuần (không Swarm, không Kubernetes), HEALTHCHECK của container trượt 3 lần. Docker làm gì?'],
      ['Marks it unhealthy and does not restart it', 'Restarts it, because restart: unless-stopped reacts to health', 'Stops it and removes it from the compose project', 'Sends SIGTERM and waits for the grace period'],
      ['Restart policies react to the process exiting, not to health; restart count stays 0. Swarm, Kubernetes or an autoheal tool act on health.', 'Chính sách restart phản ứng với tiến trình thoát, không phải với health; số lần restart vẫn 0. Swarm, Kubernetes hay công cụ autoheal mới hành động theo health.']),
    q('c4', ['Which alert is a SYMPTOM alert worth waking a human for?', 'Cảnh báo nào là cảnh báo TRIỆU CHỨNG đáng gọi người dậy?'],
      ['5xx ratio above 2% for 5 minutes, with a runbook link', 'CPU above 90% on any container for one scrape', 'More than 50 errors per minute, at any traffic level', 'One log line at level error, the moment it is written'],
      ['Rule 1: symptoms, not causes (high CPU with healthy latency is a machine doing its job). Rule 2: require a duration. Rule 3: a ratio, not a count. Rule 4: every alert gets a runbook.', 'Luật 1: triệu chứng, không phải nguyên nhân (CPU cao mà độ trễ khoẻ là máy đang làm việc). Luật 2: cần thời lượng. Luật 3: tỉ lệ, không phải số đếm. Luật 4: cảnh báo nào cũng có runbook.']),
    qn('c5', ['The website’s public /api/v1/system/health answers "status":"ok" without touching the database. Which statements are true? (choose all that apply)', '/api/v1/system/health công khai của website trả "status":"ok" mà không đụng CSDL. Những câu nào đúng? (chọn mọi câu đúng)'],
      ['An uptime monitor on it would report ok during a total database outage', 'Only a check from outside the network survives the whole machine dying', 'Request rate near zero is an alert the 5xx-ratio alert cannot replace', 'Probes should be logged at info so the access log shows the cluster is alive'],
      [0, 1, 2],
      ['Monitoring that runs inside the thing it monitors cannot report that the thing is gone. When nothing arrives, nothing errors — the third alert catches it. Probes belong OUT of the access log: one per 10 s is 8,640 empty lines a day.', 'Giám sát chạy bên trong thứ nó giám sát không báo được rằng thứ đó đã mất. Khi không có gì tới thì không có lỗi nào — cảnh báo thứ ba bắt được điều đó. Probe phải ra NGOÀI access log: mỗi 10 s một cái là 8.640 dòng rỗng mỗi ngày.']),
  ],
  goiY: [['For each probe ask: if it fails, what does the machine do to the container?', 'Với mỗi probe hỏi: nếu nó trượt, máy làm gì với container?'], ['An alert is a promise that a human will act.', 'Cảnh báo là lời hứa rằng một người sẽ hành động.']],
  loi: [['A liveness check that queries the database.', 'Liveness check truy vấn CSDL.'], ['Alerting on causes (CPU) and on counts instead of ratios.', 'Cảnh báo theo nguyên nhân (CPU) và theo số đếm thay vì tỉ lệ.']],
  tns: [tn('liveness', 'liveness', 'is the process alive? no ⇒ restart'), tn('readiness', 'readiness', 'can it take traffic? no ⇒ out of the load balancer'), tn('runbook', 'sổ tay xử lý', 'what to check first at 3 am'), tn('saturation', 'độ bão hoà', 'headroom left: disk, pool, memory, loop lag')],
  kn: ['health checks', 'alerting'],
});

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      const e = new Error(`timeout after ${ms} ms`);
      e.name = 'TimeoutError';
      reject(e);
    }, ms);
    // dọn timer khi xong sớm — không thì mỗi probe để lại một timer treo
    promise.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}
function readyHandler(checks, ms) {
  return async (req, res) => {
    const names = Object.keys(checks);
    // chạy SONG SONG — tổng thời gian ≈ phụ thuộc chậm nhất, không phải tổng các phụ thuộc
    const results = await Promise.all(names.map((n) => withTimeout(Promise.resolve().then(checks[n]), ms)
      .then(() => 'ok', (e) => (e && e.name === 'TimeoutError' ? 'timeout' : 'error'))));
    const detail = {};
    names.forEach((n, i) => { detail[n] = results[i]; });
    const ok = results.every((r) => r === 'ok');
    res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'unavailable', checks: detail });
  };
}
const E2 = await jsBai({
  ten: 'readyHandler(checks, ms): a readiness probe that fails cleanly when the database is stuck', kho: 'MEDIUM', phut: 18,
  en: '<p>Write <code>readyHandler(checks, ms)</code> returning an async Express handler <code>(req, res)</code> for <code>/health/ready</code>. <code>checks</code> is an object of async functions (e.g. <code>{ db: () => pool.query("SELECT 1"), redis: () => redis.ping() }</code>). Run every check <b>in parallel</b>, each with its own timeout of <code>ms</code>. A check is <code>"ok"</code> if it resolves in time, <code>"timeout"</code> if <code>ms</code> passes first, <code>"error"</code> if it rejects (or throws). Respond <code>200 { status: "ok", checks }</code> when all are ok, otherwise <code>503 { status: "unavailable", checks }</code>, where <code>checks</code> maps each name to its result.</p>',
  vi: '<p>Viết <code>readyHandler(checks, ms)</code> trả về handler Express bất đồng bộ <code>(req, res)</code> cho <code>/health/ready</code>. <code>checks</code> là object các hàm async (vd <code>{ db: () => pool.query("SELECT 1"), redis: () => redis.ping() }</code>). Chạy mọi kiểm tra <b>song song</b>, mỗi cái có timeout riêng <code>ms</code>. Một kiểm tra là <code>"ok"</code> nếu resolve kịp, <code>"timeout"</code> nếu hết <code>ms</code> trước, <code>"error"</code> nếu reject (hoặc ném). Trả <code>200 { status: "ok", checks }</code> khi tất cả ok, không thì <code>503 { status: "unavailable", checks }</code>, với <code>checks</code> ánh xạ tên ⇒ kết quả.</p>',
  yc: [['Never let a stuck dependency hang the response.', 'Không bao giờ để một phụ thuộc bị kẹt làm treo response.'], ['Clear the timer when a check settles first.', 'Dọn timer khi kiểm tra xong trước.']],
  goiY: [['Write a helper withTimeout(promise, ms) that races the promise against a setTimeout rejecting with a named error.', 'Viết hàm phụ withTimeout(promise, ms) cho promise đua với một setTimeout reject bằng lỗi có tên riêng.'], ['Promise.resolve().then(fn) turns a check that throws synchronously into a rejected promise; map rejections to "timeout" or "error" before Promise.all, so one failure does not hide the others.', 'Promise.resolve().then(fn) biến kiểm tra ném lỗi đồng bộ thành promise bị reject; đổi reject thành "timeout" hay "error" trước Promise.all, để một lỗi không che các kết quả khác.']],
  loi: [['No timeout: a database that accepts and never answers makes /ready hang until the probe gives up — exactly like a dead process.', 'Không timeout: CSDL nhận kết nối mà không trả lời làm /ready treo tới khi probe bỏ cuộc — y như tiến trình đã chết.'], ['Running the checks one after another: a 800 ms DB timeout plus a 800 ms Redis timeout is longer than many probe timeouts.', 'Chạy kiểm tra lần lượt: 800 ms timeout DB cộng 800 ms timeout Redis dài hơn timeout của nhiều probe.']],
  gt: ['A clean, fast 503 is something an orchestrator can handle correctly: take this container out of the load balancer and keep it alive. A hang is indistinguishable from death. And the check’s timeout must be shorter than the probe’s, or you measure the probe queue, not the app.', 'Một 503 nhanh và sạch là thứ bộ điều phối xử lý đúng được: rút container khỏi load balancer và giữ nó sống. Một cú treo thì không phân biệt được với cái chết. Và timeout của kiểm tra phải ngắn hơn timeout của probe, không thì bạn đo hàng đợi probe chứ không đo app.'],
  kn: ['health checks', 'promises', 'timeouts'],
  tns: [tn('stuck dependency', 'phụ thuộc bị kẹt', 'accepts the connection, never answers'), tn('Promise.all', 'Promise.all')],
  dau: `/** /health/ready */
function readyHandler(checks, ms) {
  return async (req, res) => {
    // Write your solution here
    const detail = {};
    for (const name of Object.keys(checks)) {
      try { await checks[name](); detail[name] = 'ok'; } catch { detail[name] = 'error'; }
    }
    const ok = Object.values(detail).every((r) => r === 'ok');
    res.status(ok ? 200 : 503).json({ status: ok ? 'ok' : 'unavailable', checks: detail });
  };
}
`,
  giai: '// Reference solution\n' + nguon(withTimeout, readyHandler),
  cases: [
    { chuanBi: `${RES_GIA} const res = mkRes(); await readyHandler({ db: async () => 1, redis: async () => "PONG" }, 50)({}, res);`, goi: '({ status: res.statusCode, body: res.body })', moTa: ['Healthy database and Redis', 'CSDL và Redis khoẻ'] },
    { chuanBi: `${RES_GIA} const res = mkRes(); await readyHandler({ db: () => new Promise(() => {}), redis: async () => "PONG" }, 50)({}, res);`, goi: '({ status: res.statusCode, body: res.body })', moTa: ['A stuck database (accepts, never answers)', 'CSDL bị kẹt (nhận, không bao giờ trả lời)'] },
    { chuanBi: `${RES_GIA} const res = mkRes(); await readyHandler({ db: async () => { throw new Error("ECONNREFUSED"); }, redis: () => new Promise(() => {}) }, 40)({}, res);`, goi: '({ status: res.statusCode, body: res.body })', an: true },
    { chuanBi: `${RES_GIA} const res = mkRes(); await readyHandler({ db: () => { throw new Error("sync throw"); } }, 40)({}, res);`, goi: '({ status: res.statusCode, body: res.body })', an: true },
    { chuanBi: `${RES_GIA} const res = mkRes(); await readyHandler({ db: () => new Promise((r) => setTimeout(r, 10)) }, 60)({}, res);`, goi: '({ status: res.statusCode, body: res.body })', an: true },
  ],
});

function probeLoad(containers, probers, intervalSec, cacheSec) {
  // Mỗi container nhận một probe mỗi intervalSec / probers giây. Cache chỉ có ích khi SỐNG LÂU HƠN khoảng đó.
  const gap = intervalSec / probers;
  const perContainer = cacheSec > gap ? 1 / cacheSec : 1 / gap;   // truy vấn/giây mỗi container
  const qps = containers * perContainer;
  return { gapSec: Number(gap.toFixed(2)), queriesPerSec: Number(qps.toFixed(2)), everySec: Number((1 / qps).toFixed(2)) };
}
const E3 = await jsBai({
  ten: 'probeLoad(containers, probers, intervalSec, cacheSec): a readiness check is itself load', kho: 'EASY', phut: 8,
  en: '<p>6 containers × 3 probers (load balancer, orchestrator, uptime) every 10 s = one DB query every 0.56 s, forever. Write <code>probeLoad(containers, probers, intervalSec, cacheSec)</code>. Each container receives a probe every <code>gap = intervalSec / probers</code> seconds. If the readiness result is cached for <code>cacheSec</code> and <code>cacheSec &gt; gap</code>, each container queries the DB once per <code>cacheSec</code>; otherwise (no cache: <code>cacheSec = 0</code>, or a cache shorter than the gap) it queries on every probe. Return <code>{ gapSec, queriesPerSec, everySec }</code> (all rounded to 2 decimals; <code>everySec = 1 / queriesPerSec</code> computed before rounding).</p>',
  vi: '<p>6 container × 3 bên probe (load balancer, bộ điều phối, uptime) mỗi 10 s = một truy vấn CSDL mỗi 0,56 s, mãi mãi. Viết <code>probeLoad(containers, probers, intervalSec, cacheSec)</code>. Mỗi container nhận một probe mỗi <code>gap = intervalSec / probers</code> giây. Nếu kết quả readiness được cache <code>cacheSec</code> giây và <code>cacheSec &gt; gap</code>, mỗi container truy vấn CSDL một lần mỗi <code>cacheSec</code>; không thì (không cache: <code>cacheSec = 0</code>, hoặc cache ngắn hơn khoảng cách) nó truy vấn ở mọi probe. Trả về <code>{ gapSec, queriesPerSec, everySec }</code> (làm tròn 2 chữ số; <code>everySec = 1 / queriesPerSec</code> tính trước khi làm tròn).</p>',
  goiY: [['No useful cache: queriesPerSec = containers × probers / intervalSec.', 'Không có cache hữu ích: queriesPerSec = containers × probers / intervalSec.'], ['A useful cache: queriesPerSec = containers / cacheSec.', 'Cache hữu ích: queriesPerSec = containers / cacheSec.']],
  loi: [['A 3-second cache with probes every 3.3 s: it expires before every probe, so it never hits.', 'Cache 3 giây với probe mỗi 3,3 s: nó hết hạn trước mỗi probe, nên không bao giờ trúng.'], ['Counting probers per cluster instead of per container.', 'Đếm bên probe cho cả cụm thay vì cho từng container.']],
  gt: ['6 × 3 / 10 = 1.8 queries/s. A 10 s cache gives 6 / 10 = 0.6 queries/s. A readiness check that adds to the overload it should detect is an expensive irony — cache it, for longer than the gap between probes.', '6 × 3 / 10 = 1,8 truy vấn/giây. Cache 10 s cho 6 / 10 = 0,6 truy vấn/giây. Một readiness check làm tăng chính cơn quá tải nó cần phát hiện là sự trớ trêu đắt giá — hãy cache, lâu hơn khoảng cách giữa các probe.'],
  kn: ['health checks', 'capacity'],
  tns: [tn('prober', 'bên gọi probe'), tn('probe interval', 'chu kỳ probe')],
  dau: `/** DB load created by readiness probes */
function probeLoad(containers, probers, intervalSec, cacheSec) {
  // Write your solution here
  const gap = intervalSec / probers;
  const qps = cacheSec > 0 ? containers / cacheSec : containers * probers / intervalSec;
  return { gapSec: Number(gap.toFixed(2)), queriesPerSec: Number(qps.toFixed(2)), everySec: Number((1 / qps).toFixed(2)) };
}
`,
  giai: '// Reference solution\n' + nguon(probeLoad),
  cases: [
    { goi: goi('probeLoad', 6, 3, 10, 0), moTa: ['The lesson’s cluster, no cache', 'Cụm của bài, không cache'] },
    { goi: goi('probeLoad', 6, 3, 10, 10), moTa: ['A 10 s cache', 'Cache 10 s'] },
    { goi: goi('probeLoad', 6, 3, 10, 3), an: true },
    { goi: goi('probeLoad', 4, 2, 15, 30), an: true },
  ],
});

function makeCachedReady(ping, ttlMs, now) {
  let last = null;                                    // { ok, at } của lần ping gần nhất
  let pings = 0;
  async function check() {
    if (last && now() - last.at < ttlMs) return last.ok;   // còn hạn ⇒ trả kết quả cũ, KHÔNG đụng CSDL
    pings++;
    let ok;
    try { await ping(); ok = true; } catch { ok = false; }
    last = { ok, at: now() };                         // cache cả kết quả xấu: CSDL đang chết thì đừng dồn thêm
    return ok;
  }
  return { check, pings: () => pings };
}
const E4 = await jsBai({
  ten: 'makeCachedReady(ping, ttlMs, now): cache the readiness result, good or bad', kho: 'MEDIUM', phut: 14,
  en: '<p>Implement the cache of the lesson: <code>last = { ok, at }</code>, ping the DB only if more than <code>ttlMs</code> have passed. <code>makeCachedReady(ping, ttlMs, now)</code> returns <code>{ check, pings }</code>: <code>check()</code> is async and returns <code>true</code>/<code>false</code>; when a previous result exists and <code>now() - last.at &lt; ttlMs</code> it returns that result without pinging; otherwise it awaits <code>ping()</code> (resolve ⇒ true, reject ⇒ false), stores <code>{ ok, at: now() }</code> and returns <code>ok</code>. <code>pings()</code> returns how many times <code>ping</code> was called. <code>now</code> is an injected clock (ms).</p>',
  vi: '<p>Cài đặt bộ cache của bài: <code>last = { ok, at }</code>, chỉ ping CSDL nếu đã qua hơn <code>ttlMs</code>. <code>makeCachedReady(ping, ttlMs, now)</code> trả về <code>{ check, pings }</code>: <code>check()</code> là async, trả <code>true</code>/<code>false</code>; khi đã có kết quả trước và <code>now() - last.at &lt; ttlMs</code> thì trả kết quả đó mà không ping; không thì await <code>ping()</code> (resolve ⇒ true, reject ⇒ false), lưu <code>{ ok, at: now() }</code> rồi trả <code>ok</code>. <code>pings()</code> cho biết <code>ping</code> đã được gọi bao nhiêu lần. <code>now</code> là đồng hồ được tiêm vào (ms).</p>',
  goiY: [['Keep last and pings in the closure of makeCachedReady.', 'Giữ last và pings trong closure của makeCachedReady.'], ['Cache failures too, and read now() after the ping finishes for at.', 'Cache cả kết quả xấu, và đọc now() sau khi ping xong để lấy at.']],
  loi: [['Caching only successes: while the DB is struggling every probe pings it again — the overload the check should detect.', 'Chỉ cache kết quả tốt: khi CSDL đang khó khăn, mọi probe lại ping nó — đúng cơn quá tải lẽ ra phải phát hiện.'], ['Letting a rejected ping throw out of check(): the handler then answers 500 instead of a clean 503.', 'Để ping bị reject ném ra khỏi check(): handler khi đó trả 500 thay vì 503 sạch sẽ.']],
  gt: ['Injecting now (and ping) is chapter 14’s trick: the cache logic becomes testable without waiting 10 real seconds or running a database. With a 10 s TTL each container pings at most once per 10 s, whatever the number of probers.', 'Tiêm now (và ping) là mẹo của chương 14: logic cache kiểm thử được mà không cần chờ 10 giây thật hay chạy CSDL. Với TTL 10 s, mỗi container ping tối đa một lần mỗi 10 s, bất kể có bao nhiêu bên probe.'],
  kn: ['health checks', 'caching', 'dependency injection'],
  tns: [tn('TTL', 'thời gian sống', 'how long a cached value is trusted'), tn('injected clock', 'đồng hồ tiêm vào')],
  dau: `/** cached readiness */
function makeCachedReady(ping, ttlMs, now) {
  // Write your solution here
  let last = null, pings = 0;
  async function check() {
    if (last && last.ok && now() - last.at < ttlMs) return true;
    pings++;
    await ping();
    last = { ok: true, at: now() };
    return true;
  }
  return { check, pings: () => pings };
}
`,
  giai: '// Reference solution\n' + nguon(makeCachedReady),
  cases: [
    { chuanBi: 'let t = 0; const r = makeCachedReady(async () => 1, 10000, () => t); const out = []; for (const at of [0, 3300, 6600, 9900, 10000, 13300]) { t = at; out.push(await r.check()); }', goi: '({ out, pings: r.pings() })', moTa: ['Probes every 3.3 s, TTL 10 s', 'Probe mỗi 3,3 s, TTL 10 s'] },
    { chuanBi: 'let t = 0; let down = true; const r = makeCachedReady(async () => { if (down) throw new Error("ECONNREFUSED"); }, 10000, () => t); const out = []; for (const at of [0, 5000, 9999]) { t = at; out.push(await r.check()); } down = false; t = 10000; out.push(await r.check());', goi: '({ out, pings: r.pings() })', moTa: ['A failing DB is not hammered', 'CSDL đang lỗi không bị dồn thêm'] },
    { chuanBi: 'let t = 0; const r = makeCachedReady(async () => 1, 3000, () => t); const out = []; for (const at of [0, 3333, 6666, 9999]) { t = at; out.push(await r.check()); }', goi: 'r.pings()', an: true },
    { chuanBi: 'let t = 500; const r = makeCachedReady(async () => { t += 800; throw new Error("timeout"); }, 1000, () => t); const a = await r.check(); t = 2000; const b = await r.check(); t = 2301; const c = await r.check();', goi: '[a, b, c, r.pings()]', an: true },
  ],
});

function alertFiring(samples, rule) {
  // Một mẫu mỗi phút. Cảnh báo BẬT ở phút t khi điều kiện đúng ở `forMin` mẫu liên tiếp kết thúc tại t.
  const breach = (s) => {
    if (rule.kind === 'errorRatio') return s.requests > 0 && s.errors / s.requests > rule.above;   // tỉ lệ, không phải số đếm
    if (rule.kind === 'lowTraffic') return s.requests < rule.below;                               // không có gì tới ⇒ không có lỗi nào
    return false;
  };
  const firing = [];
  let streak = 0;
  for (const s of samples) {
    streak = breach(s) ? streak + 1 : 0;
    if (streak >= rule.forMin) firing.push(s.t);
  }
  return firing;
}
const S = (t, requests, errors) => ({ t, requests, errors });
const E5 = await jsBai({
  ten: 'alertFiring(samples, rule): a ratio, for a duration — and the outage where nothing errors', kho: 'HARD', phut: 18,
  en: '<p>Evaluate alert rules over one sample per minute <code>{ t, requests, errors }</code>. Two rule kinds:</p><ul><li><code>{ kind: "errorRatio", above, forMin }</code> — breached at a sample when <code>requests &gt; 0</code> and <code>errors / requests &gt; above</code>;</li><li><code>{ kind: "lowTraffic", below, forMin }</code> — breached when <code>requests &lt; below</code>.</li></ul><p>The alert is <b>firing</b> at minute <code>t</code> when the rule was breached at <code>forMin</code> consecutive samples ending at <code>t</code>. Return the list of <code>t</code> at which it is firing.</p>',
  vi: '<p>Đánh giá luật cảnh báo trên một mẫu mỗi phút <code>{ t, requests, errors }</code>. Hai loại luật:</p><ul><li><code>{ kind: "errorRatio", above, forMin }</code> — vi phạm ở một mẫu khi <code>requests &gt; 0</code> và <code>errors / requests &gt; above</code>;</li><li><code>{ kind: "lowTraffic", below, forMin }</code> — vi phạm khi <code>requests &lt; below</code>.</li></ul><p>Cảnh báo <b>bật</b> ở phút <code>t</code> khi luật bị vi phạm ở <code>forMin</code> mẫu liên tiếp kết thúc tại <code>t</code>. Trả về danh sách các <code>t</code> mà cảnh báo đang bật.</p>',
  goiY: [['Keep a streak counter: +1 on a breach, back to 0 otherwise; firing when streak ≥ forMin.', 'Giữ bộ đếm chuỗi: +1 khi vi phạm, về 0 khi không; bật khi chuỗi ≥ forMin.'], ['Zero requests is not a 0% error ratio breach — it is the lowTraffic rule’s job.', 'Không có request không phải vi phạm tỉ lệ lỗi — đó là việc của luật lowTraffic.']],
  loi: [['Alerting on a count (50 errors a minute): a disaster at 100 req/min, invisible at 100,000.', 'Cảnh báo theo số đếm (50 lỗi mỗi phút): thảm hoạ ở 100 req/phút, vô hình ở 100.000.'], ['Firing on one bad sample: one scrape during a deploy pages someone for nothing, and the third false page trains them to silence the real one.', 'Bật ngay ở một mẫu xấu: một lần scrape đúng lúc deploy gọi người dậy vô ích, và lần báo nhầm thứ ba dạy họ tắt luôn cảnh báo thật.']],
  gt: ['for: 5m removes the alert caused by one scrape landing during a deploy; a ratio keeps the same rule meaningful at any traffic. And when the whole entry point is broken nothing errors because nothing arrives — only a “rate near zero” rule sees that outage.', 'for: 5m loại bỏ cảnh báo do một lần scrape rơi đúng lúc deploy; tỉ lệ giữ cho cùng một luật có nghĩa ở mọi mức lưu lượng. Và khi cả lối vào hỏng, không có lỗi nào vì không có gì tới — chỉ luật “lưu lượng gần 0” thấy được sự cố đó.'],
  kn: ['alerting', 'SRE'],
  tns: [tn('for (duration)', 'thời lượng', 'the condition must hold this long'), tn('error ratio', 'tỉ lệ lỗi'), tn('page', 'gọi trực', 'an alert that wakes a human')],
  dau: `/** minutes at which the alert fires */
function alertFiring(samples, rule) {
  // Write your solution here
  return samples.filter((s) => rule.kind === 'errorRatio' ? s.errors > 50 : s.requests === 0).map((s) => s.t);
}
`,
  giai: '// Reference solution\n' + nguon(alertFiring),
  cases: [
    { goi: goi('alertFiring', [S(1, 1000, 1), S(2, 1000, 30), S(3, 1000, 40), S(4, 1000, 35), S(5, 1000, 50), S(6, 1000, 60), S(7, 1000, 2)], { kind: 'errorRatio', above: 0.02, forMin: 5 }), moTa: ['5xx above 2% for 5 minutes', '5xx trên 2% suốt 5 phút'] },
    { goi: goi('alertFiring', [S(1, 1000, 3), S(2, 1000, 90), S(3, 1000, 2), S(4, 1000, 4)], { kind: 'errorRatio', above: 0.02, forMin: 2 }), moTa: ['One bad scrape during a deploy', 'Một lần scrape xấu lúc deploy'] },
    { goi: goi('alertFiring', [S(1, 100, 50), S(2, 100, 50), S(3, 100000, 60), S(4, 100000, 60)], { kind: 'errorRatio', above: 0.02, forMin: 1 }), an: true },
    { goi: goi('alertFiring', [S(1, 900, 0), S(2, 0, 0), S(3, 0, 0), S(4, 0, 0), S(5, 3, 0), S(6, 900, 0)], { kind: 'lowTraffic', below: 10, forMin: 3 }), an: true },
    { goi: goi('alertFiring', [S(1, 0, 0), S(2, 0, 0), S(3, 0, 0)], { kind: 'errorRatio', above: 0.02, forMin: 1 }), an: true },
  ],
});

export default modul('nodejs-15-6-health-check-canh-bao', '15.6 Health checks and alerts', [E1, E3, E2, E4, E5]);
