/**
 * OSG202 · 2.5 — IPC & synchronization: race conditions, critical sections, mutex, semaphores.
 * Kết quả race do S.raceOutcomes (duyệt mọi xen kẽ), vết semaphore do S.semTrace.
 */
import { doiDau, KHOA, S, bi, hai, giai, tab, so, tinh, jsDe, dat, mc, tn } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Synchronization 1 — Critical sections and the four conditions',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five questions on race conditions, critical sections and basic mutual-exclusion mechanisms.</p>', '<p>Năm câu về race condition, miền găng và các cơ chế loại trừ tương hỗ cơ bản.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which situation is a race condition?', 'Tình huống nào là race condition?'], [['a', 'The result depends on the exact interleaving of two processes that share data'], ['b', 'Two processes wait for each other forever'], ['c', 'A process runs out of memory'], ['d', 'A process is never scheduled']], 'a', ['A race condition = the outcome depends on who runs when. Waiting forever is deadlock; never scheduled is starvation.', 'Race condition = kết quả phụ thuộc thứ tự xen kẽ. Chờ nhau mãi là deadlock; không bao giờ được lập lịch là starvation.']),
    mc('c2', ['Which of these is NOT one of the four conditions for a good solution to the critical-section problem?', 'Điều kiện nào KHÔNG thuộc bốn điều kiện của một lời giải tốt cho bài toán miền găng?'], [['a', 'Processes must run at the same speed'], ['b', 'No two processes in the critical section at the same time'], ['c', 'No process outside the critical section may block another'], ['d', 'No process waits forever to enter']], 'a', ['Tanenbaum’s four conditions: mutual exclusion, no assumptions about speeds/CPUs, no blocking from outside the CR, no starvation. Requiring the same speed is the opposite of “no assumptions”.', 'Bốn điều kiện của Tanenbaum: loại trừ tương hỗ, không giả định tốc độ/số CPU, tiến trình ngoài miền găng không được chặn ai, không chờ vô hạn.']),
    mc('c3', ['Why is “disable interrupts” unsuitable as a mutual-exclusion tool for user programs?', 'Vì sao “tắt ngắt” không phù hợp làm công cụ loại trừ tương hỗ cho chương trình người dùng?'], [['a', 'A user could never turn them back on, and it does not work on multiprocessors'], ['b', 'It is too slow'], ['c', 'It needs a semaphore'], ['d', 'It only works for threads']], 'a', ['It is fine inside the kernel on one CPU, but a buggy user process could hang the machine, and other CPUs keep running anyway.', 'Dùng trong kernel trên một CPU thì được, nhưng tiến trình người dùng lỗi có thể treo máy và các CPU khác vẫn chạy.']),
    mc('c4', ['What is “busy waiting” (a spin lock)?', '“Busy waiting” (spin lock) là gì?'], [['a', 'Repeatedly testing a variable in a loop until it changes, wasting CPU time'], ['b', 'Sleeping until the kernel wakes you'], ['c', 'Waiting for an I/O interrupt'], ['d', 'A scheduling policy']], 'a', ['A spin lock burns CPU cycles; it pays off only when the wait is shorter than a context switch.', 'Spin lock đốt chu kỳ CPU; chỉ có lợi khi chờ ngắn hơn một lần chuyển ngữ cảnh.']),
    mc('c5', ['TSL (Test and Set Lock) works because …', 'TSL (Test and Set Lock) hoạt động được vì …'], [['a', 'reading and writing the lock word is one indivisible hardware instruction'], ['b', 'it disables the scheduler'], ['c', 'it uses two variables'], ['d', 'it only runs in kernel mode']], 'a', ['TSL locks the memory bus so no other CPU can touch the word between the read and the write.', 'TSL khoá bus bộ nhớ nên CPU khác không chạm vào từ đó giữa lúc đọc và ghi.']),
  ],
  goiY: ['Race = outcome depends on timing. Deadlock = circular waiting. Starvation = never gets its turn.', 'The four conditions are about SAFETY (exclusion) and LIVENESS (progress, bounded waiting).'],
  loiHayGap: ['Mixing up race condition with deadlock.', 'Believing that a software lock variable (while(lock); lock=1;) is safe — the test and the set are two steps.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('critical section', 'miền găng: đoạn mã truy cập dữ liệu chung'), tn('mutual exclusion', 'loại trừ tương hỗ'), tn('spin lock', 'khoá quay: busy waiting')],
  khaiNiem: ['race condition', 'critical section', 'TSL'],
});

/* Bài 2: counter++ race, tính bằng duyệt mọi xen kẽ */
const cfg = [[2, 1], [2, 2], [3, 1], [2, 3]];
const out = cfg.map(([t, e]) => [t, e, S.raceOutcomes(t, e)]);
const E2 = tinh({
  tieuDe: 'Synchronization 2 — The lost update: counter++ without a lock',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p><code>counter</code> starts at 0. Each thread runs <code>for (i = 0; i &lt; K; i++) counter++;</code> and <code>counter++</code> compiles to three steps: <code>LOAD r, counter</code>; <code>ADD r, 1</code>; <code>STORE counter, r</code> (each thread has its own register r; the three steps of different threads may interleave in any way). For each configuration give the <b>smallest</b> and the <b>largest</b> possible final value of <code>counter</code>.</p>`,
    `<p><code>counter</code> bắt đầu bằng 0. Mỗi luồng chạy <code>for (i = 0; i &lt; K; i++) counter++;</code> và <code>counter++</code> biên dịch thành ba bước: <code>LOAD r, counter</code>; <code>ADD r, 1</code>; <code>STORE counter, r</code> (mỗi luồng có thanh ghi r riêng; ba bước của các luồng khác nhau xen kẽ tuỳ ý). Với mỗi cấu hình hãy cho giá trị cuối <b>nhỏ nhất</b> và <b>lớn nhất</b> có thể của <code>counter</code>.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Possible final values', 'Giá trị cuối có thể'),
    cot: [{ ma: 'c', ten: 'Threads × increments each' }, { ma: 'mn', ten: 'Smallest' }, { ma: 'mx', ten: 'Largest' }],
    hang: out.map(([t, e]) => ({ ma: `c${t}${e}`, o: { c: `${t} threads × ${e}` } })),
    dapAn: Object.fromEntries(out.flatMap(([t, e, r]) => [[`c${t}${e}.mn`, String(r[0])], [`c${t}${e}.mx`, String(r[r.length - 1])]])),
    giaiThich: giai(out.map(([t, e, r]) => `${t}×${e}: values {${r.join(', ')}}`).join('; ') + '. The maximum is the no-conflict total; the minimum is 2 whenever there are at least 2 threads and ≥ 2 increments each (thread 1 loads 0, the others finish almost everything, thread 1 stores 1, …).', out.map(([t, e, r]) => `${t}×${e}: {${r.join(', ')}}`).join('; ') + '. Lớn nhất là tổng khi không xung đột; nhỏ nhất là 2 khi có ≥ 2 luồng và mỗi luồng ≥ 2 lần tăng (đã duyệt mọi xen kẽ bằng máy).'),
  }],
  goiY: ['Largest value = every increment is applied once = threads × K.', 'The smallest value for K ≥ 2 needs the “stale register” trick: one thread reads 0, the others do almost all their work, then the stale value overwrites it.'],
  loiHayGap: ['Answering 1 as the minimum for 2 threads × 2 increments — a 1 needs the last STORE to be the first thread’s final increment of 0+1, which is impossible after another increment was stored by that same thread.', 'Thinking the minimum is K (the work of one thread).'],
  giaiThich: '<p>' + out.map(([t, e, r]) => `${t}×${e}: ${r[0]}…${r[r.length - 1]}`).join(' · ') + '. (Computed by exploring every interleaving.)</p>',
  thuatNgu: [tn('lost update', 'cập nhật bị mất do ghi đè'), tn('interleaving', 'cách xen kẽ các bước')],
  khaiNiem: ['race condition', 'interleaving', 'read-modify-write'],
});

/* Bài 3: semaphore trace */
const ops3 = [
  { p: 'A', op: 'down', s: 'S' }, { p: 'B', op: 'down', s: 'S' }, { p: 'C', op: 'down', s: 'S' },
  { p: 'A', op: 'up', s: 'S' }, { p: 'A', op: 'down', s: 'S' }, { p: 'B', op: 'up', s: 'S' }, { p: 'D', op: 'up', s: 'S' }, { p: 'D', op: 'up', s: 'S' },
];
const tr3 = S.semTrace({ S: 1 }, ops3);
const E3 = tinh({
  tieuDe: 'Synchronization 3 — Trace a counting semaphore',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>Semaphore <code>S</code> starts at 1. The following operations are executed in this order (A, B, C, D are processes). <code>down(S)</code>: if S &gt; 0 then S-- and continue, otherwise the process blocks and joins the FIFO wait queue of S. <code>up(S)</code>: if a process is waiting, wake the FIRST waiter (S is not changed, the woken process has completed its down); otherwise S++. A blocked process issues no further operations (they would be skipped). For each step give the value of S afterwards and what happened.</p>`,
    `<p>Semaphore <code>S</code> khởi đầu bằng 1. Các thao tác thực hiện theo đúng thứ tự dưới đây (A, B, C, D là tiến trình). <code>down(S)</code>: nếu S &gt; 0 thì S-- và đi tiếp, ngược lại tiến trình bị chặn và vào hàng đợi FIFO của S. <code>up(S)</code>: nếu có tiến trình đang chờ thì đánh thức tiến trình ĐẦU HÀNG (S không đổi vì tiến trình được đánh thức coi như đã xong down); ngược lại S++. Tiến trình bị chặn không phát thêm thao tác (bỏ qua). Mỗi bước cho giá trị S sau đó và kết quả.</p>`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Trace', 'Vết'),
    cot: [{ ma: 'step', ten: 'Step' }, { ma: 'v', ten: 'S afterwards' }, { ma: 'r', ten: 'Result', luaChon: ['proceeds', 'blocks', 'wakes A', 'wakes B', 'wakes C', 'S++', 'blocked (skipped)'] }],
    hang: tr3.map((t, i) => ({ ma: `t${i + 1}`, o: { step: `${i + 1}. ${t.p}: ${t.op}(S)` } })),
    dapAn: Object.fromEntries(tr3.flatMap((t, i) => [[`t${i + 1}.v`, String(t.val.S)], [`t${i + 1}.r`, t.kq]])),
    giaiThich: giai('Trace: ' + tr3.map((t, i) => `${i + 1}) ${t.p} ${t.op}: ${t.kq}, S=${t.val.S}`).join('; ') + '.', 'Vết: ' + tr3.map((t, i) => `${i + 1}) ${t.p} ${t.op}: ${t.kq}, S=${t.val.S}`).join('; ') + '.'),
  }],
  goiY: ['Keep two things in view at every step: the number S and the FIFO list of blocked processes.', 'An up() that finds a waiter does NOT increment S: the token goes straight to the waiter.'],
  loiHayGap: ['Incrementing S on every up() even when somebody is waiting.', 'Letting a blocked process execute its next operation.'],
  giaiThich: '<p>' + tr3.map((t, i) => `${i + 1}: ${t.kq} (S=${t.val.S})`).join(' · ') + '</p>',
  thuatNgu: [tn('down / P / wait', 'giảm semaphore, có thể bị chặn'), tn('up / V / signal', 'tăng semaphore, có thể đánh thức')],
  khaiNiem: ['semaphore', 'wait queue'],
});

/* Bài 4: dùng semaphore để ép thứ tự */
const E4 = tinh({
  tieuDe: 'Synchronization 4 — Semaphores that enforce an order',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Choose the semaphore design that gives the required behaviour. All semaphores are counting semaphores; <code>down</code> may block, <code>up</code> never does.</p>', '<p>Chọn thiết kế semaphore cho đúng hành vi yêu cầu. Mọi semaphore là semaphore đếm; <code>down</code> có thể chặn, <code>up</code> thì không.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Statement S1 of process A must run BEFORE statement S2 of process B. Which initialisation and code works?', 'Lệnh S1 của tiến trình A phải chạy TRƯỚC lệnh S2 của B. Khởi tạo và mã nào đúng?'], [['a', 'sem = 0;  A: S1; up(sem)   B: down(sem); S2'], ['b', 'sem = 1;  A: S1; up(sem)   B: down(sem); S2'], ['c', 'sem = 0;  A: down(sem); S1   B: S2; up(sem)'], ['d', 'sem = 1;  A: down(sem); S1; up(sem)   B: S2']], 'a', ['With sem=0, B’s down blocks until A has run S1 and called up. With sem=1 B would run S2 immediately.', 'Với sem=0, down của B chặn tới khi A chạy xong S1 và up. Với sem=1 B sẽ chạy S2 ngay.']),
    mc('c2', ['A resource has 3 identical units. Which semaphore initial value limits concurrent users to 3?', 'Một tài nguyên có 3 đơn vị như nhau. Giá trị khởi tạo nào giới hạn tối đa 3 người dùng cùng lúc?'], [['a', '3'], ['b', '1'], ['c', '0'], ['d', '2']], 'a', ['A counting semaphore initialised to N admits N holders; the (N+1)th down blocks.', 'Semaphore đếm khởi tạo N cho N người giữ; down thứ N+1 bị chặn.']),
    mc('c3', ['Three processes must run in the order P1, P2, P3 each exactly once. What is the minimum number of semaphores (initial value 0) required?', 'Ba tiến trình phải chạy theo thứ tự P1, P2, P3, mỗi cái một lần. Cần tối thiểu bao nhiêu semaphore (khởi tạo 0)?'], [['a', '2'], ['b', '1'], ['c', '3'], ['d', '4']], 'a', ['s12 (P1 ups, P2 downs) and s23 (P2 ups, P3 downs).', 's12 (P1 up, P2 down) và s23 (P2 up, P3 down).']),
    mc('c4', ['What is wrong with this “mutex”: <code>mutex = 1;  down(mutex); … critical …; down(mutex);</code>?', 'Đoạn “mutex” này sai ở đâu: <code>mutex = 1;  down(mutex); … miền găng …; down(mutex);</code>?'], [['a', 'The second call must be up(mutex); otherwise the next process blocks forever'], ['b', 'mutex must start at 0'], ['c', 'Nothing, it is correct'], ['d', 'down cannot be used twice']], 'a', ['Release needs up(); with two downs the semaphore ends at -1 and every other process blocks.', 'Giải phóng cần up(); với hai down semaphore tụt xuống -1 và mọi tiến trình khác bị chặn mãi.']),
    mc('c5', ['A binary semaphore differs from a mutex mainly in that …', 'Semaphore nhị phân khác mutex chủ yếu ở chỗ …'], [['a', 'a mutex has an owner: only the thread that locked it should unlock it'], ['b', 'a mutex can count above 1'], ['c', 'a binary semaphore cannot block'], ['d', 'a binary semaphore works only inside the kernel']], 'a', ['Ownership is the conceptual difference: semaphores are signalling tools, mutexes are locks.', 'Khác biệt khái niệm là quyền sở hữu: semaphore để báo hiệu, mutex để khoá.']),
  ],
  goiY: ['To make B wait for A: start the semaphore at 0, A ups at the end of S1, B downs before S2.', 'Initial value = number of tokens available right now.'],
  loiHayGap: ['Initialising to 1 when you want “wait for the other process first”.', 'Calling down twice instead of down/up for lock/unlock.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('counting semaphore', 'semaphore đếm'), tn('binary semaphore', 'semaphore nhị phân (0/1)')],
  khaiNiem: ['semaphore', 'ordering', 'mutex'],
});

/* Bài 5 HARD: duyệt xen kẽ */
const E5 = jsDe({
  tieuDe: 'Synchronization 5 — Enumerate every outcome of a data race',
  doKho: 'HARD', phut: 25,
  moTa: bi(`<p>Write <code>finalValues(threads, each)</code>: <code>threads</code> threads each execute <code>counter++ </code> <code>each</code> times on a shared <code>counter</code> that starts at 0, where one increment is two atomic steps: <b>read</b> the shared value into a private register, then <b>write</b> register + 1. Steps of different threads interleave in every possible way. Return the sorted array (ascending, no duplicates) of all final values of <code>counter</code>.</p>`,
    `<p>Viết <code>finalValues(threads, each)</code>: <code>threads</code> luồng, mỗi luồng thực hiện <code>counter++</code> <code>each</code> lần trên <code>counter</code> chung khởi đầu bằng 0, mỗi lần tăng gồm hai bước nguyên tử: <b>đọc</b> giá trị chung vào thanh ghi riêng rồi <b>ghi</b> thanh ghi + 1. Các bước của các luồng xen kẽ theo mọi cách có thể. Trả mảng đã sắp tăng dần (không trùng) mọi giá trị cuối của <code>counter</code>.</p>`),
  yeuCau: [bi('Explore the state space with a memo set; do not simulate random schedules.', 'Duyệt không gian trạng thái có nhớ (memo); đừng mô phỏng lịch ngẫu nhiên.')],
  viDu: [{ input: 'finalValues(2, 1)', output: '[1, 2]', explanation: 'Both read 0 then both write 1 → 1; or one finishes first → 2.|||Cả hai cùng đọc 0 rồi cùng ghi 1 → 1; hoặc một luồng xong trước → 2.' }],
  goiY: ['A state is (shared value, for every thread: phase, register, increments left). Use depth-first search with a visited set.', 'The final values are the shared values of states where every thread has finished.'],
  loiHayGap: ['Returning only [threads × each] (the no-conflict answer).', 'Forgetting the visited set: the search becomes exponential and times out.'],
  giaiThich: '<p>Each state has at most <code>threads</code> successor states (advance one thread by one atomic step). The visited set merges equal states, so the search is small even for 3 threads.</p>',
  khaiNiem: ['race condition', 'state-space search'],
  fn: 'finalValues',
  dau: "function finalValues(threads, each) {\n  // return the sorted array of every possible final value\n  return [];\n}\n",
  giaiMa: '// DFS over (shared, [phase, register, left] per thread) with a visited set.\n' + dat(S.raceOutcomes, 'finalValues').trim() + '\n',
  ref: (t, e) => S.raceOutcomes(t, e),
  cases: [{ args: [2, 1] }, { args: [2, 2] }, { args: [3, 1] }, { args: [2, 3] }, { args: [3, 2], an: true }, { args: [1, 5], an: true }],
});

/* Bài 6 HARD: vết semaphore */
const refSem = (init, ops) => S.semTrace(init, ops).map((t) => ({ res: t.kq, val: t.val }));
const E6 = jsDe({
  tieuDe: 'Synchronization 6 — Write a semaphore simulator',
  doKho: 'HARD', phut: 25,
  moTa: bi(`<p>Write <code>trace(init, ops)</code>. <code>init</code> maps semaphore names to initial values, e.g. <code>{ S: 1, T: 0 }</code>. <code>ops</code> is an array of <code>{ p, op, s }</code> (<code>op</code> is <code>'down'</code> or <code>'up'</code>) in the order they execute. Semantics: see the statement of the previous exercise (FIFO wait queues, <code>up</code> wakes the first waiter without changing the value, a blocked process’s later operations are skipped).</p><p>Return an array with one entry per operation: <code>{ res, val }</code> where <code>res</code> is one of <code>'proceeds'</code>, <code>'blocks'</code>, <code>'S++'</code> (up with nobody waiting), <code>'wakes X'</code> (X = process id), <code>'blocked (skipped)'</code>, and <code>val</code> is a copy of all semaphore values after the step.</p>`,
    `<p>Viết <code>trace(init, ops)</code>. <code>init</code> ánh xạ tên semaphore sang giá trị đầu, ví dụ <code>{ S: 1, T: 0 }</code>. <code>ops</code> là mảng <code>{ p, op, s }</code> (<code>op</code> là <code>'down'</code> hoặc <code>'up'</code>) theo thứ tự thực hiện. Ngữ nghĩa như bài trước (hàng đợi FIFO, <code>up</code> đánh thức tiến trình đầu hàng mà không đổi giá trị, thao tác sau của tiến trình đang bị chặn bị bỏ qua).</p><p>Trả mảng, mỗi thao tác một phần tử <code>{ res, val }</code>: <code>res</code> là <code>'proceeds'</code>, <code>'blocks'</code>, <code>'S++'</code> (up khi không ai chờ), <code>'wakes X'</code> (X = id tiến trình), <code>'blocked (skipped)'</code>; <code>val</code> là bản sao giá trị mọi semaphore sau bước đó.</p>`),
  yeuCau: [bi('One wait queue per semaphore; process ids are strings.', 'Mỗi semaphore một hàng đợi; id tiến trình là chuỗi.')],
  viDu: [{ input: "trace({S:1}, [{p:'A',op:'down',s:'S'},{p:'B',op:'down',s:'S'}])", output: JSON.stringify(refSem({ S: 1 }, [{ p: 'A', op: 'down', s: 'S' }, { p: 'B', op: 'down', s: 'S' }])), explanation: 'A takes the token, B blocks.|||A lấy token, B bị chặn.' }],
  goiY: ['Keep val (an object), wait (a queue per semaphore) and blockedOn (process → semaphore).', 'An up with a non-empty queue shifts the first waiter and leaves the value unchanged.'],
  loiHayGap: ['Returning the same val object for every step (it must be a COPY after each step).', 'Decrementing below zero when a process blocks.'],
  giaiThich: '<p>The semaphore is a counter plus a FIFO queue. Wake-up hands the token to the first waiter, so the counter only grows when nobody waits.</p>',
  khaiNiem: ['semaphore', 'simulation'],
  fn: 'trace',
  dau: "function trace(init, ops) {\n  const out = [];\n  // simulate each op and push { res, val }\n  return out;\n}\n",
  giaiMa: '// Simulator: counters + FIFO queues.\n' + dat(S.semTrace, 'trace').trim().replace("out.push({ p: o.p, op: o.op, s: o.s, kq: 'blocked (skipped)', val: Object.assign({}, val), wait: JSON.parse(JSON.stringify(wait)) });", "out.push({ res: 'blocked (skipped)', val: Object.assign({}, val) });").replace("out.push({ p: o.p, op: o.op, s: o.s, kq, val: Object.assign({}, val), wait: JSON.parse(JSON.stringify(wait)) });", 'out.push({ res: kq, val: Object.assign({}, val) });'),
  ref: refSem,
  cases: [
    { args: [{ S: 1 }, [{ p: 'A', op: 'down', s: 'S' }, { p: 'B', op: 'down', s: 'S' }, { p: 'A', op: 'up', s: 'S' }, { p: 'B', op: 'up', s: 'S' }]] },
    { args: [{ S: 1 }, ops3] },
    { args: [{ S: 0, T: 0 }, [{ p: 'X', op: 'down', s: 'S' }, { p: 'Y', op: 'up', s: 'S' }, { p: 'Z', op: 'up', s: 'T' }, { p: 'Y', op: 'down', s: 'T' }, { p: 'W', op: 'up', s: 'S' }]] },
    { args: [{ M: 2 }, [{ p: 'A', op: 'down', s: 'M' }, { p: 'B', op: 'down', s: 'M' }, { p: 'C', op: 'down', s: 'M' }, { p: 'D', op: 'down', s: 'M' }, { p: 'A', op: 'up', s: 'M' }, { p: 'B', op: 'up', s: 'M' }, { p: 'C', op: 'up', s: 'M' }]], an: true },
    { args: [{ S: 0 }, [{ p: 'A', op: 'up', s: 'S' }, { p: 'A', op: 'up', s: 'S' }, { p: 'B', op: 'down', s: 'S' }, { p: 'C', op: 'down', s: 'S' }, { p: 'D', op: 'down', s: 'S' }]], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-2-5-ipc-dong-bo',
  ten: '2.5 IPC & synchronization: races, mutex, semaphore',
  khoa: KHOA,
  baiHoc: 'osg202-2-5-ipc-dong-bo',
  de: [E1, E2, E3, E4, E5, E6],
});
void tab; void so; void hai;
