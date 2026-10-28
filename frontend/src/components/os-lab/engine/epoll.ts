/**
 * epoll — engine thuần cho mô phỏng `epoll` (Chương 10, bài 10.3–10.4).
 *
 *   • Danh sách QUAN TÂM (interest list) do epoll_ctl ADD/MOD/DEL sửa MỘT lần; gói tin tới ⇒ ngắt ⇒ callback của nhân
 *     đẩy fd vào danh sách SẴN SÀNG (ready list); epoll_wait chỉ trả các fd sẵn sàng ⇒ giá một lần thức không phụ thuộc
 *     số kết nối. select/poll phải đưa CẢ danh sách vào nhân và quét hết mỗi lần.
 *   • Kích hoạt theo mức (LT) vs theo cạnh (ET), EPOLLONESHOT khi nhiều luồng chung một epoll.
 *   • Mỗi kết nối một luồng vs một luồng + epoll khi tải tăng, và ba "bức tường" (pids, bộ nhớ, ulimit -n).
 * Số liệu: lab/out/c103-epoll (pollbench, trigger.c, oneshot.c, strace echo-epoll), c104-c10k, c104-mem, c104-pids, c104-fd.
 */

// ───────────────────────── 1. interest list / ready list ─────────────────────────
export interface ReadyStep {
  interest: number[]; ready: number[]; returned: number[]; serving?: number; sleeping: boolean;
  call: string; en: string; vi: string; where: string;
  /** số fd nhân phải "đụng" trong lần thức này: epoll = số sẵn sàng; poll = cả danh sách */
  epollWork: number; pollWork: number;
  sfx?: 'blip-fetch' | 'blip-decode' | 'blip-exec' | 'pop' | 'hit' | 'tick' | 'whoosh';
}

export function readyScript(): ReadyStep[] {
  const S: ReadyStep[] = [];
  let interest: number[] = [];
  const push = (x: Partial<ReadyStep> & Pick<ReadyStep, 'call' | 'en' | 'vi'>) => S.push({ interest: [...interest], ready: [], returned: [], sleeping: false, where: 'epoll', epollWork: 0, pollWork: 0, ...x });
  push({ call: 'epoll_create1(0) = 4', en: 'The server asks the kernel for an epoll instance: fd 4 (anon_inode:[eventpoll]). It holds two lists, both empty.', vi: 'Máy chủ xin nhân một thực thể epoll: fd 4 (anon_inode:[eventpoll]). Nó giữ hai danh sách, cả hai đang trống.', sfx: 'blip-fetch' });
  interest = [3];
  push({ call: 'epoll_ctl(4, EPOLL_CTL_ADD, 3, {EPOLLIN})', en: 'Register the listening socket (fd 3) ONCE. It stays in the interest list until removed — no need to hand the list over again on every wait (that is what poll() does).', vi: 'Đăng ký socket nghe (fd 3) MỘT lần. Nó nằm trong danh sách quan tâm tới khi bị gỡ — không phải trao lại danh sách mỗi lần chờ (poll() thì phải).', sfx: 'blip-decode' });
  push({ call: 'epoll_pwait(4, …, -1) …', sleeping: true, en: 'epoll_wait with no timeout: the thread SLEEPS (state S, 0% CPU). Nothing is polled in a loop.', vi: 'epoll_wait không hẹn giờ: luồng NGỦ (trạng thái S, 0% CPU). Không có vòng lặp nào hỏi liên tục.', sfx: 'tick' });
  push({ call: '(NIC → interrupt → TCP handshake done)', sleeping: true, ready: [3], where: 'packet', en: 'A client connects. The network chip raises an interrupt, the kernel finishes the TCP handshake, and epoll\'s callback puts fd 3 on the READY list. The sleeping thread is woken.', vi: 'Một khách kết nối. Chip mạng phát ngắt, nhân hoàn tất bắt tay TCP, và callback của epoll đẩy fd 3 vào danh sách SẴN SÀNG. Luồng đang ngủ được đánh thức.', sfx: 'whoosh' });
  push({ call: 'epoll_pwait(4, [{EPOLLIN, data=0x3}], 256, -1) = 1', ready: [], returned: [3], epollWork: 1, pollWork: 1, en: 'epoll_wait returns exactly ONE event: fd 3. The kernel copied one entry, not the whole list.', vi: 'epoll_wait trả về đúng MỘT sự kiện: fd 3. Nhân chép một mục, không chép cả danh sách.', sfx: 'pop' });
  interest = [3, 5];
  push({ call: 'accept4(3, …, SOCK_NONBLOCK) = 5; epoll_ctl(4, ADD, 5)', returned: [], serving: 5, en: 'accept4 gives the new connection fd 5 (non-blocking), and the server registers it once. Same steps the lab\'s strace showed (there it was fd 8).', vi: 'accept4 cho kết nối mới fd 5 (không chặn), và máy chủ đăng ký nó một lần. Đúng các bước strace của lab cho thấy (ở đó là fd 8).', sfx: 'blip-exec' });
  interest = [3, 5, 6, 7, 8, 9, 10, 11, 12];
  push({ call: '… 7 more clients connect …', en: '7 more clients connect and are registered the same way. 9 fds are watched now — and every one of them is idle.', vi: 'Thêm 7 khách kết nối và được đăng ký y như vậy. Giờ có 9 fd được theo dõi — và cái nào cũng đang rảnh.', sfx: 'tick' });
  push({ call: 'epoll_pwait(4, …, -1) …', sleeping: true, en: 'Back to sleep. 9 idle connections cost NOTHING while nobody talks: no thread per connection, no scanning.', vi: 'Lại ngủ. 9 kết nối rảnh KHÔNG tốn gì khi chẳng ai nói: không luồng nào cho từng kết nối, không quét gì.', sfx: 'tick' });
  push({ call: '(packets arrive for fd 7 and fd 11)', sleeping: true, ready: [7, 11], where: 'packet', en: 'Data arrives on two connections. The kernel appends fd 7 and fd 11 to the ready list as the packets land.', vi: 'Dữ liệu tới trên hai kết nối. Nhân nối fd 7 và fd 11 vào danh sách sẵn sàng ngay khi gói tin đến.', sfx: 'whoosh' });
  push({ call: 'epoll_pwait(4, [{EPOLLIN, 0x7}, {EPOLLIN, 0xb}], 256, -1) = 2', returned: [7, 11], epollWork: 2, pollWork: 9, en: '2 events returned. poll() would have copied all 9 fds into the kernel and checked every one to find these 2 — and with 10 000 connections, 10 000 checks for every wake-up.', vi: 'Trả về 2 sự kiện. poll() sẽ phải chép cả 9 fd vào nhân và kiểm từng cái để tìm ra 2 cái này — với 10 000 kết nối là 10 000 lần kiểm cho mỗi lần thức.', sfx: 'pop' });
  push({ call: 'read(7, "hi\\n", 4096) = 3; write(7, "hi\\n", 3) = 3', serving: 7, returned: [11], en: 'The thread serves fd 7: read, echo back.', vi: 'Luồng phục vụ fd 7: đọc, gửi trả.', sfx: 'blip-exec' });
  push({ call: 'read(11, …) = 3; write(11, …) = 3', serving: 11, returned: [], en: '…then fd 11. One thread served both, one after the other, without ever blocking.', vi: '…rồi tới fd 11. Một luồng phục vụ cả hai, lần lượt, không bao giờ bị chặn.', sfx: 'blip-exec' });
  push({ call: '(client of fd 6 closes)', sleeping: true, ready: [6], where: 'packet', en: 'A client hangs up. Its FIN also makes fd 6 "readable".', vi: 'Một khách gác máy. Gói FIN của nó cũng làm fd 6 "đọc được".', sfx: 'whoosh' });
  interest = [3, 5, 7, 8, 9, 10, 11, 12];
  push({ call: 'read(6, "", 4096) = 0; close(6)', returned: [], serving: 6, epollWork: 1, pollWork: 9, en: 'read() returns 0 = end of stream. close(6) also removes it from the interest list automatically. 8 fds watched, the thread sleeps again.', vi: 'read() trả 0 = hết dòng. close(6) cũng tự gỡ nó khỏi danh sách quan tâm. Còn 8 fd được theo dõi, luồng lại ngủ.', sfx: 'hit' });
  return S;
}

// ───────────────────────── 2. giá một lần thức (pollbench) ─────────────────────────
export const POLLBENCH: Array<{ n: number; select: number | null; poll: number; epoll: number }> = [
  { n: 10, select: 1.39, poll: 1.33, epoll: 0.70 },
  { n: 100, select: 6.68, poll: 6.76, epoll: 0.71 },
  { n: 1000, select: 64.33, poll: 64.52, epoll: 0.72 },
  { n: 10000, select: null, poll: 676.02, epoll: 0.72 },
];
export const FD_SETSIZE = 1024;

// ───────────────────────── 3. LT vs ET (trigger.c) ─────────────────────────
export type Trig = 'lt' | 'et' | 'drain';
export interface TrigStep { buffered: number; read: number; wake: number; done: boolean; stuck: boolean; line: string; en: string; vi: string }

/** 10 byte tới một lần; mỗi lần thức đọc 4 byte (drain: đọc tới EAGAIN). Khớp c103 [lt]/[et]/[et-drain]. */
export function trigger(mode: Trig, total = 10, chunk = 4): TrigStep[] {
  const out: TrigStep[] = [];
  let buf = total, wake = 0, readAll = 0;
  out.push({ buffered: buf, read: 0, wake, done: false, stuck: false, line: `(${total} bytes arrive at once)`, en: `${total} bytes arrive in ONE packet. The socket goes from "empty" to "has data" — that change is the EDGE; "has data" is the LEVEL.`, vi: `${total} byte tới trong MỘT gói. Socket chuyển từ "trống" sang "có dữ liệu" — sự chuyển đó là CẠNH; "có dữ liệu" là MỨC.` });
  if (mode === 'drain') {
    wake++; readAll = buf; buf = 0;
    out.push({ buffered: 0, read: readAll, wake, done: true, stuck: false, line: `  wake-up 1: read ${total} bytes (then EAGAIN)`, en: 'ET done right: after the one wake-up, read in a loop until read() returns -1 EAGAIN. All 10 bytes are taken; the next edge will wake us again.', vi: 'ET đúng cách: sau lần thức duy nhất, đọc trong vòng lặp tới khi read() trả -1 EAGAIN. Lấy hết 10 byte; cạnh kế tiếp sẽ lại đánh thức ta.' });
    out.push({ buffered: 0, read: readAll, wake, done: true, stuck: false, line: `  all ${total} bytes read`, en: 'Everything read with a single wake-up. This is how nginx and libuv use edge-triggered mode.', vi: 'Đọc hết chỉ với một lần thức. nginx và libuv dùng chế độ theo cạnh đúng như vậy.' });
    return out;
  }
  while (buf > 0) {
    if (mode === 'et' && wake >= 1) {
      out.push({ buffered: buf, read: readAll, wake, done: false, stuck: true, line: `  epoll_wait: timeout after 500 ms, ${buf} bytes still unread`, en: `Edge-triggered: there was only ONE edge, and it was already reported. ${buf} bytes still sit in the socket, but no new packet arrives, so epoll_wait never wakes for them — a hung connection.`, vi: `Theo cạnh: chỉ có MỘT cạnh, và nó đã được báo rồi. ${buf} byte vẫn nằm trong socket, nhưng không có gói mới nên epoll_wait không bao giờ thức vì chúng — một kết nối treo.` });
      return out;
    }
    wake++;
    const r = Math.min(chunk, buf); buf -= r; readAll += r;
    out.push({ buffered: buf, read: readAll, wake, done: buf === 0, stuck: false, line: `  wake-up ${wake}: read ${r} bytes`, en: mode === 'lt' ? `Level-triggered: data is still there (${buf + r} bytes), so epoll_wait returns again. Read ${r}.${buf ? '' : ' Now the socket is empty.'}` : `The first (and only) edge wakes us. Read ${r} bytes.`, vi: mode === 'lt' ? `Theo mức: vẫn còn dữ liệu (${buf + r} byte), nên epoll_wait lại trả về. Đọc ${r}.${buf ? '' : ' Giờ socket đã trống.'}` : `Cạnh đầu tiên (và duy nhất) đánh thức ta. Đọc ${r} byte.` });
  }
  out.push({ buffered: 0, read: readAll, wake, done: true, stuck: false, line: `  all ${total} bytes read`, en: `Level-triggered keeps reporting the fd while data remains: ${wake} wake-ups (4 + 4 + 2). Forgiving, but more wake-ups.`, vi: `Theo mức cứ báo fd chừng nào còn dữ liệu: ${wake} lần thức (4 + 4 + 2). Dễ tính, nhưng thức nhiều lần hơn.` });
  return out;
}

// ───────────────────────── 4. bốn luồng chung một epoll (oneshot.c) ─────────────────────────
export type Share = 'lt' | 'et' | 'oneshot';
export const ONESHOT: Record<Share, Array<{ ms: number; th: number; what: 'woke' | 'dup' | 'read' | 'eagain' }>> = {
  lt: [{ ms: 0, th: 4, what: 'woke' }, { ms: 0, th: 3, what: 'dup' }, { ms: 0, th: 2, what: 'dup' }, { ms: 0, th: 1, what: 'dup' }, { ms: 107, th: 3, what: 'read' }, { ms: 107, th: 4, what: 'eagain' }, { ms: 107, th: 2, what: 'eagain' }, { ms: 107, th: 1, what: 'eagain' }],
  et: [{ ms: 5, th: 4, what: 'woke' }, { ms: 56, th: 3, what: 'dup' }, { ms: 115, th: 4, what: 'read' }, { ms: 162, th: 3, what: 'eagain' }],
  oneshot: [{ ms: 3, th: 4, what: 'woke' }, { ms: 106, th: 4, what: 'read' }],
};

// ───────────────────────── 5. c10k (c104-c10k) ─────────────────────────
export type Load = 'busy' | 'light';
export type Model = 'thread' | 'epoll';
export interface C10kRow { threads: number; rss: number; kstack: number; cpu: number; ctx: number; p50: number; p99: number; max: number; late: number; openMs: number }
export const C10K: Record<Load, Record<number, Record<Model, C10kRow>>> = {
  busy: {
    1000: { thread: { threads: 1001, rss: 13.4, kstack: 15, cpu: 1.02, ctx: 31318, p50: 0.11, p99: 2.95, max: 22.22, late: 228, openMs: 11 }, epoll: { threads: 1, rss: 5.8, kstack: 0, cpu: 0.45, ctx: 4001, p50: 0.09, p99: 2.51, max: 21.28, late: 399, openMs: 9 } },
    5000: { thread: { threads: 5001, rss: 63.3, kstack: 78, cpu: 2.72, ctx: 153346, p50: 0.05, p99: 24.5, max: 68.33, late: 866, openMs: 42 }, epoll: { threads: 1, rss: 22.1, kstack: 0, cpu: 0.96, ctx: 48135, p50: 0.04, p99: 0.23, max: 8.69, late: 0, openMs: 41 } },
    10000: { thread: { threads: 10001, rss: 121.8, kstack: 156, cpu: 3.06, ctx: 206518, p50: 95.09, p99: 321.67, max: 392.94, late: 61800, openMs: 1131 }, epoll: { threads: 1, rss: 41.7, kstack: 0, cpu: 1.33, ctx: 44092, p50: 0.05, p99: 0.38, max: 2.72, late: 0, openMs: 81 } },
  },
  light: {
    1000: { thread: { threads: 1001, rss: 13.4, kstack: 15, cpu: 0.22, ctx: 4222, p50: 0.12, p99: 2.39, max: 8.38, late: 19, openMs: 9 }, epoll: { threads: 1, rss: 5.6, kstack: 0, cpu: 0.14, ctx: 2426, p50: 0.10, p99: 1.64, max: 15.63, late: 22, openMs: 8 } },
    5000: { thread: { threads: 5001, rss: 63.3, kstack: 78, cpu: 0.81, ctx: 21122, p50: 0.16, p99: 2.92, max: 16.49, late: 18, openMs: 51 }, epoll: { threads: 1, rss: 21.2, kstack: 0, cpu: 0.28, ctx: 3910, p50: 0.10, p99: 3.02, max: 26.36, late: 436, openMs: 42 } },
    10000: { thread: { threads: 10001, rss: 122.6, kstack: 156, cpu: 1.02, ctx: 32136, p50: 0.11, p99: 1.92, max: 8.07, late: 0, openMs: 1114 }, epoll: { threads: 1, rss: 40.9, kstack: 0, cpu: 0.41, ctx: 5956, p50: 0.10, p99: 1.36, max: 9.50, late: 0, openMs: 598 } },
  },
};
export const C10K_N = [1000, 5000, 10000] as const;
/** bộ nhớ thật một máy chủ phải trả = RSS + stack nhân (16 KiB/luồng, không hiện trong RSS) */
export const realMiB = (r: C10kRow) => r.rss + r.kstack;

// ───────────────────────── 6. ba bức tường ─────────────────────────
export type Wall = 'pids' | 'memory' | 'nofile';
export const WALLS: Record<Wall, { limit: string; thread: { failAt: number | null; out: string[]; exit?: number }; epoll: { failAt: number | null; out: string[] }; en: string; vi: string }> = {
  pids: {
    limit: 'pids.max = 1000',
    thread: { failAt: 997, out: ['pthread_create failed at connection 997: Resource temporarily unavailable', 'opened 3000/3000 connections … closed by server 2004'] },
    epoll: { failAt: null, out: ['opened 3000/3000 connections in 45 ms (0 failed)', 'round trip: p50 0.08 ms  p99 0.58 ms'] },
    en: 'A container with pids.max = 1000: every thread counts as a "pid". The thread-per-connection server cannot create thread 997 (EAGAIN) and starts dropping connections; the epoll server uses one thread and does not care.',
    vi: 'Container có pids.max = 1000: mỗi luồng đều tính là một "pid". Máy chủ mỗi-kết-nối-một-luồng không tạo nổi luồng thứ 997 (EAGAIN) và bắt đầu đóng kết nối; máy chủ epoll chỉ dùng một luồng nên chẳng hề gì.',
  },
  memory: {
    limit: 'memory.max = 192 MiB',
    thread: { failAt: 4624, exit: 137, out: ['connect #4625 failed: Connection refused', 'opened 4624/10000 connections (5376 failed)', 'Killed ./echo-thread  →  exit=137', 'memory.events: oom_kill 1'] },
    epoll: { failAt: null, out: ['opened 10000/10000 connections in 82 ms (0 failed)', 'round trip: p50 0.13 ms  p99 1.49 ms'] },
    en: 'memory.max = 192 MiB: each thread costs a stack in RSS plus 16 KiB of kernel stack that RSS does not even show. Around 4 600 connections the cgroup OOM-kills the thread server (exit 137). The epoll server holds 10 000 in ~41 MiB.',
    vi: 'memory.max = 192 MiB: mỗi luồng tốn một stack trong RSS cộng 16 KiB stack nhân mà RSS còn không hiện. Khoảng 4 600 kết nối là cgroup giết máy chủ luồng vì OOM (exit 137). Máy chủ epoll giữ 10 000 kết nối trong ~41 MiB.',
  },
  nofile: {
    limit: 'ulimit -n 1024',
    thread: { failAt: 1021, out: ['accept: Too many open files'] },
    epoll: { failAt: 1021, out: ['accept4(3, …) = -1 EMFILE (Too many open files)', 'epoll_pwait → fd 3 ready again → accept4 EMFILE …', '9 359 failed accept4 per second, ~100% CPU (level-triggered spin)'] },
    en: 'ulimit -n 1024 hits BOTH models: every connection is an fd. Worse, with level-triggered epoll the listening socket stays "ready", so the loop spins at 100% CPU doing 9 359 failed accept4 a second. libuv\'s trick: keep one spare fd, and on EMFILE close it, accept, close the new connection, reopen the spare.',
    vi: 'ulimit -n 1024 chặn CẢ HAI mô hình: mỗi kết nối là một fd. Tệ hơn, với epoll theo mức socket nghe cứ "sẵn sàng", nên vòng lặp quay 100% CPU với 9 359 lần accept4 thất bại mỗi giây. Mẹo của libuv: giữ sẵn một fd dự phòng, gặp EMFILE thì đóng nó, accept, đóng kết nối mới, rồi mở lại fd dự phòng.',
  },
};
