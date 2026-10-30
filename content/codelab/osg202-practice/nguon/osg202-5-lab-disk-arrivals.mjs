/**
 * OSG202 · LAB chương 5 — Lập lịch đĩa với yêu cầu đến theo thời gian (FCFS · SSTF · LOOK động).
 */
import { doiDau, KHOA, bi, tab, jsDe } from './_os.mjs';

const SRC = `function serve(algo, head, reqs, dir) {
  var pos = head, t = 0, total = 0, done = {}, order = [], wait = {}, n = reqs.length, left = n;
  while (left > 0) {
    var ready = [], i;
    for (i = 0; i < n; i++) if (!done[reqs[i].id] && reqs[i].at <= t) ready.push(i);
    if (!ready.length) {
      var nx = Infinity;
      for (i = 0; i < n; i++) if (!done[reqs[i].id] && reqs[i].at < nx) nx = reqs[i].at;
      t = nx; continue;
    }
    var pick = -1;
    if (algo === 'FCFS') {
      pick = ready.slice().sort(function (a, b) { return reqs[a].at - reqs[b].at || a - b; })[0];
    } else if (algo === 'SSTF') {
      pick = ready.slice().sort(function (a, b) { return Math.abs(reqs[a].cyl - pos) - Math.abs(reqs[b].cyl - pos) || reqs[a].at - reqs[b].at || a - b; })[0];
    } else {
      var ahead = ready.filter(function (k) { return dir === 'up' ? reqs[k].cyl >= pos : reqs[k].cyl <= pos; });
      if (!ahead.length) { dir = dir === 'up' ? 'down' : 'up'; ahead = ready; }
      pick = ahead.slice().sort(function (a, b) { return Math.abs(reqs[a].cyl - pos) - Math.abs(reqs[b].cyl - pos) || a - b; })[0];
    }
    var d = Math.abs(reqs[pick].cyl - pos);
    t += d; total += d; pos = reqs[pick].cyl;
    done[reqs[pick].id] = true; left--; order.push(reqs[pick].id);
    wait[reqs[pick].id] = t - reqs[pick].at;
  }
  var s = 0;
  for (var k in wait) s += wait[k];
  return { order: order, total: total, avgWait: Math.round((s / n) * 100) / 100, wait: wait };
}
`;
const serve = new Function(`${SRC}; return serve;`)();
const R1 = [{ id: 'a', at: 0, cyl: 60 }, { id: 'b', at: 0, cyl: 10 }, { id: 'c', at: 5, cyl: 55 }, { id: 'd', at: 20, cyl: 90 }, { id: 'e', at: 30, cyl: 20 }];
const R2 = [{ id: 'r1', at: 0, cyl: 100 }, { id: 'r2', at: 1, cyl: 20 }, { id: 'r3', at: 2, cyl: 95 }, { id: 'r4', at: 3, cyl: 105 }, { id: 'r5', at: 50, cyl: 30 }];
const R3 = [{ id: 'x', at: 40, cyl: 5 }, { id: 'y', at: 40, cyl: 5 }, { id: 'z', at: 0, cyl: 70 }];
const R4 = [{ id: 'p', at: 0, cyl: 50 }, { id: 'q', at: 0, cyl: 40 }, { id: 'r', at: 0, cyl: 60 }, { id: 's', at: 15, cyl: 45 }, { id: 't', at: 15, cyl: 65 }];

const LAB = jsDe({
  tieuDe: 'Lab 5 — Disk scheduler with requests arriving over time',
  doKho: 'HARD', phut: 45, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> Real requests do not all wait in the queue at t = 0. Write <code>serve(algo, head, reqs, dir)</code>, a disk scheduler that decides what to do <i>whenever the head is free</i>. <code>reqs</code> is an array of <code>{ id, at, cyl }</code> (arrival time, cylinder). Moving the head one cylinder takes 1 time unit; servicing a request itself takes 0 time. The clock starts at 0; if no request has arrived, the clock jumps to the next arrival.</p>
<ul>
<li><code>'FCFS'</code>: the ready request with the earliest arrival (ties: lower array index).</li>
<li><code>'SSTF'</code>: the ready request closest to the head (ties: earlier arrival, then lower index).</li>
<li><code>'LOOK'</code>: keep moving in direction <code>dir</code> (<code>'up'</code> = toward higher cylinders; a request on the head’s cylinder counts as ahead): choose the nearest ready request ahead (tie: lower index); if none is ahead, reverse the direction and then pick the nearest ready request.</li>
</ul>
<p>“Ready” = arrived by the current time and not yet served. Return <code>{ order, total, avgWait, wait }</code>: the ids in service order, the total head movement, the average waiting time (completion time − arrival time of each request; round to 2 decimals) and the object of waiting times per id.</p>
<h4>Workload 1</h4>${tab(['id', 'arrival', 'cylinder'], R1.map((r) => [r.id, r.at, r.cyl]))}`,
    `<p><b>Tình huống.</b> Yêu cầu thật không nằm sẵn hết trong hàng đợi lúc t = 0. Viết <code>serve(algo, head, reqs, dir)</code>, bộ lập lịch đĩa quyết định <i>mỗi khi đầu đọc rảnh</i>. <code>reqs</code> là mảng <code>{ id, at, cyl }</code> (thời điểm đến, cylinder). Di chuyển đầu đọc một cylinder mất 1 đơn vị thời gian; phục vụ bản thân yêu cầu mất 0. Đồng hồ bắt đầu ở 0; nếu chưa có yêu cầu nào đến thì nhảy tới lần đến kế tiếp.</p>
<ul>
<li><code>'FCFS'</code>: yêu cầu sẵn sàng đến sớm nhất (hoà: chỉ số mảng nhỏ hơn).</li>
<li><code>'SSTF'</code>: yêu cầu sẵn sàng gần đầu đọc nhất (hoà: đến sớm hơn, rồi chỉ số nhỏ hơn).</li>
<li><code>'LOOK'</code>: giữ chiều <code>dir</code> (<code>'up'</code> = về cylinder cao; yêu cầu ở ngay cylinder của đầu đọc coi là phía trước): chọn yêu cầu sẵn sàng gần nhất ở phía trước (hoà: chỉ số nhỏ); nếu không có thì đảo chiều rồi chọn yêu cầu sẵn sàng gần nhất.</li>
</ul>
<p>“Sẵn sàng” = đã đến tại thời điểm hiện tại và chưa được phục vụ. Trả <code>{ order, total, avgWait, wait }</code>: id theo thứ tự phục vụ, tổng quãng đầu đọc, thời gian chờ trung bình (thời điểm hoàn thành − thời điểm đến của từng yêu cầu; làm tròn 2 chữ số) và đối tượng thời gian chờ theo id.</p>
<h4>Tải 1</h4>${tab(['id', 'arrival', 'cylinder'], R1.map((r) => [r.id, r.at, r.cyl]))}`),
  yeuCau: [bi('Do not modify <code>reqs</code>.', 'Không sửa <code>reqs</code>.')],
  viDu: [{ input: "serve('SSTF', 50, [{id:'a',at:0,cyl:60},{id:'b',at:0,cyl:10}], 'up').order", output: JSON.stringify(serve('SSTF', 50, [{ id: 'a', at: 0, cyl: 60 }, { id: 'b', at: 0, cyl: 10 }], 'up').order), explanation: '60 is 10 away, 10 is 40 away.|||60 cách 10, 10 cách 40.' }],
  goiY: ['The main loop is “find the ready set; if empty advance the clock; else pick by policy; move; update clock”.', 'Keep the list of served ids in an object so that you never serve a request twice.', 'For LOOK, flip dir permanently when nothing is ahead.'],
  loiHayGap: ['Treating future arrivals as ready.', 'Forgetting that time advances by the distance moved (waiting times depend on it).', 'Not flipping the LOOK direction permanently.'],
  giaiThich: '<p>This is what a real elevator-style scheduler does: a decision every time the head becomes free, using only requests that have arrived. SSTF’s starvation and LOOK’s fairness show up in the waiting times.</p>',
  khaiNiem: ['disk scheduling', 'dynamic arrivals'],
  fn: 'serve',
  tep: 'answer.js',
  dau: "function serve(algo, head, reqs, dir) {\n  return { order: [], total: 0, avgWait: 0, wait: {} };\n}\n",
  giaiMa: SRC,
  ref: serve,
  cases: [{ args: ['FCFS', 50, R1, 'up'] }, { args: ['SSTF', 50, R1, 'up'] }, { args: ['LOOK', 50, R1, 'up'] }, { args: ['LOOK', 100, R2, 'down'] }, { args: ['SSTF', 100, R2, 'up'], an: true }, { args: ['FCFS', 0, R3, 'up'], an: true }, { args: ['LOOK', 0, R4, 'up'], an: true }, { args: ['SSTF', 50, R4, 'down'], an: true }],
});

export default doiDau({
  slug: 'osg202-5-lab-disk-arrivals',
  ten: 'Lab 5 — Disk scheduler with requests arriving over time',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch5',
  de: [LAB],
});
