/**
 * OSG202 · 2.6 — The classical IPC problems: producer–consumer, readers–writers, dining philosophers.
 */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, dat, mc, tn, xoay } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Classical IPC 1 — Producer–consumer: the three semaphores',
  doKho: 'EASY', phut: 7,
  moTa: bi('<p>A bounded buffer of N slots is shared by producers and consumers. The standard solution uses three semaphores: <code>mutex</code> (protects the buffer indices), <code>empty</code> (counts free slots) and <code>full</code> (counts filled slots). Give their initial values for each buffer size.</p>', '<p>Bộ đệm N ô được chia sẻ giữa nhà sản xuất và người tiêu thụ. Lời giải chuẩn dùng ba semaphore: <code>mutex</code> (bảo vệ chỉ số bộ đệm), <code>empty</code> (đếm ô trống), <code>full</code> (đếm ô đầy). Cho giá trị khởi tạo ứng với từng kích thước bộ đệm.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Initial values', 'Giá trị khởi tạo'),
    cot: [{ ma: 'n', ten: 'Buffer size N' }, { ma: 'm', ten: 'mutex' }, { ma: 'e', ten: 'empty' }, { ma: 'f', ten: 'full' }],
    hang: [8, 5, 1].map((n) => ({ ma: `n${n}`, o: { n: String(n) } })),
    dapAn: Object.fromEntries([8, 5, 1].flatMap((n) => [[`n${n}.m`, '1'], [`n${n}.e`, String(n)], [`n${n}.f`, '0']])),
    giaiThich: giai('At the start every slot is free (empty = N), nothing can be consumed (full = 0), and the buffer is not locked (mutex = 1). Note empty + full = N is an invariant outside the critical region.', 'Lúc đầu mọi ô đều trống (empty = N), chưa có gì để lấy (full = 0), bộ đệm chưa bị khoá (mutex = 1). Bất biến: empty + full = N bên ngoài miền găng.'),
  }],
  goiY: ['empty counts slots a producer may still fill; at the start that is N.', 'full counts items a consumer may take; at the start there are none.'],
  loiHayGap: ['Starting full at N (thinking the buffer begins full).', 'Starting mutex at 0 — then nobody could ever enter the critical region.'],
  giaiThich: '<p>mutex = 1, empty = N, full = 0 for every N.</p>',
  thuatNgu: [tn('bounded buffer', 'bộ đệm có giới hạn'), tn('producer–consumer', 'bài toán nhà sản xuất – người tiêu thụ')],
  khaiNiem: ['producer-consumer', 'semaphore'],
});

const PROD = ['down(empty)', 'down(mutex)', 'insert_item(item)', 'up(mutex)', 'up(full)'];
const E2 = tinh({
  tieuDe: 'Classical IPC 2 — Order the producer, then spot the deadlock',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Put the five lines of the producer’s loop body in the correct order, then decide what happens if the first two lines are swapped.</p>', '<p>Sắp năm dòng trong thân vòng lặp của nhà sản xuất đúng thứ tự, rồi cho biết điều gì xảy ra nếu hai dòng đầu bị đảo.</p>'),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('Correct producer body', 'Thân nhà sản xuất đúng'),
    muc: xoay(PROD.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), 2), dapAn: PROD.map((_, i) => `s${i + 1}`),
    giaiThich: giai('Wait for a free slot (empty) BEFORE taking the mutex; then insert under the mutex; release the mutex; finally announce the new item with up(full). If the producer took the mutex first and the buffer were full, it would sleep on empty while holding the mutex, so the consumer could never enter to free a slot: deadlock.', 'Chờ ô trống (empty) TRƯỚC khi lấy mutex; chèn trong mutex; nhả mutex; cuối cùng báo có mục mới bằng up(full). Nếu lấy mutex trước và bộ đệm đầy, nhà sản xuất ngủ trên empty khi đang giữ mutex nên người tiêu thụ không vào được để giải phóng ô: deadlock.'),
  }],
  goiY: ['Never sleep on a counting semaphore while holding the mutex.', 'The mutex should cover only the shortest possible region: the insertion.'],
  loiHayGap: ['Putting up(full) before up(mutex) is harmless, but putting down(mutex) before down(empty) deadlocks when the buffer is full.', 'Releasing the mutex after up(full) is legal but lengthens the critical region.'],
  giaiThich: '<p>down(empty) → down(mutex) → insert → up(mutex) → up(full).</p>',
  thuatNgu: [tn('critical region', 'miền găng')],
  khaiNiem: ['producer-consumer', 'deadlock by ordering'],
});

const E3 = tinh({
  tieuDe: 'Classical IPC 3 — Readers–writers and the philosophers (concepts)',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Five questions on the readers–writers and dining-philosophers problems.</p>', '<p>Năm câu về bài toán readers–writers và triết gia ăn tối.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['In the classic readers–writers solution (reader preference) which process can starve?', 'Trong lời giải readers–writers kinh điển (ưu tiên người đọc), tiến trình nào có thể bị đói?'], [['a', 'A writer, if readers keep arriving'], ['b', 'A reader'], ['c', 'Both, equally'], ['d', 'Neither; it is starvation-free']], 'a', ['As long as at least one reader is inside, the db lock is held by the reader group and the writer waits; a steady stream of readers keeps it out.', 'Chừng nào còn ít nhất một reader bên trong, khoá db do nhóm reader giữ và writer phải chờ; reader đến liên tục sẽ chặn writer mãi.']),
    mc('c2', ['How many readers may read the same file at the same time?', 'Có thể có bao nhiêu reader đọc cùng một tệp đồng thời?'], [['a', 'Any number'], ['b', 'Only one'], ['c', 'At most two'], ['d', 'None while a writer exists in the system']], 'a', ['Reading does not change data, so readers share; only a writer needs exclusive access.', 'Đọc không đổi dữ liệu nên reader dùng chung; chỉ writer cần độc quyền.']),
    mc('c3', ['Five philosophers each pick up the LEFT fork first, then the right fork. What can happen?', 'Năm triết gia mỗi người cầm đũa TRÁI trước rồi mới đũa phải. Điều gì có thể xảy ra?'], [['a', 'Deadlock: everybody holds the left fork and waits for the right one'], ['b', 'Nothing bad, it is correct'], ['c', 'Only starvation'], ['d', 'A race condition on the table']], 'a', ['If all five take the left fork at the same moment, a circular wait exists.', 'Nếu cả năm cùng cầm đũa trái, tồn tại chờ vòng tròn.']),
    mc('c4', ['Which fix does NOT remove the deadlock of the naive philosophers?', 'Cách sửa nào KHÔNG loại bỏ được deadlock của triết gia ngây thơ?'], [['a', 'Add a 1-second sleep between taking the left and the right fork'], ['b', 'Allow at most 4 philosophers to sit down'], ['c', 'Number the forks and always take the lower number first'], ['d', 'Take both forks atomically under a mutex']], 'a', ['A delay only changes timing; the circular wait can still form. The others break circular wait (b, c) or hold-and-wait (d).', 'Chờ thêm chỉ đổi thời điểm; chờ vòng vẫn có thể hình thành. Các cách còn lại phá chờ vòng (b, c) hoặc giữ-và-chờ (d).']),
    mc('c5', ['A solution in which a philosopher puts the left fork down and retries when the right fork is busy risks …', 'Giải pháp mà triết gia đặt đũa trái xuống và thử lại khi đũa phải bận có nguy cơ …'], [['a', 'Livelock / starvation: everybody keeps retrying in lockstep'], ['b', 'Deadlock only'], ['c', 'Buffer overflow'], ['d', 'Priority inversion']], 'a', ['Processes are active but make no progress: livelock, a form of starvation.', 'Các tiến trình vẫn chạy nhưng không tiến triển: livelock, một dạng đói.']),
  ],
  goiY: ['Starvation: some process waits forever although the system keeps working. Deadlock: nobody can move.', 'Break one of the four Coffman conditions to fix a deadlock.'],
  loiHayGap: ['Calling livelock “deadlock” — in livelock the processes keep running.', 'Believing that a sleep() can remove a circular wait.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('livelock', 'tiến trình chạy mà không tiến triển'), tn('readers–writers', 'nhiều người đọc / một người ghi')],
  khaiNiem: ['readers-writers', 'dining philosophers', 'livelock'],
});

/* Bài 4: bảng chiến lược */
const CC = ['Circular wait', 'Hold and wait', 'Mutual exclusion', 'None (deadlock possible)'];
const plans = {
  a: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]],
  e: [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4]],
};
const E4 = tinh({
  tieuDe: 'Classical IPC 4 — Dining philosophers: which Coffman condition does each strategy break?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Five philosophers, five forks (fork i is between philosopher i and i+1). For each strategy name the deadlock condition it eliminates, or “None” if deadlock is still possible.</p>', '<p>Năm triết gia, năm chiếc đũa (đũa i nằm giữa triết gia i và i+1). Với mỗi chiến lược, hãy nêu điều kiện deadlock mà nó loại bỏ, hoặc “None” nếu deadlock vẫn có thể xảy ra.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Strategy → condition', 'Chiến lược → điều kiện'),
    cot: [{ ma: 's', ten: 'Strategy' }, { ma: 'c', ten: 'Condition broken', luaChon: CC }],
    hang: [
      'Everyone takes the left fork, then the right fork',
      'Even philosophers take left first, odd philosophers take right first',
      'A waiter lets at most four philosophers sit at the table',
      'A philosopher locks a global mutex, takes both forks, unlocks the mutex',
      'Fork i must always be taken before fork j when i < j (resource ordering)',
    ].map((s, i) => ({ ma: `r${i}`, o: { s } })),
    dapAn: { 'r0.c': CC[3], 'r1.c': CC[0], 'r2.c': CC[0], 'r3.c': CC[1], 'r4.c': CC[0] },
    giaiThich: giai(`Naive: simulated — the plans ${JSON.stringify(plans.a)} give deadlock=${S.dining(plans.a.map((x) => x.slice())).deadlock}. Alternating and ordering prevent a cycle in the wait-for graph (circular wait); the 4-seat rule leaves at least one philosopher able to get both forks (circular wait); the global mutex makes the acquisition of both forks one step (no hold-and-wait).`, `Ngây thơ: mô phỏng — kế hoạch ${JSON.stringify(plans.a)} cho deadlock=${S.dining(plans.a.map((x) => x.slice())).deadlock}. Đổi chiều và đánh số đũa ngăn chu trình trong đồ thị chờ (chờ vòng); luật 4 chỗ ngồi để luôn có người lấy đủ hai đũa (chờ vòng); mutex toàn cục biến việc lấy hai đũa thành một bước (không giữ-và-chờ).`),
  }],
  goiY: ['Circular wait = a cycle P0→P1→…→P0 in the wait-for graph. Which strategies make a cycle impossible?', 'Hold-and-wait: a process holds one resource while waiting for another.'],
  loiHayGap: ['Claiming the waiter (4 seats) removes mutual exclusion — the forks are still exclusive.', 'Saying resource ordering breaks hold-and-wait — processes still hold one fork while waiting for the next.'],
  giaiThich: '<p>None · Circular wait · Circular wait · Hold and wait · Circular wait.</p>',
  thuatNgu: [tn('Coffman conditions', 'bốn điều kiện deadlock: loại trừ, giữ-và-chờ, không cưỡng đoạt, chờ vòng'), tn('resource ordering', 'đánh thứ tự tài nguyên')],
  khaiNiem: ['dining philosophers', 'Coffman conditions'],
});

/* Bài 5: HARD — firstBlock */
const E5 = jsDe({
  tieuDe: 'Classical IPC 5 — When does the bounded buffer first block?',
  doKho: 'HARD', phut: 15,
  moTa: bi(`<p>Write <code>firstBlock(N, ops)</code>. The buffer holds at most <code>N</code> items and starts empty. <code>ops</code> is a string such as <code>'PPCP'</code>: <code>P</code> = a producer tries to insert, <code>C</code> = a consumer tries to remove, in this global order. Return the 0-based index of the FIRST operation that would have to block (the buffer is full on <code>P</code>, or empty on <code>C</code>), or <code>-1</code> if none does.</p>`,
    `<p>Viết <code>firstBlock(N, ops)</code>. Bộ đệm chứa tối đa <code>N</code> mục, ban đầu rỗng. <code>ops</code> là chuỗi như <code>'PPCP'</code>: <code>P</code> = nhà sản xuất cố chèn, <code>C</code> = người tiêu thụ cố lấy, theo đúng thứ tự toàn cục này. Trả chỉ số (từ 0) của thao tác ĐẦU TIÊN phải bị chặn (bộ đệm đầy khi <code>P</code>, hoặc rỗng khi <code>C</code>), hoặc <code>-1</code> nếu không có.</p>`),
  yeuCau: [bi('Track only the number of items in the buffer.', 'Chỉ cần theo dõi số mục đang có trong bộ đệm.')],
  viDu: [{ input: "firstBlock(2, 'PPP')", output: '2', explanation: 'The third insert finds 2 items = N.|||Lần chèn thứ ba thấy đã có 2 mục = N.' }],
  goiY: ['This is the invariant full + empty = N: keep one counter.', 'Return at the first violation; do not simulate waiting.'],
  loiHayGap: ['Checking the limit AFTER inserting (off by one).', 'Treating a consumer on an empty buffer as legal.'],
  giaiThich: '<p>The count of items is the value of the <code>full</code> semaphore; P blocks when it equals N (empty = 0) and C blocks when it equals 0.</p>',
  khaiNiem: ['bounded buffer', 'semaphore invariant'],
  fn: 'firstBlock',
  dau: "function firstBlock(N, ops) {\n  return -2;\n}\n",
  giaiMa: '// One counter = the value of the semaphore "full".\n' + dat(S.firstBlock, 'firstBlock'),
  ref: (N, o) => S.firstBlock(N, o),
  cases: [{ args: [2, 'PPP'] }, { args: [2, 'PCPC'] }, { args: [1, 'C'] }, { args: [3, 'PPPCCCC'] }, { args: [3, 'PPCPPPC'], an: true }, { args: [5, ''], an: true }, { args: [1, 'PCPCPCPP'], an: true }],
});

/* Bài 6: HARD — dining */
const E6 = jsDe({
  tieuDe: 'Classical IPC 6 — Simulate the dining philosophers',
  doKho: 'HARD', phut: 30,
  moTa: bi(`<p>Write <code>dining(plans)</code>. <code>plans[p]</code> lists the forks philosopher <code>p</code> must take <b>in that order</b> (fork ids are numbers). The simulation runs in rounds; in each round philosophers <code>p = 0 … n−1</code> act in turn: a philosopher takes the NEXT fork of its plan if it is free (otherwise it waits and does not advance); when it holds all its forks it eats, releases all of them <i>immediately in the same turn</i> and is finished. A round in which nobody took a fork while somebody has not finished means <b>deadlock</b>.</p>
<p>Return <code>{ deadlock, order, rounds }</code>: <code>order</code> = philosopher ids in the order they finished, <code>rounds</code> = number of rounds executed (the deadlocked round included).</p>`,
    `<p>Viết <code>dining(plans)</code>. <code>plans[p]</code> liệt kê các chiếc đũa mà triết gia <code>p</code> phải lấy <b>theo thứ tự đó</b> (id đũa là số). Mô phỏng chạy theo vòng; mỗi vòng các triết gia <code>p = 0 … n−1</code> lần lượt hành động: lấy chiếc đũa KẾ TIẾP trong kế hoạch nếu rảnh (nếu bận thì chờ, không tiến); khi giữ đủ đũa thì ăn, trả hết đũa <i>ngay trong lượt đó</i> và xong. Vòng nào không ai lấy được đũa mà vẫn còn người chưa xong ⇒ <b>deadlock</b>.</p>
<p>Trả <code>{ deadlock, order, rounds }</code>: <code>order</code> = id triết gia theo thứ tự xong, <code>rounds</code> = số vòng đã chạy (kể cả vòng bế tắc).</p>`),
  yeuCau: [bi('Use an owner map for the forks.', 'Dùng một bảng chủ sở hữu cho các chiếc đũa.')],
  viDu: [{ input: 'dining([[0,1],[1,2],[2,3],[3,4],[4,0]])', output: JSON.stringify(S.dining(plans.a.map((x) => x.slice()))), explanation: 'Everyone grabs the first fork in round 1; in round 2 nobody can progress.|||Ai cũng lấy đũa đầu ở vòng 1; vòng 2 không ai tiến được.' }],
  goiY: ['Keep owner[fork], next[p] (index in the plan) and the finished list.', 'Detect deadlock by a boolean “someone progressed in this round”.'],
  loiHayGap: ['Letting a philosopher take two forks in one turn.', 'Forgetting to release the forks when a philosopher finishes (the others then deadlock wrongly).'],
  giaiThich: '<p>This is the wait-for graph in disguise: deadlock appears exactly when a cycle of philosophers each holds the fork the next one needs.</p>',
  khaiNiem: ['dining philosophers', 'deadlock detection'],
  fn: 'dining',
  dau: "function dining(plans) {\n  return { deadlock: false, order: [], rounds: 0 };\n}\n",
  giaiMa: '// Round-based simulation with an owner map.\n' + dat(S.dining, 'dining'),
  ref: (p) => S.dining(p),
  cases: [
    { args: [plans.a] }, { args: [plans.e] },
    { args: [[[0, 1], [1, 2], [2, 0]]] },
    { args: [[[0, 1], [2, 1], [2, 0]]], an: true },
    { args: [[[0], [0], [0], [1]]], an: true },
    { args: [[[0, 1, 2], [2, 1, 0]]], an: true },
  ],
});

export default doiDau({
  slug: 'osg202-2-6-bai-toan-ipc',
  ten: '2.6 The three classical IPC problems',
  khoa: KHOA,
  baiHoc: 'osg202-2-6-bai-toan-ipc',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai;
