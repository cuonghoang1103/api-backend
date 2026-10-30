/**
 * OSG202 · 5.2 — Disk scheduling, calculated: FCFS · SSTF · SCAN · C-SCAN · LOOK · C-LOOK. Đáp án do S.disk tính
 * (đã kiểm với ví dụ Silberschatz: FCFS 640, SSTF 236, SCAN 236, LOOK 208).
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, dat, mc, tn, xoay } from './_os.mjs';

const CONV = 'The disk has cylinders 0 … 199. SCAN and C-SCAN go all the way to the edge of the disk; LOOK and C-LOOK turn at the last request. The return jump of C-SCAN / C-LOOK counts as head movement. The head only moves toward requests: if no request lies behind the head, SCAN / C-SCAN do not travel to the edge.';
const CONV_VI = 'Đĩa có cylinder 0 … 199. SCAN và C-SCAN chạy tới mép đĩa; LOOK và C-LOOK quay đầu ở yêu cầu cuối. Bước nhảy về của C-SCAN / C-LOOK tính vào quãng di chuyển. Đầu đọc chỉ di chuyển về phía yêu cầu: nếu phía sau đầu đọc không còn yêu cầu thì SCAN / C-SCAN không chạy tới mép.';
const Q = [82, 170, 43, 140, 24, 16, 190];
const H = 50;

const AL1 = ['FCFS', 'SSTF'];
const E1 = tinh({
  tieuDe: 'Disk 1 — FCFS and SSTF: service order and total head movement',
  doKho: 'EASY', phut: 10,
  moTa: bi(`<p>Head at cylinder <b>${H}</b>. Pending requests (arrival order): <code>${Q.join(' ')}</code>. Give the total head movement in cylinders for FCFS and for SSTF (shortest seek time first; ties: the earlier request).</p><p>${CONV}</p>`,
    `<p>Đầu đọc ở cylinder <b>${H}</b>. Yêu cầu chờ (theo thứ tự đến): <code>${Q.join(' ')}</code>. Cho tổng quãng di chuyển đầu đọc (cylinder) của FCFS và SSTF (ưu tiên seek ngắn nhất; hoà: yêu cầu đến trước).</p><p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Total movement', 'Tổng quãng đường'),
    cot: [{ ma: 'a', ten: 'Algorithm' }, { ma: 't', ten: 'Total cylinders' }],
    hang: AL1.map((a) => ({ ma: a, o: { a } })),
    dapAn: Object.fromEntries(AL1.map((a) => [`${a}.t`, String(S.disk(a, H, Q, 'up', 199).total)])),
    giaiThich: giai(AL1.map((a) => { const r = S.disk(a, H, Q, 'up', 199); return `${a}: ${[H, ...r.order].join(' → ')} = ${r.total}`; }).join('; ') + '.', AL1.map((a) => { const r = S.disk(a, H, Q, 'up', 199); return `${a}: ${[H, ...r.order].join(' → ')} = ${r.total}`; }).join('; ') + '.'),
  }],
  goiY: ['Sum the absolute differences between consecutive cylinders, starting at the head position.', 'SSTF always picks the nearest remaining request.'],
  loiHayGap: ['Forgetting the first move from the initial head position.', 'In SSTF recomputing distances from the wrong position.'],
  giaiThich: '<p>' + AL1.map((a) => `${a} = ${S.disk(a, H, Q, 'up', 199).total}`).join(' · ') + '</p>',
  thuatNgu: [tn('head movement', 'quãng di chuyển đầu đọc'), tn('SSTF', 'seek ngắn nhất trước')],
  khaiNiem: ['FCFS', 'SSTF', 'disk scheduling'],
});

const AL2 = ['SCAN', 'CSCAN', 'LOOK', 'CLOOK'];
const NM = { SCAN: 'SCAN', CSCAN: 'C-SCAN', LOOK: 'LOOK', CLOOK: 'C-LOOK' };
const E2 = tinh({
  tieuDe: 'Disk 2 — SCAN, C-SCAN, LOOK, C-LOOK: total head movement',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Same queue: head at <b>${H}</b>, requests <code>${Q.join(' ')}</code>. The head is first moving toward <b>higher</b> cylinders. Compute the total head movement.</p><p>${CONV}</p>`,
    `<p>Cùng hàng đợi: đầu ở <b>${H}</b>, yêu cầu <code>${Q.join(' ')}</code>. Đầu đọc đang di chuyển về phía cylinder <b>cao hơn</b>. Tính tổng quãng di chuyển.</p><p>${CONV_VI}</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Total movement (moving up first)', 'Tổng quãng (đi lên trước)'),
    cot: [{ ma: 'a', ten: 'Algorithm' }, { ma: 't', ten: 'Total cylinders' }],
    hang: AL2.map((a) => ({ ma: a, o: { a: NM[a] } })),
    dapAn: Object.fromEntries(AL2.map((a) => [`${a}.t`, String(S.disk(a, H, Q, 'up', 199).total)])),
    giaiThich: giai(AL2.map((a) => { const r = S.disk(a, H, Q, 'up', 199); return `${NM[a]}: ${r.total}`; }).join('; ') + '. The “look” variants save the trip to the edge; the circular variants pay for the return jump but give uniform waiting times.', AL2.map((a) => { const r = S.disk(a, H, Q, 'up', 199); return `${NM[a]}: ${r.total}`; }).join('; ') + '. Biến thể “look” khỏi phải chạy tới mép; biến thể vòng trả giá cho bước nhảy về nhưng thời gian chờ đều hơn.'),
  }],
  goiY: ['SCAN up: 50 → highest request → edge 199 → then down to the lowest request.', 'C-SCAN: after the edge jump to 0 and continue upward.'],
  loiHayGap: ['Forgetting to go to the disk edge in SCAN / C-SCAN.', 'Not counting the return jump in the circular algorithms (the statement says to count it).'],
  giaiThich: '<p>' + AL2.map((a) => `${NM[a]} = ${S.disk(a, H, Q, 'up', 199).total}`).join(' · ') + '</p>',
  thuatNgu: [tn('elevator algorithm', 'thuật toán thang máy = SCAN'), tn('C-SCAN', 'SCAN vòng: chỉ phục vụ một chiều')],
  khaiNiem: ['SCAN', 'C-SCAN', 'LOOK'],
});

const sstf = S.disk('SSTF', H, Q, 'up', 199);
const E3 = tinh({
  tieuDe: 'Disk 3 — Order the requests as SSTF serves them',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi(`<p>Head at ${H}; requests <code>${Q.join(' ')}</code>. Put them in the order in which SSTF serves them.</p>`, `<p>Đầu ở ${H}; yêu cầu <code>${Q.join(' ')}</code>. Xếp chúng theo thứ tự SSTF phục vụ.</p>`),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('SSTF service order', 'Thứ tự phục vụ SSTF'),
    muc: xoay(sstf.order.map((c) => ({ ma: `c${c}`, noiDung: String(c) })), 3), dapAn: sstf.order.map((c) => `c${c}`),
    giaiThich: giai(`${[H, ...sstf.order].join(' → ')} (total ${sstf.total}). Notice how the head drifts to one side first: far requests such as 190 wait last (starvation risk).`, `${[H, ...sstf.order].join(' → ')} (tổng ${sstf.total}). Đầu đọc trôi về một phía trước: yêu cầu xa như 190 bị chờ lâu nhất (nguy cơ đói).`),
  }],
  goiY: ['From the current head position always take the closest unserved cylinder.', 'After each step the head position changes.'],
  loiHayGap: ['Measuring all distances from the ORIGINAL head position.', 'Sorting the requests numerically (that is not SSTF).'],
  giaiThich: '<p>' + sstf.order.join(' → ') + '</p>',
  thuatNgu: [tn('starvation', 'đói: yêu cầu xa chờ mãi')],
  khaiNiem: ['SSTF'],
});

const scn = S.disk('SCAN', H, Q, 'down', 199);
const E4 = tinh({
  tieuDe: 'Disk 4 — Order the requests as SCAN serves them (moving down first)',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi(`<p>Head at ${H}, currently moving toward cylinder 0. Requests <code>${Q.join(' ')}</code>. Put them in SCAN service order.</p>`, `<p>Đầu ở ${H}, đang chạy về phía cylinder 0. Yêu cầu <code>${Q.join(' ')}</code>. Xếp theo thứ tự SCAN phục vụ.</p>`),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('SCAN order (down first)', 'Thứ tự SCAN (đi xuống trước)'),
    muc: xoay(scn.order.map((c) => ({ ma: `c${c}`, noiDung: String(c) })), 2), dapAn: scn.order.map((c) => `c${c}`),
    giaiThich: giai(`Down: ${scn.order.filter((c) => c < H).join(', ')}; the head goes to cylinder 0, reverses, then up: ${scn.order.filter((c) => c > H).join(', ')}. Total movement ${scn.total} cylinders.`, `Đi xuống: ${scn.order.filter((c) => c < H).join(', ')}; đầu chạy tới cylinder 0, đảo chiều rồi đi lên: ${scn.order.filter((c) => c > H).join(', ')}. Tổng ${scn.total} cylinder.`),
  }],
  goiY: ['All requests below the head are served in decreasing order, then the direction reverses.', 'SCAN only reverses at the edge of the disk.'],
  loiHayGap: ['Serving the lower requests in increasing order.', 'Reversing at the lowest request (that is LOOK).'],
  giaiThich: '<p>' + scn.order.join(' → ') + `; total ${scn.total}.</p>`,
  thuatNgu: [tn('direction of travel', 'chiều di chuyển hiện tại của đầu đọc')],
  khaiNiem: ['SCAN'],
});

const E5 = tinh({
  tieuDe: 'Disk 5 — Which algorithm for which workload?',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Five questions on the properties of disk-scheduling algorithms.</p>', '<p>Năm câu về tính chất của các thuật toán lập lịch đĩa.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which algorithm can starve requests far from the head?', 'Thuật toán nào có thể làm đói các yêu cầu ở xa đầu đọc?'], [['a', 'SSTF'], ['b', 'SCAN'], ['c', 'C-SCAN'], ['d', 'FCFS']], 'a', ['If new requests keep arriving near the head, SSTF never goes to the far ones.', 'Nếu yêu cầu mới liên tục đến gần đầu đọc, SSTF không bao giờ tới những yêu cầu xa.']),
    mc('c2', ['Which algorithm gives the most uniform waiting time?', 'Thuật toán nào cho thời gian chờ đồng đều nhất?'], [['a', 'C-SCAN'], ['b', 'SSTF'], ['c', 'SCAN'], ['d', 'LOOK']], 'a', ['C-SCAN treats cylinders as a circular list: every request waits for at most one sweep.', 'C-SCAN coi cylinder như danh sách vòng: mọi yêu cầu chờ tối đa một lượt quét.']),
    mc('c3', ['Under a very heavy load, which choice is usually best?', 'Khi tải rất nặng, lựa chọn nào thường tốt nhất?'], [['a', 'SCAN or C-SCAN'], ['b', 'FCFS'], ['c', 'Random order'], ['d', 'Always the shortest request']], 'a', ['Sweep-based algorithms bound the waiting time and keep the head moving efficiently.', 'Thuật toán quét giới hạn thời gian chờ và giữ đầu đọc di chuyển hiệu quả.']),
    mc('c4', ['Why does disk scheduling matter much less for an SSD?', 'Vì sao lập lịch đĩa ít quan trọng hơn nhiều với SSD?'], [['a', 'There is no mechanical seek or rotation'], ['b', 'SSDs have no queue of pending requests'], ['c', 'SSDs are slower than any scheduler'], ['d', 'The OS cannot see the queue of an SSD']], 'a', ['Seek and rotational delay are what these algorithms reduce.', 'Seek và độ trễ quay chính là thứ các thuật toán này giảm.']),
    mc('c5', ['When the queue holds a single request, all disk-scheduling algorithms …', 'Khi hàng đợi chỉ có một yêu cầu, mọi thuật toán lập lịch đĩa …'], [['a', 'behave the same'], ['b', 'differ greatly'], ['c', 'cannot run'], ['d', 'need a head reset']], 'a', ['Scheduling only helps when several requests are pending.', 'Lập lịch chỉ có lợi khi có nhiều yêu cầu chờ.']),
  ],
  goiY: ['Think about who can be forgotten: far requests under SSTF.', 'A circular list gives every cylinder the same maximum wait.'],
  loiHayGap: ['Thinking FCFS can starve requests (it is fair, just slow).', 'Thinking SCAN serves the middle cylinders twice as often by accident (it is true that they are visited more often than the edges).'],
  thuatNgu: [tn('elevator', 'thang máy: SCAN')],
  khaiNiem: ['disk scheduling properties'],
});

const refD = (a, h, r, d, m) => S.disk(a, h, r, d, m);
const E6 = jsDe({
  tieuDe: 'Disk 6 — Write a disk-scheduling simulator',
  doKho: 'HARD', phut: 30,
  moTa: bi(`<p>Write <code>schedule(algo, head, requests, dir, maxCyl)</code> for <code>algo</code> ∈ <code>'FCFS'</code>, <code>'SSTF'</code>, <code>'SCAN'</code>, <code>'CSCAN'</code>, <code>'LOOK'</code>, <code>'CLOOK'</code>. <code>dir</code> is <code>'up'</code> or <code>'down'</code> (the initial direction), cylinders are <code>0 … maxCyl</code>. Return <code>{ order, total }</code>: <code>order</code> = the requests in the order they are served (the edge of the disk is not a request), <code>total</code> = total head movement. ${CONV} For C-SCAN / C-LOOK going <code>down</code>: serve downward, then jump (edge-to-edge for C-SCAN: first to 0, then to <code>maxCyl</code>; for C-LOOK straight to the highest request) and continue downward from the top. SSTF ties: the earlier request in the list.</p>`,
    `<p>Viết <code>schedule(algo, head, requests, dir, maxCyl)</code> với <code>algo</code> ∈ <code>'FCFS'</code>, <code>'SSTF'</code>, <code>'SCAN'</code>, <code>'CSCAN'</code>, <code>'LOOK'</code>, <code>'CLOOK'</code>. <code>dir</code> là <code>'up'</code> hoặc <code>'down'</code> (chiều ban đầu), cylinder từ <code>0 … maxCyl</code>. Trả <code>{ order, total }</code>: <code>order</code> = các yêu cầu theo thứ tự được phục vụ (mép đĩa không phải yêu cầu), <code>total</code> = tổng quãng di chuyển. ${CONV_VI} Với C-SCAN / C-LOOK đi <code>down</code>: phục vụ đi xuống rồi nhảy (C-SCAN: về 0 rồi tới <code>maxCyl</code>; C-LOOK: thẳng tới yêu cầu cao nhất) và tiếp tục đi xuống từ trên cao. SSTF hoà: yêu cầu đứng trước trong danh sách.</p>`),
  yeuCau: [bi('Do not modify the <code>requests</code> array.', 'Không sửa mảng <code>requests</code>.')],
  viDu: [{ input: 'schedule(\'LOOK\', 53, [98,183,37,122,14,124,65,67], \'down\', 199)', output: JSON.stringify(refD('LOOK', 53, [98, 183, 37, 122, 14, 124, 65, 67], 'down', 199)), explanation: 'Silberschatz example: 208 cylinders.|||Ví dụ Silberschatz: 208 cylinder.' }],
  goiY: ['Split the requests into those ≥ head and those < head, sort both.', 'Write a tiny helper move(to) that adds |to − pos| to the total and sets pos.'],
  loiHayGap: ['Counting requests equal to the head position twice or skipping them.', 'Forgetting the edge in SCAN and C-SCAN.'],
  giaiThich: '<p>All six algorithms are variations of “sort, split at the head, sweep, optionally touch the edge and jump”.</p>',
  khaiNiem: ['disk scheduling', 'simulation'],
  fn: 'schedule',
  dau: "function schedule(algo, head, requests, dir, maxCyl) {\n  return { order: [], total: 0 };\n}\n",
  giaiMa: '// move(to) accumulates the head travel; each algorithm decides the visiting order.\n' + dat(S.disk, 'schedule'),
  ref: refD,
  cases: [
    { args: ['FCFS', 53, [98, 183, 37, 122, 14, 124, 65, 67], 'up', 199] }, { args: ['SSTF', 53, [98, 183, 37, 122, 14, 124, 65, 67], 'up', 199] },
    { args: ['SCAN', 53, [98, 183, 37, 122, 14, 124, 65, 67], 'down', 199] }, { args: ['LOOK', 53, [98, 183, 37, 122, 14, 124, 65, 67], 'down', 199] },
    { args: ['CSCAN', 53, [98, 183, 37, 122, 14, 124, 65, 67], 'up', 199] }, { args: ['CLOOK', 50, Q, 'up', 199] },
    { args: ['SCAN', H, Q, 'up', 199], an: true }, { args: ['CSCAN', H, Q, 'down', 199], an: true }, { args: ['CLOOK', H, Q, 'down', 199], an: true },
    { args: ['LOOK', 100, [100, 120, 80], 'up', 199], an: true }, { args: ['SSTF', 10, [], 'up', 99], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-5-2-lap-lich-dia',
  ten: '5.2 Disk scheduling, calculated',
  khoa: KHOA,
  baiHoc: 'osg202-5-2-lap-lich-dia',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai;
