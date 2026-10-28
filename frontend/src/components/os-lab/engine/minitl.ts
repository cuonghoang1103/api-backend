/**
 * Hai dòng thời gian nhỏ của Chương 11 — engine thuần cho mô phỏng `eintr` và `nagle`.
 *
 * eintr: read() đang chặn 0 → 2 s, SIGALRM tới lúc 1 s. Nhân dừng lời gọi (ERESTARTSYS), chạy handler, rồi
 *   rt_sigreturn: không SA_RESTART ⇒ -1 EINTR (chương trình phải tự hỏi lại); có SA_RESTART ⇒ nhân tự chạy lại read();
 *   poll/ppoll thì LUÔN EINTR (ERESTARTNOHAND); Python (PEP 475) tự thử lại; Go nhận SIGURG ~33 lần/giây (49 lần / 1,475 s)
 *   để chen ngang goroutine và runtime tự thử lại. Khớp lab/out/c115-eintr.
 * nagle: máy chủ ghi headers và body bằng HAI lần write() nhỏ; Nagle giữ gói thứ hai tới khi gói đầu được ACK, còn
 *   khách thì trì hoãn ACK (~40 ms) ⇒ mỗi request ~41 ms; 200 request 8,367 s → TCP_NODELAY 0,028 s. Khớp c113-strace.
 */

// ───────────────────────── eintr ─────────────────────────
export type EintrMode = 'norestart' | 'restart' | 'poll' | 'python' | 'go';
export interface TlEv { t: number; lane: 'prog' | 'kernel' | 'signal'; text: string; strace?: string; state?: 'R' | 'S'; tone?: 'ok' | 'bad' | 'warn'; en: string; vi: string }

export function eintr(mode: EintrMode): TlEv[] {
  if (mode === 'go') {
    return [
      { t: 0, lane: 'prog', state: 'R', text: 'for { busy() }   // GOMAXPROCS=1', en: 'A Go program with one OS thread runs a tight loop that never calls into the runtime.', vi: 'Một chương trình Go với một luồng hệ điều hành chạy vòng lặp chặt không bao giờ gọi vào runtime.' },
      { t: 0.03, lane: 'signal', text: '--- SIGURG {si_code=SI_TKILL} ---', strace: '610   --- SIGURG {si_signo=SIGURG, si_code=SI_TKILL, si_pid=610, si_uid=0} ---', en: 'Go\'s scheduler sends ITSELF SIGURG to interrupt the loop and switch goroutines (asynchronous preemption, since Go 1.14).', vi: 'Bộ lập lịch của Go tự gửi SIGURG cho CHÍNH NÓ để ngắt vòng lặp và đổi goroutine (chen ngang bất đồng bộ, từ Go 1.14).' },
      { t: 1.475, lane: 'signal', text: '49 × SIGURG in 1.475 s (≈ 33/s)', strace: '$ grep -c SIGURG spin.txt\n49', tone: 'warn', en: '49 signals in 1.475 s. Every one of them could interrupt a blocking system call — so the Go runtime retries EINTR for you everywhere. Your C library calls from cgo may still see EINTR.', vi: '49 tín hiệu trong 1,475 s. Cái nào cũng có thể cắt ngang một lời gọi đang chặn — nên runtime Go tự thử lại EINTR ở mọi chỗ. Lời gọi thư viện C qua cgo vẫn có thể gặp EINTR.' },
    ];
  }
  const call = mode === 'poll' ? 'ppoll([{fd=3, POLLIN}], 1, NULL)' : 'read(3, buf, 64)';
  const ev: TlEv[] = [
    { t: 0, lane: 'prog', state: 'S', text: `${call}  …blocking`, en: `The program blocks in ${mode === 'poll' ? 'poll()' : 'read()'} on an empty pipe: state S, wchan ${mode === 'poll' ? 'poll_schedule_timeout' : 'anon_pipe_read'}. Data will only come at 2.0 s.`, vi: `Chương trình chặn trong ${mode === 'poll' ? 'poll()' : 'read()'} trên một ống trống: trạng thái S, wchan ${mode === 'poll' ? 'poll_schedule_timeout' : 'anon_pipe_read'}. Dữ liệu chỉ tới lúc 2,0 s.` },
    { t: 1.0, lane: 'signal', text: '--- SIGALRM ---', strace: `${call.replace('buf', '0xffffeed7c178').replace('  …blocking', '')} = ? ${mode === 'poll' ? 'ERESTARTNOHAND (To be restarted if no handler)' : 'ERESTARTSYS (To be restarted if SA_RESTART is set)'}\n--- SIGALRM {si_signo=SIGALRM, si_code=SI_KERNEL} ---`, tone: 'warn',
      en: `At 1.0 s alarm() fires. The kernel stops the sleeping call (internally it returns ${mode === 'poll' ? 'ERESTARTNOHAND' : 'ERESTARTSYS'} — a code user space never sees) and runs your signal handler.`,
      vi: `Lúc 1,0 s alarm() reo. Nhân dừng lời gọi đang ngủ (bên trong nó trả ${mode === 'poll' ? 'ERESTARTNOHAND' : 'ERESTARTSYS'} — mã mà không gian người dùng không bao giờ thấy) và chạy hàm xử lý tín hiệu của bạn.` },
  ];
  if (mode === 'restart') {
    ev.push({ t: 1.0, lane: 'kernel', text: 'rt_sigreturn → restart read()', strace: 'rt_sigreturn({mask=[]})                 = 3', tone: 'ok', en: 'The handler was installed with SA_RESTART, so after rt_sigreturn the kernel silently restarts read(). The program never notices.', vi: 'Hàm xử lý được cài với SA_RESTART, nên sau rt_sigreturn nhân lặng lẽ chạy lại read(). Chương trình không hề hay biết.' });
    ev.push({ t: 2.0, lane: 'prog', state: 'R', text: 'read() = 5', strace: 'read(3, "data\\n", 64)                   = 5', tone: 'ok', en: 'At 2.0 s data arrives: read() = 5. Output: "2.0s read() = 5".', vi: 'Lúc 2,0 s dữ liệu tới: read() = 5. Output: "2.0s read() = 5".' });
    return ev;
  }
  ev.push({ t: 1.0, lane: 'kernel', text: 'rt_sigreturn → -1 EINTR', strace: 'rt_sigreturn({mask=[]})                 = -1 EINTR (Interrupted system call)', tone: 'bad',
    en: mode === 'poll' ? 'poll/ppoll/epoll_wait/nanosleep are NEVER restarted after a handler, SA_RESTART or not: -1 EINTR.' : 'No SA_RESTART: the call returns -1 with errno = EINTR (4, "Interrupted system call").',
    vi: mode === 'poll' ? 'poll/ppoll/epoll_wait/nanosleep KHÔNG BAO GIỜ được chạy lại sau handler, có SA_RESTART hay không: -1 EINTR.' : 'Không có SA_RESTART: lời gọi trả -1 với errno = EINTR (4, "Interrupted system call").' });
  if (mode === 'python') {
    ev.push({ t: 1.0, lane: 'prog', state: 'S', text: 'PEP 475: run handler, retry', strace: 'handler ran', tone: 'ok', en: 'Python sees EINTR at the C level, runs your Python handler ("handler ran"), and if it did not raise, retries the read itself (PEP 475, Python 3.5+).', vi: 'Python thấy EINTR ở tầng C, chạy handler Python của bạn ("handler ran"), và nếu handler không ném lỗi thì tự đọc lại (PEP 475, Python 3.5+).' });
    ev.push({ t: 2.0, lane: 'prog', state: 'R', text: 'read() = 5', strace: 'read(3, "data\\n", 64)                   = 5', tone: 'ok', en: 'Data at 2.0 s. Your Python code never saw an exception.', vi: 'Dữ liệu tới lúc 2,0 s. Mã Python của bạn không hề thấy exception nào.' });
    return ev;
  }
  ev.push({ t: 1.0, lane: 'prog', state: 'R', text: `${mode === 'poll' ? 'poll' : 'read'}() = -1 Interrupted system call`, strace: `1.0s ${mode === 'poll' ? 'poll' : 'read'}() = -1 Interrupted system call`, tone: 'bad', en: 'Your C code gets -1/EINTR at 1.0 s even though nothing is wrong. Code that treats every -1 as fatal breaks here; the fix is a loop: while (r == -1 && errno == EINTR) retry.', vi: 'Mã C của bạn nhận -1/EINTR lúc 1,0 s dù chẳng có gì sai. Mã coi mọi -1 là lỗi chết sẽ gãy ở đây; cách sửa là một vòng lặp: while (r == -1 && errno == EINTR) thử lại.' });
  if (mode === 'norestart') ev.push({ t: 2.0, lane: 'prog', state: 'R', text: 'retry: read() = 5', strace: 'read(3, "data\\n", 64)                   = 5\n2.0s retry: read() = 5', tone: 'ok', en: 'The retry loop calls read() again; at 2.0 s data arrives: "2.0s retry: read() = 5".', vi: 'Vòng lặp thử lại gọi read() lần nữa; lúc 2,0 s dữ liệu tới: "2.0s retry: read() = 5".' });
  return ev;
}

// ───────────────────────── nagle ─────────────────────────
export interface NagleCfg { writes: 1 | 2; nodelay: boolean; delayedAck: boolean }
export interface SeqEv { ms: number; from: 'server' | 'client'; label: string; held?: boolean; tone?: 'ok' | 'bad' | 'warn'; en: string; vi: string }
export const DELAYED_ACK_MS = 40;

/** Một request HTTP keep-alive; ms là thời điểm gói tới đầu kia. */
export function nagle(c: NagleCfg): { events: SeqEv[]; perReqMs: number | null; total200s: number | null } {
  const ev: SeqEv[] = [
    { ms: 0, from: 'client', label: 'GET /1 (79 B)', en: 'curl sends request 1 on a keep-alive connection.', vi: 'curl gửi request 1 trên một kết nối keep-alive.' },
    { ms: 0.4, from: 'server', label: c.writes === 1 ? 'headers + "hello\\n" (one write)' : 'write #1: headers (111 B)', en: c.writes === 1 ? 'The server builds the whole response and sends it with ONE write(): one segment, nothing to wait for.' : 'The server writes the headers first. Nothing is unacknowledged yet, so TCP sends them at once.', vi: c.writes === 1 ? 'Máy chủ dựng cả câu trả lời rồi gửi bằng MỘT write(): một gói, không phải chờ gì.' : 'Máy chủ ghi headers trước. Chưa có gì đang chờ ACK, nên TCP gửi ngay.' },
  ];
  if (c.writes === 1) {
    ev.push({ ms: 0.5, from: 'client', label: 'ACK (+ next GET)', tone: 'ok', en: 'Done in well under a millisecond.', vi: 'Xong trong chưa tới một mili giây.' });
    return { events: ev, perReqMs: 0.14, total200s: 0.028 };
  }
  const stall = !c.nodelay && c.delayedAck;
  if (c.nodelay) {
    ev.push({ ms: 0.45, from: 'server', label: 'write #2: "hello\\n" (6 B) — sent now', tone: 'ok', en: 'TCP_NODELAY turns Nagle off: the 6-byte body goes out immediately even though the headers are not ACKed yet.', vi: 'TCP_NODELAY tắt Nagle: 6 byte body đi ngay dù headers chưa được ACK.' });
    ev.push({ ms: 0.5, from: 'client', label: 'ACK', tone: 'ok', en: 'The client has the full response — 200 requests in 0.028 s.', vi: 'Khách có đủ câu trả lời — 200 request trong 0,028 s.' });
    return { events: ev, perReqMs: 0.14, total200s: 0.028 };
  }
  ev.push({ ms: 0.45, from: 'server', label: 'write #2: "hello\\n" (6 B) — HELD by Nagle', held: true, tone: 'warn', en: 'Nagle\'s rule: while sent data is still unacknowledged, hold small segments back and merge them. The 6-byte body waits for the ACK of the headers.', vi: 'Luật Nagle: khi dữ liệu đã gửi còn chưa được ACK, giữ các gói nhỏ lại để gộp. 6 byte body phải chờ ACK của headers.' });
  if (stall) {
    ev.push({ ms: 0.5, from: 'client', label: '(delayed ACK: wait up to 40 ms…)', held: true, tone: 'warn', en: 'Meanwhile the client\'s TCP delays its ACK, hoping to piggy-back it on data it will send soon. But curl will send nothing until it has the whole response. Both sides wait for each other.', vi: 'Trong khi đó TCP phía khách trì hoãn ACK, mong gửi kèm với dữ liệu sắp gửi. Nhưng curl sẽ không gửi gì tới khi có đủ câu trả lời. Hai bên chờ nhau.' });
    ev.push({ ms: 41, from: 'client', label: 'ACK (timer fired)', tone: 'bad', en: 'After ~40 ms the delayed-ACK timer fires and the ACK finally goes out.', vi: 'Sau ~40 ms bộ hẹn giờ ACK trễ reo và ACK cuối cùng cũng được gửi.' });
    ev.push({ ms: 41.1, from: 'server', label: '"hello\\n" released', tone: 'bad', en: 'Now Nagle releases the body: the strace of curl shows it at +41 ms (recvfrom … EAGAIN, then "hello\\n" 41 ms later). 41 ms × 200 requests = 8.4 s for a 6-byte page.', vi: 'Giờ Nagle mới thả body: strace của curl thấy nó ở +41 ms (recvfrom … EAGAIN, rồi "hello\\n" 41 ms sau). 41 ms × 200 request = 8,4 s cho một trang 6 byte.' });
    return { events: ev, perReqMs: 41.8, total200s: 8.367 };
  }
  ev.push({ ms: 0.5, from: 'client', label: 'ACK (quick ACK)', en: 'With delayed ACK off (TCP_QUICKACK), the client ACKs at once…', vi: 'Tắt ACK trễ (TCP_QUICKACK) thì khách ACK ngay…' });
  ev.push({ ms: 0.6, from: 'server', label: '"hello\\n" released', tone: 'ok', en: '…and Nagle releases the body a fraction of a millisecond later.', vi: '…và Nagle thả body sau một phần nhỏ mili giây.' });
  return { events: ev, perReqMs: null, total200s: null }; // không đo trong lab
}
