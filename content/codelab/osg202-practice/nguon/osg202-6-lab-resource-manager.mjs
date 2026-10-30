/**
 * OSG202 · LAB chương 6 — Bộ quản lý tài nguyên tránh deadlock (Banker + hàng đợi chờ).
 */
import { doiDau, KHOA, bi, jsDe } from './_os.mjs';

const SRC = `function manager(avail, max, events) {
  var n = max.length, m = avail.length, log = [], queue = [], i, j;
  var avl = avail.slice();
  var alloc = max.map(function () { return avail.map(function () { return 0; }); });
  function safe(a, al) {
    var work = a.slice(), fin = max.map(function () { return false; }), progress = true;
    while (progress) {
      progress = false;
      for (var p = 0; p < n; p++) {
        if (fin[p]) continue;
        var ok = true;
        for (var r = 0; r < m; r++) if (max[p][r] - al[p][r] > work[r]) { ok = false; break; }
        if (ok) { for (var r2 = 0; r2 < m; r2++) work[r2] += al[p][r2]; fin[p] = true; progress = true; }
      }
    }
    return fin.every(function (x) { return x; });
  }
  function decide(p, req) {
    for (var r = 0; r < m; r++) if (alloc[p][r] + req[r] > max[p][r]) return 'DENY';
    for (var r2 = 0; r2 < m; r2++) if (req[r2] > avl[r2]) return 'WAIT';
    var a2 = avl.map(function (v, k) { return v - req[k]; });
    var al2 = alloc.map(function (row, q) { return q === p ? row.map(function (v, k) { return v + req[k]; }) : row.slice(); });
    return safe(a2, al2) ? 'GRANT' : 'UNSAFE';
  }
  function apply(p, req) {
    for (var r = 0; r < m; r++) { alloc[p][r] += req[r]; avl[r] -= req[r]; }
  }
  events.forEach(function (ev, idx) {
    var p = ev.p;
    if (ev.op === 'request') {
      var d = decide(p, ev.v);
      if (d === 'GRANT') { apply(p, ev.v); log.push(idx + ': P' + p + ' GRANT'); }
      else if (d === 'DENY') log.push(idx + ': P' + p + ' DENY');
      else { queue.push({ p: p, v: ev.v }); log.push(idx + ': P' + p + ' QUEUED'); }
    } else {
      var okRel = true;
      for (j = 0; j < m; j++) if (ev.v[j] > alloc[p][j]) okRel = false;
      if (!okRel) { log.push(idx + ': P' + p + ' ERROR'); return; }
      for (j = 0; j < m; j++) { alloc[p][j] -= ev.v[j]; avl[j] += ev.v[j]; }
      log.push(idx + ': P' + p + ' RELEASE');
      var rest = [];
      queue.forEach(function (q) {
        if (decide(q.p, q.v) === 'GRANT') { apply(q.p, q.v); log.push(idx + ': P' + q.p + ' GRANT (queued)'); }
        else rest.push(q);
      });
      queue = rest;
    }
  });
  return { log: log, avail: avl, alloc: alloc, waiting: queue.map(function (q) { return q.p; }) };
}
`;
const manager = new Function(`${SRC}; return manager;`)();
const rq = (p, ...v) => ({ op: 'request', p, v });
const rl = (p, ...v) => ({ op: 'release', p, v });
const MAX1 = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
const AV1 = [10, 5, 7];
const E1 = [rq(1, 2, 0, 0), rq(0, 0, 1, 0), rq(2, 3, 0, 2), rq(1, 1, 2, 2), rq(3, 2, 1, 1), rq(4, 0, 0, 2), rq(0, 7, 4, 3), rq(1, 3, 2, 2), rl(1, 3, 2, 2), rl(3, 2, 1, 1), rl(2, 3, 0, 2), rl(4, 0, 0, 2)];
const MAX2 = [[3, 3], [3, 3]];
const AV2 = [4, 4];
const E2 = [rq(0, 2, 2), rq(1, 2, 2), rq(0, 1, 1), rq(1, 1, 1), rl(0, 2, 2), rl(0, 5, 5), rl(1, 2, 2)];
const MAX3 = [[2], [2], [2]];
const AV3 = [3];
const E3 = [rq(0, 1), rq(1, 1), rq(2, 1), rq(0, 1), rq(1, 1), rl(2, 1), rl(0, 2), rl(1, 2)];

const LAB = jsDe({
  tieuDe: 'Lab 6 — A deadlock-avoiding resource manager',
  doKho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> Combine the Banker’s algorithm with a waiting queue to build the resource manager of a small OS. Write <code>manager(avail, max, events)</code>. <code>avail</code> is the total number of units of each resource type at the start (nothing is allocated yet); <code>max[p][r]</code> is the declared maximum of process p; <code>events</code> is an array of <code>{ op: 'request'|'release', p, v }</code> (<code>v</code> = vector of units).</p>
<ul>
<li><b>request</b>: <code>DENY</code> if the process would exceed its maximum (allocation + request &gt; max); otherwise if the request is not available now, or granting it would leave an UNSAFE state (use the safety algorithm: repeatedly finish any unfinished process, scanning from index 0, whose Need ≤ Work), the request is <b>queued</b> (FIFO); otherwise it is <code>GRANT</code>ed at once.</li>
<li><b>release</b>: if the process holds less than <code>v</code> in some type the event is an <code>ERROR</code> (nothing changes). Otherwise the units return to the pool, and then the queue is scanned ONCE in FIFO order: each queued request that is now safely grantable is granted (and removed); the others stay.</li>
</ul>
<p>Log format, one line per outcome: <code>'idx: P{p} GRANT'</code>, <code>'idx: P{p} DENY'</code>, <code>'idx: P{p} QUEUED'</code>, <code>'idx: P{p} RELEASE'</code>, <code>'idx: P{p} ERROR'</code>, and for requests granted from the queue during event idx: <code>'idx: P{q} GRANT (queued)'</code>. Return <code>{ log, avail, alloc, waiting }</code>: the log, the final available vector, the final allocation matrix and the list of process ids that still have a queued request (in queue order).</p>`,
    `<p><b>Tình huống.</b> Kết hợp thuật toán nhà băng với hàng đợi chờ để dựng bộ quản lý tài nguyên của một OS nhỏ. Viết <code>manager(avail, max, events)</code>. <code>avail</code> là tổng số đơn vị mỗi loại tài nguyên lúc đầu (chưa cấp gì); <code>max[p][r]</code> là nhu cầu tối đa khai báo của tiến trình p; <code>events</code> là mảng <code>{ op: 'request'|'release', p, v }</code> (<code>v</code> = vector số đơn vị).</p>
<ul>
<li><b>request</b>: <code>DENY</code> nếu tiến trình vượt tối đa (đã cấp + yêu cầu &gt; max); nếu không, khi hiện chưa đủ tài nguyên hoặc cấp xong sẽ dẫn tới trạng thái KHÔNG an toàn (dùng thuật toán an toàn: lặp lại việc cho xong tiến trình chưa xong đầu tiên, quét từ chỉ số 0, có Need ≤ Work), yêu cầu được <b>xếp hàng</b> (FIFO); còn lại thì <code>GRANT</code> ngay.</li>
<li><b>release</b>: nếu tiến trình đang giữ ít hơn <code>v</code> ở loại nào đó thì sự kiện là <code>ERROR</code> (không đổi gì). Ngược lại các đơn vị trả về kho, rồi hàng đợi được quét MỘT LẦN theo thứ tự FIFO: mỗi yêu cầu trong hàng giờ cấp được an toàn thì được cấp (và bị xoá khỏi hàng); các yêu cầu khác ở lại.</li>
</ul>
<p>Định dạng log, mỗi kết quả một dòng: <code>'idx: P{p} GRANT'</code>, <code>'idx: P{p} DENY'</code>, <code>'idx: P{p} QUEUED'</code>, <code>'idx: P{p} RELEASE'</code>, <code>'idx: P{p} ERROR'</code>, và với yêu cầu được cấp từ hàng đợi trong sự kiện idx: <code>'idx: P{q} GRANT (queued)'</code>. Trả <code>{ log, avail, alloc, waiting }</code>: log, vector available cuối, ma trận allocation cuối và danh sách id tiến trình còn yêu cầu trong hàng (theo thứ tự hàng).</p>`),
  yeuCau: [bi('A process with a queued request issues no more requests in the test data.', 'Trong dữ liệu kiểm, tiến trình có yêu cầu trong hàng không gửi thêm yêu cầu.')],
  viDu: [{ input: 'manager([4,4], [[3,3],[3,3]], events).log', output: JSON.stringify(manager(AV2, MAX2, E2).log), explanation: 'P1’s second request is queued because granting it would be unsafe; it is granted after P0 releases.|||Yêu cầu thứ hai của P1 bị xếp hàng vì cấp sẽ không an toàn; được cấp sau khi P0 trả.' }],
  goiY: ['Write decide(p, req) first: it returns DENY, WAIT, UNSAFE or GRANT without changing state.', 'Make safe(avail, alloc) a separate function working on COPIES.', 'After a release, retry the queue in order and rebuild it with the requests that stayed.'],
  loiHayGap: ['Changing the state while testing safety (the test must be on copies).', 'Letting a queued request jump the queue when an unrelated request arrives.', 'Forgetting that DENY is decided before checking availability.'],
  giaiThich: '<p>This is deadlock avoidance as a real subsystem: the safety check decides whether a grant is wise, the queue turns refusals into waiting, and releases wake the waiters. Compare with the exam’s one-shot “is the state safe?” questions.</p>',
  khaiNiem: ['banker algorithm', 'resource manager', 'waiting queue'],
  fn: 'manager',
  tep: 'answer.js',
  dau: "function manager(avail, max, events) {\n  return { log: [], avail: avail.slice(), alloc: [], waiting: [] };\n}\n",
  giaiMa: SRC,
  ref: manager,
  cases: [{ args: [AV2, MAX2, E2] }, { args: [AV1, MAX1, E1] }, { args: [AV3, MAX3, E3] }, { args: [[3, 3, 2], MAX1, [rq(1, 1, 0, 2), rq(4, 3, 3, 0), rq(0, 0, 2, 0), rq(2, 6, 0, 0), rl(1, 1, 0, 2), rl(0, 9, 9, 9)]], an: true }, { args: [[2], [[2], [2]], [rq(0, 1), rq(1, 1), rq(0, 1), rl(0, 1), rl(1, 1)]], an: true }],
});

export default doiDau({
  slug: 'osg202-6-lab-resource-manager',
  ten: 'Lab 6 — A deadlock-avoiding resource manager',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch6',
  de: [LAB],
});
