/**
 * OSG202 · 2.3 — Process states, the PCB and fork/exec/wait. Số tiến trình/dòng in tính bằng S.processCount / S.printCount
 * (và đã đối chiếu bằng cách biên dịch + chạy thật các đoạn C: xem ghi chú từng bài).
 */
import { doiDau, KHOA, S, bi, hai, giai, lc, pre, tinh, jsDe, nguon, mc, xoay, tn } from './_os.mjs';

/* Bài 1 EASY — trạng thái tiến trình */
const TT = ['Running → Ready', 'Running → Blocked', 'Blocked → Ready', 'Ready → Running', 'Running → Terminated'];
const E1 = tinh({
  tieuDe: 'Process states 1 — Which transition does the event cause?',
  doKho: 'EASY', phut: 7,
  moTa: bi('<p>The five-state process model has the states New/Ready/Running/Blocked/Terminated. For each event say which <b>transition</b> of the affected process it causes.</p>', '<p>Mô hình tiến trình năm trạng thái gồm New/Ready/Running/Blocked/Terminated. Với mỗi sự kiện, hãy chọn <b>chuyển trạng thái</b> của tiến trình bị tác động.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Event → transition', 'Sự kiện → chuyển trạng thái'),
    cot: [{ ma: 'e', ten: 'Event' }, { ma: 't', ten: 'Transition', luaChon: TT }],
    hang: ['The timer interrupt fires because the quantum of the running process expired',
      'The running process calls read() on a file that is not in the page cache',
      'The disk controller raises an interrupt: the requested block has arrived',
      'The scheduler picks the first process of the ready queue and loads its context',
      'The running process calls exit(0)',
      'The running process calls sleep(5)'].map((e, i) => ({ ma: `r${i}`, o: { e } })),
    dapAn: { 'r0.t': TT[0], 'r1.t': TT[1], 'r2.t': TT[2], 'r3.t': TT[3], 'r4.t': TT[4], 'r5.t': TT[1] },
    giaiThich: giai('Preemption sends Running → Ready; waiting for I/O or a timer sends Running → Blocked; the completion interrupt makes Blocked → Ready (not directly Running: the scheduler decides); dispatch is Ready → Running.', 'Bị cắt: Running → Ready; chờ I/O hoặc đồng hồ: Running → Blocked; ngắt hoàn tất I/O đưa Blocked → Ready (không vào thẳng Running: bộ lập lịch quyết định); cấp CPU là Ready → Running.'),
  }],
  goiY: ['A process can only leave Blocked to Ready — never straight to Running.', 'Ask: did the process give up the CPU voluntarily (Blocked) or was it taken away (Ready)?'],
  loiHayGap: ['Sending Blocked → Running when the I/O finishes (skipping the ready queue).', 'Putting a process that merely lost its quantum into Blocked.'],
  giaiThich: '<p>Ready · Blocked · Ready · Running · Terminated · Blocked.</p>',
  thuatNgu: [tn('PCB (process control block)', 'khối điều khiển tiến trình'), tn('dispatcher', 'bộ điều phối: nạp ngữ cảnh tiến trình được chọn')],
  khaiNiem: ['process states', 'state transitions'],
});

/* Bài 2 EASY — khái niệm */
const E2 = tinh({
  tieuDe: 'Process states 2 — fork(), exec(), zombie and orphan',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five conceptual questions about process creation and termination on UNIX.</p>', '<p>Năm câu khái niệm về tạo và kết thúc tiến trình trên UNIX.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['What does fork() return in the CHILD process?', 'fork() trả về gì trong tiến trình CON?'], [['a', '0'], ['b', 'The child’s PID'], ['c', '-1'], ['d', 'The parent’s PID']], 'a', ['fork() returns 0 in the child, the child’s PID in the parent and -1 on failure.', 'fork() trả 0 ở tiến trình con, PID của con ở cha, và -1 khi lỗi.']),
    mc('c2', ['A child has exited but its parent has not yet called wait(). The child is a …', 'Tiến trình con đã thoát nhưng cha chưa gọi wait(). Con đó là …'], [['a', 'Zombie'], ['b', 'Orphan'], ['c', 'Daemon'], ['d', 'Thread']], 'a', ['A zombie keeps only its PCB entry (exit status) until the parent reaps it with wait().', 'Zombie chỉ còn mục PCB (mã thoát) cho tới khi cha “thu dọn” bằng wait().']),
    mc('c3', ['The parent exits while the child is still running. What happens to the child?', 'Cha thoát khi con còn chạy. Chuyện gì xảy ra với con?'], [['a', 'It is adopted by init/systemd (PID 1)'], ['b', 'It is killed immediately by the kernel'], ['c', 'It becomes a zombie at once'], ['d', 'It keeps the dead parent as its parent forever']], 'a', ['Orphans are re-parented to PID 1, which calls wait() on them when they finish.', 'Tiến trình mồ côi được gán cho PID 1; PID 1 gọi wait() khi chúng xong.']),
    mc('c4', ['What does a successful exec() do?', 'exec() thành công làm gì?'], [['a', 'Replaces the program image; the PID stays the same'], ['b', 'Creates a new process running the new program'], ['c', 'Returns the PID of the new program'], ['d', 'Copies the calling process, then runs the copy']], 'a', ['exec replaces code, data and stack of the same process; on success it never returns.', 'exec thay mã, dữ liệu, stack của chính tiến trình đó; thành công thì không bao giờ quay về.']),
    mc('c5', ['Why does a shell call fork() BEFORE exec() when you type a command?', 'Vì sao shell gọi fork() TRƯỚC exec() khi bạn gõ lệnh?'], [['a', 'So the shell itself keeps running after the command finishes'], ['b', 'Because exec() cannot run unless fork() was called before it'], ['c', 'To double the memory available to the command'], ['d', 'To make the command run with root rights']], 'a', ['exec would overwrite the shell; the shell forks a child, the child execs the command, the parent waits.', 'exec sẽ ghi đè shell; shell fork ra con, con exec lệnh, cha wait.']),
  ],
  goiY: ['Think about who calls wait(): the PARENT. Zombie = child is dead and waiting for it.', 'exec never creates a process; fork never loads a new program.'],
  loiHayGap: ['Mixing up zombie (child dead, parent alive) and orphan (parent dead, child alive).', 'Thinking exec() returns the new program’s exit status to the caller.'],
  thuatNgu: [tn('zombie', 'tiến trình đã chết nhưng cha chưa wait()'), tn('orphan', 'tiến trình mồ côi (cha đã chết)')],
  khaiNiem: ['fork', 'exec', 'zombie', 'orphan'],
});

/* Bài 3 MEDIUM — đếm tiến trình/dòng in. Đáp án đối chiếu bằng chạy thật cc (xem ghi chú) */
const progA = [{ op: 'fork' }, { op: 'fork' }, { op: 'fork' }, { op: 'print' }];
const progB = [{ op: 'forkIf', who: 'child', then: [{ op: 'fork' }] }, { op: 'print' }];
const progF = [{ op: 'fork' }, { op: 'fork' }, { op: 'fork' }, { op: 'print' }];
const progH = [{ op: 'forkIf', who: 'parent', then: [{ op: 'fork' }] }, { op: 'print' }]; // if (fork()) fork(); printf
const progI = [{ op: 'fork' }, { op: 'print' }, { op: 'fork' }, { op: 'print' }]; // fork(); printf; fork(); printf
const E3 = tinh({
  tieuDe: 'fork 3 — How many processes and how many lines?',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi(`<p>Assume every <code>fork()</code> succeeds and that <code>printf</code> output always ends with a newline and is flushed (stdout is a terminal). For each fragment give the TOTAL number of processes that exist at the end (including the original) and the number of lines printed.</p>
${pre('A:  fork(); fork(); fork(); printf("x\\n");\nB:  if (fork() == 0) { fork(); }  printf("x\\n");\nC:  int i; for (i = 0; i < 3; i++) if (fork() == 0) break;  printf("x\\n");\nD:  fork(); printf("x\\n"); fork(); printf("x\\n");\nE:  if (fork()) fork();  printf("x\\n");')}`,
    `<p>Giả sử mọi <code>fork()</code> thành công và <code>printf</code> luôn kết thúc bằng xuống dòng và được đẩy ra ngay (stdout là terminal). Với mỗi đoạn, cho TỔNG số tiến trình tồn tại cuối cùng (kể cả tiến trình gốc) và số dòng in ra.</p>
${pre('A:  fork(); fork(); fork(); printf("x\\n");\nB:  if (fork() == 0) { fork(); }  printf("x\\n");\nC:  int i; for (i = 0; i < 3; i++) if (fork() == 0) break;  printf("x\\n");\nD:  fork(); printf("x\\n"); fork(); printf("x\\n");\nE:  if (fork()) fork();  printf("x\\n");')}`),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Count processes and lines', 'Đếm tiến trình và dòng in'),
    cot: [{ ma: 'f', ten: 'Fragment' }, { ma: 'p', ten: 'Processes' }, { ma: 'l', ten: 'Lines printed' }],
    hang: ['A', 'B', 'C', 'D', 'E'].map((f) => ({ ma: f, o: { f } })),
    dapAn: {
      'A.p': String(S.processCount(progA)), 'A.l': String(S.printCount(progA)),
      'B.p': String(S.processCount(progB)), 'B.l': String(S.printCount(progB)),
      'C.p': '4', 'C.l': '4',
      'D.p': String(S.processCount(progI)), 'D.l': String(S.printCount(progI)),
      'E.p': String(S.processCount(progH)), 'E.l': String(S.printCount(progH)),
    },
    giaiThich: giai('A: every fork doubles → 2³ = 8 / 8. B: only the child forks again → 3 / 3 (parent, child, grandchild). C: each iteration the child breaks out of the loop, so 1 + 3 = 4 processes (the loop runs once more for the parent each time). D: after the first fork there are 2 printing processes (2 lines), after the second fork 4 processes each print once more → 4 processes, 2 + 4 = 6 lines. E: the parent forks twice (child of the first fork does not) → 3 / 3.', 'A: mỗi fork nhân đôi → 2³ = 8 / 8. B: chỉ con fork tiếp → 3 / 3. C: mỗi vòng con thoát vòng for nên tổng 1 + 3 = 4. D: sau fork thứ nhất có 2 tiến trình in (2 dòng), sau fork thứ hai có 4 tiến trình in thêm mỗi cái 1 dòng → 4 tiến trình, 2 + 4 = 6 dòng. E: chỉ cha fork hai lần → 3 / 3.'),
  }],
  goiY: ['Draw the process tree. Every fork() splits ONE process into two that both continue after the call.', 'Count printf lines per process: a process that printed before a fork has already contributed its line.'],
  loiHayGap: ['Counting 2ⁿ processes for the loop in C — the child leaves the loop with break.', 'Forgetting that the original process also prints (counting only the new children).'],
  giaiThich: '<p>A 8/8 · B 3/3 · C 4/4 · D 4/6 · E 3/3. (Checked by compiling and running each fragment.)</p>',
  thuatNgu: [tn('process tree', 'cây tiến trình'), tn('fork bomb', 'nổ fork: fork vô hạn')],
  khaiNiem: ['fork', 'process tree'],
});

/* Bài 4 MEDIUM — buffering & wait */
const E4 = tinh({
  tieuDe: 'fork 4 — Output buffering and wait(): what really gets printed?',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi(`<p>This program runs with its output <b>redirected to a file or pipe</b> (stdout is then fully buffered, not line-buffered):</p>${pre('int main() {\n  printf("x");\n  fork();\n  printf("y\\n");\n  return 0;\n}')}<p>Answer the questions.</p>`,
    `<p>Chương trình chạy với đầu ra <b>chuyển hướng ra tệp hoặc pipe</b> (stdout khi đó đệm hoàn toàn, không đệm theo dòng):</p>${pre('int main() {\n  printf("x");\n  fork();\n  printf("y\\n");\n  return 0;\n}')}<p>Trả lời các câu hỏi.</p>`),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['How many times does the character x appear in the output when stdout is a pipe?', 'Ký tự x xuất hiện mấy lần khi stdout là pipe?'], [['a', '1'], ['b', '2'], ['c', '0'], ['d', '3']], 'b', ['"x" sits in the stdio buffer when fork() copies the address space, so both processes flush it: "xy" appears twice (verified by running it with | wc).', '"x" còn nằm trong bộ đệm stdio lúc fork() sao chép không gian địa chỉ, nên cả hai tiến trình đều đẩy nó ra: “xy” xuất hiện hai lần (đã chạy thật với | wc).']),
    mc('c2', ['How many times does x appear when stdout is a terminal (line-buffered)?', 'Khi stdout là terminal (đệm theo dòng) x xuất hiện mấy lần?'], [['a', '1'], ['b', '2'], ['c', '0'], ['d', 'Undefined']], 'b', ['Careful: "x" has no newline, so it is STILL in the buffer at fork time even on a terminal; both copies flush at the "\\n" → "xy" twice. Only fflush(stdout) before fork gives one x.', 'Cẩn thận: “x” không có xuống dòng nên VẪN nằm trong bộ đệm lúc fork kể cả trên terminal; cả hai bản cùng đẩy ra ở “\\n” → “xy” hai lần. Chỉ fflush(stdout) trước fork mới ra một x.']),
    mc('c3', ['Which change guarantees exactly ONE x?', 'Thay đổi nào đảm bảo CHỈ MỘT x?'], [['a', 'Call fflush(stdout) right after printf("x")'], ['b', 'Call wait(NULL) after fork() in the parent'], ['c', 'Use exit(0) instead of return 0'], ['d', 'Call sleep(1) after fork() in both processes']], 'a', ['Flushing empties the buffer BEFORE it is duplicated by fork().', 'Đẩy bộ đệm ra TRƯỚC khi fork() nhân đôi nó.']),
    mc('c4', ['What does wait(NULL) in the parent do?', 'wait(NULL) trong tiến trình cha làm gì?'], [['a', 'Blocks until one child terminates and reaps it'], ['b', 'Kills all children'], ['c', 'Waits until the parent is the only process'], ['d', 'Returns immediately with the exit status']], 'a', ['wait suspends the caller until a child exits and then frees the child’s PCB (no zombie).', 'wait treo tiến trình gọi tới khi một con thoát rồi giải phóng PCB của con (không còn zombie).']),
  ],
  goiY: ['stdio buffers live in user memory, so fork() copies them together with everything else.', 'Compile and run it twice: once to the terminal, once with | cat.'],
  loiHayGap: ['Thinking fork() duplicates only the CPU registers and not the user-space buffer.', 'Believing wait() changes what the child prints.'],
  giaiThich: '<p>A classic exam trap: the duplicated stdio buffer.</p>',
  thuatNgu: [tn('stdio buffer', 'bộ đệm thư viện C ở không gian người dùng'), tn('fflush', 'đẩy bộ đệm ra thiết bị')],
  khaiNiem: ['fork', 'stdio buffering', 'wait'],
});

/* Bài 5 MEDIUM — order: vòng đời lệnh shell */
const SEQ = ['Shell reads the line "ls -l"', 'Shell calls fork(): a child process is created', 'Child calls exec("ls", …): its image is replaced', 'Parent shell calls wait() and blocks', 'ls runs, prints the listing and calls exit(0)', 'Kernel marks the child terminated and wakes the parent', 'wait() returns the exit status; the shell prints the prompt'];
const E5 = tinh({
  tieuDe: 'fork 5 — Order the life of the command “ls -l”',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Arrange the steps from the moment the shell reads the command until the prompt returns.</p>', '<p>Sắp xếp các bước từ lúc shell đọc lệnh tới khi dấu nhắc quay lại.</p>'),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('Life of a foreground command', 'Vòng đời một lệnh chạy ở foreground'),
    muc: xoay(SEQ.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), 3), dapAn: SEQ.map((_, i) => `s${i + 1}`),
    giaiThich: giai('fork → exec (child) and wait (parent) → exit (child) → wake the parent → prompt. exec happens in the child, wait in the parent; the parent’s wait can start before or after the child’s exec, but both happen before the child exits.', 'fork → exec (con) và wait (cha) → exit (con) → đánh thức cha → dấu nhắc. exec ở tiến trình con, wait ở cha.'),
  }],
  goiY: ['Who creates whom first? fork comes before exec.', 'The shell prints the prompt only after wait() returns.'],
  loiHayGap: ['Putting exec before fork (the shell would be overwritten).', 'Placing wait() after exit() — wait blocks the parent until the child exits.'],
  giaiThich: '<p>read → fork → exec → wait → run+exit → mark terminated → prompt.</p>',
  thuatNgu: [tn('foreground job', 'tiến trình chạy trước: shell đợi nó xong')],
  khaiNiem: ['fork-exec-wait', 'shell'],
});

/* Bài 6 HARD — viết processCount */
const refPC = (prog) => S.processCount(prog);
const E6 = jsDe({
  tieuDe: 'fork 6 — Write a fork-tree counter',
  doKho: 'HARD', phut: 20,
  moTa: bi(`<p>A tiny program is an array of statements: <code>{ op: 'fork' }</code> (an unconditional <code>fork()</code>), <code>{ op: 'forkIf', who: 'child' | 'parent', then: [ …statements ] }</code> (<code>if (fork() == 0) { then }</code> for <code>'child'</code>, <code>if (fork() != 0) { then }</code> for <code>'parent'</code>) and <code>{ op: 'print' }</code>. Statements after an <code>if</code> are executed by BOTH resulting processes.</p>
<p>Write <code>processCount(prog)</code> (total processes at the end, counting the original) and <code>printCount(prog)</code> (total number of <code>print</code> executions over all processes).</p>`,
    `<p>Một chương trình nhỏ là mảng lệnh: <code>{ op: 'fork' }</code> (<code>fork()</code> không điều kiện), <code>{ op: 'forkIf', who: 'child' | 'parent', then: [ …lệnh ] }</code> (<code>if (fork() == 0) { then }</code> với <code>'child'</code>, <code>if (fork() != 0) { then }</code> với <code>'parent'</code>) và <code>{ op: 'print' }</code>. Các lệnh SAU một <code>if</code> được CẢ HAI tiến trình thực hiện.</p>
<p>Viết <code>processCount(prog)</code> (tổng số tiến trình cuối cùng, kể cả tiến trình gốc) và <code>printCount(prog)</code> (tổng số lần <code>print</code> trên mọi tiến trình).</p>`),
  yeuCau: [bi('Both functions must handle nested <code>forkIf</code> blocks.', 'Cả hai hàm phải xử lý <code>forkIf</code> lồng nhau.')],
  viDu: [{ input: "processCount([{op:'forkIf', who:'child', then:[{op:'fork'}]}, {op:'print'}])", output: '3', explanation: 'Parent stays 1; the child forks once more: 3 processes.|||Cha vẫn là 1; con fork thêm một lần: 3 tiến trình.' }],
  goiY: ['Think recursively: processes(prog) = processes seen by the parent branch + by the child branch, each continuing with the REST of the statements.', 'For forkIf: the matching side runs then + rest, the other side runs only rest.'],
  loiHayGap: ['Forgetting that the statements after an if are executed by both processes.', 'Counting a nested then-block once even though the process that enters it may be duplicated later.'],
  giaiThich: '<p>A process executing statements <code>ls</code> yields count(ls). For <code>fork</code> both continue with the rest, so 2·count(rest). For <code>forkIf</code> one side executes then + rest and the other only rest. <code>print</code> adds 1 per executing process.</p>',
  khaiNiem: ['process tree', 'recursion'],
  fn: 'processCount',
  dau: "// Write processCount(prog) and printCount(prog)\nfunction processCount(prog) {\n  return 0;\n}\nfunction printCount(prog) {\n  return 0;\n}\n",
  giaiMa: '// Recursive counting: a fork duplicates the REST of the program.\n' + nguon(S.processCount, S.printCount).replace(/export function/g, 'function'),
  ref: refPC,
  cases: [
    { args: [[{ op: 'fork' }, { op: 'fork' }, { op: 'fork' }, { op: 'print' }]] },
    { args: [[{ op: 'forkIf', who: 'child', then: [{ op: 'fork' }] }, { op: 'print' }]] },
    { args: [[{ op: 'forkIf', who: 'parent', then: [{ op: 'fork' }] }, { op: 'print' }]] },
    { args: [[{ op: 'print' }, { op: 'fork' }, { op: 'print' }, { op: 'fork' }, { op: 'print' }]] },
    { args: [[{ op: 'forkIf', who: 'child', then: [{ op: 'forkIf', who: 'child', then: [{ op: 'fork' }] }, { op: 'print' }] }, { op: 'fork' }]], an: true },
    { args: [[]], an: true },
  ],
  kiemThem: (() => {
    const progs = [
      [{ op: 'fork' }, { op: 'print' }, { op: 'fork' }, { op: 'print' }],
      [{ op: 'forkIf', who: 'child', then: [{ op: 'fork' }, { op: 'print' }] }, { op: 'print' }],
      [{ op: 'print' }, { op: 'forkIf', who: 'parent', then: [{ op: 'forkIf', who: 'parent', then: [{ op: 'fork' }] }] }, { op: 'print' }],
    ];
    return progs.map((p, i) => ({ moTa: bi(`printCount, program ${i + 1}`, `printCount, chương trình ${i + 1}`), goi: `printCount(${JSON.stringify(p)})`, mongDoi: S.printCount(p), ...(i === 2 ? { an: true } : {}) }));
  })(),
});

export default doiDau({
  slug: 'osg202-2-3-fork-exec',
  ten: '2.3 Process states, the PCB & fork/exec',
  khoa: KHOA,
  baiHoc: 'osg202-2-3-fork-exec',
  de: [E1, E2, E3, E4, E5, E6],
});
void hai; void lc;
