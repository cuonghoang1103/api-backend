/**
 * OSG202 · Chương 8 — Hệ thống đa xử lý: UMA/NUMA, hiệu suất song song, mạng omega.
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, mc, tn } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Multiprocessors 1 — UMA, NUMA, spin locks and scheduling (concepts)',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on multiple-processor systems.</p>', '<p>Năm câu về hệ thống nhiều bộ xử lý.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What is the difference between a multiprocessor and a multicomputer?', 'Multiprocessor khác multicomputer ở chỗ nào?'], [['a', 'A multiprocessor shares one memory; a multicomputer has private memories and communicates by messages'], ['b', 'A multicomputer has one CPU per memory bank; a multiprocessor has one CPU in total'], ['c', 'A multiprocessor has no caches at all; a multicomputer shares one cache between its nodes'], ['d', 'There is no difference; both share one memory and communicate by messages']], 'a', ['Shared-memory (multiprocessor) versus message passing (multicomputer, cluster).', 'Bộ nhớ chung (multiprocessor) so với truyền thông điệp (multicomputer, cluster).']),
    mc('c2', ['Why is a plain test-and-set spin lock bad on a multiprocessor?', 'Vì sao spin lock test-and-set thuần tuý kém trên multiprocessor?'], [['a', 'Every spin writes the shared word, so the cache line bounces between cores and floods the bus'], ['b', 'It cannot lock anything, because the instruction is not atomic across several cores'], ['c', 'It needs the lock word on disk, so every spin waits for the disk to answer'], ['d', 'It works only with two threads, so a third one enters the critical region']], 'a', ['Test-and-test-and-set spins on a cached read and writes only when the lock looks free.', 'Test-and-test-and-set quay trên bản đọc đã cache và chỉ ghi khi khoá có vẻ rảnh.']),
    mc('c3', ['Gang scheduling means …', 'Gang scheduling nghĩa là …'], [['a', 'all threads of a related group are scheduled to run at the same time on different CPUs'], ['b', 'one thread of a group gets all the CPUs in turn'], ['c', 'threads of a group are scheduled in random order on one CPU'], ['d', 'the OS ignores groups and runs each thread on its own schedule']], 'a', ['Communicating threads then do not wait for a thread that is descheduled.', 'Các luồng giao tiếp với nhau không phải chờ một luồng đang bị tạm dừng.']),
    mc('c4', ['“CPU affinity” (processor affinity) lets the scheduler …', '“CPU affinity” cho phép bộ lập lịch …'], [['a', 'keep a thread on the same core to reuse its warm cache'], ['b', 'run copies of one thread on every core at the same time'], ['c', 'change the page size of a thread to fit the cache of its core'], ['d', 'disable the TLB of a thread that moves between cores']], 'a', ['Moving a thread loses its cache contents (cold start).', 'Chuyển luồng sang lõi khác làm mất nội dung cache (khởi động nguội).']),
    mc('c5', ['In a symmetric multiprocessing (SMP) OS …', 'Trong hệ điều hành đa xử lý đối xứng (SMP) …'], [['a', 'every CPU can run kernel and user code and all share one copy of the OS'], ['b', 'only CPU 0 runs the kernel and the other CPUs run only user code'], ['c', 'each CPU has its own copy of the OS and its own private memory'], ['d', 'one special CPU runs all the user code and the others only the kernel']], 'a', ['Master–slave designs make CPU 0 a bottleneck; SMP needs fine-grained locking in the kernel.', 'Thiết kế master–slave làm CPU 0 thành nút cổ chai; SMP cần khoá hạt mịn trong kernel.']),
  ],
  goiY: ['Shared memory ↔ multiprocessor; messages ↔ multicomputer.', 'Think about what travels over the bus.'],
  loiHayGap: ['Calling a cluster a multiprocessor.', 'Thinking affinity forbids migration entirely.'],
  thuatNgu: [tn('SMP', 'đa xử lý đối xứng'), tn('gang scheduling', 'lập lịch theo nhóm đồng thời'), tn('CPU affinity', 'gắn luồng với lõi')],
  khaiNiem: ['multiprocessor', 'spin lock', 'gang scheduling'],
});

const eff = [[0.95, 4], [0.95, 16], [0.95, 64], [0.5, 8]];
const E2 = tinh({
  tieuDe: 'Multiprocessors 2 — Speed-up and parallel efficiency',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Amdahl speed-up = 1 / ((1 − f) + f / n). Parallel efficiency = speed-up / n. Give both (speed-up with 2 decimals, efficiency in percent rounded to the nearest integer, digits only).</p>', '<p>Speed-up Amdahl = 1 / ((1 − f) + f / n). Hiệu suất song song = speed-up / n. Cho cả hai (speed-up 2 chữ số thập phân, hiệu suất theo phần trăm làm tròn đến số nguyên, chỉ chữ số).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Speed-up and efficiency', 'Speed-up và hiệu suất'),
    cot: [{ ma: 'c', ten: 'f and n' }, { ma: 's', ten: 'Speed-up' }, { ma: 'e', ten: 'Efficiency (%)' }],
    hang: eff.map(([f, n]) => ({ ma: `c${f * 100}_${n}`, o: { c: `f = ${f}, n = ${n}` } })),
    dapAn: Object.fromEntries(eff.flatMap(([f, n]) => { const s = S.amdahl(f, n); return [[`c${f * 100}_${n}.s`, [s.toFixed(2), String(+s.toFixed(2))]], [`c${f * 100}_${n}.e`, String(Math.round((s / n) * 100))]]; })),
    giaiThich: giai(eff.map(([f, n]) => `f=${f}, n=${n}: ${S.amdahl(f, n).toFixed(2)} (${Math.round((S.amdahl(f, n) / n) * 100)}%)`).join('; ') + '. Efficiency falls quickly as cores are added: the sequential fraction dominates.', eff.map(([f, n]) => `f=${f}, n=${n}: ${S.amdahl(f, n).toFixed(2)} (${Math.round((S.amdahl(f, n) / n) * 100)}%)`).join('; ') + '. Hiệu suất giảm nhanh khi thêm lõi: phần tuần tự lấn át.'),
  }],
  goiY: ['Compute the speed-up first, then divide by n.', 'Efficiency 100% would be perfect scaling.'],
  loiHayGap: ['Dividing the fraction f by n again.', 'Reporting efficiency as a fraction when percent is asked.'],
  giaiThich: '<p>' + eff.map(([f, n]) => `${S.amdahl(f, n).toFixed(2)} / ${Math.round((S.amdahl(f, n) / n) * 100)}%`).join(' · ') + '</p>',
  thuatNgu: [tn('parallel efficiency', 'hiệu suất song song = speed-up / số lõi')],
  khaiNiem: ['Amdahl', 'efficiency'],
});

const om = [4, 8, 16, 64];
const E3 = tinh({
  tieuDe: 'Multiprocessors 3 — The omega network: stages and switches',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>An omega switching network connects n CPUs to n memories with 2×2 switches arranged in log₂(n) stages of n/2 switches each. Give the number of stages and the total number of switches (a crossbar would need n² crosspoints).</p>', '<p>Mạng chuyển mạch omega nối n CPU với n bộ nhớ bằng các công tắc 2×2 xếp thành log₂(n) tầng, mỗi tầng n/2 công tắc. Cho số tầng và tổng số công tắc (crossbar cần n² điểm nối).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Omega network size', 'Kích thước mạng omega'),
    cot: [{ ma: 'n', ten: 'n (CPUs = memories)' }, { ma: 's', ten: 'Stages' }, { ma: 't', ten: 'Switches' }, { ma: 'x', ten: 'Crossbar crosspoints' }],
    hang: om.map((n) => ({ ma: `n${n}`, o: { n: String(n) } })),
    dapAn: Object.fromEntries(om.flatMap((n) => [[`n${n}.s`, String(Math.log2(n))], [`n${n}.t`, String((n / 2) * Math.log2(n))], [`n${n}.x`, String(n * n)]])),
    giaiThich: giai(om.map((n) => `n=${n}: ${Math.log2(n)} stages × ${n / 2} = ${(n / 2) * Math.log2(n)} switches vs ${n * n} crosspoints`).join('; ') + '. The omega network grows as n·log n instead of n², but it can block: two requests may need the same internal link.', om.map((n) => `n=${n}: ${Math.log2(n)} tầng × ${n / 2} = ${(n / 2) * Math.log2(n)} công tắc so với ${n * n} điểm nối`).join('; ') + '. Mạng omega tăng như n·log n thay vì n², nhưng có thể bị chặn: hai yêu cầu có thể cần cùng một liên kết trong.'),
  }],
  goiY: ['Stages = log₂ n; switches = stages × n/2.', 'Crossbar = n × n.'],
  loiHayGap: ['Using n instead of n/2 switches per stage.', 'Counting log₂ of the wrong number.'],
  giaiThich: '<p>' + om.map((n) => `${n}: ${Math.log2(n)} / ${(n / 2) * Math.log2(n)} / ${n * n}`).join(' · ') + '</p>',
  thuatNgu: [tn('omega network', 'mạng omega'), tn('crossbar', 'mạng chéo đầy đủ')],
  khaiNiem: ['interconnection networks'],
});

export default doiDau({
  slug: 'osg202-8-multiprocessor',
  ten: '8.1 Multiple processor systems: UMA/NUMA, Amdahl, networks',
  khoa: KHOA,
  baiHoc: 'osg202-on-ch8',
  de: [E1, E2, E3],
});
