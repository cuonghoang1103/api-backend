/**
 * Operating Systems for Developers — Chương 16: Hệ điều hành trong thi cử và phỏng vấn (soạn 29/10/2026 theo _HOP-DONG.md).
 * Chương TỔNG HỢP: không dạy lại — ôn theo chủ đề (dẫn chứng là output THẬT của các chương trước, đọc lại qua run()),
 * luyện dạng bài tính toán của đề cuối kỳ OSG202 (đề MỚI, không chép ngân hàng content/exams/OSG202-*), 40 câu phỏng vấn
 * backend/bảo mật có câu trả lời mẫu + câu hỏi nối tiếp + bài để ôn, và bài thi cuối khoá 20 câu.
 * Output MỚI chạy thật trong os-lab:
 *   lab/code/ch16/osgcalc.py      bộ giải in từng bước: lập lịch (Gantt), thay trang, Banker/phát hiện, đĩa, địa chỉ, TLB, skew, semaphore
 *   lab/code/ch16/c163-lich.sh    → lab/out/c163-lich       (bài 16.3: S1–S3)
 *   lab/code/ch16/c164-bo-nho.sh  → lab/out/c164-bo-nho     (bài 16.4: M1–M5)
 *   lab/code/ch16/c165-banker-dia.sh → lab/out/c165-banker-dia (bài 16.5: B1–B4, K1–K2, Y1)
 *   lab/code/ch16/c168-thi.sh     → lab/out/c168-thi        (bài 16.8: các câu có tính toán)
 *   lab/code/ch16/kiem-engine.mts → lab/out/c16-engine      (đối chiếu LẦN HAI bằng bộ máy mô phỏng của /os-lab — 108/108 khớp)
 *   Tạo lại: lab/code/ch16/chay-tat-ca.sh (gắn frontend/src/components/os-lab/engine chỉ-đọc vào /engine).
 * Slug: 3 slug đã seed (os-16-1-cau-hoi, os-16-2-bai-tap, os-16-3-su-co) GIỮ NGUYÊN; bài mới os-16-4-on-tap-1, os-16-5-on-tap-2,
 * os-16-6-bo-nho, os-16-7-banker-dia; bài thi os-16-8-quiz. Thứ tự bài: ôn 1–2 → luyện thi 3–5 → phỏng vấn 6–7 → thi cuối khoá 8.
 * Deck slide os-16-1 … os-16-7 (theo SỐ BÀI trong tiêu đề).
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run as run0, card, kv, cmd, details, out, grab } from './_ui.mjs';
/** run() của _ui.mjs, bỏ các dòng chú thích song ngữ "# EN ||| VI" của kịch bản (chúng chỉ là nhãn bước, không phải output). */
const run = (name, prefix, n = 1, o = {}) => run0(name, prefix, n, { drop: /^# .*[|]{3}/, ...o });
import { lab } from './_lab.mjs';
import G161 from './giang/os-16-1.mjs';
import G162 from './giang/os-16-2.mjs';
import G163 from './giang/os-16-3.mjs';
import G164 from './giang/os-16-4.mjs';
import G165 from './giang/os-16-5.mjs';
import G166 from './giang/os-16-6.mjs';
import G167 from './giang/os-16-7.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
/** Phần đuôi của một lệnh trong output thật, từ dòng thứ `from` (vd. chỉ phần xét yêu cầu của Banker). */
const tail = (name, prefix, from) => out(grab(name, prefix, 1, { drop: /^# .*[|]{3}/ }).split('\n').slice(from).join('\n'));
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;
const a = (slug, text) => `<a href="${OS(slug)}">${text}</a>`;
const g = (slug, text) => `<a href="${OSG(slug)}">${text}</a>`;

/** Bảng ôn: [[khái niệm, một câu, con số đã đo, bài]] */
const sheet = (rows, h) => `<table><tr><th>${h[0]}</th><th>${h[1]}</th><th>${h[2]}</th><th>${h[3]}</th></tr>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>`;
/** Một câu luyện thi: đề (có 4 phương án) + lời giải gập lại. */
const drill = (id, stem, opts, sumSol, sol) => `<div class="callout ok"><p><strong>${id}.</strong> ${stem}</p><ul>${opts.map((o, i) => `<li><strong>${'ABCD'[i]}.</strong> ${o}</li>`).join('')}</ul></div>\n${details(sumSol, sol)}`;

/* ── 40 câu phỏng vấn: { q, a, f, fa, ls: [slug, nhãn] } — EN và VI song song ── */
const IV = (n, x, vi) => details(`<strong>Q${n}.</strong> ${vi ? x.q[1] : x.q[0]}`,
  `<p><strong>${vi ? 'Câu trả lời mẫu' : 'Model answer'}:</strong> ${vi ? x.a[1] : x.a[0]}</p>` +
  `<p><strong>${vi ? 'Câu hỏi nối tiếp' : 'Follow-up'}:</strong> <em>${vi ? x.f[1] : x.f[0]}</em> — ${vi ? x.fa[1] : x.fa[0]}</p>` +
  `<p>📖 ${x.ls.map(([s, t]) => a(s, (vi ? 'Bài ' : 'Lesson ') + t)).join(' · ')}</p>`);
const ivList = (list, from, vi) => list.map((x, i) => IV(from + i, x, vi)).join('\n');

/* ── Phỏng vấn (1/2): tiến trình, luồng, lập lịch, đồng bộ, bộ nhớ ── */
const IV1 = [
  { q: ['What is the difference between a process and a thread?', 'Tiến trình khác luồng thế nào?'],
    a: ['A process owns resources — an address space, file descriptors, credentials; a thread is a schedulable execution path inside it, with its own stack and registers but sharing the heap and fds with its siblings. Linux implements both with clone(): threads are tasks that share the memory map. Creating one is cheaper: I measured pthread_create+join at 56.9 µs against 132.8 µs for fork+wait and 302.6 µs for fork+exec+wait.',
        'Tiến trình sở hữu tài nguyên — không gian địa chỉ, file descriptor, danh tính; luồng là một dòng thực thi được lập lịch bên trong nó, có stack và thanh ghi riêng nhưng dùng chung heap và fd với các luồng anh em. Linux cài cả hai bằng clone(): luồng là các task dùng chung bản đồ bộ nhớ. Tạo luồng rẻ hơn: tôi đo pthread_create+join 56,9 µs so với fork+wait 132,8 µs và fork+exec+wait 302,6 µs.'],
    f: ['When would you choose processes anyway?', 'Khi nào bạn vẫn chọn tiến trình?'],
    fa: ['For isolation: a crash or memory corruption in one process cannot take down the others (browser tabs, PostgreSQL backends, Python multiprocessing to escape the GIL).', 'Để cách ly: một tiến trình sập hay hỏng bộ nhớ không kéo theo các tiến trình khác (tab trình duyệt, backend của PostgreSQL, multiprocessing của Python để thoát GIL).'],
    ls: [['os-1-1-tien-trinh', '1.1'], ['os-3-1-luong', '3.1']] },
  { q: ['What happens when a program calls fork()?', 'Chuyện gì xảy ra khi chương trình gọi fork()?'],
    a: ['The kernel creates a child that is a copy of the parent: same memory contents, same open files, a new PID. Memory is not copied up front — pages are shared read-only and copied on the first write (copy-on-write), so only the page tables are duplicated. fork returns twice: the child’s PID in the parent, 0 in the child. Usually the child then calls exec to become another program.',
        'Nhân tạo một tiến trình con là bản sao của cha: cùng nội dung bộ nhớ, cùng file đang mở, PID mới. Bộ nhớ không bị chép ngay — các trang được dùng chung ở chế độ chỉ đọc và chỉ bị chép ở lần ghi đầu tiên (copy-on-write), nên chỉ có bảng trang bị nhân đôi. fork trả về hai lần: PID của con ở phía cha, 0 ở phía con. Thường con sẽ gọi exec để trở thành chương trình khác.'],
    f: ['Why can fork be slow for a big process, and what do runtimes use instead?', 'Vì sao fork có thể chậm với tiến trình lớn, và runtime dùng gì thay thế?'],
    fa: ['Copying page tables grows with the parent’s memory (5 ms for a 512 MiB parent on Linux in 14.2); posix_spawn / vfork-style clone share memory until exec and stayed near 0.2 ms.', 'Việc chép bảng trang tăng theo bộ nhớ của cha (5 ms với cha 512 MiB trên Linux ở 14.2); posix_spawn / clone kiểu vfork dùng chung bộ nhớ tới khi exec và giữ quanh 0,2 ms.'],
    ls: [['os-1-2-fork-exec', '1.2'], ['os-7-3-page-fault', '7.3']] },
  { q: ['A container keeps exiting with code 137. What does that tell you?', 'Một container cứ thoát với mã 137. Điều đó nói gì?'],
    a: ['137 = 128 + 9: the process was killed by SIGKILL. In containers the usual sender is the kernel’s OOM killer, because the cgroup reached memory.max; the other common one is docker stop after its grace period. Check docker inspect (OOMKilled) right away or docker events (oom, die exitCode=137) and dmesg. I reproduced it: a Python process growing past --memory 256m died with 137 and OOMKilled true.',
        '137 = 128 + 9: tiến trình bị SIGKILL giết. Trong container thủ phạm thường gặp là OOM killer của nhân, vì cgroup chạm memory.max; trường hợp phổ biến khác là docker stop sau thời gian ân hạn. Kiểm docker inspect (OOMKilled) ngay, hoặc docker events (oom, die exitCode=137) và dmesg. Tôi đã tái hiện: một tiến trình Python lớn quá --memory 256m chết với 137 và OOMKilled true.'],
    f: ['docker inspect says OOMKilled=false although it restarted four times. Why?', 'docker inspect báo OOMKilled=false dù nó đã khởi động lại bốn lần. Vì sao?'],
    fa: ['inspect describes the current process, started after the last kill; docker events kept every oom + die 137 (measured in 17.3).', 'inspect mô tả tiến trình hiện tại, bật sau lần bị giết cuối; docker events vẫn giữ từng cặp oom + die 137 (đo ở 17.3).'],
    ls: [['os-1-4-vong-doi', '1.4'], ['os-8-4-exit137', '8.4'], ['os-17-3-chan-doan', '17.3']] },
  { q: ['What are zombie and orphan processes? Are zombies dangerous?', 'Tiến trình zombie và mồ côi là gì? Zombie có nguy hiểm không?'],
    a: ['A zombie has exited but its parent has not called wait(), so the kernel keeps its process-table entry and exit status. An orphan is still running but its parent died; it is re-parented to init (PID 1) or a subreaper, which reaps it. One zombie costs almost nothing; thousands exhaust the PID limit (pids.max), and then fork fails.',
        'Zombie đã thoát nhưng cha chưa gọi wait(), nên nhân giữ mục bảng tiến trình và mã thoát của nó. Mồ côi vẫn đang chạy nhưng cha đã chết; nó được giao cho init (PID 1) hoặc một subreaper, tiến trình đó sẽ thu dọn nó. Một zombie gần như không tốn gì; hàng nghìn zombie làm cạn giới hạn PID (pids.max), và khi đó fork hỏng.'],
    f: ['How do you get rid of a zombie?', 'Làm sao dọn một zombie?'],
    fa: ['You cannot kill it — it is already dead. Make the parent call wait (fix its SIGCHLD handling) or kill the parent so init adopts and reaps it.', 'Không giết được — nó đã chết rồi. Bắt cha gọi wait (sửa cách xử lý SIGCHLD) hoặc giết cha để init nhận nuôi và thu dọn nó.'],
    ls: [['os-1-2-fork-exec', '1.2'], ['os-1-4-vong-doi', '1.4']] },
  { q: ['What is special about PID 1 inside a container?', 'PID 1 trong container có gì đặc biệt?'],
    a: ['PID 1 gets no default signal actions — a signal without a handler is ignored — and it must reap orphaned children. A Node or Java app running as PID 1 without a SIGTERM handler ignores docker stop, waits out the grace period and is SIGKILLed (exit 137); its children become zombies. Fixes: handle SIGTERM, or run with --init (tini) so a tiny init is PID 1.',
        'PID 1 không có hành động mặc định cho tín hiệu — tín hiệu không có handler bị bỏ qua — và nó phải thu dọn các con mồ côi. Một app Node hay Java chạy làm PID 1 mà không có handler SIGTERM sẽ phớt lờ docker stop, đợi hết thời gian ân hạn rồi bị SIGKILL (exit 137); các con của nó thành zombie. Cách sửa: xử lý SIGTERM, hoặc chạy với --init (tini) để một init tí hon làm PID 1.'],
    f: ['Why does a shell-form CMD make this worse?', 'Vì sao CMD dạng shell làm chuyện này tệ hơn?'],
    fa: ['CMD npm start runs sh -c as PID 1; sh does not forward SIGTERM to the app. Use the exec form or exec in the script.', 'CMD npm start chạy sh -c làm PID 1; sh không chuyển SIGTERM cho app. Dùng dạng exec hoặc exec trong script.'],
    ls: [['os-1-5-pid1', '1.5']] },
  { q: ['What are user mode and kernel mode, and what does a system call cost?', 'Chế độ user và kernel là gì, và một system call tốn bao nhiêu?'],
    a: ['The CPU runs application code in an unprivileged mode; only the kernel, in privileged mode, may touch hardware, page tables or other processes. A system call is a controlled trap: arguments in registers, a syscall number, the kernel’s table, back with a result or errno. Measured in the lab: a plain function call 2.1 ns, getppid() 176 ns, clock_gettime through the vDSO 18.5 ns.',
        'CPU chạy mã ứng dụng ở chế độ không đặc quyền; chỉ nhân, ở chế độ đặc quyền, mới được đụng phần cứng, bảng trang hay tiến trình khác. System call là một cái bẫy có kiểm soát: đối số trong thanh ghi, một số syscall, bảng của nhân, trở về với kết quả hoặc errno. Đo trong lab: gọi hàm thường 2,1 ns, getppid() 176 ns, clock_gettime qua vDSO 18,5 ns.'],
    f: ['How would you reduce the number of system calls of a hot path?', 'Bạn giảm số system call của một đoạn mã nóng thế nào?'],
    fa: ['Batch: buffered writes, writev, one write per response, sendfile/copy_file_range; measure with strace -c first.', 'Gom lại: ghi có đệm, writev, mỗi câu trả lời một lần ghi, sendfile/copy_file_range; đo bằng strace -c trước.'],
    ls: [['os-1-3-che-do', '1.3'], ['os-11-5-chi-phi', '11.4']] },
  { q: ['What is a context switch, and when does its cost matter?', 'Chuyển ngữ cảnh là gì, và khi nào cái giá của nó đáng kể?'],
    a: ['Saving the registers of one task and loading another’s, plus the indirect cost of cold caches and TLB. I measured about 1 µs per switch with two threads ping-ponging on one core, and 23 µs per round trip across two cores. It matters when you do hundreds of thousands per second — too many threads contending, lock ping-pong — not at a few hundred.',
        'Cất thanh ghi của tác vụ này và nạp của tác vụ kia, cộng chi phí gián tiếp của cache và TLB bị nguội. Tôi đo khoảng 1 µs mỗi lần chuyển với hai luồng đánh bóng bàn trên một lõi, và 23 µs mỗi vòng khi qua hai lõi. Nó đáng kể khi bạn làm hàng trăm nghìn lần mỗi giây — quá nhiều luồng tranh chấp, khoá bị giành qua lại — không phải ở mức vài trăm.'],
    f: ['How do you see context switches on a live process?', 'Làm sao thấy số lần chuyển ngữ cảnh của một tiến trình đang chạy?'],
    fa: ['voluntary_ctxt_switches / nonvoluntary_ctxt_switches in /proc/PID/status, pidstat -w, vmstat’s cs column, perf stat -e context-switches.', 'voluntary_ctxt_switches / nonvoluntary_ctxt_switches trong /proc/PID/status, pidstat -w, cột cs của vmstat, perf stat -e context-switches.'],
    ls: [['os-3-3-context-switch', '3.3']] },
  { q: ['How does Linux decide which task runs next?', 'Linux quyết định tác vụ nào chạy tiếp thế nào?'],
    a: ['The fair scheduler (CFS, and since Linux 6.6 EEVDF) gives each runnable task CPU time in proportion to its weight and picks the one that is furthest behind its fair share; nice changes the weight by about 1.25× per step. Real-time classes (SCHED_FIFO/RR) run before all of them. In the lab, a nice 5 task on the same core as a nice 0 task got 0.99 s of CPU against 3.01 s.',
        'Bộ lập lịch công bằng (CFS, và từ Linux 6.6 là EEVDF) chia thời gian CPU cho các tác vụ sẵn sàng theo tỉ lệ trọng số và chọn tác vụ đang tụt sau phần công bằng của nó nhiều nhất; nice đổi trọng số khoảng 1,25 lần mỗi bậc. Các lớp thời gian thực (SCHED_FIFO/RR) chạy trước tất cả. Trong lab, một tác vụ nice 5 chung lõi với tác vụ nice 0 được 0,99 s CPU so với 3,01 s.'],
    f: ['Two CPU hogs at nice 0 and nice 19 on a 10-core idle machine — who wins?', 'Hai việc đốt CPU ở nice 0 và nice 19 trên máy 10 lõi đang rảnh — ai thắng?'],
    fa: ['Neither: each gets its own core and nice changes nothing — measured in 3.2. Priorities only matter under contention.', 'Không ai: mỗi việc có một lõi riêng và nice chẳng đổi gì — đo ở 3.2. Ưu tiên chỉ có nghĩa khi có tranh chấp.'],
    ls: [['os-3-2-lap-lich', '3.2']] },
  { q: ['The load average is 8 on a 4-core machine. Is the server in trouble?', 'Load average là 8 trên máy 4 lõi. Máy chủ có gặp rắc rối không?'],
    a: ['Not necessarily. Linux load counts runnable tasks plus tasks in uninterruptible sleep (D), averaged over 1, 5 and 15 minutes. 8 on 4 cores means on average 4 tasks wait — but they may be waiting for a slow disk or NFS, not for CPU. Look at %us/%sy vs %wa in top, at vmstat r vs b, and at which processes are R or D before concluding.',
        'Chưa chắc. Load của Linux đếm các tác vụ sẵn sàng chạy cộng các tác vụ đang ngủ không ngắt được (D), lấy trung bình 1, 5 và 15 phút. 8 trên 4 lõi nghĩa là trung bình có 4 tác vụ đang chờ — nhưng có thể chờ một đĩa chậm hay NFS, không phải chờ CPU. Nhìn %us/%sy so với %wa trong top, cột r và b của vmstat, và tiến trình nào ở trạng thái R hay D trước khi kết luận.'],
    f: ['What would a high load with low CPU usage suggest?', 'Load cao mà CPU dùng thấp gợi ý điều gì?'],
    fa: ['Tasks in D state: blocked I/O (slow or full disk, hung network file system) — check iostat await and ps -o stat.', 'Tác vụ ở trạng thái D: I/O bị chặn (đĩa chậm hay đầy, hệ thống file mạng treo) — kiểm await của iostat và ps -o stat.'],
    ls: [['os-2-2-cpu', '2.2'], ['os-2-1-phuong-phap', '2.1']] },
  { q: ['Node.js runs JavaScript on one thread. How does it serve 10,000 connections?', 'Node.js chạy JavaScript trên một luồng. Làm sao nó phục vụ 10.000 kết nối?'],
    a: ['Sockets are non-blocking and registered with epoll through libuv; the single thread sleeps in epoll_wait and handles only connections that are ready, so 10,000 idle connections cost almost nothing. Work that cannot be made non-blocking — file reads, DNS, crypto — goes to a small thread pool. The catch: any CPU-heavy callback blocks everyone; in the lab a 1.5 s /cpu request made a /fast request take 1.39 s.',
        'Socket ở chế độ không chặn và được đăng ký với epoll qua libuv; luồng duy nhất ngủ trong epoll_wait và chỉ xử lý kết nối đã sẵn sàng, nên 10.000 kết nối rảnh gần như không tốn gì. Việc không thể làm thành không chặn — đọc file, DNS, mã hoá — được đẩy sang một pool luồng nhỏ. Cái giá: mọi callback nặng CPU chặn tất cả; trong lab, một request /cpu 1,5 s làm request /fast mất 1,39 s.'],
    f: ['How do you keep the event loop responsive for CPU-heavy work?', 'Làm sao giữ event loop nhạy khi có việc nặng CPU?'],
    fa: ['Move it to worker_threads or another process (cluster, a queue worker); measure event-loop lag.', 'Đẩy nó sang worker_threads hoặc một tiến trình khác (cluster, worker của hàng đợi); đo độ trễ event loop.'],
    ls: [['os-3-5-event-loop', '3.5'], ['os-10-6-runtime', '10.5']] },
  { q: ['How many threads should a thread pool have?', 'Một thread pool nên có bao nhiêu luồng?'],
    a: ['It depends on what the tasks do. CPU-bound: about the number of cores — in 17.2, 4 threads on 4 cores gave 727 req/s and 16 threads only 634 with three times the p95. Waiting-bound: roughly cores × (1 + wait/compute), and Little’s law tells you the concurrency you need: at 10 ms per request, 32 threads served 2,865 req/s. Then cap the queue so latency stays bounded.',
        'Tuỳ việc mà tác vụ làm. Nặng CPU: khoảng bằng số lõi — ở 17.2, 4 luồng trên 4 lõi cho 727 req/s còn 16 luồng chỉ 634 với p95 gấp ba. Nặng chờ: khoảng số lõi × (1 + thời gian chờ/thời gian tính), và định luật Little cho biết mức đồng thời cần có: với 10 ms mỗi request, 32 luồng phục vụ 2.865 req/s. Rồi đặt trần cho hàng đợi để độ trễ có giới hạn.'],
    f: ['What happens when the queue in front of the pool is unbounded?', 'Chuyện gì xảy ra khi hàng đợi trước pool không có giới hạn?'],
    fa: ['Latency grows without limit (64 clients: p99 204 ms vs 32 ms with a queue of 8) and memory with it; shed load with 503 instead.', 'Độ trễ tăng không giới hạn (64 khách: p99 204 ms so với 32 ms khi hàng đợi 8) và bộ nhớ cũng vậy; hãy cắt tải bằng 503.'],
    ls: [['os-4-5-so-sanh', '4.5'], ['os-17-2-server', '17.2']] },
  { q: ['What is a race condition? Give an example you have seen.', 'Race condition là gì? Cho một ví dụ bạn đã thấy.'],
    a: ['A bug where the result depends on how threads interleave on shared data. counter++ is load, add, store: two threads can load the same value and one increment is lost. In C with two threads doing a million increments each, I got 1,120,356 instead of 2,000,000 — 44 % lost; with four threads about 70 %. The same bug in a backend is two requests booking the same seat.',
        'Một lỗi mà kết quả phụ thuộc vào cách các luồng xen kẽ trên dữ liệu chung. counter++ là nạp, cộng, ghi: hai luồng có thể nạp cùng một giá trị và một lần tăng bị mất. Trong C với hai luồng mỗi luồng tăng một triệu lần, tôi được 1.120.356 thay vì 2.000.000 — mất 44 %; với bốn luồng khoảng 70 %. Cùng lỗi đó trong backend là hai request cùng đặt một ghế.'],
    f: ['How do you fix the seat-booking race in a database?', 'Bạn sửa race đặt ghế trong CSDL thế nào?'],
    fa: ['A unique constraint on (show, seat), or SELECT … FOR UPDATE in a transaction, or a conditional UPDATE … WHERE status = free — and an idempotency key for retries.', 'Một ràng buộc unique trên (suất chiếu, ghế), hoặc SELECT … FOR UPDATE trong giao dịch, hoặc UPDATE có điều kiện … WHERE status = trống — và một khoá idempotency cho các lần thử lại.'],
    ls: [['os-5-1-race', '5.1'], ['os-5-4-backend', '5.4']] },
  { q: ['Mutex, spinlock, semaphore — when do you use which?', 'Mutex, spinlock, semaphore — khi nào dùng cái nào?'],
    a: ['A mutex gives one owner at a time and sleeps while waiting (on Linux a futex: no system call when uncontended). A spinlock busy-waits — only for very short sections where sleeping costs more, mostly inside kernels. A semaphore is a counter of permits, useful to cap concurrency (N database connections) or to signal between threads; it has no owner.',
        'Mutex cho một chủ tại một thời điểm và ngủ khi chờ (trên Linux là futex: không có system call khi không ai tranh). Spinlock quay chờ — chỉ dùng cho đoạn rất ngắn mà ngủ còn đắt hơn, chủ yếu trong nhân. Semaphore là bộ đếm giấy phép, hữu ích để giới hạn mức đồng thời (N kết nối CSDL) hay để báo hiệu giữa các luồng; nó không có chủ.'],
    f: ['Why must a condition variable be waited on in a while loop?', 'Vì sao phải chờ biến điều kiện trong vòng while?'],
    fa: ['Spurious wake-ups and other consumers: when you wake up, the condition may already be false again — re-check before proceeding.', 'Đánh thức giả và người tiêu thụ khác: khi bạn tỉnh dậy, điều kiện có thể đã lại sai — kiểm lại trước khi đi tiếp.'],
    ls: [['os-5-2-mutex', '5.2'], ['os-5-3-semaphore', '5.3']] },
  { q: ['What is a deadlock and how do you prevent it?', 'Deadlock là gì và phòng ngừa thế nào?'],
    a: ['Two or more threads each hold something the other needs and wait forever. It needs all four Coffman conditions: mutual exclusion, hold and wait, no preemption, circular wait. The practical prevention is a global lock order (always lock account 0 before account 1), plus timeouts on lock acquisition. A deadlock looks like a hang at 0 % CPU; jstack or gdb shows the cycle.',
        'Hai hay nhiều luồng mỗi bên giữ thứ bên kia cần và chờ mãi. Nó cần đủ bốn điều kiện Coffman: loại trừ lẫn nhau, giữ và chờ, không cưỡng đoạt, chờ vòng. Cách phòng ngừa thực tế là một thứ tự khoá toàn cục (luôn khoá ví 0 trước ví 1), cộng timeout khi lấy khoá. Deadlock trông như treo ở 0 % CPU; jstack hay gdb chỉ ra vòng chờ.'],
    f: ['Banker’s algorithm avoids deadlock — why does nobody use it in practice?', 'Thuật toán Banker tránh được deadlock — sao thực tế chẳng ai dùng?'],
    fa: ['It needs every process’s maximum demand in advance and a fixed set of processes; real systems prefer lock ordering, timeouts, or detection and rollback.', 'Nó cần biết trước nhu cầu tối đa của mọi tiến trình và một tập tiến trình cố định; hệ thống thật ưa thứ tự khoá, timeout, hoặc phát hiện rồi quay lui.'],
    ls: [['os-6-1-deadlock', '6.1'], ['os-6-4-banker', '6.4']] },
  { q: ['What happens when two transactions deadlock in PostgreSQL?', 'Chuyện gì xảy ra khi hai giao dịch deadlock trong PostgreSQL?'],
    a: ['PostgreSQL waits deadlock_timeout (1 s by default), runs its detector on the lock graph, and aborts one transaction with ERROR 40P01 "deadlock detected"; the other proceeds. The application must catch that error and retry the whole transaction. Prevent it the same way as in code: update rows in a consistent order (for example by primary key).',
        'PostgreSQL chờ deadlock_timeout (mặc định 1 s), chạy bộ phát hiện trên đồ thị khoá, và huỷ một giao dịch với ERROR 40P01 "deadlock detected"; giao dịch kia đi tiếp. Ứng dụng phải bắt lỗi đó và thử lại cả giao dịch. Phòng ngừa giống trong mã: cập nhật các dòng theo một thứ tự nhất quán (ví dụ theo khoá chính).'],
    f: ['Is retrying always safe?', 'Thử lại có luôn an toàn không?'],
    fa: ['Only if the transaction is idempotent or fully rolled back — side effects outside the database (emails, payments) need idempotency keys.', 'Chỉ khi giao dịch idempotent hoặc đã quay lui hoàn toàn — tác dụng phụ ngoài CSDL (email, thanh toán) cần khoá idempotency.'],
    ls: [['os-6-1-deadlock', '6.1'], ['os-5-4-backend', '5.4']] },
  { q: ['Explain virtual memory.', 'Giải thích bộ nhớ ảo.'],
    a: ['Every process uses virtual addresses; the MMU translates them page by page (4 KiB here) through page tables the kernel maintains, with the TLB caching recent translations. This gives isolation (a process cannot name another’s memory), lets memory be allocated lazily (pages appear on first touch), shared (libraries, copy-on-write) and backed by files or swap. On arm64 Linux the table has 4 levels.',
        'Mọi tiến trình dùng địa chỉ ảo; MMU dịch chúng theo từng trang (ở đây 4 KiB) qua các bảng trang do nhân duy trì, còn TLB cache các phép dịch gần đây. Điều này cho cách ly (tiến trình không gọi tên được bộ nhớ của tiến trình khác), cho cấp phát lười (trang chỉ xuất hiện ở lần chạm đầu), dùng chung (thư viện, copy-on-write) và được hậu thuẫn bằng file hay swap. Trên Linux arm64 bảng có 4 cấp.'],
    f: ['Then why can VSZ be 486 MB while RSS is 49 MB?', 'Vậy sao VSZ có thể là 486 MB trong khi RSS là 49 MB?'],
    fa: ['VSZ counts everything mapped, including reserved but never-touched ranges; RSS counts pages actually in RAM. Alert on RSS (or PSS), not VSZ.', 'VSZ đếm mọi thứ đã ánh xạ, kể cả vùng dành sẵn chưa từng chạm; RSS đếm các trang thật sự nằm trong RAM. Hãy cảnh báo theo RSS (hoặc PSS), đừng theo VSZ.'],
    ls: [['os-7-1-khong-gian', '7.1'], ['os-7-2-phan-trang', '7.2']] },
  { q: ['What is a page fault? Is it an error?', 'Page fault là gì? Nó có phải lỗi không?'],
    a: ['No — it is how demand paging works. A fault happens when a process touches a page with no valid mapping yet; the kernel allocates or finds the page and resumes the instruction. Minor faults need no disk (a zero page, a page already in the page cache); major faults wait for disk. Touching 256 MiB caused 65,539 faults in my lab, almost all minor. Only an access outside any mapping becomes SIGSEGV.',
        'Không — đó là cách nạp trang theo yêu cầu hoạt động. Fault xảy ra khi tiến trình chạm một trang chưa có ánh xạ hợp lệ; nhân cấp phát hoặc tìm trang rồi cho lệnh chạy tiếp. Minor fault không cần đĩa (trang 0, trang đã có trong page cache); major fault phải chờ đĩa. Chạm 256 MiB gây 65.539 fault trong lab của tôi, gần như toàn minor. Chỉ truy cập ra ngoài mọi ánh xạ mới thành SIGSEGV.'],
    f: ['What does a sudden rise in major faults on a database server mean?', 'Major fault tăng đột ngột trên máy chủ CSDL nghĩa là gì?'],
    fa: ['The working set no longer fits in RAM: pages are being read back from disk or swap — thrashing ahead; check free/available memory and swap-in rates.', 'Tập làm việc không còn vừa RAM: các trang đang bị đọc lại từ đĩa hay swap — sắp thrashing; kiểm bộ nhớ free/available và tốc độ swap-in.'],
    ls: [['os-7-3-page-fault', '7.3'], ['os-8-2-swap', '8.2']] },
  { q: ['What happens when you call malloc()?', 'Chuyện gì xảy ra khi bạn gọi malloc()?'],
    a: ['Usually no system call: the allocator hands out a chunk from memory it already owns (glibc keeps per-thread arenas and free lists). For a large request (≥ 128 KiB by default) or when its heap runs out, it asks the kernel with mmap or brk. Even then the kernel only reserves virtual addresses; physical pages arrive on first touch, through page faults.',
        'Thường không có system call: bộ cấp phát giao một mẩu từ vùng nhớ nó đã sở hữu (glibc giữ các arena theo luồng và danh sách khối rảnh). Với yêu cầu lớn (mặc định ≥ 128 KiB) hoặc khi heap hết, nó xin nhân bằng mmap hoặc brk. Ngay cả khi đó nhân cũng chỉ dành địa chỉ ảo; trang vật lý chỉ tới ở lần chạm đầu, qua page fault.'],
    f: ['Then how can malloc succeed and the process still be OOM-killed later?', 'Vậy sao malloc thành công mà tiến trình vẫn bị OOM giết sau đó?'],
    fa: ['Overcommit: Linux promises more virtual memory than exists; the bill arrives when pages are touched, and if RAM and swap are gone the OOM killer collects it.', 'Overcommit: Linux hứa nhiều bộ nhớ ảo hơn thực có; hoá đơn tới khi các trang được chạm, và nếu RAM lẫn swap đã cạn thì OOM killer thu nợ.'],
    ls: [['os-7-4-allocator', '7.4'], ['os-8-3-oom', '8.3']] },
  { q: ['free shows almost no free memory. Do we need more RAM?', 'free cho thấy gần như không còn bộ nhớ trống. Có cần thêm RAM không?'],
    a: ['Probably not. Linux uses idle RAM as page cache for files and gives it back on demand; the number that matters is "available" (MemAvailable), not "free". Real pressure looks like falling available memory, rising swap-in and major faults, PSI memory stalls, or OOM kills.',
        'Có lẽ không. Linux dùng RAM rảnh làm page cache cho file và trả lại khi cần; con số quan trọng là "available" (MemAvailable), không phải "free". Áp lực thật trông như available giảm dần, swap-in và major fault tăng, PSI báo nghẽn bộ nhớ, hoặc có OOM kill.'],
    f: ['Inside a container, which memory number does the kernel enforce?', 'Trong container, nhân áp con số bộ nhớ nào?'],
    fa: ['memory.max of the cgroup, counting anonymous memory and page cache charged to it; memory.current and memory.events show where you are.', 'memory.max của cgroup, tính cả bộ nhớ ẩn danh lẫn page cache bị tính cho nó; memory.current và memory.events cho biết bạn đang ở đâu.'],
    ls: [['os-8-1-page-cache', '8.1'], ['os-2-3-bo-nho', '2.3']] },
  { q: ['How does the OOM killer choose its victim, and how do you protect a database?', 'OOM killer chọn nạn nhân thế nào, và bảo vệ một CSDL ra sao?'],
    a: ['It computes oom_score mostly from memory use (RSS, swap, page tables) adjusted by oom_score_adj, and kills the highest. A big database is a natural victim. Protect it: set oom_score_adj = −1000 for the postmaster (systemd OOMScoreAdjust), give it its own memory limit, size other services’ limits, and prefer that a leaky worker dies first.',
        'Nó tính oom_score chủ yếu từ lượng bộ nhớ dùng (RSS, swap, bảng trang) điều chỉnh bởi oom_score_adj, rồi giết tiến trình điểm cao nhất. Một CSDL lớn là nạn nhân tự nhiên. Bảo vệ nó: đặt oom_score_adj = −1000 cho postmaster (OOMScoreAdjust của systemd), cho nó giới hạn bộ nhớ riêng, chọn giới hạn cho các dịch vụ khác, và để worker rò rỉ chết trước.'],
    f: ['Inside a cgroup limit, who does the OOM killer pick?', 'Bên trong giới hạn của một cgroup, OOM killer chọn ai?'],
    fa: ['Only a process inside the cgroup that exceeded memory.max, not a neighbour on the host; memory.events counts oom_kill.', 'Chỉ một tiến trình bên trong chính cgroup đã vượt memory.max, không phải hàng xóm trên máy chủ; memory.events đếm oom_kill.'],
    ls: [['os-8-3-oom', '8.3'], ['os-8-5-gioi-han', '8.5']] },
];

/* ── Phỏng vấn (2/2): file, I/O, syscall, container, bảo mật, sự cố ── */
const IV2 = [
  { q: ['What happens, from the OS point of view, when you type a URL and press Enter?', 'Từ góc nhìn hệ điều hành, chuyện gì xảy ra khi bạn gõ một URL và nhấn Enter?'],
    a: ['The browser process resolves the name (reads /etc/hosts and resolv.conf, sends a UDP query through a socket — a file descriptor), opens a TCP connection with socket/connect, and for HTTPS does a TLS handshake in user space. On the server, the listening socket’s accept queue hands the connection to nginx or Node, whose epoll loop gets a readiness event; the handler may read files (page cache or disk, through system calls), query a database over another socket, and write the response — ideally in one write — back through the kernel’s TCP stack.',
        'Tiến trình trình duyệt phân giải tên (đọc /etc/hosts và resolv.conf, gửi truy vấn UDP qua một socket — một file descriptor), mở kết nối TCP bằng socket/connect, và với HTTPS làm bắt tay TLS ở không gian người dùng. Ở máy chủ, hàng đợi accept của socket đang lắng nghe trao kết nối cho nginx hay Node, vòng epoll của nó nhận một sự kiện sẵn sàng; handler có thể đọc file (page cache hoặc đĩa, qua system call), hỏi CSDL qua một socket khác, rồi ghi câu trả lời — tốt nhất bằng một lần ghi — quay lại qua chồng TCP của nhân.'],
    f: ['Where can this path stall, and which tool shows it?', 'Đường đi này có thể nghẽn ở đâu, và công cụ nào cho thấy?'],
    fa: ['DNS (strace on connect/sendto), a full accept queue (ss -lnt Recv-Q), the event loop blocked by CPU work (loop lag), slow disk (iostat), a pool exhausted (thread dump) — check each with the USE method.', 'DNS (strace ở connect/sendto), hàng đợi accept đầy (Recv-Q của ss -lnt), event loop bị việc CPU chặn (độ trễ vòng lặp), đĩa chậm (iostat), pool cạn (kết xuất luồng) — kiểm từng chỗ theo phương pháp USE.'],
    ls: [['os-10-1-fd', '10.1'], ['os-11-1-hanh-trinh', '11.1'], ['os-2-1-phuong-phap', '2.1']] },
  { q: ['What is a file descriptor? What does "Too many open files" mean?', 'File descriptor là gì? "Too many open files" nghĩa là gì?'],
    a: ['A small integer indexing the process’s fd table; each entry points to an open-file description (offset, flags) that points to an inode, socket or pipe. EMFILE means the process hit RLIMIT_NOFILE. It is almost always a leak — in 17.3 a service had 255 fds open at a limit of 256, 236 of them the same template file, because it opened per request and never closed.',
        'Một số nguyên nhỏ dùng làm chỉ mục vào bảng fd của tiến trình; mỗi mục trỏ tới một mô tả file đang mở (vị trí, cờ) trỏ tiếp tới một inode, socket hay pipe. EMFILE nghĩa là tiến trình chạm RLIMIT_NOFILE. Gần như luôn là rò rỉ — ở 17.3 một dịch vụ mở 255 fd với giới hạn 256, 236 cái là cùng một file mẫu, vì nó mở ở mỗi request mà không bao giờ đóng.'],
    f: ['Would raising ulimit -n fix it?', 'Nâng ulimit -n có sửa được không?'],
    fa: ['It postpones it. Count /proc/PID/fd over time: a number that only grows is a leak; close on every path (finally, try-with-resources, using).', 'Nó chỉ hoãn lại. Đếm /proc/PID/fd theo thời gian: con số chỉ tăng là rò rỉ; đóng ở mọi nhánh (finally, try-with-resources, using).'],
    ls: [['os-9-5-fd', '9.2'], ['os-2-5-mang-fd', '2.5'], ['os-17-3-chan-doan', '17.3']] },
  { q: ['Hard link vs symbolic link — and what is an inode?', 'Hard link khác symbolic link thế nào — và inode là gì?'],
    a: ['The inode is the file itself: metadata and pointers to data blocks. A hard link is another directory entry for the same inode — deleting one name leaves the data reachable through the other, and it cannot cross file systems. A symlink is a small file containing a path; it can point anywhere, including across file systems, and it dangles if the target goes away.',
        'Inode chính là file: siêu dữ liệu và con trỏ tới các khối dữ liệu. Hard link là một mục thư mục khác cho cùng inode — xoá một tên thì dữ liệu vẫn với tới được qua tên kia, và nó không vượt được hệ thống file. Symlink là một file nhỏ chứa một đường dẫn; nó trỏ đi đâu cũng được, kể cả qua hệ thống file khác, và lơ lửng nếu đích biến mất.'],
    f: ['Why did editing a bind-mounted config with sed -i not reach the container?', 'Vì sao sửa một file cấu hình được bind mount bằng sed -i lại không tới được container?'],
    fa: ['sed -i writes a new file and renames it: a new inode. A single-file bind mount is attached to the old inode, so the container keeps reading the old content — write in place instead.', 'sed -i ghi một file mới rồi đổi tên: inode mới. Bind mount một file đơn gắn vào inode cũ, nên container tiếp tục đọc nội dung cũ — hãy ghi đè tại chỗ.'],
    ls: [['os-9-1-inode', '9.1'], ['os-9-6-mount', '9.5']] },
  { q: ['Does write() put my data on the disk?', 'write() có đưa dữ liệu của tôi xuống đĩa không?'],
    a: ['No. write() copies into the page cache and returns; the kernel writes back later (seconds). Only fsync/fdatasync wait for the device — and that is expensive: 1.8 µs for a buffered write vs about 880 µs with fsync per write in my lab. Safe file replacement is write to a temp file, fsync it, rename over the old one, fsync the directory.',
        'Không. write() chép vào page cache rồi trả về; nhân ghi xuống sau (vài giây). Chỉ fsync/fdatasync mới chờ thiết bị — và nó đắt: 1,8 µs cho một lần ghi có đệm so với khoảng 880 µs khi fsync mỗi lần trong lab của tôi. Thay file an toàn là ghi vào file tạm, fsync nó, rename đè lên file cũ, fsync thư mục.'],
    f: ['How does a database stay fast if every commit needs fsync?', 'CSDL giữ được tốc độ thế nào nếu mỗi commit cần fsync?'],
    fa: ['Group commit: many transactions share one WAL flush. In 17.3 the same trick took the audit service from ~25 ms to 0.7 ms per event without losing durability.', 'Group commit: nhiều giao dịch dùng chung một lần đẩy WAL. Ở 17.3 cùng mẹo đó đưa dịch vụ audit từ ~25 ms xuống 0,7 ms mỗi sự kiện mà không mất độ bền.'],
    ls: [['os-9-2-fsync', '9.3'], ['os-17-3-chan-doan', '17.3']] },
  { q: ['df says the disk is full, du says it is mostly empty. What is going on?', 'df bảo đĩa đầy, du bảo gần như trống. Chuyện gì đang xảy ra?'],
    a: ['du walks names; df counts allocated blocks. The gap is usually a deleted file still held open by a process — a log rotated by rm while the service keeps writing. Find it with lsof +L1 or ls -l /proc/*/fd | grep deleted; free the space by restarting the holder or truncating through /proc/PID/fd/N. Other suspects: inodes exhausted (df -i), files hidden under a mount point.',
        'du đi theo tên; df đếm khối đã cấp phát. Khoảng chênh thường là một file đã xoá mà vẫn có tiến trình giữ mở — một log bị xoay bằng rm trong khi dịch vụ vẫn ghi. Tìm bằng lsof +L1 hoặc ls -l /proc/*/fd | grep deleted; giải phóng chỗ bằng cách khởi động lại tiến trình giữ nó hoặc cắt file qua /proc/PID/fd/N. Nghi phạm khác: cạn inode (df -i), file bị che dưới một điểm gắn.'],
    f: ['How do you stop it from happening again?', 'Làm sao để nó không lặp lại?'],
    fa: ['Rotate with copytruncate or a reopen signal, log to stdout in containers with size-based rotation, alert at 80 % disk and on deleted-open files.', 'Xoay log bằng copytruncate hoặc tín hiệu mở lại, trong container thì ghi ra stdout và xoay theo dung lượng, cảnh báo ở 80 % đĩa và khi có file đã xoá còn mở.'],
    ls: [['os-2-4-dia-io', '2.4'], ['os-17-4-bao-cao', '17.4']] },
  { q: ['select, poll, epoll — what is the difference?', 'select, poll, epoll — khác nhau thế nào?'],
    a: ['All three wait for any of many fds to become ready. select and poll pass the whole set to the kernel on every call and scan it — O(n) per wake-up — and select is capped at FD_SETSIZE 1,024. epoll keeps the interest list in the kernel and returns only the ready fds. Measured at 10,000 fds: poll 676 µs per wake-up, epoll 0.72 µs.',
        'Cả ba đều chờ một trong nhiều fd sẵn sàng. select và poll đưa cả tập cho nhân ở mỗi lần gọi và quét nó — O(n) mỗi lần thức — còn select bị chặn ở FD_SETSIZE 1.024. epoll giữ danh sách quan tâm trong nhân và chỉ trả các fd sẵn sàng. Đo ở 10.000 fd: poll 676 µs mỗi lần thức, epoll 0,72 µs.'],
    f: ['Level- vs edge-triggered epoll — what bug does edge-triggered invite?', 'epoll level với edge-triggered — edge-triggered dễ gây lỗi gì?'],
    fa: ['You get one notification per change; if you do not read until EAGAIN, leftover bytes never trigger again and the connection hangs (6 bytes stuck in 10.3).', 'Bạn chỉ được báo một lần mỗi thay đổi; nếu không đọc tới EAGAIN, các byte còn sót không bao giờ báo lại và kết nối treo (6 byte kẹt ở 10.3).'],
    ls: [['os-10-3-epoll', '10.3']] },
  { q: ['For a chat server with 10,000 mostly idle connections: threads or an event loop?', 'Một máy chủ chat với 10.000 kết nối phần lớn rảnh: luồng hay event loop?'],
    a: ['An event loop (or a few, one per core). Measured in 10.4: a thread per connection at 10,000 connections needed 10,001 threads, 122.6 MiB RSS plus 156 MiB of kernel stacks and 5× the context switches; one epoll loop used one thread and 40.9 MiB with similar latency. Threads stay fine for a few hundred connections, and virtual threads (Java 21) change the cost model.',
        'Event loop (hoặc vài cái, mỗi lõi một cái). Đo ở 10.4: mỗi kết nối một luồng ở 10.000 kết nối cần 10.001 luồng, RSS 122,6 MiB cộng 156 MiB stack nhân và số lần chuyển ngữ cảnh gấp 5; một vòng epoll dùng một luồng và 40,9 MiB với độ trễ tương đương. Luồng vẫn ổn ở vài trăm kết nối, và virtual thread (Java 21) đổi hẳn mô hình chi phí.'],
    f: ['What limit do you hit first when you push further?', 'Đẩy xa hơn thì chạm giới hạn nào trước?'],
    fa: ['Usually file descriptors (ulimit -n), then pids.max for threads or memory.max — the walls measured in 10.4.', 'Thường là file descriptor (ulimit -n), rồi pids.max với luồng hoặc memory.max — các bức tường đã đo ở 10.4.'],
    ls: [['os-10-5-c10k', '10.4']] },
  { q: ['Blocking, non-blocking and asynchronous I/O — and where does io_uring fit?', 'I/O chặn, không chặn và bất đồng bộ — io_uring nằm ở đâu?'],
    a: ['Blocking: the call sleeps until data arrives. Non-blocking: it returns EAGAIN at once and you poll for readiness (epoll). Asynchronous: you submit the operation and are told when it is <em>complete</em>. io_uring is Linux’s modern async interface: shared submission and completion rings, many operations per system call. Docker’s default seccomp profile blocks it — measured in 10.7.',
        'Chặn: lời gọi ngủ tới khi dữ liệu tới. Không chặn: nó trả EAGAIN ngay và bạn chờ sự sẵn sàng (epoll). Bất đồng bộ: bạn nộp thao tác và được báo khi nó <em>xong</em>. io_uring là giao diện bất đồng bộ hiện đại của Linux: vòng gửi và vòng nhận dùng chung, nhiều thao tác mỗi system call. Hồ sơ seccomp mặc định của Docker chặn nó — đo ở 10.7.'],
    f: ['Why does Node read files in a thread pool instead of with epoll?', 'Vì sao Node đọc file bằng pool luồng thay vì bằng epoll?'],
    fa: ['Regular files are always "ready" to epoll, so a read can still block on disk; libuv hands them to its pool (UV_THREADPOOL_SIZE).', 'File thường luôn "sẵn sàng" với epoll, nên một lần đọc vẫn có thể chặn ở đĩa; libuv giao chúng cho pool của nó (UV_THREADPOOL_SIZE).'],
    ls: [['os-10-2-blocking', '10.2'], ['os-10-4-io-uring', '10.7']] },
  { q: ['A process is hung. How do you find out what it is waiting for?', 'Một tiến trình đang treo. Làm sao biết nó đang chờ gì?'],
    a: ['Look before touching: ps -o stat,wchan (S, D?), /proc/PID/wchan and /proc/PID/stack for the kernel function, /proc/PID/syscall for the call and its fd, ls -l /proc/PID/fd to see what that fd is (a socket to the database?), strace -p for live calls, and a thread dump (jstack, py-spy, gdb thread apply all bt) for locks. 0 % CPU plus waiting threads suggests a lock or a peer; 100 % suggests a loop.',
        'Nhìn trước khi đụng: ps -o stat,wchan (S hay D?), /proc/PID/wchan và /proc/PID/stack cho hàm của nhân, /proc/PID/syscall cho lời gọi và fd của nó, ls -l /proc/PID/fd để biết fd đó là gì (một socket tới CSDL?), strace -p cho các lời gọi đang diễn ra, và kết xuất luồng (jstack, py-spy, gdb thread apply all bt) cho khoá. 0 % CPU cộng các luồng đang chờ gợi ý khoá hoặc phía bên kia; 100 % gợi ý một vòng lặp.'],
    f: ['The container has no strace and no ptrace capability. Now what?', 'Container không có strace và không có capability ptrace. Giờ sao?'],
    fa: ['Run a throwaway debug container in its PID namespace: docker run --pid=container:X --cap-add SYS_PTRACE os-lab strace -p 1 (done in 17.3).', 'Chạy một container gỡ lỗi vứt đi trong PID namespace của nó: docker run --pid=container:X --cap-add SYS_PTRACE os-lab strace -p 1 (làm ở 17.3).'],
    ls: [['os-11-2-strace-ltrace', '11.3'], ['os-11-7-proc-sys', '11.6']] },
  { q: ['What is a system call, and what is the vDSO for?', 'System call là gì, và vDSO để làm gì?'],
    a: ['A system call is the only door into the kernel: the library puts a number and arguments in registers and executes a trap instruction (svc on arm64, syscall on x86-64); the kernel dispatches through its table and returns a value or −errno. The vDSO is a page of kernel-provided code mapped into every process so that calls like clock_gettime run without the trap — 18.5 ns instead of ~200 ns.',
        'System call là cánh cửa duy nhất vào nhân: thư viện đặt số và đối số vào thanh ghi rồi thực hiện một lệnh bẫy (svc trên arm64, syscall trên x86-64); nhân phân phối qua bảng của nó và trả về một giá trị hoặc −errno. vDSO là một trang mã do nhân cung cấp, ánh xạ vào mọi tiến trình để những lời gọi như clock_gettime chạy mà không cần bẫy — 18,5 ns thay vì ~200 ns.'],
    f: ['Why does Go make raw syscalls on Linux but go through libSystem on macOS?', 'Vì sao Go gọi syscall trần trên Linux mà phải qua libSystem trên macOS?'],
    fa: ['Linux guarantees stable syscall numbers; macOS and Windows only support their system library — numbers may change between releases (14.1).', 'Linux bảo đảm số syscall ổn định; macOS và Windows chỉ hỗ trợ thư viện hệ thống của chúng — các con số có thể đổi giữa các bản (14.1).'],
    ls: [['os-11-1-hanh-trinh', '11.1'], ['os-11-5-chi-phi', '11.4']] },
  { q: ['What is a container, really?', 'Container thật ra là gì?'],
    a: ['An ordinary Linux process (tree) started with namespaces that change what it can see — its own PIDs, mounts, network, hostname, IPC, cgroup view — a cgroup that limits what it can use, a root file system made of image layers (OverlayFS), and reduced privileges (capabilities, seccomp). Inside, the app is PID 1; on the host it is just another PID. It shares the host’s kernel.',
        'Một tiến trình (cây tiến trình) Linux bình thường được khởi động với các namespace đổi thứ nó nhìn thấy — PID, mount, mạng, hostname, IPC, góc nhìn cgroup của riêng nó — một cgroup giới hạn thứ nó được dùng, một hệ thống file gốc ghép từ các lớp ảnh (OverlayFS), và đặc quyền bị thu hẹp (capability, seccomp). Bên trong, app là PID 1; trên máy chủ nó chỉ là một PID khác. Nó dùng chung nhân với máy chủ.'],
    f: ['Could you build one without Docker?', 'Bạn có tự dựng được một cái mà không cần Docker không?'],
    fa: ['Yes — unshare, a cgroup directory and pivot_root in 12.4; about 120 lines of C in 17.5 (minictr).', 'Được — unshare, một thư mục cgroup và pivot_root ở 12.4; khoảng 120 dòng C ở 17.5 (minictr).'],
    ls: [['os-12-1-namespaces', '12.1'], ['os-12-4-mini', '12.4'], ['os-17-5-container', '17.5']] },
  { q: ['Container vs virtual machine — which isolates better, and why is Docker on a Mac a VM?', 'Container và máy ảo — cái nào cách ly tốt hơn, và vì sao Docker trên Mac là một máy ảo?'],
    a: ['A VM runs its own kernel on a hypervisor; a container shares the host kernel, so a kernel vulnerability or a privileged container breaks the boundary — VMs isolate more strongly, containers start faster and pack denser. Linux containers need a Linux kernel, so Docker Desktop on macOS and Windows runs a Linux VM (uname -r says linuxkit), and bind-mounted files cross the VM boundary — 10–25× slower for small files, measured in 14.6.',
        'Máy ảo chạy nhân riêng trên hypervisor; container dùng chung nhân của máy chủ, nên một lỗ hổng nhân hay một container đặc quyền phá được ranh giới — máy ảo cách ly mạnh hơn, container khởi động nhanh hơn và xếp được dày hơn. Container Linux cần nhân Linux, nên Docker Desktop trên macOS và Windows chạy một máy ảo Linux (uname -r báo linuxkit), và file được bind mount phải vượt ranh giới máy ảo — chậm 10–25 lần với file nhỏ, đo ở 14.6.'],
    f: ['What sits in between?', 'Có gì nằm ở giữa không?'],
    fa: ['gVisor (a user-space kernel) and microVMs such as Firecracker or Kata: VM-like isolation with container-like startup.', 'gVisor (một nhân chạy ở không gian người dùng) và microVM như Firecracker hay Kata: cách ly gần như máy ảo, khởi động gần như container.'],
    ls: [['os-14-3-wsl', '14.6'], ['os-13-4-container-escape', '13.4']] },
  { q: ['How is container isolation broken in practice?', 'Trên thực tế cách ly container bị phá như thế nào?'],
    a: ['Mostly by configuration, not exploits: --privileged (all capabilities, all devices), mounting /var/run/docker.sock (full control of the Docker daemon = root on the host), host namespaces (--pid=host, --net=host), sensitive host paths bind-mounted read-write, running as root without user namespaces. Hardening: non-root user, read-only root, cap-drop ALL plus what is needed, no-new-privileges, default seccomp, resource limits.',
        'Chủ yếu do cấu hình, không phải khai thác: --privileged (mọi capability, mọi thiết bị), gắn /var/run/docker.sock (toàn quyền điều khiển Docker daemon = root của máy chủ), namespace của máy chủ (--pid=host, --net=host), đường dẫn nhạy cảm của máy chủ được bind mount có quyền ghi, chạy root mà không có user namespace. Cứng hoá: người dùng không phải root, gốc chỉ đọc, cap-drop ALL rồi thêm đúng thứ cần, no-new-privileges, seccomp mặc định, giới hạn tài nguyên.'],
    f: ['A CI job needs to build images inside a container. How do you avoid mounting docker.sock?', 'Một job CI cần build ảnh bên trong container. Làm sao tránh gắn docker.sock?'],
    fa: ['Rootless builders (BuildKit rootless, kaniko, buildah) or a remote builder; never hand the socket to untrusted code.', 'Dùng bộ build không cần root (BuildKit rootless, kaniko, buildah) hoặc build từ xa; đừng bao giờ trao socket cho mã không tin cậy.'],
    ls: [['os-13-4-container-escape', '13.4'], ['os-12-7-pod-dockerfile', '12.7']] },
  { q: ['How does Docker limit a container’s memory and CPU?', 'Docker giới hạn bộ nhớ và CPU của container thế nào?'],
    a: ['It writes cgroup v2 files and the kernel enforces them: --memory sets memory.max (exceeding it means reclaim, then the OOM killer: exit 137); --cpus sets cpu.max as a quota per period, enforced by throttling (nr_throttled in cpu.stat); --pids-limit sets pids.max. Runtimes inside must also read these limits — a JVM or Node that sizes itself by host RAM or host cores misbehaves.',
        'Nó ghi các file cgroup v2 và nhân áp chúng: --memory đặt memory.max (vượt thì thu hồi, rồi OOM killer: exit 137); --cpus đặt cpu.max thành hạn mức mỗi chu kỳ, áp bằng cách bóp (nr_throttled trong cpu.stat); --pids-limit đặt pids.max. Runtime bên trong cũng phải đọc các giới hạn này — một JVM hay Node tự chọn cỡ theo RAM hay số lõi của máy chủ sẽ cư xử sai.'],
    f: ['A Java service in a 1 GiB container is OOM-killed with -Xmx1g. Why?', 'Một dịch vụ Java trong container 1 GiB bị OOM giết với -Xmx1g. Vì sao?'],
    fa: ['Heap is only part of RSS (metaspace, thread stacks, direct buffers, GC); set -XX:MaxRAMPercentage around 70–75 % or -Xmx well below the limit.', 'Heap chỉ là một phần của RSS (metaspace, stack luồng, direct buffer, GC); đặt -XX:MaxRAMPercentage khoảng 70–75 % hoặc -Xmx thấp hơn hẳn giới hạn.'],
    ls: [['os-12-2-cgroups', '12.2'], ['os-8-5-gioi-han', '8.5'], ['os-3-4-da-loi', '3.4']] },
  { q: ['What is seccomp, and when would you use it?', 'seccomp là gì, và khi nào bạn dùng nó?'],
    a: ['A kernel filter attached to a process that allows, denies (EPERM/ENOSYS) or kills on specific system calls, inherited by children and impossible to remove. Docker applies a default profile that blocks dozens of dangerous calls; systemd has SystemCallFilter=. Use it to shrink the attack surface of a service — in 11.7 blocking mkdirat made mkdir fail with "Operation not permitted", and the kill action ended the process with SIGSYS (exit 159).',
        'Một bộ lọc của nhân gắn vào tiến trình, cho phép, từ chối (EPERM/ENOSYS) hoặc giết khi gặp những system call cụ thể, được con thừa hưởng và không gỡ ra được. Docker áp một hồ sơ mặc định chặn hàng chục lời gọi nguy hiểm; systemd có SystemCallFilter=. Dùng nó để thu nhỏ bề mặt tấn công của một dịch vụ — ở 11.7 chặn mkdirat làm mkdir hỏng với "Operation not permitted", còn hành động kill kết thúc tiến trình bằng SIGSYS (exit 159).'],
    f: ['Why does a too-strict profile break threads in some runtimes?', 'Vì sao hồ sơ quá chặt làm hỏng luồng ở vài runtime?'],
    fa: ['Newer glibc tries clone3 first; returning EPERM instead of ENOSYS stops it from falling back to clone — measured with Python and the JVM in 11.7.', 'glibc mới thử clone3 trước; trả EPERM thay vì ENOSYS làm nó không lùi về clone — đo với Python và JVM ở 11.7.'],
    ls: [['os-11-4-seccomp', '11.7']] },
  { q: ['Explain a stack buffer overflow and the mitigations against it.', 'Giải thích tràn bộ đệm trên stack và các lớp phòng vệ.'],
    a: ['Writing past a local array overwrites what lies above it in the stack frame — saved registers and the return address — so the function returns somewhere the attacker chose. Mitigations, each blocking one step: the stack canary detects the overwrite before return ("stack smashing detected", exit 134 in my lab), NX makes the stack non-executable, ASLR/PIE randomise addresses, RELRO protects the GOT, FORTIFY_SOURCE checks known-size copies, and memory-safe languages remove the bug class.',
        'Ghi quá cuối một mảng cục bộ sẽ đè lên những gì nằm phía trên nó trong khung stack — thanh ghi đã lưu và địa chỉ trả về — nên hàm trả về một chỗ do kẻ tấn công chọn. Các lớp phòng vệ, mỗi lớp chặn một bước: stack canary phát hiện việc ghi đè trước khi trả về ("stack smashing detected", exit 134 trong lab của tôi), NX làm stack không thực thi được, ASLR/PIE xáo địa chỉ, RELRO bảo vệ GOT, FORTIFY_SOURCE kiểm các lệnh chép biết trước kích thước, còn ngôn ngữ an toàn bộ nhớ xoá luôn lớp lỗi này.'],
    f: ['How do you verify a binary was built with these protections?', 'Làm sao xác minh một file chạy được dựng với các lớp bảo vệ này?'],
    fa: ['readelf: __stack_chk_fail symbol (canary), GNU_STACK not executable (NX), Type DYN (PIE), BIND_NOW + GNU_RELRO (full RELRO) — as in 13.2.', 'readelf: ký hiệu __stack_chk_fail (canary), GNU_STACK không thực thi (NX), Type DYN (PIE), BIND_NOW + GNU_RELRO (RELRO đầy đủ) — như ở 13.2.'],
    ls: [['os-13-2-overflow', '13.2'], ['os-13-1-bo-nho', '13.1']] },
  { q: ['What is setuid, why is it risky, and what are capabilities?', 'setuid là gì, vì sao rủi ro, và capability là gì?'],
    a: ['A setuid binary runs with its owner’s effective UID — root for passwd. Any trust in the caller’s environment becomes an escalation: in 13.3 a setuid program that ran "hostname" with execlp, searching the caller’s PATH, executed the attacker’s planted hostname with effective UID 0; the same call through system() was saved only because the shell dropped privileges (euid 1001). The fix is an absolute path and dropping privileges early. Capabilities split root into ~41 independent privileges (CAP_NET_BIND_SERVICE to bind port 80, CAP_SYS_ADMIN…), so a program gets only the one it needs.',
        'File setuid chạy với UID hiệu lực của chủ file — root với passwd. Mọi sự tin cậy vào môi trường của người gọi đều thành leo thang: ở 13.3 một chương trình setuid chạy "hostname" bằng execlp, tìm theo PATH của người gọi, đã thực thi file hostname do kẻ tấn công cài sẵn với UID hiệu lực 0; cùng lời gọi đó qua system() chỉ thoát nạn vì shell tự bỏ đặc quyền (euid 1001). Cách sửa là đường dẫn tuyệt đối và bỏ đặc quyền sớm. Capability chia root thành ~41 đặc quyền độc lập (CAP_NET_BIND_SERVICE để mở cổng 80, CAP_SYS_ADMIN…), để một chương trình chỉ nhận đúng thứ nó cần.'],
    f: ['How do you let a Node app listen on port 80 without root?', 'Làm sao cho app Node lắng nghe cổng 80 mà không cần root?'],
    fa: ['Give the binary cap_net_bind_service (setcap) or the service AmbientCapabilities=, lower net.ipv4.ip_unprivileged_port_start, or listen on 8080 behind nginx.', 'Cấp cap_net_bind_service cho file chạy (setcap) hoặc AmbientCapabilities= cho dịch vụ, hạ net.ipv4.ip_unprivileged_port_start, hoặc nghe ở 8080 sau nginx.'],
    ls: [['os-13-3-leo-thang', '13.3'], ['os-9-7-capabilities', '9.7']] },
  { q: ['npm install inside Docker on a Mac takes minutes; on the server, seconds. Why?', 'npm install trong Docker trên Mac mất vài phút; trên máy chủ chỉ vài giây. Vì sao?'],
    a: ['On a Mac, Docker runs in a Linux VM, and a bind-mounted project folder is shared from macOS through virtiofs: every file operation crosses the VM boundary. node_modules is tens of thousands of small files — measured in 14.6, reading 3,000 small files took about 0.5 s on the share vs 0.021 s on the VM’s own disk. Keep node_modules in a named volume or in the image, and mount only the source you edit.',
        'Trên Mac, Docker chạy trong một máy ảo Linux, và thư mục dự án được bind mount được chia sẻ từ macOS qua virtiofs: mọi thao tác file đều vượt ranh giới máy ảo. node_modules là hàng chục nghìn file nhỏ — đo ở 14.6, đọc 3.000 file nhỏ mất khoảng 0,5 s trên thư mục chia sẻ so với 0,021 s trên ổ riêng của máy ảo. Giữ node_modules trong một named volume hoặc trong ảnh, và chỉ gắn phần mã nguồn bạn sửa.'],
    f: ['And on Windows with WSL2?', 'Còn trên Windows với WSL2?'],
    fa: ['Same idea: keep the project inside the WSL2 file system (\\\\wsl$), not on /mnt/c, which crosses the VM boundary.', 'Cùng ý: giữ dự án bên trong hệ thống file của WSL2 (\\\\wsl$), không đặt ở /mnt/c, nơi phải vượt ranh giới máy ảo.'],
    ls: [['os-14-3-wsl', '14.6']] },
  { q: ['How should a backend shut down when it receives SIGTERM?', 'Một backend nên tắt thế nào khi nhận SIGTERM?'],
    a: ['Stop accepting new work (close the listener, fail the readiness probe), finish in-flight and queued requests, close pools and flush logs, then exit 0 — all before the orchestrator’s grace period ends (10 s for docker stop, 30 s default in Kubernetes) and it sends SIGKILL. In 17.2 the reference server drained three requests in 1.4 s and exited 0; without signal handling it died with 143 and the running request got no answer.',
        'Thôi nhận việc mới (đóng socket lắng nghe, cho readiness probe thất bại), làm xong request đang chạy và đang xếp hàng, đóng các pool và đẩy log, rồi thoát 0 — tất cả trước khi thời gian ân hạn của trình điều phối hết (10 s với docker stop, mặc định 30 s trong Kubernetes) và nó gửi SIGKILL. Ở 17.2 máy chủ mẫu làm nốt ba request trong 1,4 s rồi thoát 0; không xử lý tín hiệu thì nó chết với 143 và request đang chạy không có câu trả lời.'],
    f: ['What is the difference between SIGTERM and SIGKILL here?', 'Ở đây SIGTERM khác SIGKILL thế nào?'],
    fa: ['SIGTERM can be caught and handled; SIGKILL cannot be caught, blocked or ignored — the process just stops (exit 137).', 'SIGTERM bắt và xử lý được; SIGKILL không bắt, không chặn, không bỏ qua được — tiến trình chỉ dừng (exit 137).'],
    ls: [['os-1-4-vong-doi', '1.4'], ['os-17-2-server', '17.2'], ['os-1-5-pid1', '1.5']] },
  { q: ['Tell me about a production incident you debugged.', 'Kể về một sự cố production bạn đã gỡ.'],
    a: ['Use STAR with two numbers. Example from 17.3: "Transfers between wallets timed out — curl gave up after 3 s — while the billing service sat at 0 % CPU with 39 threads. Idle CPU plus stuck requests meant waiting, so I took a jstack thread dump: a Java-level deadlock, two pool threads each holding the wallet the other needed, because transfers locked source then destination. I changed it to lock in id order and added a test firing 100 opposite transfers at once: 100/100 finished within 10 s and the total stayed at 4,000,000."',
        'Dùng STAR với hai con số. Ví dụ từ 17.3: "Lệnh chuyển tiền giữa các ví quá hạn — curl bỏ cuộc sau 3 s — trong khi dịch vụ billing nằm ở 0 % CPU với 39 luồng. CPU rảnh mà request kẹt nghĩa là đang chờ, nên tôi lấy bản kết xuất luồng bằng jstack: một deadlock mức Java, hai luồng của pool mỗi bên giữ ví mà bên kia cần, vì lệnh chuyển khoá ví nguồn rồi mới khoá ví đích. Tôi đổi sang khoá theo thứ tự id và thêm phép kiểm bắn 100 lệnh chuyển ngược chiều cùng lúc: 100/100 xong trong 10 s và tổng tiền giữ nguyên 4.000.000."'],
    f: ['What would you do differently next time?', 'Lần sau bạn sẽ làm khác điều gì?'],
    fa: ['Name a prevention item, not a feeling: a lock-order rule in code review, a concurrency test in CI, an alert on stuck requests (17.4).', 'Nêu một việc phòng ngừa, không phải một cảm xúc: luật thứ tự khoá trong review mã, một phép kiểm đồng thời trong CI, cảnh báo khi request bị kẹt (17.4).'],
    ls: [['os-17-4-bao-cao', '17.4'], ['os-17-3-chan-doan', '17.3']] },
];


export default {
  title: 'Chapter 16 — OS in exams and interviews|||Chương 16 — Hệ điều hành trong thi cử và phỏng vấn',
  description: 'Ôn cả khoá theo mười chủ đề, mỗi chủ đề một bảng khái niệm – con số đã đo – bài học và một output thật; luyện dạng bài tính toán của đề cuối kỳ OSG202 bằng đề mới (Gantt FCFS/SJF/SRTF/ưu tiên/RR, FIFO/LRU/OPT/Clock và Belady, dịch địa chỉ bảng trang hai cấp, phân đoạn, TLB, Banker và phát hiện deadlock, lập lịch đĩa FCFS/SSTF/SCAN/LOOK/C-SCAN/C-LOOK, độ lệch trụ, semaphore) — mọi đáp số do chương trình osgcalc.py giải và được bộ máy mô phỏng /os-lab đối chiếu lần hai (108/108 khớp); 40 câu phỏng vấn backend/bảo mật có câu trả lời mẫu, câu hỏi nối tiếp và bài để ôn; bài thi cuối khoá 20 câu và mục lục bài kiểm tra từng chương.',
  lessons: [
    /* ───────────────────────── 16.1 — Ôn tập (1/2) ───────────────────────── */
    {
      title: '16.1 — Review sheet (1/2): processes, threads and scheduling, synchronization, deadlock, memory|||16.1 — Bảng ôn tập (1/2): tiến trình, luồng và lập lịch, đồng bộ, deadlock, bộ nhớ',
      slug: 'os-16-4-on-tap-1',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm chủ đề đầu của khoá trên một trang mỗi chủ đề: khái niệm cốt lõi, con số bạn đã tự đo (fork+exec 302,6 µs, một lần chuyển ngữ cảnh ~1 µs, counter++ mất 44–70 %, 65.539 page fault cho 256 MiB, exit 137), bẫy hay gặp trong đề OSG202, góc nhìn phỏng vấn và bài cần ôn lại.',
      content: `${G161}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.1</span>
<h2>Review sheet (1/2): processes to memory</h2>
<p class="lead">Fifteen chapters, a few hundred commands and outputs. Before an exam or an interview you do not need all of them — you need the <strong>ideas</strong>, the <strong>numbers you measured yourself</strong>, and the <strong>traps</strong>. This lesson and the next compress the course into ten topics. For each one: what you must be able to say in one sentence, the evidence you produced (re-read from your own lab output), what OSG202 exams like to ask, and where to go back if a line feels unfamiliar. The question to keep asking: <strong>could I explain this to an interviewer, with a number, in under a minute?</strong></p>

<h3>How to use these two sheets</h3>
<ul>
<li>Read a topic, cover the right-hand columns, and say the one-sentence definition out loud. Then check.</li>
<li>Every "measured" number is from a real run in this course. Quote it: "a context switch cost about a microsecond when I measured it" beats "context switches are expensive".</li>
<li>OSG202 tests the same ideas with textbook vocabulary: keep both. Links marked 🎓 go to the matching OSG202 lesson.</li>
<li>Lessons 16.3–16.5 drill the computations; 16.6–16.7 the interview questions; 16.8 is the final exam.</li>
</ul>

<h3>1. Processes</h3>
${sheet([
  ['process', 'A running program: an address space, registers, open files, credentials, a PID — the kernel’s unit of ownership.', '<code>/proc/PID</code> shows all of it', a('os-1-1-tien-trinh', '1.1')],
  ['fork / exec / wait', 'fork copies the process (copy-on-write), exec replaces its program, wait collects the exit status.', 'fork+exec+wait 302.6 µs; posix_spawn 266.1 µs', a('os-1-2-fork-exec', '1.2')],
  ['user vs kernel mode', 'Only kernel mode may touch hardware; a system call is the controlled door between the two.', 'getppid() 176 ns vs a function call 2.1 ns', a('os-1-3-che-do', '1.3')],
  ['states, signals, exit codes', 'R S D T Z; a signal ends a process with status 128 + N.', 'OOM SIGKILL ⇒ exit 137', a('os-1-4-vong-doi', '1.4')],
  ['zombie / orphan', 'A zombie has exited but nobody called wait; an orphan’s parent died and init adopts it.', '<code>Z</code> in <code>ps</code>, PPID 1', a('os-1-2-fork-exec', '1.2')],
  ['PID 1 in a container', 'The first process must forward signals and reap children, or docker stop waits 10 s and kills.', 'node without a handler: stopped by SIGKILL, exit 137', a('os-1-5-pid1', '1.5')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — the price of creating work:</p>
${run('c12-fork', 'gcc -O2 spawncost.c')}
<p><strong>Exam traps.</strong> "How many processes does <code>fork(); fork(); fork();</code> create?" — 8 in total, 7 new (${a('os-1-2-fork-exec', '1.2')}). A zombie uses no CPU or memory beyond its process-table entry; you cannot kill it, only its parent can reap it. 🎓 ${g('osg202-2-1-tien-trinh-lap-lich', 'OSG202 2.1')} · ${g('osg202-2-3-fork-exec', 'OSG202 2.3')}</p>
<p><strong>Interview angle.</strong> "Why exit 137?" "What does docker stop do?" "Process vs thread?" — answered in 16.6 with these numbers.</p>
${lab('process', 'fork3', 'en', 'fork() three times: count the processes before the exam does it for you.')}

<h3>2. Threads and CPU scheduling</h3>
${sheet([
  ['thread', 'An execution path inside a process: own stack and registers, shared heap, code and file descriptors.', 'pthread_create+join 56.9 µs', a('os-3-1-luong', '3.1')],
  ['scheduling goals', 'Throughput, turnaround, waiting, response time, fairness — no policy wins all of them.', 'SJF minimises average waiting', a('os-3-2-lap-lich', '3.2')],
  ['FCFS · SJF · SRTF · RR · priority · MLFQ', 'Order by arrival · shortest job · shortest remaining · time slices · priority · feedback queues.', 'convoy effect, starvation, quantum trade-off', a('os-3-2-lap-lich', '3.2')],
  ['CFS / EEVDF', 'Linux picks the task with the smallest virtual runtime; nice changes the weight (×1.25 per step).', 'nice 5 got about a third of nice 0’s CPU', a('os-3-2-lap-lich', '3.2')],
  ['context switch', 'Saving one task’s registers and loading another’s; also costs cache and TLB warmth.', '~1 µs per switch on one core', a('os-3-3-context-switch', '3.3')],
  ['CPU limits', 'cpu.max quota throttles a container; runtimes may count host cores instead of the quota.', 'nr_throttled in cpu.stat', a('os-3-4-da-loi', '3.4')],
  ['event loop vs thread pool', 'One thread multiplexing I/O (Node) vs many threads blocking (Tomcat); CPU work blocks the loop.', 'a 1.5 s /cpu made /fast take 1.39 s', a('os-3-5-event-loop', '3.5')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — what a switch costs:</p>
${run('c33-cs', 'taskset -c 0 ./pingpong 200000', 2)}
<p>On one core a round trip (two switches) took about 2 µs; across two cores it took 23 µs because each wake-up crosses cores. Context switches are cheap one by one and expensive by the million.</p>
<p><strong>Exam traps.</strong> SJF is optimal for <em>average waiting time</em> only when all jobs are known; SRTF is its preemptive form. Round robin with a huge quantum becomes FCFS; with a tiny one, switch overhead dominates. In Gantt problems, state your tie rule (who enters the queue first when a job arrives as another is preempted) — 16.3 drills it. 🎓 ${g('osg202-2-4-lap-lich-tinh-toan', 'OSG202 2.4')}</p>
${lab('scheduler', 'textbook', 'en', 'Four textbook jobs under FCFS, SJF, SRTF, RR and priority: switch the policy and watch the Gantt chart and the averages change.', { tour: 'sched-policies' })}
${lab('gantt-exam', 'random', 'en', 'Self-test: a fresh random problem each time. Paint the Gantt chart yourself, fill finish/turnaround/waiting, press Check my answer — wrong cells are named by the convention you broke.')}

<h3>3. Synchronization</h3>
${sheet([
  ['race condition', 'The result depends on the interleaving of threads touching shared data without coordination.', '2 threads × 1M counter++: 44 % lost', a('os-5-1-race', '5.1')],
  ['critical section · mutual exclusion', 'Code that must not run in two threads at once; a mutex makes it so.', 'race fixed, slower', a('os-5-2-mutex', '5.2')],
  ['mutex · spinlock · futex', 'Sleep vs spin while waiting; Linux mutexes are futexes: no syscall when uncontended.', 'lockcost', a('os-5-2-mutex', '5.2')],
  ['condition variable', 'Wait for a condition while releasing the lock; always re-check in a while loop.', 'pc.c producer–consumer', a('os-5-2-mutex', '5.2')],
  ['semaphore · RW lock · atomic/CAS', 'Counter of permits · many readers or one writer · lock-free single-word updates.', 'cas 4 threads correct', a('os-5-3-semaphore', '5.3')],
  ['the same bugs in backends', 'Double booking, lost updates: fixed with row locks, unique constraints, idempotency keys.', 'SELECT … FOR UPDATE', a('os-5-4-backend', '5.4')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — counter++ is three instructions:</p>
${run('c51-race', './race 1 1000000', 3, { max: 6 })}
<p><strong>Exam traps.</strong> A binary semaphore initialised to 1 behaves like a mutex, but a semaphore has no owner (any thread may signal). <code>wait()</code> on a semaphore at 0 blocks; the order of two <code>wait</code>s on two semaphores can deadlock. "Which outputs are possible?" questions: enumerate interleavings — 16.5 does it with a program. 🎓 ${g('osg202-2-5-ipc-dong-bo', 'OSG202 2.5')}</p>
${lab('race', 'none', 'en', 'counter++ step by step: load, add, store — find the interleaving that loses an update.', { tour: 'race-lost-update' })}

<h3>4. Deadlock</h3>
${sheet([
  ['Coffman conditions', 'Mutual exclusion, hold and wait, no preemption, circular wait — all four needed; break one.', 'dl naive: hangs, exit 124 after timeout', a('os-6-1-deadlock', '6.1')],
  ['prevention', 'Break a condition by design: e.g. one global lock order kills circular wait.', 'dl ordered finishes', a('os-6-1-deadlock', '6.1')],
  ['avoidance: Banker', 'Grant a request only if the resulting state is safe (some order lets everyone finish).', 'banker.py step by step', a('os-6-4-banker', '6.4')],
  ['detection + recovery', 'Let it happen, find cycles (wait-for graph / request matrix), kill or roll back one.', 'PostgreSQL aborts one transaction', a('os-6-4-banker', '6.4')],
  ['livelock · starvation · priority inversion', 'Busy but no progress · never chosen · high priority waits for low (Mars Pathfinder).', 'priority inheritance fixes it', a('os-6-2-livelock', '6.2')],
  ['classic problems', 'Dining philosophers, readers–writers, bounded buffer.', 'philo: 3 solutions', a('os-6-3-kinh-dien', '6.3')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — a deadlock is a hang with 0 % CPU:</p>
${run('c61-dl', 'timeout 5 ./dl naive')}
<p><strong>Exam traps.</strong> An <em>unsafe</em> state is not yet a deadlock — it only means the system cannot guarantee completion. Banker needs the maximum demand in advance, which real systems rarely know (the classic "weakness" answer). "Which is not a prevention method? — Banker’s algorithm" (it is avoidance). 🎓 ${g('osg202-6-1-deadlock', 'OSG202 6.1')} · ${g('osg202-6-2-banker', 'OSG202 6.2')}</p>
${lab('deadlock', 'banker', 'en', 'Banker’s safety algorithm, one Work vector at a time — the same table you fill in on paper.', { tour: 'deadlock-banker' })}

<h3>5. Memory</h3>
${sheet([
  ['address space', 'Each process sees its own virtual addresses: code, data, heap, mmap, stack; ASLR randomises them.', '/proc/PID/maps', a('os-7-1-khong-gian', '7.1')],
  ['RSS · VSZ · PSS', 'Resident · mapped · resident with shared pages divided among sharers.', 'Node: VSZ ~486 MB, RSS ~49 MB', a('os-7-1-khong-gian', '7.1')],
  ['paging · page table · TLB', 'Fixed-size pages map to frames through a multi-level table; the TLB caches translations.', '4 KiB pages, 4-level table on arm64', a('os-7-2-phan-trang', '7.2')],
  ['page fault', 'Access to a page not yet mapped: minor (no disk) or major (disk read).', '256 MiB touched ⇒ 65,539 faults', a('os-7-3-page-fault', '7.3')],
  ['copy-on-write', 'fork shares pages until someone writes; Redis BGSAVE doubles memory only as pages change.', 'cowpfn: same frame until written', a('os-7-3-page-fault', '7.3')],
  ['page cache · swap · thrashing', 'Free RAM becomes file cache; swap helps until the working set does not fit.', '"free" near zero is normal', a('os-8-1-page-cache', '8.1')],
  ['OOM killer · cgroup limits', 'When reclaim fails, the kernel kills the highest-scored process; memory.max per container.', 'exit 137, OOMKilled true', a('os-8-4-exit137', '8.4')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — demand paging, one fault per 4 KiB page:</p>
${run('c73-fault', '/usr/bin/time -v ./touch 256 nohuge')}
<p>256 MiB / 4 KiB = 65,536 pages, and the program took 65,539 faults (plus a few for the program itself) — nearly all minor, because no disk was involved.</p>
${run('c14-oom', 'docker run --name os-oom', 3)}
<p><strong>Exam traps.</strong> Page size from the offset bits; number of pages from the page-number bits; FIFO can get worse with more frames (Belady), LRU and OPT cannot. Internal fragmentation belongs to paging, external to segmentation. 16.4 drills every computation. 🎓 ${g('osg202-3-1-phan-trang', 'OSG202 3.1')} · ${g('osg202-3-2-thay-trang', 'OSG202 3.2')} · ${g('osg202-3-3-tlb-dia-chi', 'OSG202 3.3')}</p>
${lab('vm', 'walk', 'en', 'Translate a virtual address by hand: split the bits, walk the levels, hit or miss in the TLB.', { tour: 'vm-translate' })}
${lab('addr-split', 'split', 'en', 'Split 0x12345678 into 10/10/12 bits: the fields are coloured on the binary, so you see why the answer is 72 / 837 / 1656 and not the hex digits read off directly.')}

<div class="pitfall co-tieu-de">
<p><strong>Memorising definitions without a number.</strong> "A context switch is expensive", "fork is slow", "page faults hurt" — every candidate says that. The difference between a passing answer and a strong one is a measurement and its limit: "about a microsecond on one core, 23 µs across cores in my lab, so it matters at hundreds of thousands per second, not at a hundred". If a number on this sheet surprises you, rerun its command in the lab before the exam — re-deriving it is faster than re-reading.</p>
</div>

<h3>🧪 Practice (45 min, closed book)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your OSG202 final is next week and you also have a backend internship interview. You want one page you can actually recite.</p>
<ol>
<li>For each of the five topics, write the one-sentence definitions of its concepts from memory, then compare with the tables.</li>
<li>For each topic, write <em>one</em> number you measured and the command that produced it.</li>
<li>Rerun two of those commands in the lab (for example <code>./spawncost</code> and <code>./race 2 1000000</code>) and check your numbers are in the same range.</li>
<li>Mark every line you got wrong and open its lesson link.</li>
</ol>
<p><strong>Done when:</strong> you can say all five topics aloud in under five minutes, each with one measured number, and you have re-read the lessons for every line you missed.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['copy-on-write', 'fork shares pages read-only and copies a page only when one side writes to it.'],
  ['turnaround / waiting / response time', 'Finish − arrival · turnaround − burst · first run − arrival: the three averages scheduling questions ask for.'],
  ['critical section', 'Code that touches shared state and must not run in two threads at once.'],
  ['safe state', 'A state from which some order lets every process finish; unsafe ≠ deadlocked.'],
  ['minor vs major page fault', 'A fault resolved without disk (zero page, page cache) vs one that waits for a disk read.'],
  ['OOM killer', 'The kernel’s last resort when reclaim fails: it SIGKILLs a process, which then reports exit 137.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Processes: fork + exec + wait, signals and 128 + N; measured fork+exec+wait 302.6 µs and thread creation 56.9 µs.</li>
<li>Scheduling: every policy trades throughput, waiting and response; a context switch costs ~1 µs on one core.</li>
<li>Synchronization: counter++ lost 44 % with two threads; locks, semaphores, atomics and DB row locks fix the same bug.</li>
<li>Deadlock: four Coffman conditions; prevent (lock order), avoid (Banker), or detect and recover.</li>
<li>Memory: virtual addresses, pages and the TLB; 65,539 faults for 256 MiB; the OOM killer’s signature is exit 137.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/', '📘', 'Operating Systems: Three Easy Pieces (free)', 'The textbook behind most of this course — virtualization, concurrency, persistence.', 'Open')}
${L(OSG('osg202-final-exam-fe'), '🎓', 'OSG202 — final exam practice', 'The real FPT final-exam papers in the exam room, with explanations.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.1</span>
<h2>Bảng ôn tập (1/2): từ tiến trình tới bộ nhớ</h2>
<p class="lead">Mười lăm chương, vài trăm lệnh và output. Trước kỳ thi hay buổi phỏng vấn bạn không cần tất cả — bạn cần <strong>ý chính</strong>, <strong>những con số chính mình đã đo</strong>, và <strong>các cái bẫy</strong>. Bài này và bài sau nén cả khoá vào mười chủ đề. Mỗi chủ đề có: điều bạn phải nói được trong một câu, bằng chứng bạn đã tạo ra (đọc lại từ output lab của chính bạn), điều đề OSG202 hay hỏi, và chỗ cần quay lại nếu một dòng nào đó còn lạ. Câu hỏi cần tự hỏi liên tục: <strong>mình có giải thích điều này cho người phỏng vấn, kèm một con số, trong dưới một phút được không?</strong></p>

<h3>Dùng hai bảng ôn này thế nào</h3>
<ul>
<li>Đọc một chủ đề, che các cột bên phải, rồi nói to định nghĩa một câu. Sau đó mới đối chiếu.</li>
<li>Mỗi con số "đã đo" đều từ một lần chạy thật trong khoá. Hãy trích nó: "một lần chuyển ngữ cảnh tốn khoảng một micro giây khi tôi đo" hơn hẳn "chuyển ngữ cảnh tốn kém".</li>
<li>OSG202 hỏi cùng những ý đó bằng từ vựng giáo trình: giữ cả hai. Link có dấu 🎓 trỏ tới bài OSG202 tương ứng.</li>
<li>Bài 16.3–16.5 luyện phần tính toán; 16.6–16.7 luyện câu phỏng vấn; 16.8 là bài thi cuối khoá.</li>
</ul>

<h3>1. Tiến trình</h3>
${sheet([
  ['process (tiến trình)', 'Một chương trình đang chạy: không gian địa chỉ, thanh ghi, file đang mở, danh tính, một PID — đơn vị sở hữu của nhân.', '<code>/proc/PID</code> cho thấy tất cả', a('os-1-1-tien-trinh', '1.1')],
  ['fork / exec / wait', 'fork sao chép tiến trình (copy-on-write), exec thay chương trình của nó, wait thu mã thoát.', 'fork+exec+wait 302,6 µs; posix_spawn 266,1 µs', a('os-1-2-fork-exec', '1.2')],
  ['chế độ user và kernel', 'Chỉ chế độ nhân được đụng phần cứng; system call là cửa có kiểm soát giữa hai bên.', 'getppid() 176 ns so với gọi hàm 2,1 ns', a('os-1-3-che-do', '1.3')],
  ['trạng thái, tín hiệu, mã thoát', 'R S D T Z; tín hiệu kết thúc tiến trình với mã 128 + N.', 'OOM SIGKILL ⇒ exit 137', a('os-1-4-vong-doi', '1.4')],
  ['zombie / orphan (mồ côi)', 'Zombie đã thoát mà chưa ai gọi wait; orphan mất cha và được init nhận nuôi.', '<code>Z</code> trong <code>ps</code>, PPID 1', a('os-1-2-fork-exec', '1.2')],
  ['PID 1 trong container', 'Tiến trình đầu tiên phải chuyển tín hiệu và thu dọn con, không thì docker stop chờ 10 s rồi giết.', 'node không có handler: bị SIGKILL, exit 137', a('os-1-5-pid1', '1.5')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — cái giá của việc tạo ra việc:</p>
${run('c12-fork', 'gcc -O2 spawncost.c')}
<p><strong>Bẫy trong đề.</strong> "<code>fork(); fork(); fork();</code> tạo bao nhiêu tiến trình?" — tổng 8, mới 7 (${a('os-1-2-fork-exec', '1.2')}). Zombie không tốn CPU hay bộ nhớ ngoài một mục trong bảng tiến trình; bạn không giết được nó, chỉ cha nó thu dọn được. 🎓 ${g('osg202-2-1-tien-trinh-lap-lich', 'OSG202 2.1')} · ${g('osg202-2-3-fork-exec', 'OSG202 2.3')}</p>
<p><strong>Góc phỏng vấn.</strong> "Vì sao exit 137?" "docker stop làm gì?" "Tiến trình khác luồng thế nào?" — trả lời ở 16.6 bằng chính các con số này.</p>
${lab('process', 'fork3', 'vi', 'fork() ba lần: tự đếm số tiến trình trước khi đề thi đếm hộ bạn.')}

<h3>2. Luồng và lập lịch CPU</h3>
${sheet([
  ['thread (luồng)', 'Một dòng thực thi trong tiến trình: stack và thanh ghi riêng, chung heap, mã và file descriptor.', 'pthread_create+join 56,9 µs', a('os-3-1-luong', '3.1')],
  ['mục tiêu lập lịch', 'Thông lượng, thời gian hoàn thành, thời gian chờ, thời gian đáp ứng, công bằng — không chính sách nào thắng tất cả.', 'SJF cho thời gian chờ trung bình nhỏ nhất', a('os-3-2-lap-lich', '3.2')],
  ['FCFS · SJF · SRTF · RR · ưu tiên · MLFQ', 'Theo thứ tự đến · việc ngắn nhất · còn lại ít nhất · lát thời gian · ưu tiên · hàng đợi phản hồi.', 'hiệu ứng đoàn xe, đói, đánh đổi quantum', a('os-3-2-lap-lich', '3.2')],
  ['CFS / EEVDF', 'Linux chọn tác vụ có thời gian chạy ảo nhỏ nhất; nice đổi trọng số (×1,25 mỗi bậc).', 'nice 5 được khoảng một phần ba CPU của nice 0', a('os-3-2-lap-lich', '3.2')],
  ['context switch (chuyển ngữ cảnh)', 'Cất thanh ghi của tác vụ này, nạp của tác vụ kia; còn tốn độ "ấm" của cache và TLB.', '~1 µs mỗi lần trên một lõi', a('os-3-3-context-switch', '3.3')],
  ['giới hạn CPU', 'Hạn mức cpu.max bóp container; runtime có thể đếm số lõi của máy thay vì hạn mức.', 'nr_throttled trong cpu.stat', a('os-3-4-da-loi', '3.4')],
  ['event loop và thread pool', 'Một luồng ghép kênh I/O (Node) so với nhiều luồng chặn (Tomcat); việc nặng CPU chặn vòng lặp.', 'một /cpu 1,5 s làm /fast mất 1,39 s', a('os-3-5-event-loop', '3.5')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — một lần chuyển tốn bao nhiêu:</p>
${run('c33-cs', 'taskset -c 0 ./pingpong 200000', 2)}
<p>Trên một lõi, một vòng đi về (hai lần chuyển) mất khoảng 2 µs; qua hai lõi mất 23 µs vì mỗi lần đánh thức phải vượt lõi. Chuyển ngữ cảnh rẻ khi tính từng lần và đắt khi tính theo triệu lần.</p>
<p><strong>Bẫy trong đề.</strong> SJF tối ưu cho <em>thời gian chờ trung bình</em> chỉ khi biết trước mọi việc; SRTF là bản có cắt ngang của nó. Round robin với quantum rất lớn thành FCFS; với quantum rất nhỏ thì chi phí chuyển lấn át. Trong bài Gantt, hãy ghi rõ luật hoà (ai vào hàng trước khi một việc đến đúng lúc việc khác bị cắt) — bài 16.3 luyện đúng chỗ này. 🎓 ${g('osg202-2-4-lap-lich-tinh-toan', 'OSG202 2.4')}</p>
${lab('scheduler', 'textbook', 'vi', 'Bốn việc giáo trình dưới FCFS, SJF, SRTF, RR và ưu tiên: đổi chính sách và nhìn biểu đồ Gantt cùng các giá trị trung bình thay đổi.', { tour: 'sched-policies' })}
${lab('gantt-exam', 'random', 'vi', 'Tự kiểm: mỗi lần một đề ngẫu nhiên mới. Tự tô biểu đồ Gantt, điền xong/hoàn thành/chờ, bấm Chấm bài — ô sai được gọi tên đúng quy ước bạn làm sai.')}

<h3>3. Đồng bộ</h3>
${sheet([
  ['race condition (tranh chấp)', 'Kết quả phụ thuộc thứ tự xen kẽ của các luồng đụng dữ liệu chung mà không phối hợp.', '2 luồng × 1 triệu counter++: mất 44 %', a('os-5-1-race', '5.1')],
  ['vùng găng · loại trừ lẫn nhau', 'Đoạn mã không được chạy ở hai luồng cùng lúc; mutex bảo đảm điều đó.', 'hết race, chậm hơn', a('os-5-2-mutex', '5.2')],
  ['mutex · spinlock · futex', 'Ngủ hay quay khi chờ; mutex của Linux là futex: không có syscall khi không ai tranh.', 'lockcost', a('os-5-2-mutex', '5.2')],
  ['condition variable (biến điều kiện)', 'Chờ một điều kiện đồng thời nhả khoá; luôn kiểm lại trong vòng while.', 'producer–consumer pc.c', a('os-5-2-mutex', '5.2')],
  ['semaphore · khoá đọc-ghi · atomic/CAS', 'Bộ đếm giấy phép · nhiều người đọc hoặc một người ghi · cập nhật một ô nhớ không cần khoá.', 'cas 4 luồng đúng', a('os-5-3-semaphore', '5.3')],
  ['cùng lỗi đó trong backend', 'Đặt trùng, mất cập nhật: sửa bằng khoá dòng, ràng buộc unique, khoá idempotency.', 'SELECT … FOR UPDATE', a('os-5-4-backend', '5.4')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — counter++ là ba lệnh máy:</p>
${run('c51-race', './race 1 1000000', 3, { max: 6 })}
<p><strong>Bẫy trong đề.</strong> Semaphore nhị phân khởi tạo 1 hành xử như mutex, nhưng semaphore không có chủ (luồng nào cũng signal được). <code>wait()</code> trên semaphore đang bằng 0 thì chặn; thứ tự hai lần <code>wait</code> trên hai semaphore có thể gây deadlock. Dạng "output nào có thể xảy ra?": liệt kê các cách xen kẽ — bài 16.5 làm việc đó bằng một chương trình. 🎓 ${g('osg202-2-5-ipc-dong-bo', 'OSG202 2.5')}</p>
${lab('race', 'none', 'vi', 'counter++ từng bước: nạp, cộng, ghi — tìm cách xen kẽ làm mất một lần cập nhật.', { tour: 'race-lost-update' })}

<h3>4. Deadlock</h3>
${sheet([
  ['điều kiện Coffman', 'Loại trừ lẫn nhau, giữ và chờ, không cưỡng đoạt, chờ vòng — cần đủ cả bốn; phá một cái.', 'dl naive: treo, exit 124 khi hết giờ', a('os-6-1-deadlock', '6.1')],
  ['phòng ngừa (prevention)', 'Phá một điều kiện ngay từ thiết kế: vd một thứ tự khoá toàn cục giết chờ vòng.', 'dl ordered chạy xong', a('os-6-1-deadlock', '6.1')],
  ['tránh (avoidance): Banker', 'Chỉ cấp khi trạng thái sau đó an toàn (có một thứ tự cho mọi người chạy xong).', 'banker.py từng bước', a('os-6-4-banker', '6.4')],
  ['phát hiện + khôi phục', 'Để nó xảy ra, tìm vòng (đồ thị chờ / ma trận Request), giết hoặc quay lui một bên.', 'PostgreSQL huỷ một giao dịch', a('os-6-4-banker', '6.4')],
  ['livelock · đói · đảo ngược ưu tiên', 'Bận mà không tiến · không bao giờ được chọn · ưu tiên cao chờ ưu tiên thấp (Mars Pathfinder).', 'kế thừa ưu tiên sửa được', a('os-6-2-livelock', '6.2')],
  ['bài toán kinh điển', 'Triết gia ăn tối, đọc–ghi, bộ đệm giới hạn.', 'philo: 3 lời giải', a('os-6-3-kinh-dien', '6.3')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — deadlock là treo ở 0 % CPU:</p>
${run('c61-dl', 'timeout 5 ./dl naive')}
<p><strong>Bẫy trong đề.</strong> Trạng thái <em>không an toàn</em> chưa phải deadlock — nó chỉ nghĩa là hệ thống không bảo đảm được việc hoàn thành. Banker cần biết trước nhu cầu tối đa, điều hệ thống thật hiếm khi biết (câu trả lời kinh điển cho "điểm yếu"). "Cách nào không phải phòng ngừa? — thuật toán Banker" (nó là tránh). 🎓 ${g('osg202-6-1-deadlock', 'OSG202 6.1')} · ${g('osg202-6-2-banker', 'OSG202 6.2')}</p>
${lab('deadlock', 'banker', 'vi', 'Thuật toán an toàn của Banker, từng vector Work một — đúng cái bảng bạn điền trên giấy.', { tour: 'deadlock-banker' })}

<h3>5. Bộ nhớ</h3>
${sheet([
  ['không gian địa chỉ', 'Mỗi tiến trình thấy địa chỉ ảo riêng: mã, dữ liệu, heap, mmap, stack; ASLR xáo chúng.', '/proc/PID/maps', a('os-7-1-khong-gian', '7.1')],
  ['RSS · VSZ · PSS', 'Đang nằm trong RAM · đã ánh xạ · nằm trong RAM với trang chung chia đều cho người dùng chung.', 'Node: VSZ ~486 MB, RSS ~49 MB', a('os-7-1-khong-gian', '7.1')],
  ['phân trang · bảng trang · TLB', 'Trang cỡ cố định ánh xạ vào khung qua bảng nhiều cấp; TLB cache các phép dịch.', 'trang 4 KiB, bảng 4 cấp trên arm64', a('os-7-2-phan-trang', '7.2')],
  ['page fault', 'Đụng một trang chưa ánh xạ: minor (không cần đĩa) hoặc major (đọc đĩa).', 'chạm 256 MiB ⇒ 65.539 fault', a('os-7-3-page-fault', '7.3')],
  ['copy-on-write', 'fork dùng chung trang tới khi có bên ghi; BGSAVE của Redis chỉ nhân đôi bộ nhớ theo số trang bị đổi.', 'cowpfn: cùng khung tới khi ghi', a('os-7-3-page-fault', '7.3')],
  ['page cache · swap · thrashing', 'RAM trống thành cache file; swap giúp được tới khi tập làm việc không còn vừa.', '"free" gần 0 là bình thường', a('os-8-1-page-cache', '8.1')],
  ['OOM killer · giới hạn cgroup', 'Khi thu hồi thất bại, nhân giết tiến trình điểm cao nhất; memory.max cho từng container.', 'exit 137, OOMKilled true', a('os-8-4-exit137', '8.4')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — nạp trang theo yêu cầu, mỗi trang 4 KiB một fault:</p>
${run('c73-fault', '/usr/bin/time -v ./touch 256 nohuge')}
<p>256 MiB / 4 KiB = 65.536 trang, và chương trình gặp 65.539 fault (thêm vài cái cho chính chương trình) — gần như toàn minor, vì không dính tới đĩa.</p>
${run('c14-oom', 'docker run --name os-oom', 3)}
<p><strong>Bẫy trong đề.</strong> Cỡ trang suy từ số bit offset; số trang suy từ số bit số trang; FIFO có thể tệ đi khi thêm khung (Belady), LRU và OPT thì không. Phân mảnh trong thuộc về phân trang, phân mảnh ngoài thuộc về phân đoạn. Bài 16.4 luyện mọi phép tính. 🎓 ${g('osg202-3-1-phan-trang', 'OSG202 3.1')} · ${g('osg202-3-2-thay-trang', 'OSG202 3.2')} · ${g('osg202-3-3-tlb-dia-chi', 'OSG202 3.3')}</p>
${lab('vm', 'walk', 'vi', 'Tự tay dịch một địa chỉ ảo: tách bit, đi qua các cấp, trúng hay trượt TLB.', { tour: 'vm-translate' })}
${lab('addr-split', 'split', 'vi', 'Tách 0x12345678 thành 10/10/12 bit: các trường được tô màu trên dãy nhị phân, nên bạn thấy vì sao đáp án là 72 / 837 / 1656 chứ không phải đọc thẳng các chữ số hex.')}

<div class="pitfall co-tieu-de">
<p><strong>Học thuộc định nghĩa mà không có con số.</strong> "Chuyển ngữ cảnh tốn kém", "fork chậm", "page fault gây hại" — ứng viên nào cũng nói thế. Khác biệt giữa câu trả lời đạt và câu trả lời mạnh là một số đo và giới hạn của nó: "khoảng một micro giây trên một lõi, 23 µs khi qua lõi trong lab của tôi, nên nó đáng kể ở mức hàng trăm nghìn lần mỗi giây, không phải ở mức một trăm". Nếu một con số trên bảng này làm bạn bất ngờ, hãy chạy lại lệnh của nó trong lab trước kỳ thi — tự đo lại nhanh hơn đọc lại.</p>
</div>

<h3>🧪 Thực hành (45 phút, gập sách)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> tuần sau bạn thi cuối kỳ OSG202 và còn một buổi phỏng vấn thực tập backend. Bạn muốn một trang giấy mình thật sự đọc thuộc được.</p>
<ol>
<li>Với mỗi chủ đề trong năm chủ đề, viết từ trí nhớ định nghĩa một câu của các khái niệm, rồi so với bảng.</li>
<li>Với mỗi chủ đề, viết <em>một</em> con số bạn đã đo và lệnh đã tạo ra nó.</li>
<li>Chạy lại hai lệnh trong số đó trong lab (ví dụ <code>./spawncost</code> và <code>./race 2 1000000</code>) và kiểm con số của bạn có cùng khoảng không.</li>
<li>Đánh dấu mọi dòng bạn sai và mở link bài của nó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nói to được cả năm chủ đề trong dưới năm phút, mỗi chủ đề kèm một con số đã đo, và đã đọc lại bài cho mọi dòng mình làm sai.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['copy-on-write (sao chép khi ghi)', 'fork dùng chung các trang ở chế độ chỉ đọc và chỉ chép một trang khi một bên ghi vào nó.'],
  ['turnaround / waiting / response time', 'Kết thúc − đến · turnaround − thời gian CPU · lần chạy đầu − đến: ba giá trị trung bình mà đề lập lịch hay hỏi.'],
  ['critical section (vùng găng)', 'Đoạn mã đụng trạng thái chung và không được chạy ở hai luồng cùng lúc.'],
  ['safe state (trạng thái an toàn)', 'Trạng thái từ đó có một thứ tự cho mọi tiến trình chạy xong; không an toàn ≠ đã deadlock.'],
  ['minor vs major page fault', 'Fault giải quyết không cần đĩa (trang 0, page cache) so với fault phải chờ đọc đĩa.'],
  ['OOM killer', 'Đường cùng của nhân khi thu hồi thất bại: nó SIGKILL một tiến trình, tiến trình đó báo exit 137.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tiến trình: fork + exec + wait, tín hiệu và 128 + N; đo được fork+exec+wait 302,6 µs và tạo luồng 56,9 µs.</li>
<li>Lập lịch: chính sách nào cũng đánh đổi thông lượng, thời gian chờ và đáp ứng; một lần chuyển ngữ cảnh ~1 µs trên một lõi.</li>
<li>Đồng bộ: counter++ mất 44 % với hai luồng; khoá, semaphore, atomic và khoá dòng CSDL sửa cùng một lỗi.</li>
<li>Deadlock: bốn điều kiện Coffman; phòng ngừa (thứ tự khoá), tránh (Banker), hoặc phát hiện và khôi phục.</li>
<li>Bộ nhớ: địa chỉ ảo, trang và TLB; 65.539 fault cho 256 MiB; dấu hiệu của OOM killer là exit 137.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/', '📘', 'Operating Systems: Three Easy Pieces (miễn phí)', 'Giáo trình đứng sau phần lớn khoá này — ảo hoá, đồng thời, lưu trữ bền.', 'Mở')}
${L(OSG('osg202-final-exam-fe'), '🎓', 'OSG202 — luyện đề cuối kỳ', 'Đề thi cuối kỳ thật của FPT trong phòng thi, có lời giải.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.2 — Ôn tập (2/2) ───────────────────────── */
    {
      title: '16.2 — Review sheet (2/2): files, I/O, system calls, containers, security|||16.2 — Bảng ôn tập (2/2): file, I/O, lời gọi hệ thống, container, bảo mật',
      slug: 'os-16-5-on-tap-2',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Năm chủ đề sau của khoá, cùng khuôn: khái niệm một câu, con số đã đo (fsync 884 µs so với ghi đệm 1,8 µs, epoll 0,72 µs so với poll 676 µs ở 10.000 fd, syscall 176 ns so với vDSO 18,5 ns, 10.000 luồng tốn thêm 156 MiB stack nhân, stack smashing exit 134), bẫy trong đề OSG202 (inode, I/O, lập lịch đĩa), góc phỏng vấn và bài cần ôn lại — kèm bảng "mười con số nên nhớ".',
      content: `${G162}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.2</span>
<h2>Review sheet (2/2): files to security</h2>
<p class="lead">The second half of the course is where backend and security work lives: files that must survive a crash, thousands of connections on one thread, the kernel boundary, containers, and the attacks that exploit all of them. Same format as 16.1 — one sentence, one measured number, the exam traps, the lesson to go back to. The question: <strong>can you connect each mechanism to a production symptom you would recognise?</strong></p>

<h3>6. Files and file systems</h3>
${sheet([
  ['inode · directory entry', 'The inode holds the file (metadata + block pointers); a name is only a directory entry pointing to it.', 'two names, one inode (ls -li)', a('os-9-1-inode', '9.1')],
  ['hard link · symlink', 'A second name for the same inode · a small file containing a path.', 'rm the original: hard link still works', a('os-9-1-inode', '9.1')],
  ['fd · open-file table', 'An fd points to an open-file entry holding the offset; dup and fork share it.', 'parent and child shared one offset', a('os-9-5-fd', '9.2')],
  ['write() vs fsync()', 'write puts bytes in the page cache; only fsync waits for the device.', 'buffered 1.8 µs vs fsync 884 µs per write', a('os-9-2-fsync', '9.3')],
  ['journaling', 'Write the intent to a journal first, so a crash leaves the file system consistent.', 'data=ordered, pulled power on a disk image', a('os-9-3-journaling', '9.4')],
  ['permissions · setuid · capabilities', 'rwx for owner/group/other; setuid runs as the file’s owner; capabilities split root.', 'PATH attack on a setuid binary', a('os-9-4-quyen', '9.6')],
  ['disk full · deleted-but-open', 'Blocks of a deleted file stay allocated while any process holds it open.', 'df 55 % vs du 4 K (lsof +L1)', a('os-2-4-dia-io', '2.4')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — the price of durability, three runs:</p>
${run('c93-fsync', 'for run in 1 2 3; do ./wbench')}
<p>A buffered write costs under 2 µs because it only copies into memory; waiting for the device makes it ~500× slower. That ratio is why databases batch their fsyncs (group commit — exactly the fix in 17.3).</p>
${run('c24-disk', 'rm /mnt/vps/log/app.log', 3)}
<p><strong>Exam traps.</strong> OSG202 inode questions: the number of blocks reachable through direct, single, double and triple indirect pointers — multiply block size by pointers per block at each level. Contiguous vs linked vs indexed allocation: random access, fragmentation, overhead. A hard link cannot cross file systems; a symlink can and can dangle. 🎓 ${g('osg202-4-1-he-thong-tep', 'OSG202 4.1')} · ${g('osg202-4-2-inode', 'OSG202 4.2')}</p>
${lab('fdtable', 'fork', 'en', 'After fork, parent and child share the same open-file entry — and therefore the same offset. This is why two processes appending to one log interleave cleanly only with O_APPEND.', { tour: 'fdtable-offsets' })}

<h3>7. I/O models</h3>
${sheet([
  ['blocking · non-blocking · async', 'Wait inside the call · return EAGAIN at once · get notified when done.', 'five Stevens models in C', a('os-10-2-blocking', '10.2')],
  ['select · poll · epoll', 'Scan all fds every time · scan all · the kernel keeps a ready list and returns only ready fds.', 'epoll 0.72 µs vs poll 676 µs at 10,000 fds', a('os-10-3-epoll', '10.3')],
  ['level vs edge triggered', 'Keep notifying while data is there · notify once per change; ET needs reading until EAGAIN.', 'ET hung with 6 unread bytes', a('os-10-3-epoll', '10.3')],
  ['C10K: thread vs event loop', 'A thread per connection pays stack and switches; one epoll loop pays neither.', '10,000 threads: +156 MiB kernel stacks', a('os-10-5-c10k', '10.4')],
  ['disk I/O in an event loop', 'Regular files are always "ready" to epoll, so Node sends file reads to a thread pool.', 'UV_THREADPOOL_SIZE', a('os-10-7-dia-mang', '10.6')],
  ['io_uring · sendfile', 'Shared submission/completion rings · copy file → socket inside the kernel.', 'io_uring blocked by Docker’s seccomp', a('os-10-4-io-uring', '10.7')],
  ['backpressure · timeouts', 'Stop reading when you cannot write; every network call needs a deadline.', 'write() === false in Node', a('os-10-8-backpressure', '10.8')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — why epoll scales:</p>
${run('c103-epoll', 'gcc -O2 -Wall -o pollbench')}
<p>select and poll grow linearly with the number of watched fds; epoll stays at 0.7 µs per wake-up from 10 to 10,000. select cannot even watch fd 10,002: <code>FD_SETSIZE</code> is 1,024.</p>
<p><strong>Exam traps.</strong> OSG202 I/O questions: programmed I/O (busy wait) vs interrupt-driven vs DMA; where buffering helps; and <strong>disk-arm scheduling</strong> (FCFS, SSTF/SSF, SCAN/elevator, C-SCAN, LOOK) — drilled with a program in 16.5. 🎓 ${g('osg202-5-1-io', 'OSG202 5.1')} · ${g('osg202-5-2-lap-lich-dia', 'OSG202 5.2')}</p>
${lab('disk-arm', 'exam', 'en', 'Disk-arm scheduling in exam mode: type the service order and the total head movement, then check — the path stays hidden until you do.')}
${lab('epoll', 'scan', 'en', 'select/poll scan every fd on every call; epoll returns only the ready ones — slide from 10 to 10,000 connections.', { tour: 'epoll-ready' })}

<h3>8. System calls and the kernel boundary</h3>
${sheet([
  ['system call', 'A numbered request to the kernel through a trap; libc wraps it, errno reports failure.', 'getppid() 176 ns, a call 2.1 ns', a('os-11-1-hanh-trinh', '11.1')],
  ['vDSO', 'Kernel code mapped into every process so time queries skip the trap.', 'clock_gettime 18.5 ns', a('os-11-5-chi-phi', '11.4')],
  ['strace · ltrace', 'Show every system call (or library call) a program makes, with arguments and timing.', 'strace -c, -f, -e trace=', a('os-11-2-strace-ltrace', '11.3')],
  ['errno · EINTR · EAGAIN · EPIPE', 'Interrupted · try again later · peer has gone — handle each, do not crash.', 'SA_RESTART', a('os-11-6-errno-tin-hieu', '11.5')],
  ['/proc and /sys', 'The kernel’s second API: state as files (status, fd, wchan, stack, cgroup).', '/proc/PID/wchan of a stuck process', a('os-11-7-proc-sys', '11.6')],
  ['seccomp', 'A per-process filter of allowed system calls: EPERM, ENOSYS or kill.', 'mkdirat blocked ⇒ exit 159 (SIGSYS)', a('os-11-4-seccomp', '11.7')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — what crossing the boundary costs:</p>
${run('c114-chi-phi', 'gcc -O2 -Wall cost.c', 1, { max: 7 })}
<p><strong>Exam traps.</strong> "Which one requires a mode switch?" — any real system call; a library function that does not call the kernel does not. The vDSO is why <code>gettimeofday</code> is cheap. 🎓 ${g('osg202-1-4-syscall-kien-truc', 'OSG202 1.4')}</p>
${lab('syscall', 'vdso', 'en', 'Two paths to the time: a trap into the kernel or a read from the vDSO page — compare the cost.', { tour: 'syscall-journey' })}

<h3>9. Containers</h3>
${sheet([
  ['namespace', 'A separate view of one kernel resource: pid, mnt, net, uts, ipc, user, cgroup, time.', 'unshare --pid: "I am PID 1"', a('os-12-1-namespaces', '12.1')],
  ['cgroup v2', 'Limits and accounting for a group of processes: memory.max, cpu.max, pids.max, io.max.', 'memory.max 64M ⇒ exit 137, oom_kill 1', a('os-12-2-cgroups', '12.2')],
  ['OverlayFS · image layers', 'Read-only lower layers + a writable upper layer; changing a file copies it up.', '200 MB copy-up 0.93 s', a('os-12-3-overlayfs', '12.3')],
  ['container = process', 'A container is a process with namespaces, a cgroup and a new root — same kernel as the host.', 'the mini container of 12.4, minictr of 17.5', a('os-12-4-mini', '12.4')],
  ['runtime chain', 'docker CLI → dockerd → containerd → shim → runc → your process.', 'runc spec / run', a('os-12-6-runc', '12.6')],
  ['VM vs container', 'A VM has its own kernel on a hypervisor; Docker on a Mac is a Linux VM.', 'uname -r = linuxkit', a('os-14-3-wsl', '14.6')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — two identities and a budget:</p>
${run('c121-ns', "unshare --pid --fork --mount-proc sh -c 'echo")}
${run('c122-cg', "sh -c 'echo $$ > /sys/fs/cgroup/box", 2)}
<p><strong>Exam / interview traps.</strong> "Containers are lightweight VMs" — no: one kernel, so a kernel bug is everyone’s bug. "Docker limits memory" — the kernel does, through cgroups; Docker only writes the files. 🎓 ${g('osg202-n1-1-cloud-container', 'OSG202 N1.1')}</p>
${lab('nslayers', 'docker', 'en', 'One process, two views: switch namespaces on one by one and compare what the host and the container see.', { tour: 'nslayers-views' })}

<h3>10. Security at the OS layer (defensive)</h3>
${sheet([
  ['stack frame · calling convention', 'Return address, saved registers and locals live on the stack; overwriting them hijacks control.', 'objdump/gdb of a function', a('os-13-1-bo-nho', '13.1')],
  ['buffer overflow · mitigations', 'Canary, NX, ASLR/PIE, RELRO, FORTIFY — each blocks one step of an exploit.', 'canary ⇒ "stack smashing detected", exit 134', a('os-13-2-overflow', '13.2')],
  ['setuid · PATH · TOCTOU', 'A setuid program that trusts its environment can be steered; check-then-use races.', 'planted "hostname" ran from a setuid binary', a('os-13-3-leo-thang', '13.3')],
  ['least privilege', 'Drop capabilities, no_new_privs, seccomp, non-root user, read-only root.', 'CapBnd reduced, mount refused', a('os-13-4-container-escape', '13.4')],
  ['container escape basics', '<code>--privileged</code> and a mounted <code>docker.sock</code> hand out root on the host.', 'hardening checklist', a('os-13-4-container-escape', '13.4')],
], ['Concept', 'In one sentence', 'Measured / seen', 'Lesson'])}
<p><strong>Evidence you produced</strong> — a mitigation doing its job:</p>
${run('c132-overflow', './retaddr-canary')}
<p><strong>Interview trap.</strong> "Is ASLR enough?" — no single mitigation is; they are layers, and an information leak can defeat ASLR. Answer with the layer each one blocks.</p>
${lab('memory', 'overflow', 'en', 'Watch a buffer overflow walk up the stack frame towards the return address — and where the canary sits in the way.')}

<h3>Ten numbers worth remembering</h3>
<table>
<tr><th>What</th><th>Measured in this course</th><th>Why it matters</th></tr>
<tr><td>function call · system call · vDSO</td><td>2.1 ns · 176 ns · 18.5 ns</td><td>batch syscalls; time queries are cheap</td></tr>
<tr><td>context switch on one core</td><td>~1 µs</td><td>matters at 10⁵–10⁶ per second</td></tr>
<tr><td>thread · fork+exec</td><td>56.9 µs · 302.6 µs</td><td>pools, not one process per request</td></tr>
<tr><td>buffered write · fsync</td><td>1.8 µs · ~880 µs</td><td>group commit, async replication</td></tr>
<tr><td>epoll · poll at 10,000 fds</td><td>0.72 µs · 676 µs</td><td>why nginx and Node use epoll</td></tr>
<tr><td>10,000 idle threads</td><td>+156 MiB kernel stacks</td><td>C10K needs an event loop</td></tr>
<tr><td>256 MiB touched</td><td>65,539 page faults</td><td>first touch is not free</td></tr>
<tr><td>counter++ in 2 threads</td><td>44 % updates lost</td><td>no lock, no correctness</td></tr>
<tr><td>killed by SIGKILL / SIGTERM / SIGSEGV</td><td>137 / 143 / 139</td><td>read exit codes as 128 + N</td></tr>
<tr><td>Little’s law, 64 clients at 347/s</td><td>≈ 184 ms predicted, 182 ms measured</td><td>latency of a saturated pool</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>Learning the security chapter as an attack recipe.</strong> Interviews for security roles test whether you understand <em>why</em> a mitigation works and how to verify it is on (<code>readelf</code>, <code>checksec</code>-style checks, <code>/proc/PID/status</code>), and how to run a service with less privilege. Everything in Chapter 13 was done on your own lab binaries, defensively; keep it that way in your answers — "I verified the canary aborts the program with exit 134" is the answer they want.</p>
</div>

<h3>🧪 Practice (45 min, closed book)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a friend preparing for a backend interview asks you to quiz them. You decide to prepare by quizzing yourself first.</p>
<ol>
<li>Cover the "Measured" column of the ten-numbers table and fill it in from memory.</li>
<li>For topics 6–10, explain one production symptom each mechanism causes (example: "df full, du small" → deleted-but-open file).</li>
<li>Rerun <code>./pollbench epoll 10000</code> and <code>./wbench</code> in the lab; compare with the sheet.</li>
<li>Write a 3-line answer to "what is a container?" that names namespaces, cgroups and the shared kernel.</li>
</ol>
<p><strong>Done when:</strong> at least eight of the ten numbers are right within a factor of two, every symptom names its mechanism, and your container answer fits three lines.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['inode', 'The on-disk object that is the file; names in directories point to it, and it lives while names or open fds remain.'],
  ['fsync', 'Waits until the file’s data and metadata are on the device — the only way write() becomes durable.'],
  ['epoll', 'Linux’s scalable readiness API: register fds once, get back only the ready ones.'],
  ['vDSO', 'A kernel page mapped into each process so some calls (time) avoid the trap.'],
  ['namespace · cgroup', 'What a process can see · how much it can use — the two halves of a container.'],
  ['stack canary', 'A random value placed before the return address; overwritten ⇒ the program aborts (exit 134).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Files: names point to inodes; write() is not durable until fsync (~880 µs vs 1.8 µs); deleted-but-open files fill disks.</li>
<li>I/O: epoll stays at 0.7 µs per wake-up up to 10,000 fds while poll grows to 676 µs; event loops beat a thread per connection.</li>
<li>System calls cost ~176 ns; the vDSO makes time queries ~18 ns; strace and /proc show what a process is doing.</li>
<li>A container is a process with namespaces (view) and a cgroup (budget) on the host’s kernel.</li>
<li>Security is layers: canary, NX, ASLR, RELRO, least privilege, seccomp — and verifying each is on.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/epoll.7.html', '📄', 'epoll(7) — Linux manual page', 'Level vs edge triggered, the ready list, and the usual pitfalls.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/namespaces.7.html', '📄', 'namespaces(7) — Linux manual page', 'Every namespace type and the system calls that create and join them.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.2</span>
<h2>Bảng ôn tập (2/2): từ file tới bảo mật</h2>
<p class="lead">Nửa sau của khoá là nơi công việc backend và bảo mật sống: file phải sống sót qua sự cố sập máy, hàng nghìn kết nối trên một luồng, ranh giới nhân, container, và những đòn tấn công khai thác tất cả chúng. Cùng khuôn với 16.1 — một câu, một con số đã đo, các bẫy trong đề, bài cần quay lại. Câu hỏi: <strong>bạn có nối được từng cơ chế với một triệu chứng production mà mình sẽ nhận ra không?</strong></p>

<h3>6. File và hệ thống file</h3>
${sheet([
  ['inode · mục thư mục', 'Inode chứa file (siêu dữ liệu + con trỏ khối); tên chỉ là một mục thư mục trỏ tới nó.', 'hai tên, một inode (ls -li)', a('os-9-1-inode', '9.1')],
  ['hard link · symlink', 'Một tên thứ hai cho cùng inode · một file nhỏ chứa một đường dẫn.', 'xoá bản gốc: hard link vẫn chạy', a('os-9-1-inode', '9.1')],
  ['fd · bảng file đang mở', 'fd trỏ tới một mục file đang mở giữ vị trí đọc/ghi; dup và fork dùng chung nó.', 'cha và con dùng chung một vị trí', a('os-9-5-fd', '9.2')],
  ['write() và fsync()', 'write đặt byte vào page cache; chỉ fsync mới chờ thiết bị.', 'ghi đệm 1,8 µs so với fsync 884 µs mỗi lần', a('os-9-2-fsync', '9.3')],
  ['journaling (ghi nhật ký)', 'Ghi ý định vào journal trước, để sập máy vẫn để lại hệ thống file nhất quán.', 'data=ordered, rút điện trên ảnh đĩa', a('os-9-3-journaling', '9.4')],
  ['quyền · setuid · capability', 'rwx cho chủ/nhóm/người khác; setuid chạy với quyền chủ file; capability chia nhỏ root.', 'tấn công PATH vào một file setuid', a('os-9-4-quyen', '9.6')],
  ['đầy đĩa · đã xoá mà vẫn mở', 'Khối của file đã xoá vẫn bị chiếm khi còn tiến trình giữ mở nó.', 'df 55 % so với du 4 K (lsof +L1)', a('os-2-4-dia-io', '2.4')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — cái giá của độ bền, ba lần chạy:</p>
${run('c93-fsync', 'for run in 1 2 3; do ./wbench')}
<p>Một lần ghi có đệm tốn dưới 2 µs vì chỉ chép vào bộ nhớ; chờ thiết bị làm nó chậm ~500 lần. Tỉ lệ đó là lý do CSDL gom fsync (group commit — đúng cách sửa ở 17.3).</p>
${run('c24-disk', 'rm /mnt/vps/log/app.log', 3)}
<p><strong>Bẫy trong đề.</strong> Câu inode của OSG202: số khối với tới được qua con trỏ trực tiếp, gián tiếp đơn, đôi, ba — nhân cỡ khối với số con trỏ mỗi khối ở từng cấp. Cấp phát liên tục, liên kết, chỉ mục: truy cập ngẫu nhiên, phân mảnh, chi phí. Hard link không vượt được hệ thống file; symlink thì được và có thể lơ lửng. 🎓 ${g('osg202-4-1-he-thong-tep', 'OSG202 4.1')} · ${g('osg202-4-2-inode', 'OSG202 4.2')}</p>
${lab('fdtable', 'fork', 'vi', 'Sau fork, cha và con dùng chung một mục file đang mở — nên dùng chung vị trí đọc/ghi. Vì thế hai tiến trình cùng ghi nối một log chỉ xen kẽ gọn gàng khi có O_APPEND.', { tour: 'fdtable-offsets' })}

<h3>7. Các mô hình I/O</h3>
${sheet([
  ['chặn · không chặn · bất đồng bộ', 'Chờ trong lời gọi · trả EAGAIN ngay · được báo khi xong.', 'năm mô hình Stevens bằng C', a('os-10-2-blocking', '10.2')],
  ['select · poll · epoll', 'Quét mọi fd mỗi lần · quét mọi fd · nhân giữ danh sách sẵn sàng và chỉ trả fd sẵn sàng.', 'epoll 0,72 µs so với poll 676 µs ở 10.000 fd', a('os-10-3-epoll', '10.3')],
  ['level và edge triggered', 'Báo hoài khi còn dữ liệu · báo một lần mỗi thay đổi; ET phải đọc tới EAGAIN.', 'ET treo với 6 byte chưa đọc', a('os-10-3-epoll', '10.3')],
  ['C10K: luồng và event loop', 'Mỗi kết nối một luồng thì trả giá stack và chuyển ngữ cảnh; một vòng epoll thì không.', '10.000 luồng: thêm 156 MiB stack nhân', a('os-10-5-c10k', '10.4')],
  ['I/O đĩa trong event loop', 'File thường luôn "sẵn sàng" với epoll, nên Node đẩy việc đọc file sang pool luồng.', 'UV_THREADPOOL_SIZE', a('os-10-7-dia-mang', '10.6')],
  ['io_uring · sendfile', 'Vòng gửi/nhận dùng chung · chép file → socket ngay trong nhân.', 'io_uring bị seccomp của Docker chặn', a('os-10-4-io-uring', '10.7')],
  ['backpressure · timeout', 'Ngừng đọc khi không ghi kịp; mọi lời gọi mạng cần hạn chót.', 'write() === false trong Node', a('os-10-8-backpressure', '10.8')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — vì sao epoll mở rộng được:</p>
${run('c103-epoll', 'gcc -O2 -Wall -o pollbench')}
<p>select và poll tăng tuyến tính theo số fd được theo dõi; epoll đứng yên ở 0,7 µs mỗi lần thức từ 10 tới 10.000. select thậm chí không theo dõi nổi fd 10.002: <code>FD_SETSIZE</code> là 1.024.</p>
<p><strong>Bẫy trong đề.</strong> Câu I/O của OSG202: I/O có lập trình (bận chờ), I/O theo ngắt, DMA; bộ đệm giúp ở đâu; và <strong>lập lịch tay đĩa</strong> (FCFS, SSTF/SSF, SCAN/thang máy, C-SCAN, LOOK) — luyện bằng chương trình ở 16.5. 🎓 ${g('osg202-5-1-io', 'OSG202 5.1')} · ${g('osg202-5-2-lap-lich-dia', 'OSG202 5.2')}</p>
${lab('disk-arm', 'exam', 'vi', 'Lập lịch tay đĩa ở chế độ thi: gõ thứ tự phục vụ và tổng quãng đường tay đĩa rồi chấm — đường đi bị ẩn cho tới khi bạn chấm.')}
${lab('epoll', 'scan', 'vi', 'select/poll quét mọi fd ở mỗi lần gọi; epoll chỉ trả các fd sẵn sàng — kéo từ 10 tới 10.000 kết nối.', { tour: 'epoll-ready' })}

<h3>8. Lời gọi hệ thống và ranh giới nhân</h3>
${sheet([
  ['system call', 'Một yêu cầu đánh số gửi nhân qua một cái bẫy; libc bọc nó, errno báo lỗi.', 'getppid() 176 ns, gọi hàm 2,1 ns', a('os-11-1-hanh-trinh', '11.1')],
  ['vDSO', 'Mã của nhân ánh xạ sẵn vào mọi tiến trình để các câu hỏi giờ khỏi phải bẫy vào nhân.', 'clock_gettime 18,5 ns', a('os-11-5-chi-phi', '11.4')],
  ['strace · ltrace', 'Hiện mọi system call (hay lời gọi thư viện) một chương trình làm, kèm đối số và thời gian.', 'strace -c, -f, -e trace=', a('os-11-2-strace-ltrace', '11.3')],
  ['errno · EINTR · EAGAIN · EPIPE', 'Bị ngắt · thử lại sau · đầu kia đã đi — xử lý từng cái, đừng sập.', 'SA_RESTART', a('os-11-6-errno-tin-hieu', '11.5')],
  ['/proc và /sys', 'API thứ hai của nhân: trạng thái dưới dạng file (status, fd, wchan, stack, cgroup).', '/proc/PID/wchan của tiến trình kẹt', a('os-11-7-proc-sys', '11.6')],
  ['seccomp', 'Bộ lọc system call cho từng tiến trình: EPERM, ENOSYS hoặc giết.', 'chặn mkdirat ⇒ exit 159 (SIGSYS)', a('os-11-4-seccomp', '11.7')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — vượt ranh giới tốn bao nhiêu:</p>
${run('c114-chi-phi', 'gcc -O2 -Wall cost.c', 1, { max: 7 })}
<p><strong>Bẫy trong đề.</strong> "Cái nào cần chuyển chế độ?" — mọi system call thật; một hàm thư viện không gọi nhân thì không. vDSO là lý do <code>gettimeofday</code> rẻ. 🎓 ${g('osg202-1-4-syscall-kien-truc', 'OSG202 1.4')}</p>
${lab('syscall', 'vdso', 'vi', 'Hai đường lấy giờ: bẫy vào nhân hoặc đọc từ trang vDSO — so cái giá.', { tour: 'syscall-journey' })}

<h3>9. Container</h3>
${sheet([
  ['namespace', 'Một góc nhìn riêng vào một tài nguyên của nhân: pid, mnt, net, uts, ipc, user, cgroup, time.', 'unshare --pid: "I am PID 1"', a('os-12-1-namespaces', '12.1')],
  ['cgroup v2', 'Giới hạn và đo đếm cho một nhóm tiến trình: memory.max, cpu.max, pids.max, io.max.', 'memory.max 64M ⇒ exit 137, oom_kill 1', a('os-12-2-cgroups', '12.2')],
  ['OverlayFS · lớp ảnh', 'Các lớp dưới chỉ đọc + một lớp trên ghi được; sửa một file là chép nó lên.', 'copy-up 200 MB mất 0,93 s', a('os-12-3-overlayfs', '12.3')],
  ['container = tiến trình', 'Container là một tiến trình có namespace, một cgroup và gốc mới — cùng nhân với máy chủ.', 'mini container của 12.4, minictr của 17.5', a('os-12-4-mini', '12.4')],
  ['chuỗi runtime', 'docker CLI → dockerd → containerd → shim → runc → tiến trình của bạn.', 'runc spec / run', a('os-12-6-runc', '12.6')],
  ['máy ảo và container', 'Máy ảo có nhân riêng trên hypervisor; Docker trên Mac là một máy ảo Linux.', 'uname -r = linuxkit', a('os-14-3-wsl', '14.6')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — hai danh tính và một ngân sách:</p>
${run('c121-ns', "unshare --pid --fork --mount-proc sh -c 'echo")}
${run('c122-cg', "sh -c 'echo $$ > /sys/fs/cgroup/box", 2)}
<p><strong>Bẫy thi / phỏng vấn.</strong> "Container là máy ảo nhẹ" — không: một nhân, nên lỗi của nhân là lỗi của tất cả. "Docker giới hạn bộ nhớ" — là nhân giới hạn, qua cgroup; Docker chỉ ghi file. 🎓 ${g('osg202-n1-1-cloud-container', 'OSG202 N1.1')}</p>
${lab('nslayers', 'docker', 'vi', 'Một tiến trình, hai góc nhìn: bật từng namespace và so điều máy chủ thấy với điều container thấy.', { tour: 'nslayers-views' })}

<h3>10. Bảo mật ở tầng hệ điều hành (phòng thủ)</h3>
${sheet([
  ['khung stack · quy ước gọi', 'Địa chỉ trả về, thanh ghi đã lưu và biến cục bộ nằm trên stack; ghi đè chúng là cướp luồng điều khiển.', 'objdump/gdb một hàm', a('os-13-1-bo-nho', '13.1')],
  ['tràn bộ đệm · lớp phòng vệ', 'Canary, NX, ASLR/PIE, RELRO, FORTIFY — mỗi lớp chặn một bước của cuộc khai thác.', 'canary ⇒ "stack smashing detected", exit 134', a('os-13-2-overflow', '13.2')],
  ['setuid · PATH · TOCTOU', 'Một chương trình setuid tin môi trường của nó thì bị lái được; đua giữa kiểm và dùng.', '"hostname" cài sẵn chạy từ một file setuid', a('os-13-3-leo-thang', '13.3')],
  ['đặc quyền tối thiểu', 'Bỏ capability, no_new_privs, seccomp, người dùng không phải root, gốc chỉ đọc.', 'CapBnd thu hẹp, mount bị từ chối', a('os-13-4-container-escape', '13.4')],
  ['nhập môn thoát container', '<code>--privileged</code> và <code>docker.sock</code> gắn vào container là trao root của máy chủ.', 'checklist cứng hoá', a('os-13-4-container-escape', '13.4')],
], ['Khái niệm', 'Trong một câu', 'Đã đo / đã thấy', 'Bài'])}
<p><strong>Bằng chứng bạn đã tạo ra</strong> — một lớp phòng vệ làm đúng việc:</p>
${run('c132-overflow', './retaddr-canary')}
<p><strong>Bẫy phỏng vấn.</strong> "ASLR là đủ chưa?" — không lớp nào đủ một mình; chúng là các tầng, và một chỗ rò thông tin có thể vô hiệu ASLR. Trả lời bằng tầng mà mỗi lớp chặn.</p>
${lab('memory', 'overflow', 'vi', 'Xem một lần tràn bộ đệm leo dần lên khung stack tới địa chỉ trả về — và canary nằm chắn ở đâu.')}

<h3>Mười con số nên nhớ</h3>
<table>
<tr><th>Cái gì</th><th>Đo trong khoá</th><th>Vì sao quan trọng</th></tr>
<tr><td>gọi hàm · system call · vDSO</td><td>2,1 ns · 176 ns · 18,5 ns</td><td>gom syscall; hỏi giờ thì rẻ</td></tr>
<tr><td>chuyển ngữ cảnh trên một lõi</td><td>~1 µs</td><td>đáng kể ở mức 10⁵–10⁶ lần mỗi giây</td></tr>
<tr><td>luồng · fork+exec</td><td>56,9 µs · 302,6 µs</td><td>dùng pool, không mỗi request một tiến trình</td></tr>
<tr><td>ghi có đệm · fsync</td><td>1,8 µs · ~880 µs</td><td>group commit, sao chép bất đồng bộ</td></tr>
<tr><td>epoll · poll ở 10.000 fd</td><td>0,72 µs · 676 µs</td><td>vì sao nginx và Node dùng epoll</td></tr>
<tr><td>10.000 luồng rảnh</td><td>thêm 156 MiB stack nhân</td><td>C10K cần event loop</td></tr>
<tr><td>chạm 256 MiB</td><td>65.539 page fault</td><td>lần chạm đầu không miễn phí</td></tr>
<tr><td>counter++ ở 2 luồng</td><td>mất 44 % lần cập nhật</td><td>không khoá thì không đúng</td></tr>
<tr><td>bị SIGKILL / SIGTERM / SIGSEGV giết</td><td>137 / 143 / 139</td><td>đọc mã thoát là 128 + N</td></tr>
<tr><td>định luật Little, 64 khách ở 347/s</td><td>dự đoán ≈ 184 ms, đo 182 ms</td><td>độ trễ của một pool bão hoà</td></tr>
</table>

<div class="pitfall co-tieu-de">
<p><strong>Học chương bảo mật như một công thức tấn công.</strong> Phỏng vấn vị trí bảo mật kiểm xem bạn có hiểu <em>vì sao</em> một lớp phòng vệ hiệu quả và cách xác minh nó đang bật (<code>readelf</code>, các phép kiểm kiểu <code>checksec</code>, <code>/proc/PID/status</code>), và cách chạy một dịch vụ với ít đặc quyền hơn. Mọi thứ ở Chương 13 đều làm trên file chạy trong lab của chính bạn, theo hướng phòng thủ; hãy giữ đúng tinh thần đó trong câu trả lời — "tôi đã xác minh canary làm chương trình dừng với exit 134" là câu họ muốn nghe.</p>
</div>

<h3>🧪 Thực hành (45 phút, gập sách)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một người bạn đang chuẩn bị phỏng vấn backend nhờ bạn hỏi bài. Bạn quyết định tự hỏi mình trước.</p>
<ol>
<li>Che cột "Đo trong khoá" của bảng mười con số và điền lại từ trí nhớ.</li>
<li>Với chủ đề 6–10, giải thích mỗi cơ chế gây ra một triệu chứng production nào (ví dụ: "df đầy, du nhỏ" → file đã xoá mà vẫn mở).</li>
<li>Chạy lại <code>./pollbench epoll 10000</code> và <code>./wbench</code> trong lab; so với bảng.</li>
<li>Viết câu trả lời 3 dòng cho "container là gì?" có nhắc namespace, cgroup và nhân dùng chung.</li>
</ol>
<p><strong>Đạt khi:</strong> ít nhất tám trên mười con số đúng trong phạm vi gấp đôi, mỗi triệu chứng gọi đúng tên cơ chế, và câu trả lời về container gói trong ba dòng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['inode', 'Đối tượng trên đĩa chính là file; tên trong thư mục trỏ tới nó, và nó còn sống khi còn tên hoặc fd đang mở.'],
  ['fsync', 'Chờ tới khi dữ liệu và siêu dữ liệu của file nằm trên thiết bị — cách duy nhất để write() trở nên bền.'],
  ['epoll', 'API sẵn sàng có khả năng mở rộng của Linux: đăng ký fd một lần, chỉ nhận lại các fd sẵn sàng.'],
  ['vDSO', 'Một trang của nhân ánh xạ vào mỗi tiến trình để vài lời gọi (giờ) khỏi phải bẫy.'],
  ['namespace · cgroup', 'Tiến trình thấy được gì · dùng được bao nhiêu — hai nửa của một container.'],
  ['stack canary', 'Một giá trị ngẫu nhiên đặt trước địa chỉ trả về; bị ghi đè ⇒ chương trình dừng (exit 134).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>File: tên trỏ tới inode; write() chưa bền cho tới fsync (~880 µs so với 1,8 µs); file đã xoá mà vẫn mở làm đầy đĩa.</li>
<li>I/O: epoll đứng ở 0,7 µs mỗi lần thức tới 10.000 fd trong khi poll tăng lên 676 µs; event loop thắng mỗi kết nối một luồng.</li>
<li>System call tốn ~176 ns; vDSO làm câu hỏi giờ còn ~18 ns; strace và /proc cho thấy tiến trình đang làm gì.</li>
<li>Container là một tiến trình có namespace (góc nhìn) và cgroup (ngân sách) trên nhân của máy chủ.</li>
<li>Bảo mật là nhiều tầng: canary, NX, ASLR, RELRO, đặc quyền tối thiểu, seccomp — và xác minh từng lớp đang bật.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/epoll.7.html', '📄', 'epoll(7) — Linux manual page', 'Level và edge triggered, danh sách sẵn sàng, và các bẫy quen thuộc.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/namespaces.7.html', '📄', 'namespaces(7) — Linux manual page', 'Mọi loại namespace và các system call tạo và gia nhập chúng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.3 — Luyện thi: lập lịch CPU ───────────────────────── */
    {
      title: '16.3 — Exam drills (1/3): CPU scheduling — Gantt charts, waiting and turnaround, solved by a program|||16.3 — Luyện đề (1/3): lập lịch CPU — biểu đồ Gantt, thời gian chờ và hoàn thành, giải bằng chương trình',
      slug: 'os-16-2-bai-tap',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dạng bài lập lịch của đề cuối kỳ OSG202 với đề MỚI: năm việc theo lô (FCFS, SJF, ưu tiên, RR q=2), năm tiến trình có thời điểm đến (SJF, SRTF, RR q=3), ưu tiên có/không cắt ngang; mỗi câu bốn phương án, lời giải từng bước bằng output thật của osgcalc.py và được bộ máy mô phỏng /os-lab đối chiếu lần hai; quy trình 5 bước vẽ Gantt không sai và các luật hoà phải ghi rõ.',
      content: `${G163}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.3</span>
<h2>Exam drills (1/3): CPU scheduling</h2>
<p class="lead">Every OSG202 final has two or three scheduling computations: "Five batch jobs A–E arrive at almost the same time…", "Using round robin (quantum = 4), the turnaround time for job B is…". They are easy marks if you draw the Gantt chart carefully and expensive ones if you guess. The question of this lesson: <strong>can you produce the exact Gantt chart, and the averages, the way the exam expects — and check yourself with a program?</strong></p>

<h3>The method: five steps, no shortcuts</h3>
<ol>
<li><strong>Table first.</strong> Copy job, arrival, burst (and priority) into a table. Write down which number means "higher priority" — exams use both conventions.</li>
<li><strong>Time line.</strong> Walk time forward. At each moment: add arrivals to the ready queue, decide whether the running job is preempted, pick the next job.</li>
<li><strong>Tie rules — write them on the paper.</strong> Equal bursts or priorities: earlier arrival first, then the order in the table. Round robin: a job arriving at time <em>t</em> enters the queue <em>before</em> the job preempted at <em>t</em> (the textbook convention, and the one the /os-lab simulator uses).</li>
<li><strong>Finish times from the chart</strong>, then turnaround = finish − arrival, waiting = turnaround − burst, response = first run − arrival.</li>
<li><strong>Check:</strong> the chart’s total length equals the sum of bursts (plus idle gaps); waiting is never negative.</li>
</ol>
<p>The program used for every answer below, <code>lab/code/ch16/osgcalc.py</code>, follows exactly these rules and prints the chart and the table. Every result was checked a second time by the scheduler engine of the /os-lab simulator — two independent programs in two languages:</p>
${run('c16-engine', 'node --experimental-strip-types kiem-engine.mts')}
<p>(108 checks in total, all equal — the full run is in <code>lab/out/c16-engine.out.txt</code>.) Use the program to <em>check</em> your paper, never instead of it: the exam gives you a pen, not Python.</p>
${cmd('docker run --rm -it --label oslab=1 -v "$PWD":/lab -w /lab/ch16 os-lab bash', 'python3 osgcalc.py sched rr "A:0:8 B:1:4 C:2:9 D:3:5" q=4      # any problem from any past paper')}

<h3>Problem S1 — five batch jobs</h3>
<p>Five batch jobs A–E arrive at a computer centre at almost the same time (time 0, in the order A, B, C, D, E). Their running times are 6, 3, 8, 2 and 5 minutes; their externally determined priorities are 4, 1, 5, 2 and 3, with <strong>5 the highest</strong>. Ignore process-switching overhead.</p>
${drill('S1.1', 'What is the average turnaround time under <strong>FCFS</strong>?', ['11.4 min', '15 min', '17.2 min', '10.2 min'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched fcfs "A:0:6:4') + '<p>Jobs run in table order; finish times 6, 9, 17, 19, 24. Turnaround = finish − 0, so the average is (6 + 9 + 17 + 19 + 24) / 5 = 75 / 5 = <strong>15 min — B</strong>. 10.2 (D) is the average <em>waiting</em> time — the classic swap of the two columns.</p>')}
${drill('S1.2', 'What is the average waiting time under <strong>SJF</strong>?', ['6.6 min', '5.6 min', '10.2 min', '11.4 min'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched sjf "A:0:6:4') + '<p>Shortest first: D(2), B(3), E(5), A(6), C(8). Waiting = start time when all arrive at 0: 0 + 2 + 5 + 10 + 16 = 33, average 33 / 5 = <strong>6.6 min — A</strong>. 11.4 (D) is SJF’s average turnaround.</p>')}
${drill('S1.3', 'What is the average waiting time under (non-preemptive) <strong>priority</strong> scheduling?', ['6.6 min', '10.2 min', '12.4 min', '13.6 min'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched prio "A:0:6:4') + '<p>5 is highest, so the order is C(5), A(4), E(3), D(2), B(1). Waits 0, 8, 14, 19, 21 → 62 / 5 = <strong>12.4 min — C</strong>. If you read "1 = highest" by habit you get B, D, E, A, C and 34 / 5 = 6.8 — not even an option, which should make you re-read the stem.</p>')}
${drill('S1.4', 'What is the average turnaround time under <strong>round robin, quantum = 2</strong>?', ['15 min', '17.2 min', '12.4 min', '19 min'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched rr "A:0:6:4') + '<p>Slices of 2 in order A B C D E A B C E A C E C. D finishes first at 8 (it only needs one slice), B at 13, A at 19, E at 22, C at 24. Average turnaround 86 / 5 = <strong>17.2 min — B</strong>. Note the coincidence: RR’s average <em>waiting</em> (12.4) equals priority’s — never pick an answer because the number "looks familiar".</p>')}
${lab('scheduler', 'textbook', 'en', 'Load your own jobs into the scheduler simulator and step through the Gantt chart tick by tick — it uses the same tie rules as this lesson.', { tour: 'sched-policies' })}
${lab('gantt-exam', 's1', 'en', 'Problem S1 to do yourself: pick a job, tap or drag across the cells to paint the FCFS chart, fill the table and press Check my answer. Then switch to 📖 Worked solution and replay it moment by moment with the ready queue.', { tour: 'gantt-exam-grade' })}

<h3>Problem S2 — five processes with arrival times</h3>
<p>Processes P1–P5 arrive at times 0, 1, 2, 4, 6 with CPU bursts 7, 4, 1, 4, 3.</p>
${drill('S2.1', 'Under <strong>non-preemptive SJF</strong>, in which order do the processes <em>start</em>?', ['P1, P2, P3, P4, P5', 'P3, P2, P5, P4, P1', 'P1, P3, P5, P2, P4', 'P1, P3, P2, P5, P4'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched sjf "P1:0:7') + '<p>At time 0 only P1 exists, and non-preemptive means it runs to 7. At 7 the ready queue holds P2(4), P3(1), P4(4), P5(3): shortest is P3, then P5 (3), then P2 and P4 tie on 4 — earlier arrival P2 wins. Order <strong>P1, P3, P5, P2, P4 — C</strong>. B is what SJF would do if all had arrived at 0.</p>')}
${drill('S2.2', 'Under <strong>SRTF</strong> (preemptive SJF), what is the average waiting time?', ['3.6', '5.6', '7.4', '9'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched srtf "P1:0:7') + '<p>Re-decide at every arrival. At 1, P2 (4) beats P1’s remaining 6; at 2, P3 (1) beats P2’s remaining 3; at 6, P5 (3) beats P4 (4) and P1 (6). Waiting = turnaround − burst: 12, 1, 0, 5, 0 → 18 / 5 = <strong>3.6 — A</strong>. 5.6 (B) is non-preemptive SJF; 7.4 (C) is SRTF’s average turnaround.</p>')}
${drill('S2.3', 'Under <strong>round robin, quantum = 3</strong>, what is the turnaround time of P2?', ['5', '12', '16', '17'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched rr "P1:0:7') + '<p>The key moment is time 6: P5 arrives exactly when P2’s slice ends, and by the textbook rule P5 enters the queue <strong>before</strong> P2. Queue after 6: P3, P1, P4, P5, P2. P2’s last unit runs 16–17. Turnaround = 17 − 1 = <strong>16 — C</strong>. 17 (D) is P2’s finish time; 12 (B) is its waiting time.</p>')}
${lab('gantt-exam', 'rr', 'en', 'S2 under round robin, q = 3, with the trap at t = 6: P5 arrives exactly when P2’s slice ends. Paint it your way and check — if you queued P2 first, the grader names the rr-order rule you broke.', { tour: 'gantt-exam-rr' })}

<h3>Problem S3 — priority, with and without preemption</h3>
<p>P1–P4 arrive at 0, 2, 3, 5 with bursts 6, 3, 4, 2 and priorities 3, 1, 4, 2 (<strong>smaller number = higher priority</strong>, as in Linux nice).</p>
${drill('S3.1', 'Under <strong>preemptive</strong> priority scheduling, what is the average waiting time?', ['4', '3.25', '5.5', '7'], 'Worked solution', run('c163-lich', 'python3 osgcalc.py sched prio-p "P1:0:6:3', 2) + '<p>Preemptive: P2 (priority 1) takes the CPU from P1 at 2; P4 (priority 2) arrives at 5 when P2 has just finished and beats P1 (3). Waits 5, 0, 8, 0 → 13 / 4 = <strong>3.25 — B</strong>. Without preemption (second output) P1 keeps the CPU until 6 and the average rises to 4 (A). 7 (D) is the preemptive average turnaround.</p>')}
${lab('gantt-exam', 'prio', 'en', 'S3 with preemptive priority (smaller number = higher): check the priority direction switch first, paint the chart, then compare your average waiting time with 3.25.')}

<div class="pitfall co-tieu-de">
<p><strong>The quantum-boundary tie decides round-robin answers.</strong> When a job arrives at exactly the moment another job’s quantum expires, the two possible queue orders give different charts — in S2.3 the "wrong" order changes P2’s turnaround. The textbook convention puts the newly arrived job first, and both osgcalc.py and the /os-lab simulator follow it. Write your rule at the top of the answer; if your result is not among the options, try the other order before anything else.</p>
</div>

${lab('gantt-exam', 'random', 'en', 'More practice: New exam gives a random problem with a seed. Do at least one of each policy until every cell comes back green.')}
<h3>If you have done OSG202 lesson 2.4</h3>
<p>There you learned the policies and the formulas; here you practised them on new numbers with an exact checker. For more real past-paper questions, the exam room has every FPT final with explanations. 🎓 ${g('osg202-2-4-lap-lich-tinh-toan', 'OSG202 2.4 — scheduling computations')} · ${g('osg202-final-exam-fe', 'OSG202 — final exam practice')}</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the night before the OSG202 final, a friend shows you a past-paper question: "Jobs A–D arrive at 0, 1, 2, 3 with CPU cycles 8, 4, 9, 5; round robin, quantum 4; turnaround of job B?" — and two classmates disagree on the answer.</p>
<ol>
<li>Draw the Gantt chart on paper with the five-step method; write your tie rule at the top.</li>
<li>Compute B’s turnaround and the average waiting time.</li>
<li>Check with <code>python3 osgcalc.py sched rr "A:0:8 B:1:4 C:2:9 D:3:5" q=4</code> in the lab.</li>
<li>Redo S1 under SRTF and explain why it gives the same averages as SJF.</li>
</ol>
<p><strong>Done when:</strong> your paper chart matches the program’s slice for slice, and you can explain the S1 result in one sentence (all jobs arrive at 0, so nothing ever preempts).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Gantt chart', 'A time line of which job holds the CPU when; every scheduling answer is read from it.'],
  ['turnaround time', 'Finish time − arrival time.'],
  ['waiting time', 'Turnaround − burst: time spent ready but not running.'],
  ['response time', 'First time on the CPU − arrival time.'],
  ['preemptive / non-preemptive', 'Whether a running job can be taken off the CPU before it finishes or blocks.'],
  ['quantum (time slice)', 'The maximum CPU time a job gets in one turn under round robin.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Five steps: table, time line, written tie rules, finish → turnaround → waiting, sanity check.</li>
<li>S1: FCFS turnaround 15, SJF waiting 6.6, priority (5 high) waiting 12.4, RR q=2 turnaround 17.2.</li>
<li>S2: SJF order P1, P3, P5, P2, P4; SRTF waiting 3.6; RR q=3 turnaround of P2 = 16 (arrival before the preempted job).</li>
<li>S3: preemptive priority waiting 3.25 vs 4 without preemption.</li>
<li>Every answer was produced by osgcalc.py and confirmed by the /os-lab engine (108/108 checks).</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf', '📘', 'OSTEP — Scheduling: Introduction (PDF)', 'FIFO, SJF, STCF and round robin with turnaround and response time.', 'Open')}
${L('/os-lab?sim=scheduler', '🧪', 'Scheduler simulator', 'Enter any exam table and step through the Gantt chart.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.3</span>
<h2>Luyện đề (1/3): lập lịch CPU</h2>
<p class="lead">Đề cuối kỳ OSG202 nào cũng có hai ba câu tính lập lịch: "Năm việc A–E đến gần như cùng lúc…", "Dùng round robin (quantum = 4), thời gian hoàn thành của job B là…". Đó là điểm dễ nếu bạn vẽ Gantt cẩn thận và là điểm đắt nếu bạn đoán. Câu hỏi của bài: <strong>bạn có vẽ đúng biểu đồ Gantt và các giá trị trung bình theo đúng cách đề chờ — rồi tự kiểm bằng một chương trình không?</strong></p>

<h3>Phương pháp: năm bước, không đi tắt</h3>
<ol>
<li><strong>Bảng trước.</strong> Chép job, thời điểm đến, thời gian CPU (và ưu tiên) vào bảng. Ghi rõ số nào nghĩa là "ưu tiên cao hơn" — đề dùng cả hai quy ước.</li>
<li><strong>Trục thời gian.</strong> Đi dần theo thời gian. Ở mỗi thời điểm: thêm việc vừa đến vào hàng sẵn sàng, quyết định việc đang chạy có bị cắt không, chọn việc kế tiếp.</li>
<li><strong>Luật hoà — ghi ra giấy.</strong> Bằng thời gian hay bằng ưu tiên: đến sớm hơn trước, rồi tới thứ tự trong bảng. Round robin: việc đến đúng lúc <em>t</em> vào hàng <em>trước</em> việc bị cắt lúc <em>t</em> (quy ước giáo trình, và cũng là quy ước bộ mô phỏng /os-lab dùng).</li>
<li><strong>Thời điểm xong đọc từ biểu đồ</strong>, rồi turnaround = xong − đến, waiting = turnaround − thời gian CPU, response = lần chạy đầu − đến.</li>
<li><strong>Kiểm:</strong> tổng chiều dài biểu đồ bằng tổng thời gian CPU (cộng khoảng rỗi); thời gian chờ không bao giờ âm.</li>
</ol>
<p>Chương trình dùng cho mọi đáp án dưới đây, <code>lab/code/ch16/osgcalc.py</code>, theo đúng các luật này và in ra biểu đồ cùng bảng. Mọi kết quả được kiểm lần hai bằng bộ máy lập lịch của trình mô phỏng /os-lab — hai chương trình độc lập, hai ngôn ngữ:</p>
${run('c16-engine', 'node --experimental-strip-types kiem-engine.mts')}
<p>(Tổng cộng 108 phép kiểm, tất cả khớp — bản chạy đầy đủ ở <code>lab/out/c16-engine.out.txt</code>.) Dùng chương trình để <em>kiểm</em> bài giấy của bạn, đừng bao giờ thay cho nó: phòng thi phát bút, không phát Python.</p>
${cmd('docker run --rm -it --label oslab=1 -v "$PWD":/lab -w /lab/ch16 os-lab bash', 'python3 osgcalc.py sched rr "A:0:8 B:1:4 C:2:9 D:3:5" q=4      # bất kỳ câu nào của đề cũ')}

<h3>Bài S1 — năm việc theo lô</h3>
<p>Năm việc A–E đến trung tâm máy tính gần như cùng lúc (thời điểm 0, theo thứ tự A, B, C, D, E). Thời gian chạy là 6, 3, 8, 2 và 5 phút; độ ưu tiên do bên ngoài định là 4, 1, 5, 2 và 3, với <strong>5 là cao nhất</strong>. Bỏ qua chi phí chuyển tiến trình.</p>
${drill('S1.1', 'Thời gian hoàn thành trung bình theo <strong>FCFS</strong> là bao nhiêu?', ['11,4 phút', '15 phút', '17,2 phút', '10,2 phút'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched fcfs "A:0:6:4') + '<p>Các việc chạy theo thứ tự trong bảng; xong ở 6, 9, 17, 19, 24. Turnaround = xong − 0, nên trung bình là (6 + 9 + 17 + 19 + 24) / 5 = 75 / 5 = <strong>15 phút — B</strong>. 10,2 (D) là thời gian <em>chờ</em> trung bình — kiểu nhầm cột kinh điển.</p>')}
${drill('S1.2', 'Thời gian chờ trung bình theo <strong>SJF</strong> là bao nhiêu?', ['6,6 phút', '5,6 phút', '10,2 phút', '11,4 phút'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched sjf "A:0:6:4') + '<p>Ngắn nhất trước: D(2), B(3), E(5), A(6), C(8). Thời gian chờ = thời điểm bắt đầu khi tất cả đến lúc 0: 0 + 2 + 5 + 10 + 16 = 33, trung bình 33 / 5 = <strong>6,6 phút — A</strong>. 11,4 (D) là turnaround trung bình của SJF.</p>')}
${drill('S1.3', 'Thời gian chờ trung bình theo lập lịch <strong>ưu tiên</strong> (không cắt ngang) là bao nhiêu?', ['6,6 phút', '10,2 phút', '12,4 phút', '13,6 phút'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched prio "A:0:6:4') + '<p>5 là cao nhất, nên thứ tự là C(5), A(4), E(3), D(2), B(1). Chờ 0, 8, 14, 19, 21 → 62 / 5 = <strong>12,4 phút — C</strong>. Nếu theo thói quen đọc "1 = cao nhất" bạn được B, D, E, A, C và 34 / 5 = 6,8 — không có trong phương án, điều đó phải khiến bạn đọc lại đề.</p>')}
${drill('S1.4', 'Thời gian hoàn thành trung bình theo <strong>round robin, quantum = 2</strong> là bao nhiêu?', ['15 phút', '17,2 phút', '12,4 phút', '19 phút'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched rr "A:0:6:4') + '<p>Các lát 2 theo thứ tự A B C D E A B C E A C E C. D xong đầu tiên ở 8 (nó chỉ cần một lát), B ở 13, A ở 19, E ở 22, C ở 24. Turnaround trung bình 86 / 5 = <strong>17,2 phút — B</strong>. Để ý sự trùng hợp: thời gian <em>chờ</em> trung bình của RR (12,4) bằng của ưu tiên — đừng bao giờ chọn một đáp án vì con số "trông quen".</p>')}
${lab('scheduler', 'textbook', 'vi', 'Nạp bảng việc của chính bạn vào trình mô phỏng lập lịch và đi từng nhịp trên biểu đồ Gantt — nó dùng đúng các luật hoà của bài này.', { tour: 'sched-policies' })}
${lab('gantt-exam', 's1', 'vi', 'Bài S1 để tự làm: chọn một việc, chạm hoặc kéo qua các ô để tô biểu đồ FCFS, điền bảng rồi bấm Chấm bài. Sau đó chuyển sang 📖 Lời giải và phát lại từng thời điểm cùng hàng sẵn sàng.', { tour: 'gantt-exam-grade' })}

<h3>Bài S2 — năm tiến trình có thời điểm đến</h3>
<p>Các tiến trình P1–P5 đến lúc 0, 1, 2, 4, 6 với thời gian CPU 7, 4, 1, 4, 3.</p>
${drill('S2.1', 'Theo <strong>SJF không cắt ngang</strong>, các tiến trình <em>bắt đầu</em> chạy theo thứ tự nào?', ['P1, P2, P3, P4, P5', 'P3, P2, P5, P4, P1', 'P1, P3, P5, P2, P4', 'P1, P3, P2, P5, P4'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched sjf "P1:0:7') + '<p>Lúc 0 chỉ có P1, và không cắt ngang nghĩa là nó chạy tới 7. Lúc 7 hàng sẵn sàng có P2(4), P3(1), P4(4), P5(3): ngắn nhất là P3, rồi P5 (3), rồi P2 và P4 hoà ở 4 — P2 đến sớm hơn nên thắng. Thứ tự <strong>P1, P3, P5, P2, P4 — C</strong>. B là điều SJF sẽ làm nếu tất cả đến lúc 0.</p>')}
${drill('S2.2', 'Theo <strong>SRTF</strong> (SJF có cắt ngang), thời gian chờ trung bình là bao nhiêu?', ['3,6', '5,6', '7,4', '9'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched srtf "P1:0:7') + '<p>Quyết định lại ở mỗi lần có việc đến. Lúc 1, P2 (4) thắng phần còn lại 6 của P1; lúc 2, P3 (1) thắng phần còn lại 3 của P2; lúc 6, P5 (3) thắng P4 (4) và P1 (6). Chờ = turnaround − thời gian CPU: 12, 1, 0, 5, 0 → 18 / 5 = <strong>3,6 — A</strong>. 5,6 (B) là SJF không cắt ngang; 7,4 (C) là turnaround trung bình của SRTF.</p>')}
${drill('S2.3', 'Theo <strong>round robin, quantum = 3</strong>, thời gian hoàn thành (turnaround) của P2 là bao nhiêu?', ['5', '12', '16', '17'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched rr "P1:0:7') + '<p>Thời điểm then chốt là 6: P5 đến đúng lúc lát của P2 hết, và theo luật giáo trình P5 vào hàng <strong>trước</strong> P2. Hàng sau lúc 6: P3, P1, P4, P5, P2. Đơn vị cuối của P2 chạy từ 16 tới 17. Turnaround = 17 − 1 = <strong>16 — C</strong>. 17 (D) là thời điểm xong của P2; 12 (B) là thời gian chờ của nó.</p>')}
${lab('gantt-exam', 'rr', 'vi', 'S2 theo round robin, q = 3, có bẫy ở t = 6: P5 tới đúng lúc lượt của P2 hết. Tô theo cách của bạn rồi chấm — nếu bạn xếp P2 trước, máy chấm gọi tên luật rr-order bạn đã làm sai.', { tour: 'gantt-exam-rr' })}

<h3>Bài S3 — ưu tiên, có và không cắt ngang</h3>
<p>P1–P4 đến lúc 0, 2, 3, 5 với thời gian CPU 6, 3, 4, 2 và độ ưu tiên 3, 1, 4, 2 (<strong>số nhỏ = ưu tiên cao</strong>, như nice của Linux).</p>
${drill('S3.1', 'Theo lập lịch ưu tiên <strong>có cắt ngang</strong>, thời gian chờ trung bình là bao nhiêu?', ['4', '3,25', '5,5', '7'], 'Lời giải từng bước', run('c163-lich', 'python3 osgcalc.py sched prio-p "P1:0:6:3', 2) + '<p>Có cắt ngang: P2 (ưu tiên 1) giành CPU của P1 lúc 2; P4 (ưu tiên 2) đến lúc 5 khi P2 vừa xong và thắng P1 (3). Chờ 5, 0, 8, 0 → 13 / 4 = <strong>3,25 — B</strong>. Không cắt ngang (output thứ hai) thì P1 giữ CPU tới 6 và trung bình tăng lên 4 (A). 7 (D) là turnaround trung bình khi có cắt ngang.</p>')}
${lab('gantt-exam', 'prio', 'vi', 'S3 với ưu tiên có cắt ngang (số nhỏ = cao): kiểm công tắc chiều ưu tiên trước, tô biểu đồ, rồi so thời gian chờ trung bình của bạn với 3,25.')}

<div class="pitfall co-tieu-de">
<p><strong>Ca hoà ở ranh giới quantum quyết định đáp án round robin.</strong> Khi một việc đến đúng lúc quantum của việc khác hết, hai thứ tự hàng đợi có thể cho hai biểu đồ khác nhau — ở S2.3, thứ tự "sai" làm đổi turnaround của P2. Quy ước giáo trình cho việc vừa đến đứng trước, và cả osgcalc.py lẫn trình mô phỏng /os-lab đều theo nó. Ghi luật của bạn ở đầu bài làm; nếu kết quả không có trong phương án, hãy thử thứ tự kia trước mọi thứ khác.</p>
</div>

${lab('gantt-exam', 'random', 'vi', 'Luyện thêm: Đề mới cho một đề ngẫu nhiên có hạt giống. Làm ít nhất một đề cho mỗi thuật toán tới khi mọi ô đều xanh.')}
<h3>Nếu bạn đã học OSG202 bài 2.4</h3>
<p>Ở đó bạn học các chính sách và công thức; ở đây bạn luyện chúng trên số mới với một bộ kiểm chính xác. Muốn thêm câu thật của đề cũ, phòng thi có mọi đề cuối kỳ FPT kèm lời giải. 🎓 ${g('osg202-2-4-lap-lich-tinh-toan', 'OSG202 2.4 — tính toán lập lịch')} · ${g('osg202-final-exam-fe', 'OSG202 — luyện đề cuối kỳ')}</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> tối trước kỳ thi OSG202, một người bạn đưa bạn câu đề cũ: "Các job A–D đến lúc 0, 1, 2, 3 với CPU cycle 8, 4, 9, 5; round robin, quantum 4; turnaround của job B?" — và hai bạn cùng lớp cãi nhau về đáp án.</p>
<ol>
<li>Vẽ biểu đồ Gantt trên giấy theo phương pháp năm bước; ghi luật hoà của bạn lên đầu.</li>
<li>Tính turnaround của B và thời gian chờ trung bình.</li>
<li>Kiểm bằng <code>python3 osgcalc.py sched rr "A:0:8 B:1:4 C:2:9 D:3:5" q=4</code> trong lab.</li>
<li>Làm lại S1 theo SRTF và giải thích vì sao nó cho cùng giá trị trung bình với SJF.</li>
</ol>
<p><strong>Đạt khi:</strong> biểu đồ trên giấy khớp với chương trình từng lát một, và bạn giải thích được kết quả S1 trong một câu (mọi việc đến lúc 0, nên không bao giờ có cắt ngang).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Gantt chart (biểu đồ Gantt)', 'Trục thời gian ghi việc nào giữ CPU lúc nào; mọi đáp án lập lịch đều đọc từ nó.'],
  ['turnaround time (thời gian hoàn thành)', 'Thời điểm xong − thời điểm đến.'],
  ['waiting time (thời gian chờ)', 'Turnaround − thời gian CPU: thời gian sẵn sàng mà không được chạy.'],
  ['response time (thời gian đáp ứng)', 'Lần đầu được CPU − thời điểm đến.'],
  ['preemptive / non-preemptive (có / không cắt ngang)', 'Việc đang chạy có bị lấy CPU trước khi xong hay tự chờ hay không.'],
  ['quantum (lát thời gian)', 'Thời gian CPU tối đa một việc nhận trong một lượt của round robin.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Năm bước: bảng, trục thời gian, luật hoà viết ra giấy, xong → turnaround → chờ, kiểm lại.</li>
<li>S1: FCFS turnaround 15, SJF chờ 6,6, ưu tiên (5 cao) chờ 12,4, RR q=2 turnaround 17,2.</li>
<li>S2: thứ tự SJF P1, P3, P5, P2, P4; SRTF chờ 3,6; RR q=3 turnaround của P2 = 16 (việc đến đứng trước việc bị cắt).</li>
<li>S3: ưu tiên có cắt ngang chờ 3,25 so với 4 khi không cắt ngang.</li>
<li>Mọi đáp án do osgcalc.py tạo ra và được bộ máy /os-lab xác nhận (108/108 phép kiểm).</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf', '📘', 'OSTEP — Scheduling: Introduction (PDF)', 'FIFO, SJF, STCF và round robin với turnaround và response time.', 'Mở')}
${L('/os-lab?sim=scheduler', '🧪', 'Trình mô phỏng lập lịch', 'Nhập bảng của bất kỳ đề nào và đi từng bước trên biểu đồ Gantt.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.4 — Luyện thi: bộ nhớ ───────────────────────── */
    {
      title: '16.4 — Exam drills (2/3): memory — page replacement, address translation, page tables and the TLB|||16.4 — Luyện đề (2/3): bộ nhớ — thay trang, dịch địa chỉ, bảng trang và TLB',
      slug: 'os-16-6-bo-nho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dạng bài bộ nhớ của đề OSG202 với đề MỚI: một chuỗi tham chiếu dưới FIFO/LRU/OPT/Clock (11/10/8/10 lỗi với 3 khung), nghịch lý Belady (FIFO 9 → 10 lỗi khi thêm khung), chọn trang nạn nhân từ bảng Loaded/Last-ref/R/M, tách địa chỉ ảo 32 bit cho bảng trang hai cấp, cỡ bảng trang, độ dài địa chỉ logic, dịch địa chỉ phân đoạn có bẫy limit, thời gian truy cập hiệu dụng có TLB — lời giải bằng output thật của osgcalc.py, đối chiếu với bộ máy /os-lab.',
      content: `${G164}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.4</span>
<h2>Exam drills (2/3): memory</h2>
<p class="lead">Memory questions are the most mechanical part of the OSG202 final, which makes them the most reliable marks — and the most frustrating to lose to one column drawn wrong. Four kinds come back every term: page replacement on a reference string, choosing a victim from a table, splitting a virtual address into fields, and effective access time with a TLB. The question: <strong>can you do each one by hand in under three minutes, and prove the answer?</strong></p>

<h3>Page replacement: the table method</h3>
<p>Draw one column per reference and one row per frame. For each reference: hit (no mark) or fault (<strong>F</strong>); on a fault with no free frame, cross out the victim and note it in an "out" row. FIFO evicts the page <em>loaded</em> earliest; LRU the page <em>used</em> least recently; OPT the page used furthest in the future (or never); Clock walks a circular hand, clearing reference bits until it finds a 0. Count the Fs — and count them twice.</p>
<p>Reference string for M1: <code>7 2 7 3 1 2 4 2 7 3 2 1 5 2</code>, 3 frames, initially empty.</p>
${drill('M1.1', 'How many page faults with <strong>FIFO</strong>?', ['8', '10', '11', '12'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py page fifo 3') + '<p>Read the "out" row: FIFO evicts 7, 2, 3, 1, 4, 2, 7, 3 in loading order — even page 2, which was used a moment ago. <strong>11 faults — C</strong>.</p>')}
${drill('M1.2', 'How many page faults with <strong>LRU</strong>?', ['9', '10', '11', '8'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py page lru 3') + '<p>At reference 5 (the 5th, page 1) the frames hold 7, 2, 3, last used at positions 3, 2, 4 → evict 2. LRU keeps the busy page 2 more often than FIFO does: <strong>10 faults — B</strong>.</p>')}
${drill('M1.3', 'How many page faults with the <strong>optimal (OPT)</strong> algorithm?', ['8', '7', '9', '10'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py page opt 3') + '<p>At each fault, look ahead: evict the page whose next use is furthest away, or that is never used again (at reference 13, page 1 is never used again). OPT is the lower bound no real algorithm can beat: <strong>8 faults — A</strong>.</p>')}
${drill('M1.4', 'How many page faults with <strong>Clock (second chance)</strong>, where a newly loaded page gets reference bit 1 and the hand moves past the replaced frame?', ['11', '9', '8', '10'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py page clock 3') + '<p>Clock approximates LRU with one bit per frame; here it ties LRU at <strong>10 faults — D</strong>, one better than FIFO. If a paper uses another convention (new page with R = 0), the count may change — say which one you use.</p>')}
${drill('M1.5', 'With <strong>4 frames</strong>, LRU takes 9 faults. How many does FIFO take on the same string?', ['8', '9', '10', '11'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py page lru 4', 2) + '<p><strong>8 — A</strong>: on this string FIFO beats LRU with 4 frames. LRU is better <em>on average</em> for programs with locality, not on every string; exam statements like "LRU always causes fewer faults than FIFO" are false.</p>')}
${lab('vm', 'exam', 'en', 'Type any reference string, pick FIFO, LRU, OPT or Clock and the frame count — the simulator fills the same table, column by column.')}

<h3>Belady’s anomaly</h3>
${drill('M2', 'For the string <code>1 2 3 4 1 2 5 1 2 3 4 5</code>, which statement is true?', ['FIFO: 3 frames ⇒ 10 faults, 4 frames ⇒ 9', 'FIFO: 3 frames ⇒ 9 faults, 4 frames ⇒ 10; LRU with 4 frames ⇒ 8', 'LRU also gets worse with more frames', 'Adding a frame never increases faults'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py page fifo 3 "1 2 3 4', 3) + '<p><strong>B.</strong> FIFO is not a stack algorithm: the set of pages in 4 frames is not always a superset of the set in 3 frames, so one more frame can cost one more fault (Belady, 1969). LRU and OPT are stack algorithms and never get worse — C and D are both false.</p>')}
${lab('vm', 'belady', 'en', 'Run FIFO with 3 then 4 frames on the classic string and watch the fault count go up.')}

<h3>Choosing a victim from a table</h3>
<p>A computer has four page frames. Loading time, time of last access, and the R and M bits (times in clock ticks):</p>
<table><tr><th>Page</th><th>Loaded</th><th>Last ref.</th><th>R</th><th>M</th></tr><tr><td>0</td><td>126</td><td>279</td><td>0</td><td>0</td></tr><tr><td>1</td><td>230</td><td>260</td><td>1</td><td>0</td></tr><tr><td>2</td><td>120</td><td>272</td><td>1</td><td>1</td></tr><tr><td>3</td><td>160</td><td>280</td><td>1</td><td>1</td></tr></table>
${drill('M3', 'Which page do FIFO, LRU and NRU replace, respectively?', ['0, 1, 2', '2, 1, 0', '2, 0, 1', '1, 2, 0'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py victim') + '<p>FIFO looks only at <em>Loaded</em> (smallest: page 2, t = 120). LRU looks only at <em>Last ref.</em> (smallest: page 1, t = 260). NRU groups pages by class 2R + M and evicts from the lowest class: page 0 is class 0 (not referenced, not modified). <strong>B.</strong> The trap is reading the wrong column — each algorithm uses exactly one.</p>')}

<h3>Address arithmetic</h3>
<p>Three facts solve every question: page size = 2<sup>offset bits</sup>; number of pages = 2<sup>page-number bits</sup>; a field’s value is its bits read as a binary number. Write the address in binary, in groups of four, and draw the field boundaries.</p>
${drill('M4.1', 'A 32-bit virtual address uses a two-level page table: 10-bit top-level field (PT1), 10-bit second-level field (PT2), 12-bit offset. For VA <code>0x12345678</code>, what are PT1, PT2 and the offset?', ['PT1 = 18, PT2 = 52, offset = 0x678', 'PT1 = 72, PT2 = 837, offset = 0x678', 'PT1 = 72, PT2 = 837, offset = 0x5678', 'PT1 = 0x12, PT2 = 0x345, offset = 0x678'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py addr bits=10,10,12 0x12345678') + '<p>The offset is the last 3 hex digits only when it is 12 bits: 0x678. The other two fields do <em>not</em> fall on hex-digit boundaries (10 bits each), so convert through binary: 0001001000 = 72 and 1101000101 = 837. <strong>B.</strong> A and D are what you get by splitting the hex digits instead of the bits.</p>')}
${drill('M4.2', 'A 32-bit address is split into a 9-bit first-level field, an 11-bit second-level field and a 12-bit offset. How large are the pages, and how many pages are in the address space?', ['4 KiB and 2<sup>20</sup> pages', '2 KiB and 2<sup>21</sup> pages', '4 KiB and 2<sup>11</sup> pages', '8 KiB and 2<sup>20</sup> pages'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py addr bits=9,11,12') + '<p>Page size = 2<sup>12</sup> = 4,096 bytes; pages = 2<sup>9 + 11</sup> = 2<sup>20</sup> = 1,048,576. <strong>A.</strong> C counts only the second-level field.</p>')}
${drill('M4.3', 'A system has 32-bit virtual addresses, 8 KiB pages and 4-byte page-table entries. How large is a single-level page table?', ['4 MiB', '1 MiB', '2 MiB', '512 KiB'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py pagesize 32 8192 4') + '<p>Offset = 13 bits, so 19 bits of page number: 2<sup>19</sup> entries × 4 B = 2 MiB per process. <strong>C.</strong> 4 MiB (A) is the answer for 4 KiB pages — this is why systems use multi-level tables: unused regions need no second-level table.</p>')}
${drill('M4.4', 'A logical address space has 128 pages of 8,192 words each. How long is a logical address?', ['20 bits', '21 bits', '13 bits', '17 bits'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py loglen 128 8192') + '<p>log<sub>2</sub>128 = 7 bits for the page number, log<sub>2</sub>8,192 = 13 bits for the offset: <strong>20 bits — A</strong>.</p>')}
${drill('M4.5', 'Segment table: segment 0 base 2100 limit 500; segment 1 base 3800 limit 120; segment 2 base 900 limit 300; segment 3 base 5000 limit 750. What are the physical addresses of (2, 250) and (1, 130)?', ['1150 and 3930', '1150 and a trap', '250 and 130', 'a trap and 3930'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py seg', 2) + '<p>Check the offset against the limit <em>before</em> adding: 250 &lt; 300 ⇒ 900 + 250 = 1150; 130 ≥ 120 ⇒ addressing error, trap to the OS. <strong>B.</strong> A adds without checking — exactly the bug segmentation hardware exists to prevent.</p>')}
${lab('vm', 'walk', 'en', 'Split a virtual address into its fields and walk the page-table levels — the same arithmetic as M4.1, animated.', { tour: 'vm-translate' })}
${lab('addr-split', 'split', 'en', 'M4.1 step by step: 0x12345678 split 10/10/12. Change the bit widths (try 8/12/12 or 9/11/12) and the hex address, and watch the coloured fields and the page walk follow.', { tour: 'addr-split-walk' })}
${lab('addr-split', 'table', 'en', 'M4.2–M4.4: drag the address size, page size and PTE size, and compare a one-level table (4 MiB) with the few small tables a sparse process needs on many levels (12 KiB).', { tour: 'addr-split-size' })}
${lab('addr-split', 'seg', 'en', 'M4.5 segmentation: (2, 250) ⇒ 900 + 250 = 1150; (1, 130) exceeds limit 120 ⇒ TRAP. Try other offsets against each segment’s limit.')}

<h3>Effective access time with a TLB</h3>
${drill('M5', 'TLB lookup 10 ns, memory access 80 ns, TLB hit ratio 95 %, single-level page table. What is the effective access time? (And with a 4-level table?)', ['90 ns (and 90 ns)', '94 ns (and 106 ns)', '85.5 ns (and 106 ns)', '170 ns (and 410 ns)'], 'Worked solution', run('c164-bo-nho', 'python3 osgcalc.py eat 10 80 0.95', 3) + '<p>Hit: TLB + one memory access = 90 ns. Miss: TLB + one page-table read per level + the access = 170 ns (1 level) or 410 ns (4 levels). EAT = 0.95 × 90 + 0.05 × 170 = <strong>94 ns</strong>, and with 4 levels 0.95 × 90 + 0.05 × 410 = <strong>106 ns — B</strong>. The third line shows why hit ratio matters more than depth: at 80 % hits a 4-level walk costs 154 ns. On the real machine of 7.2, arm64 uses 4 levels — the TLB is what makes that affordable.</p>')}
${lab('addr-split', 'tlb', 'en', 'Effective access time with a TLB: drag the hit rate, memory time and number of table levels and watch EAT move between 94, 106 and 154 ns; compare TLB reach with 4 KiB and 2 MiB pages.')}

<div class="pitfall co-tieu-de">
<p><strong>Splitting a hex address at hex digits.</strong> 0x12345678 is not "PT1 = 0x12, PT2 = 0x345" unless the fields are 8 and 12 bits. Hex digits are 4-bit groups; fields of 9, 10 or 11 bits cut through them. Always write the binary first, in groups of four, then draw the field boundaries — 30 seconds that save the whole question.</p>
</div>

<h3>If you have done OSG202 lessons 3.1–3.3</h3>
<p>Same algorithms, new numbers, an exact checker. More real past-paper items wait in the exam room. 🎓 ${g('osg202-3-2-thay-trang', 'OSG202 3.2 — page replacement')} · ${g('osg202-3-3-tlb-dia-chi', 'OSG202 3.3 — TLB and addresses')} · ${g('osg202-final-exam-fe', 'OSG202 — final exam practice')}</p>

<h3>🧪 Practice (40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a past paper asks: "If LRU page replacement is used with three frames, how many page faults occur for 4, 7, 6, 1, 7, 6, 1, 2, 7, 2?" and "A 32-bit address is split 10/11/11 — how large are the pages?"</p>
<ol>
<li>Solve both on paper with the table method and the binary layout.</li>
<li>Check with <code>python3 osgcalc.py page lru 3 "4 7 6 1 7 6 1 2 7 2"</code> and <code>python3 osgcalc.py addr bits=10,11,11 0x0</code>.</li>
<li>Run the same string with FIFO and OPT and explain the ranking.</li>
<li>Compute EAT for TLB 20 ns, memory 100 ns, 98 % hits, 2 levels — then check with <code>osgcalc.py eat</code>.</li>
</ol>
<p><strong>Done when:</strong> your paper answers match the program and you can name, for each algorithm, the one column of information it uses.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['reference string', 'The sequence of page numbers a program touches; the input of every replacement question.'],
  ['FIFO · LRU · OPT · Clock', 'Evict by load time · by last use · by next use (ideal) · by a circular scan of reference bits.'],
  ['Belady’s anomaly', 'With FIFO, more frames can cause more faults; stack algorithms (LRU, OPT) are immune.'],
  ['NRU class', '2R + M: class 0 (not referenced, not modified) is evicted first.'],
  ['offset bits · page-number bits', 'Offset bits fix the page size; page-number bits fix the number of pages.'],
  ['effective access time', 'hit × (TLB + memory) + miss × (TLB + levels × memory + memory).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>M1 (3 frames): FIFO 11, LRU 10, OPT 8, Clock 10 faults; with 4 frames LRU 9 and FIFO 8 — LRU is not always better.</li>
<li>Belady: FIFO 9 → 10 faults when going from 3 to 4 frames; LRU and OPT cannot get worse.</li>
<li>Victim tables: FIFO reads Loaded, LRU reads Last ref., NRU reads R and M.</li>
<li>Addresses: write binary first; 10/10/12 of 0x12345678 = 72, 837, 0x678; a single-level table for 32-bit/8 KiB/4 B is 2 MiB.</li>
<li>EAT: 94 ns (1 level), 106 ns (4 levels) at 95 % hits — the TLB makes deep tables affordable.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf', '📘', 'OSTEP — Swapping: Policies (PDF)', 'OPT, FIFO, LRU, Clock, and Belady’s anomaly with worked traces.', 'Open')}
${L('/os-lab?sim=vm&amp;preset=exam', '🧪', 'Page replacement simulator', 'Enter a reference string and compare the four algorithms.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.4</span>
<h2>Luyện đề (2/3): bộ nhớ</h2>
<p class="lead">Câu bộ nhớ là phần máy móc nhất của đề cuối kỳ OSG202, nên cũng là điểm chắc ăn nhất — và đáng tiếc nhất khi mất vì vẽ sai một cột. Bốn dạng quay lại mọi kỳ: thay trang trên một chuỗi tham chiếu, chọn trang nạn nhân từ một bảng, tách địa chỉ ảo thành các trường, và thời gian truy cập hiệu dụng có TLB. Câu hỏi: <strong>bạn có làm tay từng dạng trong dưới ba phút, và chứng minh được đáp án không?</strong></p>

<h3>Thay trang: phương pháp kẻ bảng</h3>
<p>Kẻ mỗi tham chiếu một cột và mỗi khung một hàng. Với mỗi tham chiếu: trúng (không đánh dấu) hoặc lỗi (<strong>F</strong>); lỗi mà không còn khung trống thì gạch trang nạn nhân và ghi nó vào hàng "out". FIFO đuổi trang được <em>nạp</em> sớm nhất; LRU đuổi trang lâu nhất chưa <em>dùng</em>; OPT đuổi trang sẽ được dùng xa nhất trong tương lai (hoặc không bao giờ); Clock quay một kim vòng tròn, xoá bit tham chiếu tới khi gặp một trang có bit 0. Đếm số F — và đếm hai lần.</p>
<p>Chuỗi tham chiếu của M1: <code>7 2 7 3 1 2 4 2 7 3 2 1 5 2</code>, 3 khung, ban đầu trống.</p>
${drill('M1.1', 'Có bao nhiêu lỗi trang với <strong>FIFO</strong>?', ['8', '10', '11', '12'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py page fifo 3') + '<p>Đọc hàng "out": FIFO đuổi 7, 2, 3, 1, 4, 2, 7, 3 theo thứ tự nạp — kể cả trang 2 vừa được dùng ngay trước đó. <strong>11 lỗi — C</strong>.</p>')}
${drill('M1.2', 'Có bao nhiêu lỗi trang với <strong>LRU</strong>?', ['9', '10', '11', '8'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py page lru 3') + '<p>Ở tham chiếu thứ 5 (trang 1) các khung giữ 7, 2, 3, lần dùng cuối ở vị trí 3, 2, 4 → đuổi 2. LRU giữ trang bận rộn 2 thường xuyên hơn FIFO: <strong>10 lỗi — B</strong>.</p>')}
${drill('M1.3', 'Có bao nhiêu lỗi trang với thuật toán <strong>tối ưu (OPT)</strong>?', ['8', '7', '9', '10'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py page opt 3') + '<p>Ở mỗi lỗi, nhìn về phía trước: đuổi trang có lần dùng kế tiếp xa nhất, hoặc không bao giờ được dùng nữa (ở tham chiếu 13, trang 1 không bao giờ được dùng lại). OPT là cận dưới mà không thuật toán thật nào vượt được: <strong>8 lỗi — A</strong>.</p>')}
${drill('M1.4', 'Có bao nhiêu lỗi trang với <strong>Clock (cơ hội thứ hai)</strong>, khi trang mới nạp có bit tham chiếu 1 và kim đi qua khung vừa thay?', ['11', '9', '8', '10'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py page clock 3') + '<p>Clock xấp xỉ LRU bằng một bit mỗi khung; ở đây nó hoà LRU với <strong>10 lỗi — D</strong>, hơn FIFO một lỗi. Nếu đề dùng quy ước khác (trang mới có R = 0), số đếm có thể đổi — hãy ghi rõ quy ước của bạn.</p>')}
${drill('M1.5', 'Với <strong>4 khung</strong>, LRU bị 9 lỗi. FIFO bị bao nhiêu lỗi trên cùng chuỗi đó?', ['8', '9', '10', '11'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py page lru 4', 2) + '<p><strong>8 — A</strong>: trên chuỗi này FIFO thắng LRU khi có 4 khung. LRU tốt hơn <em>trung bình</em> với các chương trình có tính cục bộ, không phải trên mọi chuỗi; các phát biểu kiểu "LRU luôn gây ít lỗi hơn FIFO" là sai.</p>')}
${lab('vm', 'exam', 'vi', 'Gõ bất kỳ chuỗi tham chiếu nào, chọn FIFO, LRU, OPT hay Clock và số khung — trình mô phỏng điền đúng cái bảng đó, từng cột một.')}

<h3>Nghịch lý Belady</h3>
${drill('M2', 'Với chuỗi <code>1 2 3 4 1 2 5 1 2 3 4 5</code>, phát biểu nào đúng?', ['FIFO: 3 khung ⇒ 10 lỗi, 4 khung ⇒ 9', 'FIFO: 3 khung ⇒ 9 lỗi, 4 khung ⇒ 10; LRU với 4 khung ⇒ 8', 'LRU cũng tệ đi khi thêm khung', 'Thêm khung không bao giờ làm tăng số lỗi'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py page fifo 3 "1 2 3 4', 3) + '<p><strong>B.</strong> FIFO không phải thuật toán ngăn xếp (stack algorithm): tập trang trong 4 khung không phải lúc nào cũng chứa tập trang trong 3 khung, nên thêm một khung có thể tốn thêm một lỗi (Belady, 1969). LRU và OPT là thuật toán ngăn xếp và không bao giờ tệ đi — C và D đều sai.</p>')}
${lab('vm', 'belady', 'vi', 'Chạy FIFO với 3 rồi 4 khung trên chuỗi kinh điển và nhìn số lỗi tăng lên.')}

<h3>Chọn trang nạn nhân từ một bảng</h3>
<p>Một máy có bốn khung trang. Thời điểm nạp, thời điểm truy cập cuối, và các bit R, M (thời gian tính bằng nhịp đồng hồ):</p>
<table><tr><th>Trang</th><th>Nạp</th><th>Truy cập cuối</th><th>R</th><th>M</th></tr><tr><td>0</td><td>126</td><td>279</td><td>0</td><td>0</td></tr><tr><td>1</td><td>230</td><td>260</td><td>1</td><td>0</td></tr><tr><td>2</td><td>120</td><td>272</td><td>1</td><td>1</td></tr><tr><td>3</td><td>160</td><td>280</td><td>1</td><td>1</td></tr></table>
${drill('M3', 'FIFO, LRU và NRU lần lượt thay trang nào?', ['0, 1, 2', '2, 1, 0', '2, 0, 1', '1, 2, 0'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py victim') + '<p>FIFO chỉ nhìn cột <em>Nạp</em> (nhỏ nhất: trang 2, t = 120). LRU chỉ nhìn cột <em>Truy cập cuối</em> (nhỏ nhất: trang 1, t = 260). NRU xếp trang theo lớp 2R + M và đuổi từ lớp thấp nhất: trang 0 thuộc lớp 0 (không được tham chiếu, không bị sửa). <strong>B.</strong> Cái bẫy là đọc nhầm cột — mỗi thuật toán dùng đúng một cột.</p>')}

<h3>Tính địa chỉ</h3>
<p>Ba sự thật giải mọi câu: cỡ trang = 2<sup>số bit offset</sup>; số trang = 2<sup>số bit số trang</sup>; giá trị một trường là các bit của nó đọc như số nhị phân. Viết địa chỉ ra nhị phân, nhóm bốn bit, rồi vạch ranh giới các trường.</p>
${drill('M4.1', 'Địa chỉ ảo 32 bit dùng bảng trang hai cấp: trường cấp trên 10 bit (PT1), trường cấp hai 10 bit (PT2), offset 12 bit. Với VA <code>0x12345678</code>, PT1, PT2 và offset là bao nhiêu?', ['PT1 = 18, PT2 = 52, offset = 0x678', 'PT1 = 72, PT2 = 837, offset = 0x678', 'PT1 = 72, PT2 = 837, offset = 0x5678', 'PT1 = 0x12, PT2 = 0x345, offset = 0x678'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py addr bits=10,10,12 0x12345678') + '<p>Offset là 3 chữ số hex cuối chỉ khi nó dài 12 bit: 0x678. Hai trường còn lại <em>không</em> rơi đúng ranh giới chữ số hex (mỗi trường 10 bit), nên phải đổi qua nhị phân: 0001001000 = 72 và 1101000101 = 837. <strong>B.</strong> A và D là kết quả khi tách theo chữ số hex thay vì theo bit.</p>')}
${drill('M4.2', 'Một địa chỉ 32 bit được chia thành trường cấp một 9 bit, trường cấp hai 11 bit và offset 12 bit. Trang lớn bao nhiêu, và không gian địa chỉ có bao nhiêu trang?', ['4 KiB và 2<sup>20</sup> trang', '2 KiB và 2<sup>21</sup> trang', '4 KiB và 2<sup>11</sup> trang', '8 KiB và 2<sup>20</sup> trang'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py addr bits=9,11,12') + '<p>Cỡ trang = 2<sup>12</sup> = 4.096 byte; số trang = 2<sup>9 + 11</sup> = 2<sup>20</sup> = 1.048.576. <strong>A.</strong> C chỉ đếm trường cấp hai.</p>')}
${drill('M4.3', 'Một hệ thống có địa chỉ ảo 32 bit, trang 8 KiB và mục bảng trang 4 byte. Bảng trang một cấp lớn bao nhiêu?', ['4 MiB', '1 MiB', '2 MiB', '512 KiB'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py pagesize 32 8192 4') + '<p>Offset = 13 bit, nên số trang dài 19 bit: 2<sup>19</sup> mục × 4 B = 2 MiB cho mỗi tiến trình. <strong>C.</strong> 4 MiB (A) là đáp án cho trang 4 KiB — đây là lý do hệ thống dùng bảng nhiều cấp: vùng không dùng thì không cần bảng cấp hai.</p>')}
${drill('M4.4', 'Không gian địa chỉ logic có 128 trang, mỗi trang 8.192 word. Địa chỉ logic dài bao nhiêu bit?', ['20 bit', '21 bit', '13 bit', '17 bit'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py loglen 128 8192') + '<p>log<sub>2</sub>128 = 7 bit cho số trang, log<sub>2</sub>8.192 = 13 bit cho offset: <strong>20 bit — A</strong>.</p>')}
${drill('M4.5', 'Bảng phân đoạn: đoạn 0 base 2100 limit 500; đoạn 1 base 3800 limit 120; đoạn 2 base 900 limit 300; đoạn 3 base 5000 limit 750. Địa chỉ vật lý của (2, 250) và (1, 130) là gì?', ['1150 và 3930', '1150 và một trap', '250 và 130', 'một trap và 3930'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py seg', 2) + '<p>So offset với limit <em>trước</em> khi cộng: 250 &lt; 300 ⇒ 900 + 250 = 1150; 130 ≥ 120 ⇒ lỗi địa chỉ, bẫy vào hệ điều hành. <strong>B.</strong> A cộng mà không kiểm — đúng lỗi mà phần cứng phân đoạn sinh ra để ngăn.</p>')}
${lab('vm', 'walk', 'vi', 'Tách một địa chỉ ảo thành các trường và đi qua các cấp của bảng trang — đúng phép tính của M4.1, có hoạt hoạ.', { tour: 'vm-translate' })}
${lab('addr-split', 'split', 'vi', 'M4.1 từng bước: 0x12345678 tách 10/10/12. Đổi số bit (thử 8/12/12 hay 9/11/12) và địa chỉ hex, rồi xem các trường tô màu và bước đi bảng trang đổi theo.', { tour: 'addr-split-walk' })}
${lab('addr-split', 'table', 'vi', 'M4.2–M4.4: kéo số bit địa chỉ, cỡ trang và cỡ PTE, rồi so bảng một mức (4 MiB) với vài bảng nhỏ mà tiến trình thưa cần khi chia nhiều mức (12 KiB).', { tour: 'addr-split-size' })}
${lab('addr-split', 'seg', 'vi', 'M4.5 phân đoạn: (2, 250) ⇒ 900 + 250 = 1150; (1, 130) vượt giới hạn 120 ⇒ TRAP. Thử các offset khác với giới hạn của từng đoạn.')}

<h3>Thời gian truy cập hiệu dụng có TLB</h3>
${drill('M5', 'Tra TLB 10 ns, truy cập bộ nhớ 80 ns, tỉ lệ trúng TLB 95 %, bảng trang một cấp. Thời gian truy cập hiệu dụng là bao nhiêu? (Và với bảng 4 cấp?)', ['90 ns (và 90 ns)', '94 ns (và 106 ns)', '85,5 ns (và 106 ns)', '170 ns (và 410 ns)'], 'Lời giải từng bước', run('c164-bo-nho', 'python3 osgcalc.py eat 10 80 0.95', 3) + '<p>Trúng: TLB + một lần truy cập bộ nhớ = 90 ns. Trượt: TLB + mỗi cấp một lần đọc bảng trang + lần truy cập = 170 ns (1 cấp) hoặc 410 ns (4 cấp). EAT = 0,95 × 90 + 0,05 × 170 = <strong>94 ns</strong>, và với 4 cấp 0,95 × 90 + 0,05 × 410 = <strong>106 ns — B</strong>. Dòng thứ ba cho thấy vì sao tỉ lệ trúng quan trọng hơn độ sâu: ở 80 % trúng, đi 4 cấp tốn 154 ns. Trên máy thật của bài 7.2, arm64 dùng 4 cấp — chính TLB làm việc đó trở nên chấp nhận được.</p>')}
${lab('addr-split', 'tlb', 'vi', 'Thời gian truy cập hiệu dụng có TLB: kéo tỉ lệ trúng, thời gian bộ nhớ và số mức bảng, xem EAT đi giữa 94, 106 và 154 ns; so TLB reach với trang 4 KiB và 2 MiB.')}

<div class="pitfall co-tieu-de">
<p><strong>Tách địa chỉ hex theo chữ số hex.</strong> 0x12345678 không phải "PT1 = 0x12, PT2 = 0x345" trừ khi các trường dài 8 và 12 bit. Chữ số hex là nhóm 4 bit; trường dài 9, 10 hay 11 bit cắt ngang qua chúng. Luôn viết nhị phân trước, nhóm bốn bit, rồi mới vạch ranh giới trường — 30 giây cứu cả câu.</p>
</div>

<h3>Nếu bạn đã học OSG202 bài 3.1–3.3</h3>
<p>Cùng thuật toán, số mới, bộ kiểm chính xác. Còn nhiều câu đề cũ thật đang chờ trong phòng thi. 🎓 ${g('osg202-3-2-thay-trang', 'OSG202 3.2 — thay trang')} · ${g('osg202-3-3-tlb-dia-chi', 'OSG202 3.3 — TLB và địa chỉ')} · ${g('osg202-final-exam-fe', 'OSG202 — luyện đề cuối kỳ')}</p>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đề cũ hỏi: "Dùng LRU với ba khung, chuỗi 4, 7, 6, 1, 7, 6, 1, 2, 7, 2 gây bao nhiêu lỗi trang?" và "Địa chỉ 32 bit chia 10/11/11 — trang lớn bao nhiêu?"</p>
<ol>
<li>Giải cả hai trên giấy bằng phương pháp kẻ bảng và cách viết nhị phân.</li>
<li>Kiểm bằng <code>python3 osgcalc.py page lru 3 "4 7 6 1 7 6 1 2 7 2"</code> và <code>python3 osgcalc.py addr bits=10,11,11 0x0</code>.</li>
<li>Chạy cùng chuỗi với FIFO và OPT rồi giải thích thứ hạng.</li>
<li>Tính EAT cho TLB 20 ns, bộ nhớ 100 ns, 98 % trúng, 2 cấp — rồi kiểm bằng <code>osgcalc.py eat</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> đáp án trên giấy khớp với chương trình và bạn gọi tên được, cho từng thuật toán, đúng một cột thông tin mà nó dùng.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['reference string (chuỗi tham chiếu)', 'Dãy số trang mà chương trình đụng tới; đầu vào của mọi câu thay trang.'],
  ['FIFO · LRU · OPT · Clock', 'Đuổi theo thời điểm nạp · theo lần dùng cuối · theo lần dùng kế tiếp (lý tưởng) · theo vòng quét bit tham chiếu.'],
  ['Belady’s anomaly (nghịch lý Belady)', 'Với FIFO, thêm khung có thể gây thêm lỗi; thuật toán ngăn xếp (LRU, OPT) miễn nhiễm.'],
  ['lớp NRU', '2R + M: lớp 0 (không tham chiếu, không sửa) bị đuổi trước.'],
  ['bit offset · bit số trang', 'Số bit offset quyết định cỡ trang; số bit số trang quyết định số trang.'],
  ['effective access time (thời gian truy cập hiệu dụng)', 'trúng × (TLB + bộ nhớ) + trượt × (TLB + số cấp × bộ nhớ + bộ nhớ).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>M1 (3 khung): FIFO 11, LRU 10, OPT 8, Clock 10 lỗi; với 4 khung LRU 9 và FIFO 8 — LRU không phải lúc nào cũng tốt hơn.</li>
<li>Belady: FIFO 9 → 10 lỗi khi đi từ 3 lên 4 khung; LRU và OPT không thể tệ đi.</li>
<li>Bảng chọn nạn nhân: FIFO đọc cột Nạp, LRU đọc cột Truy cập cuối, NRU đọc R và M.</li>
<li>Địa chỉ: viết nhị phân trước; 10/10/12 của 0x12345678 = 72, 837, 0x678; bảng một cấp cho 32 bit/8 KiB/4 B là 2 MiB.</li>
<li>EAT: 94 ns (1 cấp), 106 ns (4 cấp) ở 95 % trúng — TLB làm bảng sâu trở nên chấp nhận được.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf', '📘', 'OSTEP — Swapping: Policies (PDF)', 'OPT, FIFO, LRU, Clock và nghịch lý Belady với các bản dò từng bước.', 'Mở')}
${L('/os-lab?sim=vm&amp;preset=exam', '🧪', 'Trình mô phỏng thay trang', 'Nhập một chuỗi tham chiếu và so bốn thuật toán.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.5 — Luyện thi: deadlock, đĩa, semaphore ───────────────────────── */
    {
      title: '16.5 — Exam drills (3/3): Banker’s algorithm, deadlock detection, disk scheduling and semaphores|||16.5 — Luyện đề (3/3): thuật toán Banker, phát hiện deadlock, lập lịch đĩa và semaphore',
      slug: 'os-16-7-banker-dia',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dạng bài deadlock, đĩa và đồng bộ của đề OSG202 với đề MỚI: Banker 5 tiến trình × 3 tài nguyên (ma trận Need, thứ tự an toàn, xét hai yêu cầu: từ chối rồi chấp nhận), x nhỏ nhất để an toàn, bảng Has/Max một tài nguyên, phát hiện deadlock bằng ma trận Request; lập lịch tay đĩa FCFS/SSTF/SCAN/LOOK/C-SCAN/C-LOOK từ trụ 80 (708/237/306/270/385/325 trụ), nhận ra thuật toán từ thứ tự, độ lệch trụ 36 sector; và liệt kê MỌI cách xen kẽ của ba tiến trình với hai semaphore — kể cả nhánh treo vĩnh viễn.',
      content: `${G165}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.5</span>
<h2>Exam drills (3/3): deadlock, disks and semaphores</h2>
<p class="lead">The last group of computations on the OSG202 final: Banker’s algorithm (is the state safe? can this request be granted? what is the smallest x?), deadlock detection with a request matrix, disk-arm scheduling, and "which outputs can these processes print?". The question: <strong>can you run each algorithm by hand, step by step, in the form the marker wants to see — and know which answer is the trap?</strong></p>

<h3>Banker’s algorithm: the four-line routine</h3>
<ol>
<li><strong>Need = Max − Allocation</strong>, row by row. Write the matrix — half the marks are here.</li>
<li><strong>Work = Available.</strong> Scan the processes in order; the first one with Need ≤ Work (every column) "finishes": Work += its Allocation. Repeat the scan until nobody fits.</li>
<li>Everybody finished ⇒ <strong>safe</strong>, and the order is a safe sequence (there may be others). Somebody left ⇒ <strong>unsafe</strong> (not necessarily deadlocked).</li>
<li><strong>Request</strong> from Pi: Request ≤ Need (else error) · Request ≤ Available (else wait) · pretend to grant (Available −, Allocation +, Need −) and run step 2. Safe ⇒ grant; unsafe ⇒ Pi waits.</li>
</ol>

<h3>Problem B1 — five processes, three resource types</h3>
<table><tr><th></th><th>Allocation (A B C)</th><th>Max (A B C)</th></tr><tr><td>P0</td><td>1 0 1</td><td>4 2 3</td></tr><tr><td>P1</td><td>2 1 1</td><td>3 2 2</td></tr><tr><td>P2</td><td>0 1 0</td><td>2 3 1</td></tr><tr><td>P3</td><td>1 2 0</td><td>1 3 2</td></tr><tr><td>P4</td><td>0 0 2</td><td>3 1 4</td></tr></table>
<p>Available = (2, 1, 1).</p>
${drill('B1.1', 'Is the state safe? If so, which safe sequence does the standard scan produce?', ['Unsafe', 'Safe: &lt;P1, P2, P3, P4, P0&gt;', 'Safe: &lt;P3, P1, P0, P2, P4&gt;', 'Safe: &lt;P0, P1, P2, P3, P4&gt;'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py banker "1,0,1 2,1,1', 1, { max: 14 }) + '<p>Need: P0 (3,2,2), P1 (1,1,1), P2 (2,2,1), P3 (0,1,2), P4 (3,1,2). With Work (2,1,1) only P1 fits; after it Work = (4,2,2) and P2, P3, P4 follow in the same scan; P0 last. <strong>B.</strong> D fails at once (P0 needs 3 A’s); C is not even reachable — P3 needs 2 C’s and only 1 is free.</p>')}
${drill('B1.2', 'P4 then requests (1, 0, 1). Then P1 requests (1, 0, 0). What does the Banker do?', ['Grant both', 'Deny P4 (unsafe), then grant P1', 'Grant P4, deny P1', 'P4’s request is an error: it exceeds its Need'], 'Worked solution', tail('c165-banker-dia', 'python3 osgcalc.py banker "1,0,1 2,1,1', 14) + '<p>P4’s request passes both checks ((1,0,1) ≤ Need (3,1,2) and ≤ Available (2,1,1)), but after pretending, Available = (1,1,0) and nobody’s Need fits: <strong>unsafe ⇒ P4 waits</strong>. The state is unchanged, so P1’s (1,0,0) leaves Available (1,1,1) and P1’s Need becomes (0,1,1) — it fits, and the rest follow: <strong>grant. B.</strong> D is the trap: "≤ Need" is satisfied, so it is not an error.</p>')}
${drill('B2', 'With the same Allocation and Max, Available = (1, x, 1). What is the smallest x for which the state is safe?', ['0', '1', '2', '3'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py banker-x') + '<p>Try x upward. With x = 0 nobody fits (every Need has B ≥ 1 or more than one A/C). With x = 1, Work = (1,1,1) equals P1’s Need exactly — "≤" includes equality — and the scan finishes everyone. <strong>x = 1 — B.</strong></p>')}
${lab('deadlock', 'banker', 'en', 'Load a Banker table and step through the safety scan — Work, Need, Finish — exactly as on paper.', { tour: 'deadlock-banker' })}

<h3>Problem B3 — one resource type (Has / Max)</h3>
<p>Four processes A–D hold 2, 1, 3, 2 units and may need at most 7, 4, 5, 8.</p>
${drill('B3', 'Is the state safe with 2 free units? And with 1 free unit?', ['Safe / safe', 'Unsafe / unsafe', 'Safe / unsafe', 'Unsafe / safe'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py banker "2 1 3 2" "7 4 5 8" "2"', 2) + '<p>Free = 2: C needs 2 more ⇒ finishes, returns 3 ⇒ 5 free ⇒ A (needs 5) ⇒ 7 ⇒ B ⇒ 8 ⇒ D (needs 6) ⇒ safe. Free = 1: the smallest remaining need is C’s 2 ⇒ nobody can be guaranteed to finish ⇒ unsafe. <strong>C.</strong> One unit is the whole difference — that is how fragile safety is, and why the textbook "Fig. A/B/C" questions turn on a single free unit.</p>')}

<h3>Problem B4 — deadlock detection</h3>
<p>Detection uses <strong>Request</strong> (what each process is waiting for now) instead of Need, and the same scan. Allocation: P0 (1,0,1), P1 (0,1,0), P2 (1,1,0), P3 (0,0,1). Request: P0 (0,1,0), P1 (1,0,1), P2 (0,0,1), P3 (1,0,0).</p>
${drill('B4', 'Which processes are deadlocked when Available = (0, 0, 0)? And when Available = (0, 1, 0)?', ['None / none', 'P0, P1 / none', 'All four / none', 'All four / P2, P3'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py detect', 2) + '<p>With nothing free, every process waits for something another one holds: all four are in the cycle. A single free B lets P0 finish, which returns (1,0,1) and unblocks P1, then P2, then P3: no deadlock. <strong>C.</strong> Detection answers "who is stuck <em>now</em>"; recovery then kills or rolls back one of them — what PostgreSQL does with "deadlock detected" (6.1).</p>')}
${lab('deadlock', 'detect', 'en', 'Detection on a multi-instance resource graph: reduce the matrix step by step and see which processes remain.', { tour: 'deadlock-detect' })}

<h3>Disk-arm scheduling</h3>
<p>Cylinders 0–199. The head is at <strong>80</strong>, moving towards higher numbers. Queue (in arrival order): <strong>45, 132, 12, 98, 181, 67, 140, 30</strong>. Total head movement is the sum of the absolute differences along the service order.</p>
${run('c165-banker-dia', 'python3 osgcalc.py disk fcfs 80', 2)}
${drill('K1.1', 'What is the total head movement under <strong>SSTF</strong> (shortest seek first)? With 2 ms per cylinder, what is the seek time?', ['237 cylinders, 474 ms', '270 cylinders, 540 ms', '708 cylinders, 1416 ms', '225 cylinders, 450 ms'], 'Worked solution', '<p>From 80 the nearest is 67 (13), then 45, 30, 12 — all on the low side — then the long jump to 98 and up. 13 + 22 + 15 + 18 + 86 + 34 + 8 + 41 = <strong>237 cylinders × 2 ms = 474 ms — A</strong> (second output above). 708 (C) is FCFS. SSTF ignores the direction the head was moving — and can starve far requests.</p>')}
${drill('K1.2', 'What are the totals for <strong>SCAN</strong>, <strong>LOOK</strong>, <strong>C-SCAN</strong> and <strong>C-LOOK</strong>?', ['270, 306, 325, 385', '306, 270, 385, 325', '306, 270, 186, 325', '237, 237, 385, 325'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py disk scan 80', 4) + '<p>SCAN goes up to the edge (199) before turning: 306. LOOK turns at the last request (181): 270. C-SCAN goes to 199, jumps to 0 and sweeps up: 385 <em>counting</em> the 199-cylinder return (186 without it — some books leave the return out; say which rule you use). C-LOOK jumps from 181 back to the lowest request, 12: 325. <strong>B.</strong></p>')}
${drill('K1.3', 'The arm visited 80, 98, 132, 140, 181, 12, 30, 45, 67. Which algorithm was used?', ['SCAN', 'LOOK', 'C-LOOK', 'SSTF'], 'Worked solution', '<p>Up to the highest request (not to 199 — so not SCAN or C-SCAN), then a jump to the <em>lowest</em> request and upward again: <strong>C-LOOK — C</strong>. LOOK would turn around and go 67, 45, 30, 12 (downward); SSTF would have started with 67.</p>')}
${drill('K1.4', 'If the head at 80 is moving <strong>down</strong>, what is LOOK’s total — and which other algorithm gives the same total here?', ['237, SSTF', '270, SCAN', '306, C-SCAN', '325, C-LOOK'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py disk look 80 "45 132 12 98 181 67 140 30" down') + '<p>Down first: 67, 45, 30, 12, then up 98 … 181 = 237 — the same order SSTF chose, by coincidence of the numbers. <strong>A.</strong> Direction is part of the question: always state it.</p>')}
${lab('disk-arm', 'cscan', 'en', 'Problem K1 on a disk seen from above: pick FCFS, SSTF, SCAN, LOOK, C-SCAN or C-LOOK and step the arm while the running total adds each move. Flip the return-jump switch to see why C-SCAN is 385 counted and 186 without the jump.', { tour: 'disk-arm-cscan' })}
${drill('K2', 'A 7,200 RPM disk has 300 sectors per track and a track-to-track seek of 1 ms. How much cylinder skew is needed so that reading continues without waiting a full rotation after moving to the next track?', ['30 sectors', '36 sectors', '42 sectors', '8 sectors'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py skew 7200 1 300') + '<p>One rotation = 60,000 / 7,200 = 8.33 ms; one sector passes in 8.33 / 300 ≈ 0.0278 ms; during the 1 ms seek 36 sectors pass under the head, so the next track’s sector 0 must start 36 sectors later: <strong>36 — B</strong>.</p>')}
${lab('disk-arm', 'exam', 'en', 'Exam mode: type the order and the total for each algorithm, check, then answer “which algorithm is this?” (K1.3). The cylinder-skew panel works K2 out step by step.', { tour: 'disk-arm-exam' })}

<h3>Semaphores: which outputs are possible?</h3>
<p>S = 1, T = 0. Three processes run concurrently:</p>
${cmd('P1:  wait(S); print("A"); signal(T); print("B");', 'P2:  wait(T); print("C"); signal(S);', 'P3:  wait(S); print("D");')}
${drill('Y1', 'Which of these outputs is <strong>impossible</strong>?', ['ACBD', 'ABCD', 'DACB', 'ACDB'], 'Worked solution', run('c165-banker-dia', 'python3 osgcalc.py sem') + '<p>The program tries <em>every</em> interleaving. Only three complete outputs exist: ABCD, ACBD, ACDB. <strong>DACB is impossible — C</strong>: if P3 takes S first and prints D, P1 can never get S (only P2 signals S, and P2 waits for T, which only P1 signals) — that run blocks forever after printing "D". Exam questions of this kind are a small deadlock in disguise; when in doubt, enumerate.</p>')}
${lab('sync', 'semaphore', 'en', 'A semaphore as a counter of permits: wait takes one or blocks, signal returns one — step through and watch who is blocked.')}

<div class="pitfall co-tieu-de">
<p><strong>"Unsafe" written as "deadlocked".</strong> In B3 with one free unit the state is unsafe, yet nobody is deadlocked — the processes may never ask for their maximum. Banker refuses to <em>enter</em> unsafe states because it cannot prove they end well; detection (B4) is about states where processes are already blocked on each other. Mixing the two costs a mark on every paper; keep the words apart.</p>
</div>

<h3>If you have done OSG202 lessons 5.2, 6.1 and 6.2</h3>
<p>🎓 ${g('osg202-6-2-banker', 'OSG202 6.2 — Banker')} · ${g('osg202-6-1-deadlock', 'OSG202 6.1 — deadlock')} · ${g('osg202-5-2-lap-lich-dia', 'OSG202 5.2 — disk scheduling')} · ${g('osg202-final-exam-fe', 'OSG202 — final exam practice')}</p>

<h3>🧪 Practice (45 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a past paper gives "Available (3,3,2), Allocation [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]], Max [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]. Is it safe?" and "Head at 53, queue 98, 37, 14, 65, 67 — SSF arm motion?"</p>
<ol>
<li>Solve the Banker question on paper with the four-line routine.</li>
<li>Check with <code>python3 osgcalc.py banker "0,1,0 2,0,0 3,0,2 2,1,1 0,0,2" "7,5,3 3,2,2 9,0,2 2,2,2 4,3,3" "3,3,2"</code>.</li>
<li>Solve the disk question for SSF and for LOOK moving up; check with <code>python3 osgcalc.py disk sstf 53 "98 37 14 65 67"</code>.</li>
<li>Change Y1 so that P3 does <code>wait(T)</code> instead of <code>wait(S)</code>; predict the outputs, then check by editing <code>cmd_sem</code> in <code>osgcalc.py</code>.</li>
</ol>
<p><strong>Done when:</strong> your paper answers match the program and you can say, for each question, which single number or word would have been the trap.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Need = Max − Allocation', 'What each process may still request; the input of Banker’s safety scan.'],
  ['safe sequence', 'An order in which every process can get its remaining need and finish.'],
  ['Request matrix', 'What each process is blocked on now; detection uses it instead of Need.'],
  ['SSTF · SCAN · LOOK · C-SCAN · C-LOOK', 'Nearest first · sweep to the edge · sweep to the last request · one-way sweeps with a return jump.'],
  ['cylinder skew', 'Offset of sector 0 between tracks so a sequential read continues after a track-to-track seek.'],
  ['semaphore', 'A counter with wait (take or block) and signal (give back); signal can come from any process.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>B1: Need first; safe sequence &lt;P1, P2, P3, P4, P0&gt;; P4’s (1,0,1) denied as unsafe, P1’s (1,0,0) granted.</li>
<li>B2: smallest x = 1 (Need ≤ Work includes equality). B3: 2 free safe, 1 free unsafe. B4: all four deadlocked with nothing free, none with one free B.</li>
<li>Disk from 80 up: FCFS 708, SSTF 237, SCAN 306, LOOK 270, C-SCAN 385 (186 without the return), C-LOOK 325.</li>
<li>Cylinder skew at 7,200 RPM, 300 sectors, 1 ms seek: 36 sectors.</li>
<li>Semaphore outputs: enumerate interleavings — DACB is impossible, and that branch deadlocks.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf', '📘', 'OSTEP — Common Concurrency Problems (PDF)', 'Deadlock conditions, prevention, avoidance and detection.', 'Open')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf', '📘', 'OSTEP — Hard Disk Drives (PDF)', 'Seek, rotation, track skew and the disk-scheduling algorithms.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.5</span>
<h2>Luyện đề (3/3): deadlock, đĩa và semaphore</h2>
<p class="lead">Nhóm tính toán cuối cùng của đề cuối kỳ OSG202: thuật toán Banker (trạng thái có an toàn không? yêu cầu này có cấp được không? x nhỏ nhất là bao nhiêu?), phát hiện deadlock bằng ma trận Request, lập lịch tay đĩa, và "các tiến trình này in ra được những gì?". Câu hỏi: <strong>bạn có chạy tay từng thuật toán, từng bước, đúng dạng người chấm muốn thấy — và biết đáp án nào là cái bẫy không?</strong></p>

<h3>Thuật toán Banker: quy trình bốn dòng</h3>
<ol>
<li><strong>Need = Max − Allocation</strong>, từng hàng. Viết ma trận ra — một nửa số điểm nằm ở đây.</li>
<li><strong>Work = Available.</strong> Quét các tiến trình theo thứ tự; tiến trình đầu tiên có Need ≤ Work (ở mọi cột) thì "xong": Work += Allocation của nó. Lặp lại vòng quét tới khi không ai vừa nữa.</li>
<li>Mọi tiến trình đều xong ⇒ <strong>an toàn</strong>, và thứ tự đó là một chuỗi an toàn (có thể còn chuỗi khác). Còn người kẹt lại ⇒ <strong>không an toàn</strong> (chưa chắc đã deadlock).</li>
<li><strong>Yêu cầu</strong> từ Pi: Request ≤ Need (không thì lỗi) · Request ≤ Available (không thì chờ) · giả vờ cấp (Available −, Allocation +, Need −) rồi chạy bước 2. An toàn ⇒ cấp; không an toàn ⇒ Pi chờ.</li>
</ol>

<h3>Bài B1 — năm tiến trình, ba loại tài nguyên</h3>
<table><tr><th></th><th>Allocation (A B C)</th><th>Max (A B C)</th></tr><tr><td>P0</td><td>1 0 1</td><td>4 2 3</td></tr><tr><td>P1</td><td>2 1 1</td><td>3 2 2</td></tr><tr><td>P2</td><td>0 1 0</td><td>2 3 1</td></tr><tr><td>P3</td><td>1 2 0</td><td>1 3 2</td></tr><tr><td>P4</td><td>0 0 2</td><td>3 1 4</td></tr></table>
<p>Available = (2, 1, 1).</p>
${drill('B1.1', 'Trạng thái có an toàn không? Nếu có, vòng quét chuẩn cho ra chuỗi an toàn nào?', ['Không an toàn', 'An toàn: &lt;P1, P2, P3, P4, P0&gt;', 'An toàn: &lt;P3, P1, P0, P2, P4&gt;', 'An toàn: &lt;P0, P1, P2, P3, P4&gt;'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py banker "1,0,1 2,1,1', 1, { max: 14 }) + '<p>Need: P0 (3,2,2), P1 (1,1,1), P2 (2,2,1), P3 (0,1,2), P4 (3,1,2). Với Work (2,1,1) chỉ P1 vừa; sau nó Work = (4,2,2) và P2, P3, P4 lần lượt theo ngay trong vòng quét đó; P0 cuối cùng. <strong>B.</strong> D hỏng ngay (P0 cần 3 A); C thậm chí không với tới được — P3 cần 2 C mà chỉ có 1 C rảnh.</p>')}
${drill('B1.2', 'Sau đó P4 xin (1, 0, 1). Rồi P1 xin (1, 0, 0). Banker làm gì?', ['Cấp cả hai', 'Từ chối P4 (không an toàn), rồi cấp cho P1', 'Cấp cho P4, từ chối P1', 'Yêu cầu của P4 là lỗi: vượt quá Need'], 'Lời giải từng bước', tail('c165-banker-dia', 'python3 osgcalc.py banker "1,0,1 2,1,1', 14) + '<p>Yêu cầu của P4 qua cả hai phép kiểm ((1,0,1) ≤ Need (3,1,2) và ≤ Available (2,1,1)), nhưng sau khi giả vờ cấp, Available = (1,1,0) và không Need nào vừa: <strong>không an toàn ⇒ P4 phải chờ</strong>. Trạng thái giữ nguyên, nên (1,0,0) của P1 để lại Available (1,1,1) và Need của P1 thành (0,1,1) — vừa, rồi những người còn lại theo sau: <strong>cấp. B.</strong> D là cái bẫy: "≤ Need" thoả, nên đây không phải lỗi.</p>')}
${drill('B2', 'Vẫn Allocation và Max đó, Available = (1, x, 1). x nhỏ nhất bằng bao nhiêu để trạng thái an toàn?', ['0', '1', '2', '3'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py banker-x') + '<p>Thử x tăng dần. Với x = 0 không ai vừa (mọi Need đều có B ≥ 1 hoặc nhiều hơn một A/C). Với x = 1, Work = (1,1,1) bằng đúng Need của P1 — "≤" tính cả dấu bằng — và vòng quét cho mọi người xong. <strong>x = 1 — B.</strong></p>')}
${lab('deadlock', 'banker', 'vi', 'Nạp một bảng Banker và đi từng bước vòng quét an toàn — Work, Need, Finish — đúng như trên giấy.', { tour: 'deadlock-banker' })}

<h3>Bài B3 — một loại tài nguyên (Has / Max)</h3>
<p>Bốn tiến trình A–D đang giữ 2, 1, 3, 2 đơn vị và có thể cần tối đa 7, 4, 5, 8.</p>
${drill('B3', 'Trạng thái có an toàn không khi còn 2 đơn vị rảnh? Và khi còn 1?', ['An toàn / an toàn', 'Không / không', 'An toàn / không an toàn', 'Không an toàn / an toàn'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py banker "2 1 3 2" "7 4 5 8" "2"', 2) + '<p>Rảnh = 2: C cần thêm 2 ⇒ xong, trả 3 ⇒ rảnh 5 ⇒ A (cần 5) ⇒ 7 ⇒ B ⇒ 8 ⇒ D (cần 6) ⇒ an toàn. Rảnh = 1: nhu cầu còn lại nhỏ nhất là 2 của C ⇒ không ai được bảo đảm xong ⇒ không an toàn. <strong>C.</strong> Chỉ một đơn vị là toàn bộ khác biệt — sự an toàn mong manh đến thế, và vì vậy các câu "Fig. A/B/C" trong giáo trình xoay quanh đúng một đơn vị rảnh.</p>')}

<h3>Bài B4 — phát hiện deadlock</h3>
<p>Phát hiện dùng <strong>Request</strong> (thứ mỗi tiến trình đang chờ ngay lúc này) thay cho Need, và cùng vòng quét. Allocation: P0 (1,0,1), P1 (0,1,0), P2 (1,1,0), P3 (0,0,1). Request: P0 (0,1,0), P1 (1,0,1), P2 (0,0,1), P3 (1,0,0).</p>
${drill('B4', 'Những tiến trình nào bị deadlock khi Available = (0, 0, 0)? Và khi Available = (0, 1, 0)?', ['Không ai / không ai', 'P0, P1 / không ai', 'Cả bốn / không ai', 'Cả bốn / P2, P3'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py detect', 2) + '<p>Không có gì rảnh thì mỗi tiến trình đều chờ thứ một tiến trình khác đang giữ: cả bốn nằm trong vòng. Chỉ một B rảnh là P0 xong, trả lại (1,0,1) và gỡ cho P1, rồi P2, rồi P3: không deadlock. <strong>C.</strong> Phát hiện trả lời "ai đang kẹt <em>ngay bây giờ</em>"; khôi phục thì giết hoặc quay lui một trong số đó — đúng việc PostgreSQL làm với "deadlock detected" (6.1).</p>')}
${lab('deadlock', 'detect', 'vi', 'Phát hiện trên đồ thị tài nguyên nhiều bản: rút gọn ma trận từng bước và xem tiến trình nào còn lại.', { tour: 'deadlock-detect' })}

<h3>Lập lịch tay đĩa</h3>
<p>Trụ 0–199. Đầu đọc ở <strong>80</strong>, đang đi về phía số lớn. Hàng đợi (theo thứ tự đến): <strong>45, 132, 12, 98, 181, 67, 140, 30</strong>. Tổng quãng di chuyển là tổng các hiệu tuyệt đối dọc theo thứ tự phục vụ.</p>
${run('c165-banker-dia', 'python3 osgcalc.py disk fcfs 80', 2)}
${drill('K1.1', 'Tổng quãng di chuyển theo <strong>SSTF</strong> (gần nhất trước) là bao nhiêu? Với 2 ms mỗi trụ, thời gian seek là bao nhiêu?', ['237 trụ, 474 ms', '270 trụ, 540 ms', '708 trụ, 1416 ms', '225 trụ, 450 ms'], 'Lời giải từng bước', '<p>Từ 80, gần nhất là 67 (13), rồi 45, 30, 12 — đều ở phía thấp — rồi cú nhảy dài lên 98 và đi lên. 13 + 22 + 15 + 18 + 86 + 34 + 8 + 41 = <strong>237 trụ × 2 ms = 474 ms — A</strong> (output thứ hai ở trên). 708 (C) là FCFS. SSTF bỏ qua hướng đầu đọc đang đi — và có thể làm đói các yêu cầu ở xa.</p>')}
${drill('K1.2', 'Tổng quãng của <strong>SCAN</strong>, <strong>LOOK</strong>, <strong>C-SCAN</strong> và <strong>C-LOOK</strong> là bao nhiêu?', ['270, 306, 325, 385', '306, 270, 385, 325', '306, 270, 186, 325', '237, 237, 385, 325'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py disk scan 80', 4) + '<p>SCAN đi lên tới mép (199) rồi mới quay: 306. LOOK quay ở yêu cầu cuối (181): 270. C-SCAN đi tới 199, nhảy về 0 rồi quét lên: 385 khi <em>tính</em> cả 199 trụ quay về (186 nếu không tính — vài sách bỏ phần quay về; hãy ghi rõ bạn dùng luật nào). C-LOOK nhảy từ 181 về yêu cầu thấp nhất, 12: 325. <strong>B.</strong></p>')}
${drill('K1.3', 'Tay đĩa đã đi qua 80, 98, 132, 140, 181, 12, 30, 45, 67. Thuật toán nào đã được dùng?', ['SCAN', 'LOOK', 'C-LOOK', 'SSTF'], 'Lời giải từng bước', '<p>Lên tới yêu cầu cao nhất (không tới 199 — nên không phải SCAN hay C-SCAN), rồi nhảy về yêu cầu <em>thấp nhất</em> và đi lên tiếp: <strong>C-LOOK — C</strong>. LOOK sẽ quay đầu và đi 67, 45, 30, 12 (đi xuống); SSTF thì đã bắt đầu bằng 67.</p>')}
${drill('K1.4', 'Nếu đầu đọc ở 80 đang đi <strong>xuống</strong>, tổng quãng của LOOK là bao nhiêu — và thuật toán nào khác cho cùng tổng ở đây?', ['237, SSTF', '270, SCAN', '306, C-SCAN', '325, C-LOOK'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py disk look 80 "45 132 12 98 181 67 140 30" down') + '<p>Xuống trước: 67, 45, 30, 12, rồi lên 98 … 181 = 237 — đúng thứ tự SSTF đã chọn, do trùng hợp của các con số. <strong>A.</strong> Hướng đi là một phần của đề: luôn ghi rõ.</p>')}
${lab('disk-arm', 'cscan', 'vi', 'Bài K1 trên mặt đĩa nhìn từ trên xuống: chọn FCFS, SSTF, SCAN, LOOK, C-SCAN hay C-LOOK rồi bấm từng bước cho tay đĩa chạy, bộ cộng dồn cộng từng bước. Lật công tắc cú nhảy về để thấy vì sao C-SCAN là 385 khi tính và 186 khi không tính.', { tour: 'disk-arm-cscan' })}
${drill('K2', 'Một đĩa 7.200 vòng/phút có 300 sector mỗi track và seek giữa hai track kề nhau 1 ms. Cần lệch trụ (cylinder skew) bao nhiêu để sau khi sang track kế tiếp việc đọc tiếp diễn mà không phải chờ trọn một vòng?', ['30 sector', '36 sector', '42 sector', '8 sector'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py skew 7200 1 300') + '<p>Một vòng = 60.000 / 7.200 = 8,33 ms; một sector đi qua trong 8,33 / 300 ≈ 0,0278 ms; trong 1 ms seek có 36 sector đi qua dưới đầu đọc, nên sector 0 của track kế phải bắt đầu chậm 36 sector: <strong>36 — B</strong>.</p>')}
${lab('disk-arm', 'exam', 'vi', 'Chế độ thi: gõ thứ tự và tổng cho từng thuật toán, chấm, rồi trả lời “thuật toán nào đây?” (K1.3). Ô độ lệch trụ giải K2 từng bước.', { tour: 'disk-arm-exam' })}

<h3>Semaphore: những output nào có thể xảy ra?</h3>
<p>S = 1, T = 0. Ba tiến trình chạy đồng thời:</p>
${cmd('P1:  wait(S); print("A"); signal(T); print("B");', 'P2:  wait(T); print("C"); signal(S);', 'P3:  wait(S); print("D");')}
${drill('Y1', 'Output nào dưới đây <strong>không thể</strong> xảy ra?', ['ACBD', 'ABCD', 'DACB', 'ACDB'], 'Lời giải từng bước', run('c165-banker-dia', 'python3 osgcalc.py sem') + '<p>Chương trình thử <em>mọi</em> cách xen kẽ. Chỉ có ba output hoàn chỉnh: ABCD, ACBD, ACDB. <strong>DACB không thể — C</strong>: nếu P3 lấy S trước và in D, P1 không bao giờ lấy được S nữa (chỉ P2 signal S, mà P2 chờ T, thứ chỉ P1 signal) — lần chạy đó treo vĩnh viễn sau khi in "D". Dạng câu này là một deadlock nhỏ đội lốt; khi phân vân, hãy liệt kê hết.</p>')}
${lab('sync', 'semaphore', 'vi', 'Semaphore là một bộ đếm giấy phép: wait lấy một cái hoặc chặn, signal trả lại một cái — đi từng bước và xem ai đang bị chặn.')}

<div class="pitfall co-tieu-de">
<p><strong>Viết "không an toàn" thành "đã deadlock".</strong> Ở B3 với một đơn vị rảnh, trạng thái không an toàn, nhưng chẳng ai bị deadlock — các tiến trình có thể không bao giờ xin tới mức tối đa. Banker từ chối <em>bước vào</em> trạng thái không an toàn vì không chứng minh được nó kết thúc tốt; phát hiện (B4) nói về trạng thái mà các tiến trình đã chặn nhau rồi. Lẫn hai khái niệm là mất điểm ở mọi đề; hãy giữ hai chữ đó tách biệt.</p>
</div>

<h3>Nếu bạn đã học OSG202 bài 5.2, 6.1 và 6.2</h3>
<p>🎓 ${g('osg202-6-2-banker', 'OSG202 6.2 — Banker')} · ${g('osg202-6-1-deadlock', 'OSG202 6.1 — deadlock')} · ${g('osg202-5-2-lap-lich-dia', 'OSG202 5.2 — lập lịch đĩa')} · ${g('osg202-final-exam-fe', 'OSG202 — luyện đề cuối kỳ')}</p>

<h3>🧪 Thực hành (45 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một đề cũ cho "Available (3,3,2), Allocation [[0,1,0],[2,0,0],[3,0,2],[2,1,1],[0,0,2]], Max [[7,5,3],[3,2,2],[9,0,2],[2,2,2],[4,3,3]]. Có an toàn không?" và "Đầu đọc ở 53, hàng đợi 98, 37, 14, 65, 67 — SSF di chuyển thế nào?"</p>
<ol>
<li>Giải câu Banker trên giấy bằng quy trình bốn dòng.</li>
<li>Kiểm bằng <code>python3 osgcalc.py banker "0,1,0 2,0,0 3,0,2 2,1,1 0,0,2" "7,5,3 3,2,2 9,0,2 2,2,2 4,3,3" "3,3,2"</code>.</li>
<li>Giải câu đĩa cho SSF và cho LOOK đi lên; kiểm bằng <code>python3 osgcalc.py disk sstf 53 "98 37 14 65 67"</code>.</li>
<li>Sửa Y1 để P3 làm <code>wait(T)</code> thay vì <code>wait(S)</code>; dự đoán các output, rồi kiểm bằng cách sửa <code>cmd_sem</code> trong <code>osgcalc.py</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> đáp án trên giấy khớp với chương trình và bạn nói được, cho từng câu, con số hay chữ nào lẽ ra là cái bẫy.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['Need = Max − Allocation', 'Thứ mỗi tiến trình còn có thể xin; đầu vào của vòng quét an toàn Banker.'],
  ['safe sequence (chuỗi an toàn)', 'Một thứ tự trong đó tiến trình nào cũng nhận đủ phần còn thiếu và chạy xong.'],
  ['Request matrix (ma trận Request)', 'Thứ mỗi tiến trình đang bị chặn để chờ; thuật toán phát hiện dùng nó thay cho Need.'],
  ['SSTF · SCAN · LOOK · C-SCAN · C-LOOK', 'Gần nhất trước · quét tới mép · quét tới yêu cầu cuối · quét một chiều kèm cú nhảy quay về.'],
  ['cylinder skew (độ lệch trụ)', 'Độ lệch của sector 0 giữa các track để đọc tuần tự tiếp diễn sau một lần seek sang track kề.'],
  ['semaphore', 'Bộ đếm với wait (lấy hoặc chặn) và signal (trả lại); signal có thể đến từ bất kỳ tiến trình nào.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>B1: Need trước; chuỗi an toàn &lt;P1, P2, P3, P4, P0&gt;; (1,0,1) của P4 bị từ chối vì không an toàn, (1,0,0) của P1 được cấp.</li>
<li>B2: x nhỏ nhất = 1 (Need ≤ Work tính cả dấu bằng). B3: rảnh 2 an toàn, rảnh 1 không an toàn. B4: cả bốn deadlock khi không gì rảnh, không ai khi rảnh một B.</li>
<li>Đĩa từ 80 đi lên: FCFS 708, SSTF 237, SCAN 306, LOOK 270, C-SCAN 385 (186 nếu không tính quay về), C-LOOK 325.</li>
<li>Độ lệch trụ ở 7.200 vòng/phút, 300 sector, seek 1 ms: 36 sector.</li>
<li>Output semaphore: liệt kê các cách xen kẽ — DACB không thể, và nhánh đó deadlock.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf', '📘', 'OSTEP — Common Concurrency Problems (PDF)', 'Điều kiện deadlock, phòng ngừa, tránh và phát hiện.', 'Mở')}
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf', '📘', 'OSTEP — Hard Disk Drives (PDF)', 'Seek, vòng quay, track skew và các thuật toán lập lịch đĩa.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.6 — Phỏng vấn (1/2) ───────────────────────── */
    {
      title: '16.6 — Interview track (1/2): processes, threads, scheduling, locks and memory — 20 questions with model answers|||16.6 — Phỏng vấn (1/2): tiến trình, luồng, lập lịch, khoá và bộ nhớ — 20 câu có câu trả lời mẫu',
      slug: 'os-16-1-cau-hoi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai mươi câu phỏng vấn backend/bảo mật kiểu thật (tiến trình vs luồng, fork, vì sao exit 137, zombie, PID 1, giá syscall và chuyển ngữ cảnh, CFS/nice, load average, Node phục vụ 10.000 kết nối, cỡ thread pool, race, mutex/semaphore, deadlock trong code và PostgreSQL, bộ nhớ ảo, page fault, malloc, "free" gần 0, OOM killer) — mỗi câu có câu trả lời mẫu kèm số đo của chính khoá, một câu hỏi nối tiếp có đáp án, và bài để ôn; kèm khung trả lời bốn bước.',
      content: `${G166}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.6</span>
<h2>Interview track (1/2): processes to memory</h2>
<p class="lead">Backend and security interviews ask operating-system questions not to test memory but to see whether you understand what your code costs and how it fails. "Why exit 137?", "fork or threads?", "how does Node handle 10,000 connections?" — every one of them has a textbook answer and a <em>measured</em> answer, and the measured one wins. The question of this lesson: <strong>for each of twenty classic questions, can you give a two-minute answer with a mechanism, a number you measured, and a trade-off — and survive the follow-up?</strong></p>

<h3>How to answer: four beats, two minutes</h3>
<ol>
<li><strong>Define</strong> in one sentence, in plain words.</li>
<li><strong>Mechanism:</strong> what the kernel actually does (the system call, the data structure).</li>
<li><strong>Number:</strong> one measurement you made and its unit — "about 1 µs per context switch on one core".</li>
<li><strong>Trade-off or consequence</strong> for a real system, then stop and let them ask the follow-up.</li>
</ol>
<p>Each question below is folded: say your answer out loud first, then open it. The model answers use the course’s real measurements; the follow-up is the question a good interviewer asks next; the links take you back to the lesson.</p>
<p>Two of the numbers you will quote most, as you measured them — a race with two threads, and the cost of creating work:</p>
${run('c51-race', './race 2 1000000')}
${run('c12-fork', 'gcc -O2 spawncost.c')}
${lab('process', 'oom137', 'en', 'The most common interview opener for backend roles — "why did my container exit with 137?" — as an animation: memory grows, the cgroup limit is hit, the kernel sends SIGKILL.')}

<h3>Processes and the kernel boundary</h3>
${ivList(IV1.slice(0, 6), 1, false)}

<h3>Threads, scheduling and concurrency models</h3>
${ivList(IV1.slice(6, 11), 7, false)}
${lab('threadpool', 'overload', 'en', 'For question 11: a pool with more arrivals than it can finish — the queue and the latency grow while throughput stays flat.')}

<h3>Races, locks and deadlock</h3>
${ivList(IV1.slice(11, 15), 12, false)}
${lab('race', 'deadlock', 'en', 'For questions 14–15: two locks taken in opposite order, step by step, until both threads wait forever.', { tour: 'race-deadlock' })}

<h3>Memory</h3>
${ivList(IV1.slice(15), 16, false)}
${lab('addr-split', 'x64', 'en', 'For the page-table questions: a 48-bit x86-64 address split 9/9/9/9/12. Count the levels a TLB miss walks, and why a sparse process needs only a few small tables.')}

<div class="pitfall co-tieu-de">
<p><strong>Answering the question you memorised instead of the one asked.</strong> "What happens when you call malloc?" is not "explain virtual memory" — the interviewer wants to hear "usually no system call", then brk/mmap, then lazy pages. Listen for the noun (malloc, fork, 137, load average), answer that first in one sentence, and only then widen. If you do not know, say what you would measure and how — "I would check /proc/PID/status and strace -c" is a good answer to almost any "why is it slow?".</p>
</div>

<h3>🧪 Practice (one hour, out loud)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you have a 45-minute technical interview for a backend internship on Friday. The interviewer is known to ask "explain it as if I were a new teammate".</p>
<ol>
<li>Pick five questions from this lesson at random. Answer each aloud with the four beats, recording yourself; keep each under two minutes.</li>
<li>Open the model answers. Note what you missed: the mechanism, the number, or the trade-off.</li>
<li>For every missed number, rerun its command in the lab (the lesson link names it).</li>
<li>Ask a friend to read you the follow-ups only, cold.</li>
</ol>
<p><strong>Done when:</strong> five recorded answers each contain a mechanism, a measured number with its unit and a trade-off, all under two minutes, and you answered at least three follow-ups without opening them.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['four-beat answer', 'Define · mechanism · number · trade-off — a structure that fits any OS interview question in two minutes.'],
  ['exit status 128 + N', 'How a shell reports a signal death: 130 SIGINT, 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM.'],
  ['Coffman conditions', 'Mutual exclusion, hold and wait, no preemption, circular wait — break one to prevent deadlock.'],
  ['overcommit', 'Linux grants more virtual memory than exists; the bill arrives on first touch, possibly to the OOM killer.'],
  ['oom_score_adj', 'A per-process bias from −1000 (never kill) to +1000 (kill first) used by the OOM killer.'],
  ['Little’s law', 'L = λ × W — the concurrency you need equals throughput times latency.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Answer in four beats: definition, mechanism, a measured number, a trade-off — then stop.</li>
<li>Processes own resources, threads share them; fork+exec 302.6 µs vs a thread 56.9 µs; 137 = SIGKILL, usually the OOM killer.</li>
<li>Context switch ~1 µs; nice only matters under contention; load average counts D-state tasks too.</li>
<li>Races lose updates (44 %); prevent deadlock with one lock order and timeouts; PostgreSQL detects and aborts one transaction.</li>
<li>Virtual memory, demand paging (65,539 faults for 256 MiB), lazy malloc and overcommit explain most "where did my memory go" questions.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fork.2.html', '📄', 'fork(2) — Linux manual page', 'What the child inherits, what it does not, and copy-on-write.', 'Open')}
${L('https://www.kernel.org/doc/html/latest/scheduler/sched-eevdf.html', '📄', 'EEVDF scheduler — kernel documentation', 'How Linux 6.6+ picks the next task.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.6</span>
<h2>Phỏng vấn (1/2): từ tiến trình tới bộ nhớ</h2>
<p class="lead">Phỏng vấn backend và bảo mật hỏi về hệ điều hành không phải để kiểm trí nhớ mà để xem bạn có hiểu mã của mình tốn gì và hỏng thế nào. "Vì sao exit 137?", "fork hay luồng?", "Node xử lý 10.000 kết nối thế nào?" — câu nào cũng có một câu trả lời sách vở và một câu trả lời <em>có số đo</em>, và câu có số đo thắng. Câu hỏi của bài: <strong>với mỗi câu trong hai mươi câu kinh điển, bạn có trả lời trong hai phút với một cơ chế, một con số mình đã đo, và một sự đánh đổi — rồi đứng vững trước câu hỏi nối tiếp không?</strong></p>

<h3>Cách trả lời: bốn nhịp, hai phút</h3>
<ol>
<li><strong>Định nghĩa</strong> trong một câu, bằng lời đời thường.</li>
<li><strong>Cơ chế:</strong> nhân thật sự làm gì (system call nào, cấu trúc dữ liệu nào).</li>
<li><strong>Con số:</strong> một phép đo bạn đã làm, kèm đơn vị — "khoảng 1 µs mỗi lần chuyển ngữ cảnh trên một lõi".</li>
<li><strong>Đánh đổi hay hệ quả</strong> cho một hệ thống thật, rồi dừng lại để họ hỏi tiếp.</li>
</ol>
<p>Mỗi câu dưới đây được gập lại: hãy nói to câu trả lời của bạn trước, rồi mới mở. Câu trả lời mẫu dùng số đo thật của khoá; câu hỏi nối tiếp là câu một người phỏng vấn giỏi sẽ hỏi tiếp; link đưa bạn về bài học.</p>
<p>Hai con số bạn sẽ trích nhiều nhất, đúng như bạn đã đo — một race với hai luồng, và cái giá của việc tạo ra việc:</p>
${run('c51-race', './race 2 1000000')}
${run('c12-fork', 'gcc -O2 spawncost.c')}
${lab('process', 'oom137', 'vi', 'Câu mở màn phổ biến nhất của phỏng vấn backend — "vì sao container của tôi thoát với 137?" — thành hoạt cảnh: bộ nhớ tăng, chạm giới hạn cgroup, nhân gửi SIGKILL.')}

<h3>Tiến trình và ranh giới nhân</h3>
${ivList(IV1.slice(0, 6), 1, true)}

<h3>Luồng, lập lịch và mô hình đồng thời</h3>
${ivList(IV1.slice(6, 11), 7, true)}
${lab('threadpool', 'overload', 'vi', 'Cho câu 11: một pool có lượng việc tới nhiều hơn số nó làm xong — hàng đợi và độ trễ tăng trong khi thông lượng đứng yên.')}

<h3>Race, khoá và deadlock</h3>
${ivList(IV1.slice(11, 15), 12, true)}
${lab('race', 'deadlock', 'vi', 'Cho câu 14–15: hai khoá lấy theo thứ tự ngược nhau, từng bước, tới khi cả hai luồng chờ mãi.', { tour: 'race-deadlock' })}

<h3>Bộ nhớ</h3>
${ivList(IV1.slice(15), 16, true)}
${lab('addr-split', 'x64', 'vi', 'Cho các câu về bảng trang: địa chỉ 48 bit x86-64 tách 9/9/9/9/12. Đếm số mức một lần trượt TLB phải đi, và vì sao một tiến trình thưa chỉ cần vài bảng nhỏ.')}

<div class="pitfall co-tieu-de">
<p><strong>Trả lời câu mình đã học thuộc thay vì câu được hỏi.</strong> "Chuyện gì xảy ra khi bạn gọi malloc?" không phải "giải thích bộ nhớ ảo" — người phỏng vấn muốn nghe "thường không có system call", rồi brk/mmap, rồi trang được cấp lười. Hãy nghe danh từ chính (malloc, fork, 137, load average), trả lời đúng nó trước trong một câu, rồi mới mở rộng. Nếu không biết, hãy nói bạn sẽ đo gì và đo thế nào — "tôi sẽ xem /proc/PID/status và strace -c" là câu trả lời tốt cho gần như mọi câu "vì sao nó chậm?".</p>
</div>

<h3>🧪 Thực hành (một giờ, nói thành tiếng)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> thứ Sáu bạn có buổi phỏng vấn kỹ thuật 45 phút cho vị trí thực tập backend. Người phỏng vấn nổi tiếng hay hỏi "giải thích như thể tôi là đồng nghiệp mới".</p>
<ol>
<li>Chọn ngẫu nhiên năm câu trong bài. Trả lời to từng câu theo bốn nhịp, ghi âm lại; mỗi câu dưới hai phút.</li>
<li>Mở câu trả lời mẫu. Ghi lại thứ bạn bỏ sót: cơ chế, con số, hay sự đánh đổi.</li>
<li>Với mỗi con số bị sót, chạy lại lệnh của nó trong lab (link bài có ghi).</li>
<li>Nhờ một người bạn chỉ đọc cho bạn các câu hỏi nối tiếp, không báo trước.</li>
</ol>
<p><strong>Đạt khi:</strong> năm câu trả lời đã ghi âm đều có một cơ chế, một con số đã đo kèm đơn vị và một sự đánh đổi, đều dưới hai phút, và bạn trả lời được ít nhất ba câu hỏi nối tiếp mà không mở đáp án.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['four-beat answer (câu trả lời bốn nhịp)', 'Định nghĩa · cơ chế · con số · đánh đổi — khung vừa cho mọi câu phỏng vấn OS trong hai phút.'],
  ['exit status 128 + N (mã thoát 128 + N)', 'Cách shell báo một tiến trình chết vì tín hiệu: 130 SIGINT, 137 SIGKILL, 139 SIGSEGV, 143 SIGTERM.'],
  ['điều kiện Coffman', 'Loại trừ lẫn nhau, giữ và chờ, không cưỡng đoạt, chờ vòng — phá một cái là ngăn được deadlock.'],
  ['overcommit', 'Linux cấp nhiều bộ nhớ ảo hơn thực có; hoá đơn tới ở lần chạm đầu, có thể tới tay OOM killer.'],
  ['oom_score_adj', 'Độ lệch cho từng tiến trình từ −1000 (không bao giờ giết) tới +1000 (giết trước) mà OOM killer dùng.'],
  ['Little’s law (định luật Little)', 'L = λ × W — mức đồng thời cần có bằng thông lượng nhân độ trễ.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trả lời theo bốn nhịp: định nghĩa, cơ chế, một con số đã đo, một sự đánh đổi — rồi dừng.</li>
<li>Tiến trình sở hữu tài nguyên, luồng dùng chung chúng; fork+exec 302,6 µs so với một luồng 56,9 µs; 137 = SIGKILL, thường là OOM killer.</li>
<li>Chuyển ngữ cảnh ~1 µs; nice chỉ có nghĩa khi tranh chấp; load average đếm cả tác vụ trạng thái D.</li>
<li>Race làm mất cập nhật (44 %); ngăn deadlock bằng một thứ tự khoá và timeout; PostgreSQL phát hiện và huỷ một giao dịch.</li>
<li>Bộ nhớ ảo, nạp trang theo yêu cầu (65.539 fault cho 256 MiB), malloc lười và overcommit giải thích phần lớn câu hỏi "bộ nhớ của tôi đi đâu".</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/fork.2.html', '📄', 'fork(2) — Linux manual page', 'Con thừa hưởng gì, không thừa hưởng gì, và copy-on-write.', 'Mở')}
${L('https://www.kernel.org/doc/html/latest/scheduler/sched-eevdf.html', '📄', 'EEVDF scheduler — tài liệu nhân', 'Linux 6.6+ chọn tác vụ kế tiếp thế nào.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.7 — Phỏng vấn (2/2) ───────────────────────── */
    {
      title: '16.7 — Interview track (2/2): files, I/O, system calls, containers, security and incident stories — 20 questions|||16.7 — Phỏng vấn (2/2): file, I/O, lời gọi hệ thống, container, bảo mật và câu chuyện sự cố — 20 câu',
      slug: 'os-16-3-su-co',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai mươi câu phỏng vấn nửa sau của khoá: gõ URL rồi Enter nhìn từ hệ điều hành, fd và EMFILE, inode/link và sed -i qua bind mount, write() chưa phải đã lên đĩa, df đầy mà du trống, select/poll/epoll, luồng hay event loop cho 10.000 kết nối, io_uring, tìm vì sao tiến trình treo, vDSO, container thật ra là gì, container vs máy ảo, docker.sock và --privileged, cgroup giới hạn bộ nhớ/CPU, seccomp, tràn bộ đệm và các lớp phòng vệ, setuid và capability, npm install chậm trên Mac, tắt êm khi SIGTERM, và kể một sự cố theo STAR — mỗi câu có câu trả lời mẫu kèm số đo, câu hỏi nối tiếp và bài để ôn.',
      content: `${G167}
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Lesson 16.7</span>
<h2>Interview track (2/2): files to incidents</h2>
<p class="lead">The second half of an OS interview for backend or security roles moves from "how does it work" to "what goes wrong in production": full disks, hung processes, containers that escape, servers that do not shut down. Interviewers also love one open question — "what happens when you type a URL?" — because it lets you show how far down the stack you can go. The question of this lesson: <strong>can you walk from a symptom to the mechanism to the fix, with numbers, and end with a story of your own?</strong></p>

<h3>The numbers behind these answers</h3>
<p>Two measurements carry several of the answers below — a thread per connection at 10,000 connections, and a server that ignores SIGTERM:</p>
${run('c104-c10k', './c10k.sh echo-thread 10000 1000', 2, { max: 13 })}
${run('c15-pid1', 'docker stop os-p1a', 2)}
${lab('epoll', 'c10k', 'en', 'Questions 26–27 in one picture: threads vs one epoll loop at 1k, 5k and 10k connections — threads, memory, kernel stacks, context switches, p99.', { tour: 'epoll-c10k' })}

<h3>From a URL to a file on disk</h3>
${ivList(IV2.slice(0, 5), 21, false)}

<h3>I/O and the kernel boundary</h3>
${ivList(IV2.slice(5, 10), 26, false)}

<h3>Containers</h3>
${ivList(IV2.slice(10, 14), 31, false)}
${lab('nslayers', 'docker', 'en', 'For questions 31–33: switch namespaces on one by one and see what the container can still see of the host.', { tour: 'nslayers-views' })}

<h3>Security and operations</h3>
${ivList(IV2.slice(14), 35, false)}

<div class="pitfall co-tieu-de">
<p><strong>Telling an incident story without a number or without your own action.</strong> "There was a memory problem and we restarted it" says nothing about you. Interviewers listen for what <em>you</em> measured, what you concluded, what you changed, and how you knew it worked: "RSS climbed 18 MiB every 2 s to the 192 MiB limit; docker events showed oom and die 137; the cache key included a random parameter; after keying by product id and capping at 500 entries RSS stayed at 68 MiB through 75 s of traffic." If your only incidents are from this course, say so — a lab incident told precisely beats a vague real one.</p>
</div>

<h3>🧪 Practice (one hour, out loud)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the second round of your interview is with the platform team; they warned you there will be one open question and one incident story.</p>
<ol>
<li>Answer question 21 ("type a URL") aloud in three minutes, naming at least five system calls or kernel structures on the way.</li>
<li>Pick three more questions at random; answer with the four beats of 16.6; record yourself.</li>
<li>Prepare question 40 with your own incident from 17.3: two numbers, one action, one result.</li>
<li>Have a friend ask only the follow-ups; answer without opening them.</li>
</ol>
<p><strong>Done when:</strong> your URL answer names at least five concrete mechanisms in order, three recorded answers each hold a measured number, and your incident story is under two minutes with a number in the problem and in the result.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['open-file description', 'The kernel object behind an fd (offset, flags), shared after dup and fork.'],
  ['readiness vs completion', 'epoll tells you an fd is ready to read; io_uring tells you an operation has finished.'],
  ['debug container', 'A throwaway container joined to a target’s namespaces with the tools it lacks: <code>--pid=container:X</code>.'],
  ['privileged container', 'All capabilities and devices; effectively root on the host — never for application workloads.'],
  ['seccomp profile', 'The list of system calls a container may make; Docker’s default blocks dozens.'],
  ['graceful shutdown', 'On SIGTERM: stop accepting, drain, close, exit 0 before SIGKILL arrives.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>"Type a URL" is a tour of sockets, fds, epoll, the page cache and TCP — name the mechanisms in order.</li>
<li>fd leaks show up as EMFILE; deleted-but-open files fill disks; write() is not durable until fsync (~880 µs).</li>
<li>epoll scales (0.72 µs at 10,000 fds); a thread per connection costs 10,001 threads and +156 MiB of kernel stacks at 10k.</li>
<li>A container is a process with namespaces and a cgroup on a shared kernel; --privileged and docker.sock break it.</li>
<li>Seccomp, capabilities, canaries and graceful SIGTERM handling are what security and platform teams ask about — with your own measurements.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/socket.7.html', '📄', 'socket(7) — Linux manual page', 'Socket options, the backlog and what a socket fd really is.', 'Open')}
${L('https://docs.docker.com/engine/security/', '📄', 'Docker Engine security — Docker docs', 'Namespaces, cgroups, capabilities, seccomp and the daemon attack surface.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 16 · Bài 16.7</span>
<h2>Phỏng vấn (2/2): từ file tới sự cố</h2>
<p class="lead">Nửa sau của một buổi phỏng vấn OS cho vị trí backend hay bảo mật chuyển từ "nó hoạt động thế nào" sang "điều gì hỏng ở production": đĩa đầy, tiến trình treo, container thoát ra ngoài, máy chủ không chịu tắt. Người phỏng vấn còn rất thích một câu mở — "chuyện gì xảy ra khi bạn gõ một URL?" — vì nó cho bạn thể hiện mình đi sâu xuống chồng hệ thống tới đâu. Câu hỏi của bài: <strong>bạn có đi từ triệu chứng tới cơ chế tới cách sửa, kèm con số, và kết thúc bằng một câu chuyện của chính mình không?</strong></p>

<h3>Những con số đứng sau các câu trả lời này</h3>
<p>Hai phép đo gánh nhiều câu trả lời bên dưới — mỗi kết nối một luồng ở 10.000 kết nối, và một máy chủ phớt lờ SIGTERM:</p>
${run('c104-c10k', './c10k.sh echo-thread 10000 1000', 2, { max: 13 })}
${run('c15-pid1', 'docker stop os-p1a', 2)}
${lab('epoll', 'c10k', 'vi', 'Câu 26–27 trong một hình: luồng so với một vòng epoll ở 1k, 5k và 10k kết nối — số luồng, bộ nhớ, stack nhân, chuyển ngữ cảnh, p99.', { tour: 'epoll-c10k' })}

<h3>Từ một URL tới một file trên đĩa</h3>
${ivList(IV2.slice(0, 5), 21, true)}

<h3>I/O và ranh giới nhân</h3>
${ivList(IV2.slice(5, 10), 26, true)}

<h3>Container</h3>
${ivList(IV2.slice(10, 14), 31, true)}
${lab('nslayers', 'docker', 'vi', 'Cho câu 31–33: bật từng namespace và xem container còn thấy được gì của máy chủ.', { tour: 'nslayers-views' })}

<h3>Bảo mật và vận hành</h3>
${ivList(IV2.slice(14), 35, true)}

<div class="pitfall co-tieu-de">
<p><strong>Kể chuyện sự cố mà không có con số hay không có hành động của chính mình.</strong> "Có vấn đề bộ nhớ và bọn em khởi động lại" chẳng nói gì về bạn. Người phỏng vấn lắng nghe xem <em>bạn</em> đã đo gì, kết luận gì, đổi gì, và làm sao biết nó hiệu quả: "RSS tăng 18 MiB mỗi 2 s tới giới hạn 192 MiB; docker events cho thấy oom và die 137; khoá cache chứa một tham số ngẫu nhiên; sau khi lấy khoá theo mã sản phẩm và đặt trần 500 mục, RSS giữ ở 68 MiB suốt 75 s tải." Nếu sự cố duy nhất của bạn đến từ khoá học này, hãy nói thẳng — một sự cố trong lab được kể chính xác thắng một sự cố thật được kể mơ hồ.</p>
</div>

<h3>🧪 Thực hành (một giờ, nói thành tiếng)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> vòng hai của buổi phỏng vấn là với nhóm hạ tầng; họ báo trước sẽ có một câu hỏi mở và một câu chuyện sự cố.</p>
<ol>
<li>Trả lời câu 21 ("gõ một URL") thành tiếng trong ba phút, gọi tên ít nhất năm system call hay cấu trúc của nhân trên đường đi.</li>
<li>Chọn ngẫu nhiên ba câu nữa; trả lời theo bốn nhịp của 16.6; ghi âm lại.</li>
<li>Chuẩn bị câu 40 bằng sự cố của chính bạn ở 17.3: hai con số, một hành động, một kết quả.</li>
<li>Nhờ một người bạn chỉ hỏi các câu nối tiếp; trả lời mà không mở đáp án.</li>
</ol>
<p><strong>Đạt khi:</strong> câu trả lời về URL gọi tên ít nhất năm cơ chế cụ thể theo đúng thứ tự, ba câu trả lời đã ghi âm đều có một con số đã đo, và câu chuyện sự cố dưới hai phút với một con số ở vấn đề và một ở kết quả.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['open-file description (mô tả file đang mở)', 'Đối tượng của nhân đứng sau một fd (vị trí, cờ), được dùng chung sau dup và fork.'],
  ['readiness vs completion (sẵn sàng và hoàn tất)', 'epoll báo một fd đã sẵn sàng để đọc; io_uring báo một thao tác đã xong.'],
  ['debug container (container gỡ lỗi)', 'Một container vứt đi gia nhập namespace của mục tiêu, mang theo công cụ mà mục tiêu không có: <code>--pid=container:X</code>.'],
  ['privileged container (container đặc quyền)', 'Mọi capability và mọi thiết bị; thực chất là root của máy chủ — không bao giờ dùng cho ứng dụng.'],
  ['seccomp profile (hồ sơ seccomp)', 'Danh sách system call một container được gọi; hồ sơ mặc định của Docker chặn hàng chục cái.'],
  ['graceful shutdown (tắt êm)', 'Khi SIGTERM: thôi nhận, làm nốt, đóng, thoát 0 trước khi SIGKILL tới.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>"Gõ một URL" là một chuyến tham quan socket, fd, epoll, page cache và TCP — gọi tên các cơ chế theo đúng thứ tự.</li>
<li>Rò fd lộ ra thành EMFILE; file đã xoá mà vẫn mở làm đầy đĩa; write() chưa bền cho tới fsync (~880 µs).</li>
<li>epoll mở rộng được (0,72 µs ở 10.000 fd); mỗi kết nối một luồng tốn 10.001 luồng và thêm 156 MiB stack nhân ở 10k.</li>
<li>Container là một tiến trình có namespace và cgroup trên một nhân dùng chung; --privileged và docker.sock phá vỡ nó.</li>
<li>Seccomp, capability, canary và xử lý SIGTERM êm là những gì nhóm bảo mật và hạ tầng hỏi — kèm số đo của chính bạn.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/socket.7.html', '📄', 'socket(7) — Linux manual page', 'Tuỳ chọn socket, backlog và một fd socket thật ra là gì.', 'Mở')}
${L('https://docs.docker.com/engine/security/', '📄', 'Docker Engine security — tài liệu Docker', 'Namespace, cgroup, capability, seccomp và bề mặt tấn công của daemon.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 16.8 — Bài thi cuối khoá ───────────────────────── */
    {
      title: '16.8 — Final exam: the whole course in 20 questions (and every chapter check in one place)|||16.8 — Thi cuối khoá: cả khoá trong 20 câu (và mọi bài kiểm tra chương ở một chỗ)',
      slug: 'os-16-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Bài thi cuối khoá 20 câu, 30 phút: mười câu tính toán kiểu đề OSG202 (FCFS, RR, SRTF, LRU/OPT, tách địa chỉ, cỡ bảng trang, TLB, Banker, SSTF — mọi đáp số chạy thật bằng osgcalc.py và đối chiếu bằng bộ máy /os-lab) và mười câu tình huống backend/bảo mật (143, zombie, race, thứ tự khoá, free vs available, write chưa bền, epoll, PID namespace, seccomp 159, Belady); kèm mục lục bài kiểm tra 10 câu của từng chương.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 16 · Final exam</span>
<h2>Final exam: the whole course in 20 questions</h2>
<p class="lead">Twenty questions, thirty minutes. The first ten are computations in the style of the OSG202 final — have paper ready; every answer was produced by <code>osgcalc.py</code> in the lab and confirmed by the /os-lab engine. The last ten are situations from backend and security work, each tied to something you measured. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can draw a Gantt chart for FCFS, SJF, SRTF, priority and round robin and compute turnaround and waiting times.</li>
<li>I can run FIFO, LRU, OPT and Clock on a reference string and split a virtual address into its fields.</li>
<li>I can run the Banker safety algorithm and the disk-scheduling algorithms by hand.</li>
<li>I can read an exit code as 128 + N and connect it to a cause.</li>
<li>I can explain each measured number of the 16.2 table and the mechanism behind it.</li>
</ul>
<h3>Every chapter check in one place</h3>
<table>
<tr><th>Chapter</th><th>Check (10 questions each)</th><th>What it tests</th></tr>
<tr><td>Section 0</td><td>${a('os-0-7-quiz', '0.7 — Section 0 check')}</td><td>the OS’s jobs, the lab, just enough C</td></tr>
<tr><td>1 Processes</td><td>${a('os-1-6-quiz', '1.6 — Chapter 1 check')}</td><td>fork/exec/wait, modes, signals, exit codes, PID 1</td></tr>
<tr><td>2 Observing Linux</td><td>${a('os-2-8-quiz', '2.8 — Chapter 2 check')}</td><td>USE method, top, free/available, df/du, ss/lsof, logs</td></tr>
<tr><td>3 Threads and scheduling</td><td>${a('os-3-6-quiz', '3.6 — Chapter 3 check')}</td><td>threads, CFS/nice, context switches, CPU limits, event loop</td></tr>
<tr><td>4 Concurrent programs</td><td>${a('os-4-9-quiz', '4.9 — Chapter 4 check')}</td><td>pthreads, Java, Node, Python GIL, Amdahl, false sharing</td></tr>
<tr><td>5 Synchronization</td><td>${a('os-5-5-quiz', '5.5 — Chapter 5 check')}</td><td>races, mutexes, semaphores, atomics, backend locking</td></tr>
<tr><td>6 Deadlock</td><td>${a('os-6-5-quiz', '6.5 — Chapter 6 check')}</td><td>Coffman, livelock, priority inversion, classic problems, Banker</td></tr>
<tr><td>7 Virtual memory</td><td>${a('os-7-5-quiz', '7.5 — Chapter 7 check')}</td><td>address spaces, paging, TLB, page faults, allocators</td></tr>
<tr><td>8 Memory pressure</td><td>${a('os-8-6-quiz', '8.6 — Chapter 8 check')}</td><td>page cache, swap, OOM killer, exit 137, limits</td></tr>
<tr><td>9 File systems</td><td>${a('os-9-8-quiz', '9.8 — Chapter 9 check')}</td><td>inodes, fds, fsync, journaling, mounts, permissions</td></tr>
<tr><td>10 I/O models</td><td>${a('os-10-9-quiz', '10.9 — Chapter 10 check')}</td><td>sockets, epoll, C10K, io_uring, backpressure</td></tr>
<tr><td>11 System calls</td><td>${a('os-11-8-quiz', '11.8 — Chapter 11 check')}</td><td>the trap, strace, vDSO, errno and signals, /proc, seccomp</td></tr>
<tr><td>12 Containers</td><td>${a('os-12-8-quiz', '12.8 — Chapter 12 check')}</td><td>namespaces, cgroups, OverlayFS, runc, networking</td></tr>
<tr><td>13 Security</td><td>${a('os-13-5-quiz', '13.5 — Chapter 13 check')}</td><td>stack frames, overflow mitigations, privilege, hardening</td></tr>
<tr><td>14 Windows and macOS</td><td>${a('os-14-9-quiz', '14.9 — Chapter 14 check')}</td><td>three kernels, signals, memory, file systems, portability</td></tr>
<tr><td>15 Observing and tuning</td><td>${a('os-15-1-perf', 'at the end of Chapter 15')}</td><td>perf, eBPF, sysctl, a tuning method</td></tr>
<tr><td>17 Capstone</td><td>${a('os-17-6-quiz', '17.6 — Chapter 17 check')}</td><td>the four projects: shell, server, incidents, runtime</td></tr>
</table>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 16 · Thi cuối khoá</span>
<h2>Thi cuối khoá: cả khoá trong 20 câu</h2>
<p class="lead">Hai mươi câu, ba mươi phút. Mười câu đầu là tính toán theo kiểu đề cuối kỳ OSG202 — chuẩn bị giấy; mọi đáp số do <code>osgcalc.py</code> tạo ra trong lab và được bộ máy /os-lab xác nhận. Mười câu sau là tình huống trong công việc backend và bảo mật, mỗi câu gắn với một thứ bạn đã đo. Mỗi lời giải đều nói vì sao đáp án đúng là đúng và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi vẽ được biểu đồ Gantt cho FCFS, SJF, SRTF, ưu tiên và round robin và tính được thời gian hoàn thành, thời gian chờ.</li>
<li>Tôi chạy được FIFO, LRU, OPT và Clock trên một chuỗi tham chiếu và tách được một địa chỉ ảo thành các trường.</li>
<li>Tôi chạy tay được thuật toán an toàn Banker và các thuật toán lập lịch đĩa.</li>
<li>Tôi đọc được mã thoát là 128 + N và nối nó với một nguyên nhân.</li>
<li>Tôi giải thích được từng con số đã đo trong bảng của 16.2 và cơ chế đứng sau nó.</li>
</ul>
<h3>Mọi bài kiểm tra chương ở một chỗ</h3>
<table>
<tr><th>Chương</th><th>Bài kiểm tra (mỗi bài 10 câu)</th><th>Kiểm gì</th></tr>
<tr><td>Mục 0</td><td>${a('os-0-7-quiz', '0.7 — Kiểm tra Mục 0')}</td><td>việc của hệ điều hành, phòng lab, vừa đủ C</td></tr>
<tr><td>1 Tiến trình</td><td>${a('os-1-6-quiz', '1.6 — Kiểm tra Chương 1')}</td><td>fork/exec/wait, chế độ, tín hiệu, mã thoát, PID 1</td></tr>
<tr><td>2 Quan sát Linux</td><td>${a('os-2-8-quiz', '2.8 — Kiểm tra Chương 2')}</td><td>phương pháp USE, top, free/available, df/du, ss/lsof, nhật ký</td></tr>
<tr><td>3 Luồng và lập lịch</td><td>${a('os-3-6-quiz', '3.6 — Kiểm tra Chương 3')}</td><td>luồng, CFS/nice, chuyển ngữ cảnh, giới hạn CPU, event loop</td></tr>
<tr><td>4 Chương trình đồng thời</td><td>${a('os-4-9-quiz', '4.9 — Kiểm tra Chương 4')}</td><td>pthreads, Java, Node, GIL của Python, Amdahl, false sharing</td></tr>
<tr><td>5 Đồng bộ</td><td>${a('os-5-5-quiz', '5.5 — Kiểm tra Chương 5')}</td><td>race, mutex, semaphore, atomic, khoá trong backend</td></tr>
<tr><td>6 Deadlock</td><td>${a('os-6-5-quiz', '6.5 — Kiểm tra Chương 6')}</td><td>Coffman, livelock, đảo ngược ưu tiên, bài toán kinh điển, Banker</td></tr>
<tr><td>7 Bộ nhớ ảo</td><td>${a('os-7-5-quiz', '7.5 — Kiểm tra Chương 7')}</td><td>không gian địa chỉ, phân trang, TLB, page fault, bộ cấp phát</td></tr>
<tr><td>8 Áp lực bộ nhớ</td><td>${a('os-8-6-quiz', '8.6 — Kiểm tra Chương 8')}</td><td>page cache, swap, OOM killer, exit 137, giới hạn</td></tr>
<tr><td>9 Hệ thống file</td><td>${a('os-9-8-quiz', '9.8 — Kiểm tra Chương 9')}</td><td>inode, fd, fsync, journaling, mount, quyền</td></tr>
<tr><td>10 Mô hình I/O</td><td>${a('os-10-9-quiz', '10.9 — Kiểm tra Chương 10')}</td><td>socket, epoll, C10K, io_uring, backpressure</td></tr>
<tr><td>11 Lời gọi hệ thống</td><td>${a('os-11-8-quiz', '11.8 — Kiểm tra Chương 11')}</td><td>cái bẫy, strace, vDSO, errno và tín hiệu, /proc, seccomp</td></tr>
<tr><td>12 Container</td><td>${a('os-12-8-quiz', '12.8 — Kiểm tra Chương 12')}</td><td>namespace, cgroup, OverlayFS, runc, mạng</td></tr>
<tr><td>13 Bảo mật</td><td>${a('os-13-5-quiz', '13.5 — Kiểm tra Chương 13')}</td><td>khung stack, lớp phòng vệ tràn bộ đệm, đặc quyền, cứng hoá</td></tr>
<tr><td>14 Windows và macOS</td><td>${a('os-14-9-quiz', '14.9 — Kiểm tra Chương 14')}</td><td>ba nhân, tín hiệu, bộ nhớ, hệ thống file, code chạy mọi nơi</td></tr>
<tr><td>15 Quan sát và tinh chỉnh</td><td>${a('os-15-1-perf', 'ở cuối Chương 15')}</td><td>perf, eBPF, sysctl, một phương pháp tinh chỉnh</td></tr>
<tr><td>17 Dự án cuối khoá</td><td>${a('os-17-6-quiz', '17.6 — Kiểm tra Chương 17')}</td><td>bốn dự án: shell, máy chủ, sự cố, runtime</td></tr>
</table>
</div>
`,
      quiz: {
        timeLimitSeconds: 1800,
        questions: [
          { question: 'Four jobs arrive at time 0 in the order A, B, C, D with CPU bursts 5, 9, 2, 4. What is the average waiting time under <strong>FCFS</strong>?|||Bốn việc đến lúc 0 theo thứ tự A, B, C, D với thời gian CPU 5, 9, 2, 4. Thời gian chờ trung bình theo <strong>FCFS</strong> là bao nhiêu?',
            options: ['13.75|||13,75', '8.75|||8,75', '4.75|||4,75', '9.75|||9,75'], correctIndex: 1, points: 1,
            explanation: 'EN: FCFS runs A 0–5, B 5–14, C 14–16, D 16–20; waits 0 + 5 + 14 + 16 = 35, average 8.75 (osgcalc.py, c168). 13.75 is the average turnaround; 4.75 and 9.75 are SJF’s waiting and turnaround (C, D, A, B) — right numbers for the wrong question.|||VI: FCFS chạy A 0–5, B 5–14, C 14–16, D 16–20; chờ 0 + 5 + 14 + 16 = 35, trung bình 8,75 (osgcalc.py, c168). 13,75 là turnaround trung bình; 4,75 và 9,75 là thời gian chờ và turnaround của SJF (C, D, A, B) — đúng số nhưng sai câu hỏi.' },
          { question: 'P1, P2, P3 arrive at 0, 1, 2 with bursts 6, 4, 2. Round robin, quantum 3 (a job arriving when another’s quantum expires queues first). What is P2’s turnaround time?|||P1, P2, P3 đến lúc 0, 1, 2 với thời gian CPU 6, 4, 2. Round robin, quantum 3 (việc đến đúng lúc quantum của việc khác hết thì xếp trước). Turnaround của P2 là bao nhiêu?',
            options: ['12|||12', '7|||7', '11|||11', '9|||9'], correctIndex: 2, points: 1,
            explanation: 'EN: Gantt: P1 0–3, P2 3–6, P3 6–8, P1 8–11, P2 11–12. P2 finishes at 12 and arrived at 1: turnaround 11. 12 (A) is the finish time, 7 (B) its waiting time.|||VI: Gantt: P1 0–3, P2 3–6, P3 6–8, P1 8–11, P2 11–12. P2 xong lúc 12 và đến lúc 1: turnaround 11. 12 (A) là thời điểm xong, 7 (B) là thời gian chờ của nó.' },
          { question: 'P1–P4 arrive at 0, 2, 3, 5 with bursts 6, 2, 8, 3. What is the average waiting time under <strong>SRTF</strong>?|||P1–P4 đến lúc 0, 2, 3, 5 với thời gian CPU 6, 2, 8, 3. Thời gian chờ trung bình theo <strong>SRTF</strong> là bao nhiêu?',
            options: ['3.25|||3,25', '8|||8', '4.75|||4,75', '2.5|||2,5'], correctIndex: 0, points: 1,
            explanation: 'EN: P1 0–2; P2 (2) preempts P1 (remaining 4) at 2, runs 2–4; P1 4–8 (P4 with 3 arrives at 5 but P1’s remaining 3 at that moment ties and P1 keeps the CPU by earlier arrival); P4 8–11; P3 11–19. Waits 2, 0, 8, 3 → 13 / 4 = 3.25. 8 (B) is the average turnaround.|||VI: P1 0–2; P2 (2) giành CPU của P1 (còn 4) lúc 2, chạy 2–4; P1 4–8 (P4 cần 3 đến lúc 5 nhưng phần còn lại của P1 lúc đó cũng là 3, hoà, và P1 giữ CPU vì đến sớm hơn); P4 8–11; P3 11–19. Chờ 2, 0, 8, 3 → 13 / 4 = 3,25. 8 (B) là turnaround trung bình.' },
          { question: 'Reference string 1 3 5 2 3 1 4 5 2 3 6 2, <strong>4 frames</strong>, initially empty. How many page faults with <strong>LRU</strong>?|||Chuỗi tham chiếu 1 3 5 2 3 1 4 5 2 3 6 2, <strong>4 khung</strong>, ban đầu trống. Có bao nhiêu lỗi trang với <strong>LRU</strong>?',
            options: ['6|||6', '7|||7', '10|||10', '9|||9'], correctIndex: 3, points: 1,
            explanation: 'EN: LRU faults on 1, 3, 5, 2, then 4 (evicts 5), 5 (evicts 2), 2 (evicts 3), 3 (evicts 1), 6 (evicts 4): 9. 6 (A) is what FIFO gets on the same string with 4 frames (measured in c168) — LRU is not always better than FIFO.|||VI: LRU lỗi ở 1, 3, 5, 2, rồi 4 (đuổi 5), 5 (đuổi 2), 2 (đuổi 3), 3 (đuổi 1), 6 (đuổi 4): 9. 6 (A) là số FIFO đạt trên cùng chuỗi với 4 khung (đo ở c168) — LRU không phải lúc nào cũng tốt hơn FIFO.' },
          { question: 'Same string, <strong>3 frames</strong>, <strong>OPT</strong>. How many page faults?|||Cùng chuỗi đó, <strong>3 khung</strong>, <strong>OPT</strong>. Có bao nhiêu lỗi trang?',
            options: ['6|||6', '7|||7', '8|||8', '9|||9'], correctIndex: 1, points: 1,
            explanation: 'EN: Faults on 1, 3, 5, 2 (evicts 5, used latest among 1, 3, 5), 4 (evicts 1, never used again), 5 (evicts 4), 6 (evicts 5): 7. OPT is the lower bound; any answer below it (A) is impossible for a real algorithm.|||VI: Lỗi ở 1, 3, 5, 2 (đuổi 5, cái được dùng muộn nhất trong 1, 3, 5), 4 (đuổi 1, không bao giờ dùng lại), 5 (đuổi 4), 6 (đuổi 5): 7. OPT là cận dưới; đáp án nào thấp hơn nó (A) là bất khả với một thuật toán thật.' },
          { question: 'A 32-bit virtual address is split into an 8-bit top-level field, a 12-bit second-level field and a 12-bit offset. For VA 0xABCDE123, what are PT1, PT2 and the offset (decimal)?|||Một địa chỉ ảo 32 bit được chia thành trường cấp trên 8 bit, trường cấp hai 12 bit và offset 12 bit. Với VA 0xABCDE123, PT1, PT2 và offset (thập phân) là bao nhiêu?',
            options: ['687, 222, 291|||687, 222, 291', '171, 3294, 123|||171, 3294, 123', '171, 3294, 291|||171, 3294, 291', '43, 3294, 291|||43, 3294, 291'], correctIndex: 2, points: 1,
            explanation: 'EN: 8/12/12 falls on hex-digit boundaries: 0xAB = 171, 0xCDE = 3294, 0x123 = 291. A is the same address split 10/10/12 (687, 222 — computed in c168): the bit widths decide everything. B reads 0x123 as decimal 123.|||VI: 8/12/12 rơi đúng ranh giới chữ số hex: 0xAB = 171, 0xCDE = 3294, 0x123 = 291. A là cùng địa chỉ đó tách 10/10/12 (687, 222 — tính ở c168): độ rộng bit quyết định tất cả. B đọc 0x123 thành số thập phân 123.' },
          { question: 'A system has 32-bit virtual addresses, 4 KiB pages and 4-byte page-table entries. How large is a single-level page table per process?|||Một hệ thống có địa chỉ ảo 32 bit, trang 4 KiB và mục bảng trang 4 byte. Bảng trang một cấp cho mỗi tiến trình lớn bao nhiêu?',
            options: ['4 MiB|||4 MiB', '2 MiB|||2 MiB', '1 MiB|||1 MiB', '4 KiB|||4 KiB'], correctIndex: 0, points: 1,
            explanation: 'EN: 12 offset bits leave 20 bits of page number: 2^20 entries × 4 B = 4 MiB. 2 MiB (B) is the answer for 8 KiB pages (lesson 16.4). That size per process is why tables are multi-level.|||VI: 12 bit offset để lại 20 bit số trang: 2^20 mục × 4 B = 4 MiB. 2 MiB (B) là đáp án cho trang 8 KiB (bài 16.4). Cỡ đó cho mỗi tiến trình là lý do bảng phải nhiều cấp.' },
          { question: 'TLB lookup 5 ns, memory access 50 ns, TLB hit ratio 90 %, two-level page table. Effective access time?|||Tra TLB 5 ns, truy cập bộ nhớ 50 ns, tỉ lệ trúng TLB 90 %, bảng trang hai cấp. Thời gian truy cập hiệu dụng?',
            options: ['55 ns|||55 ns', '155 ns|||155 ns', '60 ns|||60 ns', '65 ns|||65 ns'], correctIndex: 3, points: 1,
            explanation: 'EN: Hit 5 + 50 = 55 ns; miss 5 + 2 × 50 + 50 = 155 ns; EAT = 0.9 × 55 + 0.1 × 155 = 65 ns. A and B are the hit and miss costs alone; C forgets that a two-level miss reads memory twice before the access.|||VI: Trúng 5 + 50 = 55 ns; trượt 5 + 2 × 50 + 50 = 155 ns; EAT = 0,9 × 55 + 0,1 × 155 = 65 ns. A và B chỉ là riêng chi phí trúng và trượt; C quên rằng trượt với bảng hai cấp phải đọc bộ nhớ hai lần trước lần truy cập.' },
          { question: 'Allocation P0 (1,2), P1 (2,0), P2 (0,1), P3 (1,1); Max P0 (3,3), P1 (2,2), P2 (2,2), P3 (1,3); Available (1,1). Which statement is correct?|||Allocation P0 (1,2), P1 (2,0), P2 (0,1), P3 (1,1); Max P0 (3,3), P1 (2,2), P2 (2,2), P3 (1,3); Available (1,1). Phát biểu nào đúng?',
            options: ['Safe: &lt;P1, P3, P0, P2&gt;|||An toàn: &lt;P1, P3, P0, P2&gt;', 'Unsafe: no process’s Need fits in (1,1)|||Không an toàn: không Need nào vừa (1,1)', 'Safe: &lt;P3, P1, P2, P0&gt;|||An toàn: &lt;P3, P1, P2, P0&gt;', 'Deadlocked: all four processes are blocked now|||Deadlock: cả bốn tiến trình đang bị chặn'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Need = P0 (2,1), P1 (0,2), P2 (2,1), P3 (0,2); every one exceeds (1,1) in some column, so the scan cannot start: unsafe. D is the classic confusion — unsafe means no guaranteed completion, not that anyone is blocked now; that needs the Request matrix (detection).|||VI: Need = P0 (2,1), P1 (0,2), P2 (2,1), P3 (0,2); cái nào cũng vượt (1,1) ở một cột, nên vòng quét không bắt đầu được: không an toàn. D là kiểu nhầm kinh điển — không an toàn nghĩa là không bảo đảm hoàn thành, không phải có ai đang bị chặn; điều đó cần ma trận Request (phát hiện).' },
          { question: 'Head at cylinder 50; queue 82, 170, 43, 140, 24, 16, 190. Total head movement under <strong>SSTF</strong>?|||Đầu đọc ở trụ 50; hàng đợi 82, 170, 43, 140, 24, 16, 190. Tổng quãng di chuyển theo <strong>SSTF</strong>?',
            options: ['642|||642', '314|||314', '208|||208', '174|||174'], correctIndex: 2, points: 1,
            explanation: 'EN: 50 → 43 → 24 → 16 → 82 → 140 → 170 → 190: 7 + 19 + 8 + 66 + 58 + 30 + 20 = 208. 642 (A) is FCFS and 314 (B) is LOOK moving up — both computed in c168; 174 is just the last FCFS move.|||VI: 50 → 43 → 24 → 16 → 82 → 140 → 170 → 190: 7 + 19 + 8 + 66 + 58 + 30 + 20 = 208. 642 (A) là FCFS và 314 (B) là LOOK đi lên — cả hai tính ở c168; 174 chỉ là bước cuối của FCFS.' },
          { question: 'A worker in production disappears and its supervisor logs <code>exit status 143</code>. What most likely ended it?|||Một worker trên production biến mất và trình giám sát ghi <code>exit status 143</code>. Điều gì nhiều khả năng đã kết thúc nó?',
            options: ['SIGTERM (15): a polite stop — docker stop, kill, a deploy — that the program did not handle|||SIGTERM (15): một yêu cầu dừng lịch sự — docker stop, kill, một lần deploy — mà chương trình không xử lý', 'The OOM killer (SIGKILL)|||OOM killer (SIGKILL)', 'A segmentation fault|||Lỗi phân đoạn (segmentation fault)', 'The program called exit(143) after an error|||Chương trình tự gọi exit(143) sau một lỗi'],
            correctIndex: 0, points: 1,
            explanation: 'EN: 143 = 128 + 15. The OOM killer gives 137 (B), SIGSEGV 139 (C). D is possible in principle but 143 is the shell convention for SIGTERM, and in 17.2 an unhandled SIGTERM produced exactly 143 with the in-flight request lost.|||VI: 143 = 128 + 15. OOM killer cho 137 (B), SIGSEGV cho 139 (C). D về lý thuyết có thể, nhưng 143 là quy ước của shell cho SIGTERM, và ở 17.2 một SIGTERM không được xử lý cho đúng 143 kèm mất request đang chạy.' },
          { question: '<code>ps</code> shows hundreds of <code>&lt;defunct&gt;</code> children under one Node process, and new spawns start failing. Root cause?|||<code>ps</code> cho thấy hàng trăm tiến trình con <code>&lt;defunct&gt;</code> dưới một tiến trình Node, và các lần spawn mới bắt đầu hỏng. Nguyên nhân gốc?',
            options: ['The children leak memory|||Các tiến trình con rò bộ nhớ', 'The kernel failed to free them|||Nhân không giải phóng được chúng', 'Slow disk I/O|||I/O đĩa chậm', 'The parent never collects their exit status (no wait), so zombies accumulate until the PID limit is hit|||Tiến trình cha không bao giờ thu mã thoát của chúng (không wait), nên zombie tích lại tới khi chạm giới hạn PID'],
            correctIndex: 3, points: 1,
            explanation: 'EN: defunct = zombie: exited, waiting to be reaped. Each holds a PID; pids.max or kernel.pid_max eventually refuses fork. Zombies hold no memory (A) and the kernel is doing exactly what it should (B). Fix the parent’s child handling, or run an init (tini) as PID 1.|||VI: defunct = zombie: đã thoát, đang chờ được thu dọn. Mỗi cái giữ một PID; tới lúc pids.max hay kernel.pid_max từ chối fork. Zombie không giữ bộ nhớ (A) và nhân đang làm đúng việc của nó (B). Sửa cách tiến trình cha xử lý con, hoặc chạy một init (tini) làm PID 1.' },
          { question: 'Two threads each increment a shared counter one million times without a lock; the result was 1,120,356. Why?|||Hai luồng mỗi luồng tăng một bộ đếm chung một triệu lần mà không khoá; kết quả là 1.120.356. Vì sao?',
            options: ['CPU caches lose writes under load|||Cache CPU làm mất các lần ghi khi tải cao', 'counter++ is load, add, store; interleavings let one thread overwrite the other’s update|||counter++ là nạp, cộng, ghi; các cách xen kẽ cho phép luồng này ghi đè cập nhật của luồng kia', 'The compiler removed half the loop|||Trình biên dịch bỏ đi một nửa vòng lặp', 'The counter overflowed|||Bộ đếm bị tràn số'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured in 5.1: 44 % of updates lost. Caches are coherent (A); the loss is a logic race, fixed by a mutex, an atomic or by not sharing. An int does not overflow at 2 million (D).|||VI: Đo ở 5.1: mất 44 % lần cập nhật. Cache có tính nhất quán (A); mất mát là race về logic, sửa bằng mutex, atomic hoặc không dùng chung. Một int không tràn ở 2 triệu (D).' },
          { question: 'Your team adopts the rule "always lock accounts in ascending id order". Which Coffman condition does that remove?|||Nhóm bạn đặt luật "luôn khoá các tài khoản theo thứ tự id tăng dần". Luật đó loại bỏ điều kiện Coffman nào?',
            options: ['Mutual exclusion|||Loại trừ lẫn nhau', 'Hold and wait|||Giữ và chờ', 'Circular wait|||Chờ vòng', 'No preemption|||Không cưỡng đoạt'],
            correctIndex: 2, points: 1,
            explanation: 'EN: With a global order, a cycle of waits is impossible: every thread waits only for higher ids. Threads still hold one lock while waiting for another (B is still true) — which is why "hold and wait" is the tempting wrong answer. This is the fix of incident 4 in 17.3.|||VI: Có một thứ tự toàn cục thì vòng chờ không thể xảy ra: luồng nào cũng chỉ chờ id cao hơn. Luồng vẫn giữ một khoá trong khi chờ khoá khác (B vẫn đúng) — vì thế "giữ và chờ" là đáp án sai hấp dẫn. Đây là cách sửa sự cố 4 ở 17.3.' },
          { question: 'On a server <code>free -m</code> shows free 200 and available 5,100. A colleague wants to add RAM. You say:|||Trên một máy chủ <code>free -m</code> cho free 200 và available 5.100. Một đồng nghiệp muốn thêm RAM. Bạn nói:',
            options: ['Not needed: idle RAM is page cache and is given back on demand; available is the number that matters|||Không cần: RAM rảnh đang làm page cache và được trả lại khi cần; available mới là con số quan trọng', 'Yes: only 200 MB are left|||Cần: chỉ còn 200 MB', 'Turn on more swap first|||Bật thêm swap trước đã', 'There is a memory leak; restart the services|||Có rò bộ nhớ; khởi động lại các dịch vụ'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Linux fills idle memory with file cache (8.1); 5.1 GB can be reclaimed for programs. Real pressure shows as falling available, swap-in, major faults or OOM kills. B reads the wrong column; C and D treat a healthy state as a problem.|||VI: Linux lấp bộ nhớ rảnh bằng cache file (8.1); 5,1 GB có thể thu hồi cho chương trình. Áp lực thật lộ ra khi available giảm, có swap-in, major fault hay OOM kill. B đọc nhầm cột; C và D coi một trạng thái khoẻ là sự cố.' },
          { question: 'An order service calls <code>write()</code> on its order log, gets success, answers 200 — and the machine loses power a second later. Is the order on disk?|||Một dịch vụ đơn hàng gọi <code>write()</code> vào log đơn, nhận thành công, trả 200 — và máy mất điện một giây sau. Đơn hàng có nằm trên đĩa không?',
            options: ['Yes: write() returned success|||Có: write() đã báo thành công', 'Yes, if the file was opened with O_APPEND|||Có, nếu file được mở với O_APPEND', 'Only if the disk is an SSD|||Chỉ khi đĩa là SSD', 'Possibly not: write() only reached the page cache; only fsync (or O_SYNC/O_DSYNC) waits for the device|||Có thể không: write() mới tới page cache; chỉ fsync (hoặc O_SYNC/O_DSYNC) mới chờ thiết bị'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Measured in 9.3: a buffered write returns in ~1.8 µs because it only copies to memory; durability costs ~880 µs per fsync. O_APPEND controls where data goes, not when it is durable (B). Lesson 9.3 also pulled the power on a disk image to show the loss.|||VI: Đo ở 9.3: một lần ghi có đệm trả về sau ~1,8 µs vì chỉ chép vào bộ nhớ; độ bền tốn ~880 µs mỗi lần fsync. O_APPEND quyết định dữ liệu đi đâu, không quyết định khi nào nó bền (B). Bài 9.3 còn rút điện trên một ảnh đĩa để cho thấy dữ liệu mất.' },
          { question: 'At 10,000 watched connections, what did the lab measure per wake-up for poll and for epoll?|||Ở 10.000 kết nối được theo dõi, lab đo được mỗi lần thức tốn bao nhiêu với poll và với epoll?',
            options: ['Both about 0.7 µs|||Cả hai khoảng 0,7 µs', 'poll ~676 µs, epoll ~0.72 µs|||poll ~676 µs, epoll ~0,72 µs', 'epoll slower, because of its interest list|||epoll chậm hơn, vì danh sách quan tâm của nó', 'select was fastest|||select nhanh nhất'],
            correctIndex: 1, points: 1,
            explanation: 'EN: poll scans the whole set every call (linear); epoll returns only ready fds (constant): 676 vs 0.72 µs in 10.3. select could not even run: fd 10,002 ≥ FD_SETSIZE (D).|||VI: poll quét cả tập ở mỗi lần gọi (tuyến tính); epoll chỉ trả các fd sẵn sàng (hằng số): 676 so với 0,72 µs ở 10.3. select thậm chí không chạy được: fd 10.002 ≥ FD_SETSIZE (D).' },
          { question: 'Inside a container a process is PID 1; on the host <code>grep NSpid /proc/768/status</code> prints <code>NSpid: 768 1</code>. Which namespace makes this possible?|||Bên trong container một tiến trình là PID 1; trên máy chủ <code>grep NSpid /proc/768/status</code> in ra <code>NSpid: 768 1</code>. Namespace nào làm được điều này?',
            options: ['The mount namespace|||Mount namespace', 'The network namespace|||Network namespace', 'The PID namespace|||PID namespace', 'The user namespace|||User namespace'],
            correctIndex: 2, points: 1,
            explanation: 'EN: A PID namespace gives processes a second numbering; NSpid lists the PID in each nested namespace (measured with minictr in 17.5). The mount namespace changes what / is (A); the user namespace remaps UIDs, not PIDs (D).|||VI: PID namespace cho các tiến trình một cách đánh số thứ hai; NSpid liệt kê PID ở từng namespace lồng nhau (đo bằng minictr ở 17.5). Mount namespace đổi / là gì (A); user namespace ánh xạ lại UID, không phải PID (D).' },
          { question: 'Under a seccomp filter with a "kill" action, a program that calls the forbidden <code>mkdirat</code> ends with exit status 159. What happened?|||Dưới một bộ lọc seccomp có hành động "kill", một chương trình gọi <code>mkdirat</code> bị cấm kết thúc với mã 159. Chuyện gì đã xảy ra?',
            options: ['The kernel killed it with SIGSYS (31): 128 + 31 = 159|||Nhân giết nó bằng SIGSYS (31): 128 + 31 = 159', 'mkdirat returned EPERM and the program exited 159|||mkdirat trả về EPERM và chương trình thoát 159', 'The OOM killer stopped it|||OOM killer đã dừng nó', 'It received SIGTERM from Docker|||Nó nhận SIGTERM từ Docker'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in 11.7: kill:mkdirat ⇒ "Bad system call", exit 159. The EPERM action (B) instead made mkdir print "Operation not permitted" and exit 1. OOM is 137 (C), SIGTERM 143 (D).|||VI: Đo ở 11.7: kill:mkdirat ⇒ "Bad system call", exit 159. Hành động EPERM (B) thì làm mkdir in "Operation not permitted" và thoát 1. OOM là 137 (C), SIGTERM là 143 (D).' },
          { question: 'Which page-replacement algorithm can produce <em>more</em> page faults when it is given more frames?|||Thuật toán thay trang nào có thể gây <em>nhiều</em> lỗi trang hơn khi được cấp thêm khung?',
            options: ['LRU|||LRU', 'OPT|||OPT', 'Any algorithm, depending on the string|||Mọi thuật toán, tuỳ chuỗi', 'FIFO|||FIFO'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Belady’s anomaly: FIFO went from 9 to 10 faults on 1 2 3 4 1 2 5 1 2 3 4 5 when frames went from 3 to 4 (16.4). LRU and OPT are stack algorithms and cannot get worse with more frames, so C is false.|||VI: Nghịch lý Belady: FIFO từ 9 lên 10 lỗi trên 1 2 3 4 1 2 5 1 2 3 4 5 khi khung tăng từ 3 lên 4 (16.4). LRU và OPT là thuật toán ngăn xếp và không thể tệ đi khi thêm khung, nên C sai.' },
        ],
      },
    },
  ],
};
