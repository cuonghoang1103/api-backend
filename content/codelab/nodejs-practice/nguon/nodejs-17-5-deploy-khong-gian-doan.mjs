/** Node.js 17.5 — Deploy không gián đoạn: đo bằng probe không ngừng, stop-rồi-start 5,32%, blue-green không proxy 12,03%, có proxy 0%, cổng health check, rolling/canary. */
import { modul, cs, q, qn, ord, bang1, tn, jsBai, nguon, goi } from './_node-c15-18.mjs';

const E1 = cs({
  ten: 'Where the hole is: the port, not the health of the container', kho: 'EASY', phut: 7,
  en: 'Questions on lesson 17.5 (a probe every ~25 ms on /health/live, a new connection each time, 9-second window, median of 5 runs).',
  vi: 'Câu hỏi về bài 17.5 (probe ~25 ms một lần vào /health/live, mỗi lần một kết nối mới, cửa sổ 9 giây, trung vị 5 lượt).',
  cau: [
    q('c1', ['“Blue-green” without a proxy (green on a second port, wait healthy, remove blue, re-create green on the real port) lost 35 of 291 requests — worse than stop-then-start. Why?', '“Blue-green” không proxy (green ở cổng thứ hai, chờ healthy, xoá blue, tạo lại green ở cổng thật) mất 35/291 request — tệ hơn cả stop-rồi-start. Vì sao?'],
      ['Between blue releasing the port and green binding it nothing listens, and that gap was longer (1.05 s)', 'Green was not healthy, so the probe counted every request to it as failed', 'Two containers on one machine halved the CPU each one could use', 'The health check itself overloaded green during the switch'],
      ['The problem was never which container was healthy; it is the port. The health check still matters — if green is broken, blue keeps serving, a failed deploy instead of an outage.', 'Vấn đề chưa bao giờ là container nào healthy; mà là cái cổng. Health check vẫn có giá trị — nếu green hỏng, blue vẫn phục vụ, một lần deploy hỏng thay vì một sự cố.']),
    q('c2', ['Method 3 (nginx holds the port, reload, drop blue at once) had a median of 0 failures, but 2 of 5 runs had exactly one 502. The fix that gave 0 in 5 of 5?', 'Cách 3 (nginx giữ cổng, reload, bỏ blue ngay) có trung vị 0 lỗi, nhưng 2/5 lượt có đúng một 502. Cách sửa cho 0 lỗi ở cả 5/5 lượt?'],
      ['Wait about 1 s after the reload so old nginx workers drain before dropping blue', 'Reload nginx twice, so both worker generations get the new config', 'Restart nginx instead of reloading it, so no old worker survives', 'Make green listen on port 80 directly, next to nginx'],
      ['An old nginx worker still handed one request to blue as it shut down. Something long-lived owns the address; everything else is detail.', 'Một worker nginx cũ vẫn chuyển một request cho blue lúc nó đang tắt. Có một thứ sống lâu giữ địa chỉ; còn lại là chi tiết.']),
    q('c3', ['The website’s deploy-nha.sh recreates the backend in place (docker compose up -d --no-build), then reloads nginx. What do users see during the swap?', 'deploy-nha.sh của website tạo lại backend tại chỗ (docker compose up -d --no-build), rồi reload nginx. Người dùng thấy gì trong lúc tráo?'],
      ['A short window of 502s from nginx instead of refused connections — method 1 behind a proxy', 'Nothing: nginx owns the port, so recreating the backend is zero-downtime', 'Connection refused, because nginx is restarted by every deploy', 'Old responses from cache, because nginx serves stale content on errors'],
      ['nginx (never restarted by a deploy) is the right piece; running old and new side by side is the missing one. On 11/09/2026 recreated containers swapped IPs while nginx kept the old ones: 502 on both domains for 15 minutes.', 'nginx (không bao giờ bị deploy khởi động lại) là mảnh đúng; chạy cũ và mới song song là mảnh còn thiếu. Ngày 11/09/2026 các container tạo lại bị tráo IP trong khi nginx giữ IP cũ: 502 trên cả hai tên miền 15 phút.']),
    qn('c4', ['Which statements are true? (choose all that apply)', 'Những câu nào đúng? (chọn mọi câu đúng)'],
      ['The switch gate must be a real HTTP answer from a real route, not docker ps showing Up', 'A Socket.IO connection is cut on every deploy; the client must rejoin rooms and refetch', 'During a rolling deploy, two versions use one database, so schema changes must stay compatible', 'Keep-alive in the probe makes the measurement more honest'],
      [0, 1, 2],
      ['The probe opens a new connection each time, like a new visitor: keep-alive could hide failures behind one lucky connection.', 'Probe mở kết nối mới mỗi lần, như một khách mới: keep-alive có thể giấu lỗi sau một kết nối may mắn.']),
  ],
  goiY: [['Ask: who listens on the public port at every instant?', 'Hỏi: ở mỗi thời điểm, ai đang nghe ở cổng công khai?'], ['“Container started” and “app ready” are seconds apart.', '“Container đã chạy” và “app đã sẵn sàng” cách nhau vài giây.']],
  loi: [['Calling “health check after the swap” blue-green.', 'Gọi “health check sau khi tráo” là blue-green.'], ['Dropping the old container the instant the proxy reloads.', 'Bỏ container cũ ngay khi proxy vừa reload.']],
  tns: [tn('blue-green', 'blue-green', 'two full versions, switch all at once'), tn('reverse proxy', 'proxy ngược'), tn('drain', 'xả dần')],
  kn: ['deployment', 'nginx'],
});

function probeReport(probes) {
  // probes: [{ t, ok }] theo thời gian (ms). Một "lỗ" = chuỗi probe trượt liên tiếp, đo từ probe trượt đầu tới probe ĐẠT kế tiếp.
  const failed = probes.filter((p) => !p.ok).length;
  const holes = [];
  for (let i = 0; i < probes.length; i++) {
    if (probes[i].ok || (i > 0 && !probes[i - 1].ok)) continue;          // chỉ bắt đầu ở probe trượt đầu tiên của một chuỗi
    let j = i;
    while (j < probes.length && !probes[j].ok) j++;
    const to = j < probes.length ? probes[j].t : probes[j - 1].t;
    holes.push({ from: probes[i].t, to, ms: to - probes[i].t, failed: j - i });
  }
  return {
    total: probes.length,
    failed,
    pct: probes.length ? Number(((100 * failed) / probes.length).toFixed(2)) : 0,
    holes,
    longestHoleMs: holes.reduce((m, h) => Math.max(m, h.ms), 0),
  };
}
const mkProbes = (n, step, failAt) => Array.from({ length: n }, (_, i) => ({ t: i * step, ok: !failAt(i * step) }));
const E2 = await jsBai({
  ten: 'probeReport(probes): do not claim zero downtime, count it', kho: 'MEDIUM', phut: 12,
  en: '<p>A probe fired a request about every 25 ms through the whole deploy; anything that is not 200 (refused, reset, 502, timeout) is a failure. <code>probes = [{ t, ok }]</code> in time order (ms). Write <code>probeReport(probes)</code> returning <code>{ total, failed, pct, holes, longestHoleMs }</code>: <code>pct</code> = failed share × 100 rounded to 2 decimals (0 for no probes); <code>holes</code> = one entry per run of consecutive failed probes, <code>{ from, to, ms, failed }</code>, where <code>from</code> is the first failed probe’s time and <code>to</code> the time of the next successful probe (or of the last failed probe if none follows), <code>ms = to − from</code>, <code>failed</code> the probes in the run; <code>longestHoleMs</code> the largest <code>ms</code> (0 if none).</p>',
  vi: '<p>Một probe bắn request khoảng 25 ms một lần suốt lần deploy; bất cứ thứ gì không phải 200 (bị từ chối, bị reset, 502, quá giờ) là lỗi. <code>probes = [{ t, ok }]</code> theo thứ tự thời gian (ms). Viết <code>probeReport(probes)</code> trả về <code>{ total, failed, pct, holes, longestHoleMs }</code>: <code>pct</code> = tỉ lệ lỗi × 100 làm tròn 2 chữ số (0 nếu không có probe); <code>holes</code> = mỗi chuỗi probe lỗi liên tiếp một mục <code>{ from, to, ms, failed }</code>, với <code>from</code> là thời điểm probe lỗi đầu và <code>to</code> là thời điểm probe đạt kế tiếp (hoặc của probe lỗi cuối nếu không có cái nào sau), <code>ms = to − from</code>, <code>failed</code> là số probe trong chuỗi; <code>longestHoleMs</code> là <code>ms</code> lớn nhất (0 nếu không có).</p>',
  goiY: [['A run starts at a failed probe whose previous probe was ok (or that is the first probe).', 'Một chuỗi bắt đầu ở probe lỗi mà probe trước nó đạt (hoặc là probe đầu tiên).'], ['Walk j forward while probes fail; probes[j] (if it exists) is the first success after the hole.', 'Cho j tiến lên khi probe còn lỗi; probes[j] (nếu có) là lần đạt đầu tiên sau lỗ.']],
  loi: [['Measuring once by hand after the deploy: the hole of 0.43 s is invisible to a human with curl.', 'Đo tay một lần sau khi deploy: lỗ 0,43 s vô hình với người dùng curl.'], ['Reusing one keep-alive connection in the probe: the failures hide behind it.', 'Dùng một kết nối keep-alive cho probe: lỗi trốn sau nó.']],
  gt: ['Stop-then-start, median of 5: 16 of 301 failed (5.32%) with a 0.43 s hole — exactly what docker compose up does to a single container when the image changed. The same probe after the proxy method reads 0. Numbers, not claims.', 'Stop-rồi-start, trung vị 5 lượt: 16/301 lỗi (5,32%) với lỗ 0,43 s — đúng điều docker compose up làm với một container duy nhất khi ảnh đổi. Cùng probe đó sau cách dùng proxy đọc ra 0. Con số, không phải lời khẳng định.'],
  kn: ['deployment', 'measurement'],
  tns: [tn('probe', 'probe'), tn('downtime', 'thời gian gián đoạn')],
  dau: `/** how much did the deploy cost? */
function probeReport(probes) {
  // Write your solution here
  const failed = probes.filter((p) => !p.ok);
  const longest = failed.length ? failed[failed.length - 1].t - failed[0].t : 0;
  return { total: probes.length, failed: failed.length, pct: 100 * failed.length / probes.length, holes: [], longestHoleMs: longest };
}
`,
  giai: '// Reference solution\n' + nguon(probeReport),
  cases: [
    { goi: goi('probeReport', mkProbes(301, 30, (t) => t >= 1500 && t < 1980)), moTa: ['Stop-then-start: one hole', 'Stop-rồi-start: một lỗ'] },
    { goi: goi('probeReport', mkProbes(20, 25, () => false)), moTa: ['The proxy method: nothing failed', 'Cách dùng proxy: không có lỗi'] },
    { goi: goi('probeReport', mkProbes(40, 25, (t) => t === 300 || (t >= 600 && t <= 700) || t >= 950)), an: true },
    { goi: goi('probeReport', []), an: true },
  ],
});

function checkDeployPlan(steps) {
  // Năm bước: proxy giữ cổng · chạy song song · health check THẬT · đổi đích + reload · chờ rồi mới bỏ bản cũ.
  const v = [];
  const at = (pred) => steps.findIndex(pred);
  const startNew = at((s) => s.do === 'start' && s.name === 'new');
  const healthNew = at((s) => s.do === 'health' && s.name === 'new' && s.check === 'route');
  const sw = at((s) => s.do === 'switch');
  const stopOld = at((s) => s.do === 'stop' && s.name === 'old');
  if (steps.some((s) => (s.do === 'stop' || s.do === 'restart') && s.name === 'proxy')) v.push('PROXY_RESTARTED');
  if (startNew < 0) v.push('NO_NEW_CONTAINER');
  if (stopOld >= 0 && (startNew < 0 || stopOld < startNew)) v.push('OLD_STOPPED_FIRST');
  if (healthNew < 0 || (sw >= 0 && healthNew > sw)) v.push(steps.some((s) => s.do === 'health' && s.name === 'new') && healthNew < 0 ? 'WEAK_HEALTH_CHECK' : 'NO_HEALTH_GATE');
  if (sw < 0) v.push('NO_SWITCH');
  if (sw >= 0 && stopOld > sw) {
    const waited = steps.slice(sw + 1, stopOld).filter((s) => s.do === 'wait').reduce((a, s) => a + s.ms, 0);
    if (waited < 1000) v.push('NO_DRAIN_WAIT');
  }
  return v;
}
const GOOD = [{ do: 'start', name: 'new' }, { do: 'health', name: 'new', check: 'route' }, { do: 'switch' }, { do: 'wait', ms: 1000 }, { do: 'stop', name: 'old' }];
const E3 = await jsBai({
  ten: 'checkDeployPlan(steps): review a deploy script against the five steps', kho: 'HARD', phut: 18,
  en: '<p>A deploy plan is a list of steps: <code>{ do: "start", name }</code>, <code>{ do: "health", name, check: "route" | "docker-ps" }</code>, <code>{ do: "switch" }</code> (rewrite the proxy target + reload), <code>{ do: "wait", ms }</code>, <code>{ do: "stop" | "restart", name }</code>; names are <code>"old"</code>, <code>"new"</code>, <code>"proxy"</code>. Return the violations, in this order:</p><ol><li><code>PROXY_RESTARTED</code> — the proxy is stopped or restarted;</li><li><code>NO_NEW_CONTAINER</code> — <code>new</code> is never started;</li><li><code>OLD_STOPPED_FIRST</code> — <code>old</code> is stopped before <code>new</code> starts (or <code>new</code> never starts);</li><li><code>WEAK_HEALTH_CHECK</code> if <code>new</code> is only checked with <code>docker-ps</code>, otherwise <code>NO_HEALTH_GATE</code> — when there is no <code>route</code> check of <code>new</code> before the switch;</li><li><code>NO_SWITCH</code> — no switch step;</li><li><code>NO_DRAIN_WAIT</code> — <code>old</code> is stopped after the switch with less than 1000 ms of waits between them.</li></ol>',
  vi: '<p>Một kế hoạch deploy là danh sách bước: <code>{ do: "start", name }</code>, <code>{ do: "health", name, check: "route" | "docker-ps" }</code>, <code>{ do: "switch" }</code> (sửa đích của proxy + reload), <code>{ do: "wait", ms }</code>, <code>{ do: "stop" | "restart", name }</code>; tên là <code>"old"</code>, <code>"new"</code>, <code>"proxy"</code>. Trả về các vi phạm, theo thứ tự:</p><ol><li><code>PROXY_RESTARTED</code> — proxy bị dừng hoặc khởi động lại;</li><li><code>NO_NEW_CONTAINER</code> — <code>new</code> không bao giờ được chạy;</li><li><code>OLD_STOPPED_FIRST</code> — <code>old</code> bị dừng trước khi <code>new</code> chạy (hoặc <code>new</code> không bao giờ chạy);</li><li><code>WEAK_HEALTH_CHECK</code> nếu <code>new</code> chỉ được kiểm bằng <code>docker-ps</code>, không thì <code>NO_HEALTH_GATE</code> — khi không có lần kiểm <code>route</code> của <code>new</code> trước bước switch;</li><li><code>NO_SWITCH</code> — không có bước switch;</li><li><code>NO_DRAIN_WAIT</code> — <code>old</code> bị dừng sau switch mà tổng thời gian chờ giữa hai bước dưới 1000 ms.</li></ol>',
  goiY: [['findIndex each key step once; most rules compare two indexes.', 'findIndex mỗi bước then chốt một lần; đa số luật so hai chỉ số.'], ['For the drain rule, sum the ms of wait steps strictly between the switch and the stop.', 'Với luật xả, cộng ms của các bước wait nằm hẳn giữa switch và stop.']],
  loi: [['Checking health AFTER the switch: it gates nothing — users already hit the new version.', 'Kiểm health SAU khi switch: không chặn được gì — người dùng đã chạm bản mới.'], ['docker ps | grep green as the gate: Up while every request still returns 502.', 'docker ps | grep green làm cổng: Up trong khi mọi request vẫn trả 502.']],
  gt: ['(1) The proxy holds the public port permanently; (2) start the new version alongside the old one; (3) health-check it through a real route until truly ready; (4) switch the target and reload; (5) wait, then drop the old one with the grace period of 17.3. Step 5 is exactly where method 3 let its 502 through.', '(1) Proxy giữ cổng công khai vĩnh viễn; (2) chạy bản mới song song bản cũ; (3) kiểm health qua một route thật tới khi thật sự sẵn sàng; (4) đổi đích và reload; (5) chờ, rồi bỏ bản cũ với thời gian ân hạn của 17.3. Bước 5 chính là chỗ cách 3 để lọt cái 502.'],
  kn: ['deployment', 'blue-green', 'review'],
  tns: [tn('health gate', 'cổng health check', 'the switch happens only after the new version answers')],
  dau: `/** review a deploy plan */
function checkDeployPlan(steps) {
  // Write your solution here
  const v = [];
  if (!steps.some((s) => s.do === 'health')) v.push('NO_HEALTH_GATE');
  if (!steps.some((s) => s.do === 'switch')) v.push('NO_SWITCH');
  return v;
}
`,
  giai: '// Reference solution\n' + nguon(checkDeployPlan),
  cases: [
    { goi: goi('checkDeployPlan', GOOD), moTa: ['Method 4: proxy, health gate, drain wait', 'Cách 4: proxy, cổng health, chờ xả'] },
    { goi: goi('checkDeployPlan', [{ do: 'stop', name: 'old' }, { do: 'start', name: 'new' }, { do: 'health', name: 'new', check: 'route' }]), moTa: ['Method 1: stop-then-start', 'Cách 1: stop-rồi-start'] },
    { goi: goi('checkDeployPlan', [{ do: 'start', name: 'new' }, { do: 'health', name: 'new', check: 'route' }, { do: 'switch' }, { do: 'stop', name: 'old' }]), an: true },
    { goi: goi('checkDeployPlan', [{ do: 'start', name: 'new' }, { do: 'health', name: 'new', check: 'docker-ps' }, { do: 'switch' }, { do: 'wait', ms: 400 }, { do: 'wait', ms: 700 }, { do: 'stop', name: 'old' }, { do: 'restart', name: 'proxy' }]), an: true },
    { goi: goi('checkDeployPlan', [{ do: 'start', name: 'new' }, { do: 'switch' }, { do: 'health', name: 'new', check: 'route' }, { do: 'wait', ms: 2000 }, { do: 'stop', name: 'old' }]), an: true },
  ],
});

const E4 = cs({
  ten: 'Zero downtime, step by step — and the schema change a rolling deploy needs', kho: 'EASY', phut: 5, loai: 'order',
  en: 'Two orders from lesson 17.5 (and chapter 7).',
  vi: 'Hai thứ tự của bài 17.5 (và chương 7).',
  cau: [
    ord('o1', ['Blue-green behind a proxy.', 'Blue-green sau một proxy.'], [
      'The proxy holds the public port (and is never restarted by a deploy)',
      'Start green alongside blue',
      'Health-check green through a real route until it answers',
      'Rewrite the proxy target and reload',
      'Wait ~1 s for old workers to drain, then stop blue',
    ], ['You change the destination, not the listener — like a receptionist who never goes home.', 'Bạn đổi đích đến, không đổi người nghe máy — như một lễ tân không bao giờ về nhà.']),
    ord('o2', ['Make notes.summary NOT NULL while old and new versions both run.', 'Đặt notes.summary thành NOT NULL trong khi bản cũ và bản mới cùng chạy.'], [
      'Add summary as a nullable column',
      'Deploy code that writes summary on every insert and update',
      'Backfill summary for the old rows',
      'Switch the reads to summary',
      'Make the column NOT NULL',
    ], ['Each step can be undone on its own, and at every moment both versions work against the schema that exists. NOT NULL first would break the old version, which still inserts rows without summary.', 'Mỗi bước tự hoàn tác được, và ở mọi thời điểm cả hai phiên bản đều chạy được trên lược đồ đang có. NOT NULL trước sẽ làm hỏng bản cũ, vốn vẫn chèn dòng không có summary.']),
  ],
  goiY: [['Something long-lived must own the address.', 'Phải có thứ sống lâu giữ địa chỉ.'], ['Every intermediate state must work for both versions.', 'Mọi trạng thái trung gian phải chạy được cho cả hai phiên bản.']],
  loi: [['Stopping blue before green is healthy.', 'Dừng blue trước khi green healthy.'], ['NOT NULL in the same migration that adds the column.', 'NOT NULL ngay trong migration thêm cột.']],
  tns: [tn('expand / contract', 'mở rộng / thu hẹp', 'additive migration first, removal last')],
  kn: ['deployment', 'migrations'],
});

const E5 = cs({
  ten: 'Blue-green, rolling, canary, recreate', kho: 'MEDIUM', phut: 5, loai: 'table',
  en: 'Match each property to the strategy.',
  vi: 'Ghép mỗi tính chất với chiến lược.',
  bang: [bang1('b1', ['Which strategy?', 'Chiến lược nào?'], [{ ma: 'x', ten: 'Property' }, { ma: 's', ten: 'Strategy', luaChon: ['blue-green', 'rolling', 'canary', 'recreate'] }], [
    { o: { x: 'Two full versions, switch all at once, instant rollback by switching back' }, a: { s: 'blue-green' } },
    { o: { x: 'Replace one replica at a time, a little extra capacity' }, a: { s: 'rolling' } },
    { o: { x: '5% of traffic first, watch the metrics of chapter 15, then the rest' }, a: { s: 'canary' } },
    { o: { x: 'Stop all, start all — the 5.3% of method 1' }, a: { s: 'recreate' } },
    { o: { x: 'The safest, and the most infrastructure' }, a: { s: 'canary' } },
  ], ['Rolling and canary both run two versions against one database for a while, so every schema change must stay backward compatible. Recreate is what a single docker compose service does by default.', 'Rolling và canary đều chạy hai phiên bản trên một CSDL trong một lúc, nên mọi thay đổi lược đồ phải tương thích ngược. Recreate là điều một service docker compose đơn lẻ làm theo mặc định.'])],
  goiY: [['How many versions run at the same time, and for how much traffic?', 'Bao nhiêu phiên bản chạy cùng lúc, và cho bao nhiêu lưu lượng?'], ['Canary needs metrics to decide.', 'Canary cần metric để quyết định.']],
  loi: [['Calling compose recreate “rolling”.', 'Gọi recreate của compose là “rolling”.'], ['Rolling with a destructive migration.', 'Rolling với một migration phá huỷ.']],
  tns: [tn('canary', 'canary', 'a small share of traffic first')],
  kn: ['deployment'],
});

export default modul('nodejs-17-5-deploy-khong-gian-doan', '17.5 Zero-downtime deploys, measured', [E1, E4, E5, E2, E3]);
