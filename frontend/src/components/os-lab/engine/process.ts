/**
 * Mô hình tiến trình rút gọn: cây cha–con, trạng thái, fork/exec/wait/exit/kill, zombie, mồ côi, luồng.
 * Mỗi kịch bản = dãy hành động + lời giải thích; `run()` trả về dãy ảnh chụp để bộ phát tua tới/lui.
 */
export type PSt = 'ready' | 'running' | 'blocked' | 'stopped' | 'zombie';
export interface Proc { pid: number; ppid: number; name: string; st: PSt; threads: number; exit?: number; waiting?: boolean; rss?: number }
export interface World { procs: Proc[]; next: number; term: string[]; reaped: number[] }
export type Act =
  | { k: 'fork'; pid: number; name?: string }
  | { k: 'run'; pid: number }
  | { k: 'ready'; pid: number }
  | { k: 'exec'; pid: number; prog: string }
  | { k: 'wait'; pid: number }
  | { k: 'block'; pid: number }
  | { k: 'wake'; pid: number }
  | { k: 'exit'; pid: number; code: number }
  | { k: 'kill'; pid: number; sig: number }
  | { k: 'stop'; pid: number }
  | { k: 'cont'; pid: number }
  | { k: 'thread'; pid: number }
  | { k: 'rss'; pid: number; mb: number }
  | { k: 'print'; line: string };
export interface Step { a: Act[]; en: string; vi: string; line?: number }
export interface Scenario { id: string; en: string; vi: string; code: string[]; codeLang: string; start: World; steps: Step[] }

const clone = (w: World): World => ({ procs: w.procs.map((p) => ({ ...p })), next: w.next, term: [...w.term], reaped: [...w.reaped] });

export function apply(w0: World, act: Act): World {
  const w = clone(w0);
  const P = (pid: number) => w.procs.find((p) => p.pid === pid);
  const reap = (child: Proc) => {
    w.procs = w.procs.filter((p) => p !== child);
    w.reaped.push(child.pid);
  };
  switch (act.k) {
    case 'fork': {
      const par = P(act.pid); if (!par) break;
      w.procs.push({ pid: w.next, ppid: par.pid, name: act.name ?? par.name, st: 'ready', threads: 1, rss: par.rss });
      w.next++;
      break;
    }
    case 'run': {
      for (const p of w.procs) if (p.st === 'running') p.st = 'ready';
      const p = P(act.pid); if (p) { p.st = 'running'; p.waiting = false; }
      break;
    }
    case 'ready': { const p = P(act.pid); if (p) p.st = 'ready'; break; }
    case 'exec': { const p = P(act.pid); if (p) { p.name = act.prog; p.threads = 1; } break; }
    case 'block': { const p = P(act.pid); if (p) p.st = 'blocked'; break; }
    case 'wake': { const p = P(act.pid); if (p) { p.st = 'ready'; p.waiting = false; } break; }
    case 'stop': { const p = P(act.pid); if (p) p.st = 'stopped'; break; }
    case 'cont': { const p = P(act.pid); if (p) p.st = 'ready'; break; }
    case 'thread': { const p = P(act.pid); if (p) p.threads++; break; }
    case 'rss': { const p = P(act.pid); if (p) p.rss = act.mb; break; }
    case 'print': w.term.push(act.line); break;
    case 'wait': {
      const par = P(act.pid); if (!par) break;
      const z = w.procs.find((p) => p.ppid === par.pid && p.st === 'zombie');
      if (z) reap(z);
      else if (w.procs.some((p) => p.ppid === par.pid)) { par.st = 'blocked'; par.waiting = true; }
      break;
    }
    case 'kill':
    case 'exit': {
      const p = P(act.pid); if (!p) break;
      p.st = 'zombie'; p.exit = act.k === 'kill' ? 128 + act.sig : act.code; p.threads = 0; p.rss = 0;
      for (const c of w.procs) if (c.ppid === p.pid) c.ppid = 1; // mồ côi ⇒ PID 1 nhận nuôi
      const par = P(p.ppid);
      if (par && par.pid === 1) {
        // init/systemd luôn wait() cho con ⇒ dọn ngay; nhưng để thấy được, kịch bản tự gọi wait cho PID 1
      }
      break;
    }
  }
  return w;
}

export function run(sc: Scenario): World[] {
  const out = [sc.start];
  let w = sc.start;
  for (const st of sc.steps) { for (const a of st.a) w = apply(w, a); out.push(w); }
  return out;
}

export const stat = (p: Proc) => (p.st === 'zombie' ? 'Z' : p.st === 'blocked' ? 'S' : p.st === 'stopped' ? 'T' : 'R');
export function psLines(w: World) {
  const rows = [...w.procs].sort((a, b) => a.pid - b.pid).map((p) =>
    `${String(p.pid).padStart(5)} ${String(p.ppid).padStart(5)} ${stat(p).padEnd(4)} ${p.st === 'zombie' ? `[${p.name}] <defunct>` : p.name}`);
  return ['  PID  PPID STAT CMD', ...rows];
}

const base = (extra: Proc[] = [], next = 101): World => ({
  procs: [
    { pid: 1, ppid: 0, name: 'systemd', st: 'blocked', threads: 1 },
    { pid: 100, ppid: 1, name: 'bash', st: 'running', threads: 1, rss: 5 },
    ...extra,
  ],
  next, term: [], reaped: [],
});

export const SCENARIOS: Scenario[] = [
  {
    id: 'shell', en: 'A shell runs one command: fork → exec → wait', vi: 'Shell chạy một lệnh: fork → exec → wait', codeLang: 'c',
    code: [
      'while (1) {',
      '  read_line(line);              // "ls"',
      '  pid_t pid = fork();           // one process becomes two',
      '  if (pid == 0) {               // child',
      '    execvp("ls", argv);         // become ls',
      '    _exit(127);                 // only if exec failed',
      '  }',
      '  int status;',
      '  waitpid(pid, &status, 0);     // parent sleeps',
      '  printf("exit=%d\\n", WEXITSTATUS(status));',
      '}',
    ],
    start: { ...base(), procs: base().procs.map((p) => (p.pid === 100 ? { ...p, st: 'blocked' as PSt } : p)) },
    steps: [
      { a: [{ k: 'print', line: '$ ls' }, { k: 'wake', pid: 100 }, { k: 'run', pid: 100 }], line: 2,
        en: 'bash was asleep (S) inside read() waiting for the keyboard. You press Enter: the kernel wakes it, it becomes Ready, then the scheduler gives it the CPU (Running).',
        vi: 'bash đang ngủ (S) trong read(), chờ bàn phím. Bạn bấm Enter: nhân đánh thức nó, nó thành Sẵn sàng, rồi bộ lập lịch cho nó CPU (Đang chạy).' },
      { a: [{ k: 'fork', pid: 100 }], line: 3,
        en: 'fork(): the kernel copies bash. PID 101 is a new process — same code, a copy-on-write copy of the memory, its own PID. fork returns 101 to the parent and 0 to the child.',
        vi: 'fork(): nhân nhân bản bash. PID 101 là tiến trình mới — cùng mã, bản sao copy-on-write của bộ nhớ, PID riêng. fork trả 101 cho cha và 0 cho con.' },
      { a: [{ k: 'wait', pid: 100 }, { k: 'run', pid: 101 }], line: 9,
        en: 'The parent calls waitpid() and goes to sleep (S). The child (Ready) now gets the CPU.',
        vi: 'Cha gọi waitpid() rồi đi ngủ (S). Con (Sẵn sàng) giờ được CPU.' },
      { a: [{ k: 'exec', pid: 101, prog: 'ls' }], line: 5,
        en: 'execvp("ls"): the child throws away the copy of bash and loads the ls program into ITSELF. Same PID 101, new code. exec never returns on success.',
        vi: 'execvp("ls"): con vứt bản sao bash và nạp chương trình ls vào CHÍNH NÓ. Vẫn PID 101, mã mới. exec thành công thì không bao giờ quay lại.' },
      { a: [{ k: 'print', line: 'notes.txt  server.js  package.json' }], line: 5,
        en: 'ls does its work: a few system calls (openat, getdents64, write) and the listing appears.',
        vi: 'ls làm việc: vài system call (openat, getdents64, write) và danh sách hiện ra.' },
      { a: [{ k: 'exit', pid: 101, code: 0 }], line: 5,
        en: 'ls calls exit(0). Its memory is freed, but a tiny record (PID + exit code) stays: the process is a ZOMBIE (Z) until its parent collects the code.',
        vi: 'ls gọi exit(0). Bộ nhớ được giải phóng, nhưng còn một bản ghi nhỏ (PID + mã thoát): tiến trình là ZOMBIE (Z) cho tới khi cha nhận mã.' },
      { a: [{ k: 'wake', pid: 100 }, { k: 'wait', pid: 100 }, { k: 'run', pid: 100 }, { k: 'print', line: 'exit=0' }], line: 10,
        en: 'The kernel wakes the parent; waitpid() returns status 0 and the zombie is reaped — PID 101 is gone for good. bash loops back to read the next command.',
        vi: 'Nhân đánh thức cha; waitpid() trả về status 0 và zombie được dọn — PID 101 biến mất hẳn. bash quay lại đọc lệnh tiếp theo.' },
    ],
  },
  {
    id: 'zombie', en: 'Zombies: a parent that never calls wait()', vi: 'Zombie: tiến trình cha không bao giờ gọi wait()', codeLang: 'c',
    code: [
      'int main(void) {',
      '  for (int i = 0; i < 3; i++)',
      '    if (fork() == 0) {           // worker',
      '      do_job();',
      '      exit(0);                   // becomes a zombie',
      '    }',
      '  for (;;) serve_forever();      // BUG: never wait()',
      '}',
      '// fix: signal(SIGCHLD, SIG_IGN) or waitpid(-1,&st,WNOHANG)',
    ],
    start: base([{ pid: 200, ppid: 100, name: 'server', st: 'running', threads: 1, rss: 30 }], 201),
    steps: [
      { a: [{ k: 'ready', pid: 100 }, { k: 'block', pid: 100 }, { k: 'fork', pid: 200 }, { k: 'fork', pid: 200 }, { k: 'fork', pid: 200 }], line: 3,
        en: 'The server forks three workers (201, 202, 203). They are Ready; the server keeps running.',
        vi: 'Máy chủ fork ba worker (201, 202, 203). Chúng Sẵn sàng; máy chủ chạy tiếp.' },
      { a: [{ k: 'run', pid: 201 }, { k: 'exit', pid: 201, code: 0 }, { k: 'run', pid: 202 }, { k: 'exit', pid: 202, code: 0 }, { k: 'run', pid: 203 }, { k: 'exit', pid: 203, code: 0 }, { k: 'run', pid: 200 }], line: 5,
        en: 'Each worker does its job and exits. Nobody calls wait(), so all three stay as zombies: ps shows Z and <defunct>. They use no CPU and no RAM — but each holds a PID.',
        vi: 'Từng worker làm xong và thoát. Không ai gọi wait(), nên cả ba nằm lại thành zombie: ps hiện Z và <defunct>. Chúng không tốn CPU hay RAM — nhưng mỗi con giữ một PID.' },
      { a: [{ k: 'print', line: '$ ps -o pid,ppid,stat,cmd --ppid 200' }], line: 7,
        en: 'Why it matters: PIDs are limited (cat /proc/sys/kernel/pid_max; a container may have pids.max = a few hundred). A server that leaks zombies eventually gets "fork: Resource temporarily unavailable". kill -9 on a zombie does nothing — it is already dead.',
        vi: 'Vì sao đáng lo: PID có hạn (cat /proc/sys/kernel/pid_max; container có thể chỉ có pids.max vài trăm). Máy chủ rò zombie đến lúc sẽ gặp "fork: Resource temporarily unavailable". kill -9 một zombie chẳng làm gì — nó đã chết rồi.' },
      { a: [{ k: 'kill', pid: 200, sig: 15 }], line: 7,
        en: 'Kill the parent (SIGTERM). The server itself becomes a zombie of bash, and its three zombie children are orphans: the kernel re-parents them to PID 1.',
        vi: 'Giết cha (SIGTERM). Máy chủ thành zombie của bash, còn ba đứa con zombie thành mồ côi: nhân chuyển chúng cho PID 1 nuôi.' },
      { a: [{ k: 'wake', pid: 1 }, { k: 'wait', pid: 1 }, { k: 'wait', pid: 1 }, { k: 'wait', pid: 1 }, { k: 'block', pid: 1 }, { k: 'wake', pid: 100 }, { k: 'wait', pid: 100 }, { k: 'run', pid: 100 }, { k: 'print', line: '[1]+  Terminated              ./server' }], line: 9,
        en: 'PID 1 (systemd, or tini in a container) always calls wait(), so it reaps the orphans at once; bash reaps the server (exit code 143 = 128 + 15). In a container whose PID 1 is your app, nobody does this job — that is why Docker has --init.',
        vi: 'PID 1 (systemd, hoặc tini trong container) luôn gọi wait(), nên dọn ngay đám mồ côi; bash dọn máy chủ (mã thoát 143 = 128 + 15). Trong container mà PID 1 là chính app của bạn thì không ai làm việc này — vì thế Docker có --init.' },
    ],
  },
  {
    id: 'orphan', en: 'Orphans: the parent dies first', vi: 'Mồ côi: cha chết trước', codeLang: 'c',
    code: [
      'pid_t pid = fork();',
      'if (pid == 0) {           // child',
      '  sleep(5);',
      '  printf("my parent is %d\\n", getppid());',
      '  exit(0);',
      '}',
      'exit(0);                  // parent leaves at once',
    ],
    start: base([{ pid: 300, ppid: 100, name: 'a.out', st: 'running', threads: 1, rss: 1 }], 301),
    steps: [
      { a: [{ k: 'block', pid: 100 }, { k: 'fork', pid: 300 }], line: 1,
        en: 'a.out (PID 300) forks a child, PID 301.', vi: 'a.out (PID 300) fork một con, PID 301.' },
      { a: [{ k: 'run', pid: 301 }, { k: 'block', pid: 301 }], line: 3,
        en: 'The child calls sleep(5): Blocked (S) for five seconds.', vi: 'Con gọi sleep(5): Bị chặn (S) trong năm giây.' },
      { a: [{ k: 'run', pid: 300 }, { k: 'exit', pid: 300, code: 0 }], line: 7,
        en: 'The parent exits immediately. The child is now an orphan — the kernel sets its PPID to 1 (or to the nearest "subreaper", e.g. systemd --user).',
        vi: 'Cha thoát ngay. Con giờ là mồ côi — nhân đặt PPID của nó thành 1 (hoặc "subreaper" gần nhất, vd. systemd --user).' },
      { a: [{ k: 'wake', pid: 100 }, { k: 'wait', pid: 100 }, { k: 'run', pid: 100 }, { k: 'print', line: '$ ' }], line: 7,
        en: 'bash reaps the parent and shows the prompt again… while the orphan keeps sleeping in the background.',
        vi: 'bash dọn cha và hiện lại dấu nhắc… trong khi đứa mồ côi vẫn ngủ ở nền.' },
      { a: [{ k: 'wake', pid: 301 }, { k: 'run', pid: 301 }, { k: 'print', line: 'my parent is 1' }, { k: 'exit', pid: 301, code: 0 }], line: 4,
        en: 'Five seconds later it wakes and prints "my parent is 1", printed AFTER the prompt — the classic orphan symptom. Then it exits…',
        vi: 'Năm giây sau nó thức dậy và in "my parent is 1", in SAU dấu nhắc — triệu chứng kinh điển của mồ côi. Rồi nó thoát…' },
      { a: [{ k: 'wake', pid: 1 }, { k: 'wait', pid: 1 }, { k: 'block', pid: 1 }, { k: 'block', pid: 100 }], line: 5,
        en: '…and PID 1 reaps it. Orphans are harmless as long as PID 1 does its job.',
        vi: '…và PID 1 dọn nó. Mồ côi vô hại miễn là PID 1 làm đúng việc.' },
    ],
  },
  {
    id: 'fork3', en: 'Exam classic: fork(); fork(); fork();', vi: 'Câu thi kinh điển: fork(); fork(); fork();', codeLang: 'c',
    code: [
      'int main(void) {',
      '  fork();',
      '  fork();',
      '  fork();',
      '  printf("hi\\n");',
      '  return 0;',
      '}',
    ],
    start: base([{ pid: 400, ppid: 100, name: 'a.out', st: 'running', threads: 1, rss: 1 }], 401),
    steps: [
      { a: [{ k: 'block', pid: 100 }, { k: 'fork', pid: 400 }], line: 2,
        en: 'First fork(): 1 process → 2 (400 and 401). BOTH continue from the next line.', vi: 'fork() thứ nhất: 1 tiến trình → 2 (400 và 401). CẢ HAI chạy tiếp từ dòng sau.' },
      { a: [{ k: 'fork', pid: 400 }, { k: 'fork', pid: 401 }], line: 3,
        en: 'Second fork(): each of the 2 forks → 4 processes.', vi: 'fork() thứ hai: mỗi con trong 2 con đều fork → 4 tiến trình.' },
      { a: [{ k: 'fork', pid: 400 }, { k: 'fork', pid: 401 }, { k: 'fork', pid: 402 }, { k: 'fork', pid: 403 }], line: 4,
        en: 'Third fork(): 4 → 8. In general n calls in a row give 2ⁿ processes (2ⁿ − 1 of them new).', vi: 'fork() thứ ba: 4 → 8. Tổng quát: n lần gọi liên tiếp cho 2ⁿ tiến trình (2ⁿ − 1 tiến trình mới).' },
      { a: [{ k: 'print', line: 'hi\nhi\nhi\nhi\nhi\nhi\nhi\nhi' }], line: 5,
        en: '8 processes ⇒ "hi" is printed 8 times. The order between them is up to the scheduler.', vi: '8 tiến trình ⇒ "hi" in ra 8 lần. Thứ tự giữa chúng do bộ lập lịch quyết định.' },
      { a: [401, 402, 403, 404, 405, 406, 407, 400].map((pid) => ({ k: 'exit' as const, pid, code: 0 })), line: 6,
        en: 'All return 0. The children are zombies until their own parents reap them — but these parents exit too, so most of them end up reaped by PID 1.',
        vi: 'Tất cả return 0. Các con là zombie cho tới khi cha của chính chúng dọn — nhưng cha cũng thoát luôn, nên phần lớn cuối cùng do PID 1 dọn.' },
      { a: [{ k: 'wake', pid: 1 }, ...Array.from({ length: 7 }, () => ({ k: 'wait' as const, pid: 1 })), { k: 'block', pid: 1 }, { k: 'wake', pid: 100 }, { k: 'wait', pid: 100 }, { k: 'run', pid: 100 }], line: 6,
        en: 'PID 1 and bash collect every exit code. Back to one shell. Try it yourself in the lab: gcc fork3.c && ./a.out | wc -l prints 8.',
        vi: 'PID 1 và bash nhận hết mã thoát. Quay về một shell. Tự thử trong phòng lab: gcc fork3.c && ./a.out | wc -l in ra 8.' },
    ],
  },
  {
    id: 'oom137', en: 'Exit 137: the OOM killer ends a build', vi: 'Exit 137: OOM killer kết liễu một lần build', codeLang: 'bash',
    code: [
      '$ npm run build          # next build',
      '  …',
      'Killed',
      '$ echo $?',
      '137                      # 128 + 9 (SIGKILL)',
      '$ dmesg | grep -i oom',
      'Out of memory: Killed process 4242 (node) …',
    ],
    start: base(),
    steps: [
      { a: [{ k: 'print', line: '$ npm run build' }, { k: 'fork', pid: 100 }, { k: 'wait', pid: 100 }, { k: 'run', pid: 101 }, { k: 'exec', pid: 101, prog: 'node next build' }, { k: 'rss', pid: 101, mb: 900 }], line: 1,
        en: 'bash fork+execs node for next build and waits. The build starts at ~0.9 GB of RAM.', vi: 'bash fork+exec node để chạy next build rồi chờ. Bản build bắt đầu với ~0,9 GB RAM.' },
      { a: [{ k: 'thread', pid: 101 }, { k: 'thread', pid: 101 }, { k: 'thread', pid: 101 }, { k: 'rss', pid: 101, mb: 2600 }], line: 2,
        en: 'Node spins up worker threads to compile pages in parallel; memory climbs to 2.6 GB.', vi: 'Node bật thêm luồng worker để biên dịch song song; bộ nhớ leo lên 2,6 GB.' },
      { a: [{ k: 'rss', pid: 101, mb: 5900 }], line: 2,
        en: 'With another build running on the same 6 GB VPS, free memory hits zero. Page cache is gone, swap is full, the machine crawls (thrashing — Chapter 8).',
        vi: 'Có thêm một lần build khác chạy cùng trên VPS 6 GB, bộ nhớ trống chạm 0. Page cache bị vét sạch, swap đầy, máy bò như rùa (thrashing — Chương 8).' },
      { a: [{ k: 'kill', pid: 101, sig: 9 }], line: 3,
        en: 'The kernel\'s OOM killer picks the biggest process (highest oom_score) and sends SIGKILL — a signal that cannot be caught. No error message from node itself: it simply stops existing.',
        vi: 'OOM killer của nhân chọn tiến trình to nhất (oom_score cao nhất) và gửi SIGKILL — tín hiệu không bắt được. node không kịp in lỗi gì: nó chỉ đơn giản là biến mất.' },
      { a: [{ k: 'wake', pid: 100 }, { k: 'wait', pid: 100 }, { k: 'run', pid: 100 }, { k: 'print', line: 'Killed' }, { k: 'print', line: '$ echo $?' }, { k: 'print', line: '137' }], line: 5,
        en: 'bash reaps it: "terminated by signal 9" ⇒ the shell reports 128 + 9 = 137. Docker shows "Exited (137)". Whenever you see 137, check dmesg / journalctl -k for "Out of memory".',
        vi: 'bash dọn nó: "chết vì tín hiệu 9" ⇒ shell báo 128 + 9 = 137. Docker hiện "Exited (137)". Hễ thấy 137 là xem dmesg / journalctl -k tìm "Out of memory".' },
    ],
  },
  {
    id: 'threads', en: 'Threads vs processes: same PID, shared memory', vi: 'Luồng vs tiến trình: cùng PID, chung bộ nhớ', codeLang: 'c',
    code: [
      'int counter = 0;                 // shared by all threads',
      'void *work(void *a) { counter++; return 0; }',
      'int main(void) {',
      '  pthread_t t[3];',
      '  for (int i = 0; i < 3; i++)',
      '    pthread_create(&t[i], 0, work, 0);',
      '  for (int i = 0; i < 3; i++) pthread_join(t[i], 0);',
      '  if (fork() == 0) { counter = 100; exit(0); } // child: its own copy',
      '  wait(0); printf("%d\\n", counter);           // still 3',
      '}',
    ],
    start: base([{ pid: 500, ppid: 100, name: 'a.out', st: 'running', threads: 1, rss: 1 }], 501),
    steps: [
      { a: [{ k: 'block', pid: 100 }, { k: 'thread', pid: 500 }, { k: 'thread', pid: 500 }, { k: 'thread', pid: 500 }], line: 6,
        en: 'pthread_create ×3: still ONE process (PID 500) but now 4 threads. They share code, heap, globals and open files; each has its own stack and registers. ps -L or /proc/500/task shows them as LWPs (thread IDs).',
        vi: 'pthread_create ×3: vẫn MỘT tiến trình (PID 500) nhưng giờ có 4 luồng. Chúng chung mã, heap, biến toàn cục và file đang mở; mỗi luồng có stack và thanh ghi riêng. ps -L hay /proc/500/task hiện chúng là các LWP (mã luồng).' },
      { a: [{ k: 'print', line: 'counter = 3   (each thread did counter++ on the SAME variable)' }], line: 7,
        en: 'Each thread increments the same counter → 3. (With many increments this becomes a race condition — Chapter 5.)',
        vi: 'Mỗi luồng tăng cùng một biến counter → 3. (Tăng nhiều lần thì thành race condition — Chương 5.)' },
      { a: [{ k: 'fork', pid: 500 }], line: 8,
        en: 'fork() copies only the CALLING thread into the child, with a copy-on-write copy of memory. The child sets counter = 100 in ITS copy.',
        vi: 'fork() chỉ chép luồng ĐANG GỌI sang con, kèm bản sao copy-on-write của bộ nhớ. Con đặt counter = 100 trong BẢN CỦA NÓ.' },
      { a: [{ k: 'run', pid: 501 }, { k: 'exit', pid: 501, code: 0 }, { k: 'run', pid: 500 }, { k: 'wait', pid: 500 }, { k: 'print', line: '3' }], line: 9,
        en: 'The parent still prints 3: processes do NOT share memory, threads do. That one difference explains most of this course — and why threads need locks.',
        vi: 'Cha vẫn in 3: tiến trình KHÔNG chung bộ nhớ, luồng thì có. Một khác biệt đó giải thích phần lớn khoá học này — và vì sao luồng cần khoá.' },
    ],
  },
];

export const STATE_EDGES: Array<[PSt | 'new' | 'gone', PSt | 'gone', string, string]> = [
  ['new', 'ready', 'fork()', 'fork()'],
  ['ready', 'running', 'scheduled', 'được lập lịch'],
  ['running', 'ready', 'preempted', 'bị cắt ngang'],
  ['running', 'blocked', 'wait for I/O / sleep', 'chờ I/O / ngủ'],
  ['blocked', 'ready', 'event / wake up', 'sự kiện / đánh thức'],
  ['running', 'stopped', 'SIGSTOP / Ctrl-Z', 'SIGSTOP / Ctrl-Z'],
  ['stopped', 'ready', 'SIGCONT', 'SIGCONT'],
  ['running', 'zombie', 'exit() / killed', 'exit() / bị giết'],
  ['zombie', 'gone', 'parent\'s wait()', 'cha gọi wait()'],
];
