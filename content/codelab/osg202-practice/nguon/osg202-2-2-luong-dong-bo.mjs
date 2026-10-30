/**
 * OSG202 · 2.2 — Threads, multiprogramming and parallel speed-up (công thức: 1 − pⁿ, Amdahl).
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Threads 1 — What do threads share and what is private?',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on the thread model.</p>', '<p>Năm câu về mô hình luồng.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which of these is PRIVATE to each thread of a process?', 'Thứ nào là RIÊNG của mỗi luồng trong một tiến trình?'], [['a', 'Stack and registers (including the program counter)'], ['b', 'Global variables'], ['c', 'The heap'], ['d', 'Open file descriptors']], 'a', ['Each thread needs its own execution state (PC, registers, stack); everything else lives in the shared address space of the process.', 'Mỗi luồng cần trạng thái thực thi riêng (PC, thanh ghi, stack); mọi thứ khác nằm trong không gian địa chỉ chung của tiến trình.']),
    mc('c2', ['One thread of a multithreaded process calls exit() / segfaults on a NULL pointer. What happens?', 'Một luồng của tiến trình đa luồng gọi exit() / lỗi segmentation fault. Điều gì xảy ra?'], [['a', 'The whole process (all its threads) terminates'], ['b', 'Only that thread ends'], ['c', 'The other threads keep running'], ['d', 'The parent thread restarts it']], 'a', ['Threads share the address space and the process; a fatal fault or exit() ends the entire process.', 'Các luồng chung không gian địa chỉ và tiến trình; lỗi nghiêm trọng hay exit() kết thúc cả tiến trình.']),
    mc('c3', ['Compared with creating a process, creating a thread is cheaper mainly because …', 'So với tạo tiến trình, tạo luồng rẻ hơn chủ yếu vì …'], [['a', 'no new address space or page table has to be built'], ['b', 'threads run on a separate CPU'], ['c', 'threads need no stack'], ['d', 'the kernel is not involved at all']], 'a', ['A new thread reuses the address space, open files and heap; only a stack and a small control block are created.', 'Luồng mới dùng lại không gian địa chỉ, tệp mở và heap; chỉ cần tạo stack và một khối điều khiển nhỏ.']),
    mc('c4', ['With pure USER-LEVEL threads (many-to-one) a thread calls a blocking read(). What happens to the other threads of the process?', 'Với luồng CẤP NGƯỜI DÙNG thuần (nhiều–một), một luồng gọi read() chặn. Các luồng khác của tiến trình ra sao?'], [['a', 'They all block, because the kernel sees one schedulable entity'], ['b', 'They continue normally'], ['c', 'They are killed'], ['d', 'They move to another process']], 'a', ['The kernel knows only the process; a blocking system call blocks the whole process, which is the main weakness of user-level threads.', 'Kernel chỉ biết tiến trình; lời gọi hệ thống chặn làm chặn cả tiến trình, đó là điểm yếu chính của luồng cấp người dùng.']),
    mc('c5', ['Which model lets a multithreaded process use several CPU cores at the same time?', 'Mô hình nào cho phép tiến trình đa luồng dùng nhiều lõi CPU cùng lúc?'], [['a', 'Kernel-level (one-to-one) threads'], ['b', 'Pure user-level threads on a non-preemptive library'], ['c', 'Only fork()-based processes'], ['d', 'None; a process uses one core']], 'a', ['The kernel schedules kernel threads on any core. A many-to-one library has one kernel thread, hence one core. (Processes with fork() can also use several cores, but option a is the thread answer.)', 'Kernel lập lịch luồng kernel trên bất kỳ lõi nào. Thư viện nhiều–một chỉ có một luồng kernel nên chỉ một lõi.']),
  ],
  goiY: ['Ask: is this piece of state part of “where the thread is executing” or part of “the program’s world”?', 'The kernel can only schedule entities it knows about.'],
  loiHayGap: ['Saying that each thread has its own heap (it shares the process heap).', 'Thinking a crash in one thread only kills that thread.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('user-level thread', 'luồng do thư viện quản lý, kernel không biết'), tn('kernel-level thread', 'luồng do kernel lập lịch')],
  khaiNiem: ['threads', 'shared address space', 'user vs kernel threads'],
});

/* Bài 2: 1 − p^n */
const ps = [[0.8, 1], [0.8, 2], [0.8, 4], [0.5, 3], [0.2, 4]];
const E2 = tinh({
  tieuDe: 'Threads 2 — CPU utilisation with multiprogramming: 1 − pⁿ',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>With n processes in memory, each waiting for I/O a fraction <b>p</b> of the time (independently), the probability that the CPU is idle is pⁿ, so utilisation = 1 − pⁿ. Give the CPU utilisation as a percentage rounded to the nearest integer (type digits only, e.g. 59).</p>', '<p>Với n tiến trình trong bộ nhớ, mỗi tiến trình chờ I/O một tỉ lệ <b>p</b> thời gian (độc lập), xác suất CPU rảnh là pⁿ nên mức dùng CPU = 1 − pⁿ. Cho mức dùng CPU theo phần trăm làm tròn đến số nguyên (chỉ gõ chữ số, ví dụ 59).</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Utilisation (%)', 'Mức dùng CPU (%)'),
    cot: [{ ma: 'c', ten: 'I/O wait p, processes n' }, { ma: 'u', ten: 'CPU utilisation %' }],
    hang: ps.map(([p, n]) => ({ ma: `c${p * 10}_${n}`, o: { c: `p = ${p}, n = ${n}` } })),
    dapAn: Object.fromEntries(ps.map(([p, n]) => [`c${p * 10}_${n}.u`, String(Math.round(S.cpuUtil(p, n) * 100))])),
    giaiThich: giai(ps.map(([p, n]) => `p=${p}, n=${n}: 1 − ${p}^${n} = ${(S.cpuUtil(p, n) * 100).toFixed(2)}%`).join('; ') + '.', ps.map(([p, n]) => `p=${p}, n=${n}: ${(S.cpuUtil(p, n) * 100).toFixed(2)}%`).join('; ') + '.'),
  }],
  goiY: ['pⁿ is the probability that ALL n processes are waiting at once.', 'Use a calculator or code: 0.8⁴ = 0.4096 → 1 − 0.4096.'],
  loiHayGap: ['Multiplying p by n instead of raising p to the power n.', 'Reporting 4096 → forgetting to subtract from 1.'],
  giaiThich: '<p>' + ps.map(([p, n]) => `${(S.cpuUtil(p, n) * 100).toFixed(1)}%`).join(' · ') + '</p>',
  thuatNgu: [tn('degree of multiprogramming', 'mức độ đa chương: số tiến trình trong bộ nhớ'), tn('CPU utilisation', 'mức dùng CPU')],
  khaiNiem: ['multiprogramming', 'CPU utilisation'],
});

/* Bài 3: Amdahl */
const am = [[0.5, 2], [0.5, 8], [0.9, 10], [0.95, 20], [0.75, 4]];
const E3 = tinh({
  tieuDe: 'Threads 3 — Amdahl’s law: speed-up of a parallel program',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>A fraction <b>f</b> of a program can be parallelised perfectly over <b>n</b> cores; the rest is sequential. Speed-up = 1 / ((1 − f) + f / n). Give the speed-up rounded to 2 decimals.</p>', '<p>Một phần <b>f</b> của chương trình song song hoá hoàn hảo trên <b>n</b> lõi; phần còn lại tuần tự. Speed-up = 1 / ((1 − f) + f / n). Cho speed-up làm tròn 2 chữ số thập phân.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Speed-up', 'Speed-up'),
    cot: [{ ma: 'c', ten: 'Parallel fraction f, cores n' }, { ma: 's', ten: 'Speed-up' }],
    hang: am.map(([f, n]) => ({ ma: `a${f * 100}_${n}`, o: { c: `f = ${f}, n = ${n}` } })),
    dapAn: Object.fromEntries(am.map(([f, n]) => [`a${f * 100}_${n}.s`, [S.amdahl(f, n).toFixed(2), String(+S.amdahl(f, n).toFixed(2))]])),
    giaiThich: giai(am.map(([f, n]) => `f=${f}, n=${n}: ${S.amdahl(f, n).toFixed(2)}`).join('; ') + '. Even with infinite cores the speed-up of f = 0.9 can never exceed 10.', am.map(([f, n]) => `f=${f}, n=${n}: ${S.amdahl(f, n).toFixed(2)}`).join('; ') + '. Dù có vô hạn lõi, speed-up của f = 0,9 không bao giờ vượt 10.'),
  }],
  goiY: ['Plug into 1 / ((1 − f) + f / n); the sequential part (1 − f) is the bottleneck.', 'Check your result against the limit 1 / (1 − f).'],
  loiHayGap: ['Answering n (perfect scaling) — Amdahl exists to deny that.', 'Dividing by n the sequential part instead of the parallel part.'],
  giaiThich: '<p>' + am.map(([f, n]) => S.amdahl(f, n).toFixed(2)).join(' · ') + '</p>',
  thuatNgu: [tn('Amdahl’s law', 'định luật Amdahl: phần tuần tự giới hạn tăng tốc'), tn('speed-up', 'hệ số tăng tốc')],
  khaiNiem: ['Amdahl', 'parallel speed-up'],
});

/* Bài 4: choice about thread API */
const E4 = tinh({
  tieuDe: 'Threads 4 — Pthreads: join, detach and thread-safe code',
  doKho: 'MEDIUM', phut: 9,
  moTa: bi('<p>Five questions on POSIX threads.</p>', '<p>Năm câu về POSIX threads.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What does pthread_join(t, NULL) do?', 'pthread_join(t, NULL) làm gì?'], [['a', 'Blocks the caller until thread t terminates'], ['b', 'Starts thread t'], ['c', 'Kills thread t'], ['d', 'Merges two threads into one']], 'a', ['join is the thread version of wait(): it waits for a thread to finish and releases its resources.', 'join là bản luồng của wait(): chờ luồng kết thúc và thu hồi tài nguyên.']),
    mc('c2', ['main() creates a thread and returns without joining it. What is the usual result?', 'main() tạo một luồng rồi return mà không join. Kết quả thường gặp?'], [['a', 'The process exits and the thread is cut off'], ['b', 'The thread continues forever'], ['c', 'The compiler rejects the program'], ['d', 'main() waits automatically']], 'a', ['Returning from main() calls exit(), which ends every thread; use pthread_join or pthread_exit(main).', 'return khỏi main() gọi exit() kết thúc mọi luồng; dùng pthread_join hoặc pthread_exit.']),
    mc('c3', ['Two threads both execute x = x + 1 on a shared int x without synchronisation. This is …', 'Hai luồng cùng chạy x = x + 1 trên biến int x chung mà không đồng bộ. Đây là …'], [['a', 'a data race: the result is unpredictable'], ['b', 'always safe, because + is atomic'], ['c', 'a deadlock'], ['d', 'a memory leak']], 'a', ['x = x + 1 is load, add, store: not atomic.', 'x = x + 1 là load, add, store: không nguyên tử.']),
    mc('c4', ['A function that uses a static local buffer and is called from two threads is …', 'Hàm dùng bộ đệm static cục bộ và được gọi từ hai luồng là …'], [['a', 'not thread-safe (not reentrant)'], ['b', 'automatically thread-safe'], ['c', 'faster than a normal function'], ['d', 'illegal in C']], 'a', ['The static buffer is shared by every caller. strtok() and ctime() are classic examples; strtok_r and ctime_r are the reentrant versions.', 'Bộ đệm static dùng chung cho mọi nơi gọi. strtok() và ctime() là ví dụ kinh điển; strtok_r và ctime_r là bản reentrant.']),
    mc('c5', ['A thread pool is mainly used to …', 'Thread pool chủ yếu dùng để …'], [['a', 'avoid the cost of creating a thread per request and to bound concurrency'], ['b', 'make threads share registers'], ['c', 'avoid using mutexes'], ['d', 'run threads at higher privilege']], 'a', ['Reusing a fixed set of threads removes creation cost and caps the number of concurrent threads.', 'Tái sử dụng một tập luồng cố định bỏ chi phí tạo luồng và giới hạn số luồng đồng thời.']),
  ],
  goiY: ['join ~ wait, for threads.', 'An operation is atomic only if it is a single indivisible step; compound statements are not.'],
  loiHayGap: ['Believing a C increment is atomic.', 'Forgetting that main() returning ends all threads.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('data race', 'tranh chấp dữ liệu'), tn('reentrant', 'có thể gọi lại an toàn từ nhiều luồng'), tn('thread pool', 'nhóm luồng dùng chung')],
  khaiNiem: ['pthreads', 'thread safety'],
});

/* Bài 5: HARD — threadsNeeded */
const E5 = jsDe({
  tieuDe: 'Threads 5 — How many cores do you need? (Amdahl, solved in code)',
  doKho: 'HARD', phut: 15,
  moTa: bi(`<p>Write <code>coresNeeded(f, target)</code>: the SMALLEST integer number of cores <code>n</code> such that the Amdahl speed-up <code>1 / ((1 − f) + f / n)</code> is at least <code>target</code>. Return <code>-1</code> if no number of cores can ever reach it. That happens when the limit <code>1 / (1 − f)</code> is not above the target. If <code>target ≤ 1</code> return <code>1</code>. For <code>f = 1</code> the speed-up equals n.</p>`,
    `<p>Viết <code>coresNeeded(f, target)</code>: số lõi nguyên <code>n</code> NHỎ NHẤT để speed-up Amdahl <code>1 / ((1 − f) + f / n)</code> đạt ít nhất <code>target</code>. Trả <code>-1</code> nếu dù bao nhiêu lõi cũng không đạt (giới hạn <code>1 / (1 − f)</code> không vượt quá target). Nếu <code>target ≤ 1</code> trả <code>1</code>. Với <code>f = 1</code>, speed-up bằng n.</p>`),
  yeuCau: [bi('A loop over n is fine; or solve the inequality for n.', 'Dùng vòng lặp trên n là được; hoặc giải bất phương trình theo n.')],
  viDu: [{ input: 'coresNeeded(0.9, 5)', output: '9', explanation: '1/(0.1 + 0.9/9) = 5 exactly; 8 cores give 4.7.|||1/(0,1 + 0,9/9) = 5; 8 lõi chỉ được 4,7.' }],
  goiY: ['If the limit 1/(1−f) is ≤ target, no n works: return -1 at once.', 'Floating point: compare with a tiny epsilon only if you solve algebraically; a loop with the original formula is exact enough here.'],
  loiHayGap: ['Looping forever when the target is above the limit.', 'Returning the first n for which speed-up > target when the target is hit exactly (use ≥).'],
  giaiThich: '<p>Speed-up grows monotonically with n and tends to 1/(1−f); if the target is not below that limit it is unreachable, otherwise a linear search finds the first n.</p>',
  khaiNiem: ['Amdahl', 'search'],
  fn: 'coresNeeded',
  dau: "function coresNeeded(f, target) {\n  return 0;\n}\n",
  giaiMa: '// Linear search with an unreachable-target guard.\n' + dat(S.threadsNeeded, 'coresNeeded'),
  ref: (f, t) => S.threadsNeeded(f, t),
  cases: [{ args: [0.9, 5] }, { args: [0.9, 10] }, { args: [0.5, 1.5] }, { args: [0.95, 10] }, { args: [1, 16], an: true }, { args: [0.75, 4], an: true }, { args: [0.6, 0.5], an: true }],
});

export default doiDau({
  slug: 'osg202-2-2-luong-dong-bo',
  ten: '2.2 Threads & parallel speed-up',
  khoa: KHOA,
  baiHoc: 'osg202-2-2-luong-dong-bo',
  de: [E1, E2, E3, E4, E5],
});
void hai;
