/**
 * socket — engine thuần cho mô phỏng `socket`.
 *
 *   • demux     — máy web 10.10.2.10: nginx có MỘT socket nghe 0.0.0.0:80 và N socket đã kết nối, cái nào cũng có cổng
 *                 cục bộ 80. Mỗi đoạn TCP tới được so theo bộ 4 (IP nguồn, cổng nguồn, IP đích, cổng đích) với các socket
 *                 đã kết nối trước, không khớp thì mới tới socket nghe; SYN ⇒ socket mới vào hàng accept; accept() ⇒ fd mới.
 *                 Bảng kiểu `ss -tan` đổi theo từng bước. (Cổng 50228 là cổng thật của capture v2; 50230 / 51000 là ví dụ.)
 *   • bind      — ứng dụng nghe 127.0.0.1:3000 / 0.0.0.0:3000 / 10.10.2.20:3000: ai kết nối được (lo, container khác,
 *                 máy chủ qua `docker -p`), ai bị từ chối (RST).
 *   • ephemeral — mở kết nối ngắn tới MỘT ip:port của DB không có pool: dải cổng tạm 32768–60999 (28 232 cổng),
 *                 TIME_WAIT 60 s ⇒ ~470 kết nối mới/giây là trần; TẤT CẢ là TÍNH RA từ giá trị mặc định của nhân.
 */
import { IP } from './capture';

export type TcpState = 'LISTEN' | 'SYN-RECV' | 'ESTAB' | 'TIME-WAIT';
export interface Sock { id: number; state: TcpState; local: string; peer: string; recvQ: number; sendQ: number; fd?: number; acceptQ?: boolean }
export interface Seg { src: string; dst: string; flags: 'SYN' | 'ACK' | 'DATA'; len?: number }
export type MatchCell = { proto: boolean; srcIp: boolean; srcPort: boolean; dstIp: boolean; dstPort: boolean };
export interface Lookup { hit?: number; via: 'established' | 'listener' | 'rst'; cells: Array<{ id: number; cell: MatchCell; ok: boolean }>; why: [string, string] }

const split = (ap: string) => { const k = ap.lastIndexOf(':'); return { ip: ap.slice(0, k), port: ap.slice(k + 1) }; };

/** Nhân tìm socket cho một đoạn TCP: khớp đủ bộ 4 với socket đã kết nối trước; không có thì socket nghe (IP 0.0.0.0 = mọi IP). */
export function lookup(socks: Sock[], seg: Seg): Lookup {
  const s = split(seg.src), d = split(seg.dst);
  const cells: Lookup['cells'] = [];
  for (const k of socks) {
    const L = split(k.local), P = split(k.peer);
    if (k.state === 'LISTEN') {
      const cell = { proto: true, srcIp: true, srcPort: true, dstIp: L.ip === '0.0.0.0' || L.ip === d.ip, dstPort: L.port === d.port };
      cells.push({ id: k.id, cell, ok: cell.dstIp && cell.dstPort });
    } else {
      const cell = { proto: true, srcIp: P.ip === s.ip, srcPort: P.port === s.port, dstIp: L.ip === d.ip, dstPort: L.port === d.port };
      cells.push({ id: k.id, cell, ok: cell.srcIp && cell.srcPort && cell.dstIp && cell.dstPort });
    }
  }
  const est = cells.find((c) => c.ok && socks.find((k) => k.id === c.id)!.state !== 'LISTEN');
  if (est) return { hit: est.id, via: 'established', cells, why: ['All four numbers match an existing connection ⇒ this socket, nobody else.', 'Cả bốn con số khớp một kết nối có sẵn ⇒ socket này, không phải ai khác.'] };
  const lis = cells.find((c) => c.ok);
  if (lis && seg.flags === 'SYN') return { hit: lis.id, via: 'listener', cells, why: ['No connection has this 4-tuple, and it is a SYN ⇒ the listening socket takes it: a new connection begins.', 'Không kết nối nào có bộ 4 này, và đây là SYN ⇒ socket nghe nhận: một kết nối mới bắt đầu.'] };
  if (lis) return { via: 'rst', cells, why: ['Only the listener matches, but this is not a SYN — a segment for a connection that does not exist ⇒ the kernel answers RST.', 'Chỉ socket nghe khớp, nhưng đây không phải SYN — đoạn của một kết nối không tồn tại ⇒ nhân trả RST.'] };
  return { via: 'rst', cells, why: ['No socket at all listens on this port ⇒ RST: “Connection refused”.', 'Không socket nào nghe ở cổng này ⇒ RST: “Connection refused”.'] };
}

export interface DemuxStep { socks: Sock[]; seg?: Seg; look?: Lookup; call: string; en: string; vi: string; tone?: 'ok' | 'warn' | 'bad'; sfx?: 'whoosh' | 'pop' | 'hit' | 'blip-exec' | 'blip-fetch' | 'oops' | 'right' }

export const WEB80 = `${IP.web}:80`;
export const TAB1 = `${IP.client}:50228`;
export const TAB2 = `${IP.client}:50230`;
export const C2 = `${IP.client2}:51000`;

export function demuxScript(): DemuxStep[] {
  let socks: Sock[] = [{ id: 0, state: 'LISTEN', local: '0.0.0.0:80', peer: '0.0.0.0:*', recvQ: 0, sendQ: 511, fd: 6 }];
  const out: DemuxStep[] = [];
  let nextId = 1, nextFd = 7;
  const snap = (x: Omit<DemuxStep, 'socks'>) => out.push({ ...x, socks: socks.map((k) => ({ ...k })) });
  const upd = (id: number, f: Partial<Sock>) => { socks = socks.map((k) => (k.id === id ? { ...k, ...f } : k)); };
  const listen = () => socks[0];

  snap({ call: 'nginx: listen(6, 511) on 0.0.0.0:80', sfx: 'blip-fetch',
    en: 'nginx started and owns ONE listening socket: 0.0.0.0:80 (0.0.0.0 = “any of my IPs”). For a LISTEN socket, ss shows the accept-queue length in Recv-Q and the backlog limit (511, nginx’s default) in Send-Q.',
    vi: 'nginx đã chạy và giữ MỘT socket nghe: 0.0.0.0:80 (0.0.0.0 = “mọi IP của tôi”). Với socket LISTEN, ss hiện độ dài hàng accept ở Recv-Q và giới hạn backlog (511, mặc định của nginx) ở Send-Q.' });
  const connect = (peer: string, label: [string, string]) => {
    const seg: Seg = { src: peer, dst: WEB80, flags: 'SYN' };
    const look = lookup(socks, seg);
    const id = nextId++;
    socks.push({ id, state: 'SYN-RECV', local: WEB80, peer, recvQ: 0, sendQ: 0 });
    snap({ seg, look, call: `SYN ${peer} → ${WEB80}`, sfx: 'whoosh',
      en: `${label[0]} sends SYN. No connection has this 4-tuple ⇒ the listening socket takes it, the kernel creates a half-open entry (SYN-RECV) and answers SYN-ACK. nginx knows nothing yet.`,
      vi: `${label[1]} gửi SYN. Chưa kết nối nào có bộ 4 này ⇒ socket nghe nhận, nhân tạo một mục nửa mở (SYN-RECV) và trả SYN-ACK. nginx chưa biết gì.` });
    const ack: Seg = { src: peer, dst: WEB80, flags: 'ACK' };
    const lookAck = lookup(socks, ack);
    upd(id, { state: 'ESTAB', acceptQ: true });
    upd(0, { recvQ: listen().recvQ + 1 });
    snap({ seg: ack, look: lookAck, call: `ACK ${peer} → ${WEB80}  (handshake done)`, sfx: 'pop',
      en: 'The final ACK of the handshake matches the half-open entry ⇒ a full socket, ESTAB, waiting in the listener’s ACCEPT QUEUE (see Recv-Q of LISTEN go up). The connection exists even though nginx has not called accept() yet.',
      vi: 'ACK cuối của bắt tay khớp mục nửa mở ⇒ thành socket đầy đủ, ESTAB, chờ trong HÀNG ACCEPT của socket nghe (Recv-Q của LISTEN tăng lên). Kết nối đã tồn tại dù nginx chưa gọi accept().' });
    const fd = nextFd++;
    upd(id, { acceptQ: false, fd });
    upd(0, { recvQ: listen().recvQ - 1 });
    snap({ call: `nginx: accept4(6, …) = ${fd}`, sfx: 'blip-exec',
      en: `nginx calls accept(): the kernel hands it this connection as a NEW file descriptor, fd ${fd}. The listening socket stays and keeps listening; Recv-Q back to 0.`,
      vi: `nginx gọi accept(): nhân trao kết nối này dưới dạng một file descriptor MỚI, fd ${fd}. Socket nghe vẫn ở đó và tiếp tục nghe; Recv-Q về 0.` });
    return id;
  };
  const t1 = connect(TAB1, ['curl (tab 1, 10.10.1.10:50228)', 'curl (tab 1, 10.10.1.10:50228)']);
  const data1: Seg = { src: TAB1, dst: WEB80, flags: 'DATA', len: 83 };
  upd(t1, { recvQ: 83 });
  snap({ seg: data1, look: lookup(socks, data1), call: `83 bytes ${TAB1} → ${WEB80}`, sfx: 'hit',
    en: '“GET /api/hello” arrives (83 bytes). Its 4-tuple matches the ESTAB socket exactly ⇒ the bytes wait in THAT socket’s receive buffer (Recv-Q 83) until nginx reads them.',
    vi: '“GET /api/hello” tới (83 byte). Bộ 4 của nó khớp đúng socket ESTAB ⇒ byte chờ trong bộ đệm nhận của CHÍNH socket đó (Recv-Q 83) tới khi nginx đọc.' });
  upd(t1, { recvQ: 0, sendQ: 304 });
  snap({ call: `nginx: recv(7) = 83 · writev(7, …) = 304`, sfx: 'blip-exec',
    en: 'nginx reads the request (Recv-Q 0) and writes a 304-byte answer. Until the client ACKs it, the bytes sit in Send-Q — the kernel must keep them in case it has to resend.',
    vi: 'nginx đọc request (Recv-Q 0) và ghi câu trả lời 304 byte. Tới khi client ACK, số byte đó nằm ở Send-Q — nhân phải giữ phòng khi phải gửi lại.' });
  upd(t1, { sendQ: 0 });
  snap({ seg: { src: TAB1, dst: WEB80, flags: 'ACK' }, look: lookup(socks, { src: TAB1, dst: WEB80, flags: 'ACK' }), call: `ACK ${TAB1} (Ack=305)`, sfx: 'pop',
    en: 'The client’s ACK arrives ⇒ Send-Q 0. (Real capture: Ack=305 = 304 bytes + 1.)', vi: 'ACK của client tới ⇒ Send-Q 0. (Capture thật: Ack=305 = 304 byte + 1.)' });
  const t2 = connect(TAB2, ['A second tab of the same browser (10.10.1.10:50230)', 'Tab thứ hai của cùng trình duyệt (10.10.1.10:50230)']);
  connect(C2, ['client2 (10.10.1.11:51000)', 'client2 (10.10.1.11:51000)']);
  const data2: Seg = { src: TAB2, dst: WEB80, flags: 'DATA', len: 83 };
  upd(t2, { recvQ: 83 });
  snap({ seg: data2, look: lookup(socks, data2), call: `83 bytes ${TAB2} → ${WEB80}`, tone: 'ok', sfx: 'right',
    en: 'The key moment: same client IP, same server IP, same local port 80 — four sockets all show “10.10.2.10:80”. Only the SOURCE PORT differs (50230 vs 50228), and that alone sends these bytes to tab 2’s socket.',
    vi: 'Khoảnh khắc mấu chốt: cùng IP client, cùng IP máy chủ, cùng cổng cục bộ 80 — bốn socket đều ghi “10.10.2.10:80”. Chỉ CỔNG NGUỒN khác nhau (50230 so với 50228), và chỉ riêng điều đó đưa byte này vào socket của tab 2.' });
  upd(t2, { recvQ: 0 });
  const stray: Seg = { src: `${IP.client2}:51001`, dst: WEB80, flags: 'DATA', len: 20 };
  snap({ seg: stray, look: lookup(socks, stray), call: `20 bytes ${stray.src} → ${WEB80}  ⇒ RST`, tone: 'bad', sfx: 'oops',
    en: 'A data segment from 10.10.1.11:51001 — a connection that was never opened. No ESTAB socket matches, the listener only accepts SYNs ⇒ the kernel replies RST (“reset”). nginx never sees it.',
    vi: 'Một đoạn dữ liệu từ 10.10.1.11:51001 — kết nối chưa từng được mở. Không socket ESTAB nào khớp, socket nghe chỉ nhận SYN ⇒ nhân trả RST (“reset”). nginx không hề thấy.' });
  return out;
}

/** `ss -tan` cho một ảnh chụp */
export function ssLines(socks: Sock[]): string[] {
  const pad = (x: string | number, n: number) => String(x).padEnd(n);
  return [`${pad('State', 10)} ${pad('Recv-Q', 6)} ${pad('Send-Q', 6)} ${pad('Local Address:Port', 20)} Peer Address:Port`,
    ...socks.map((k) => `${pad(k.state === 'SYN-RECV' ? 'SYN-RECV' : k.state, 10)} ${pad(k.recvQ, 6)} ${pad(k.sendQ, 6)} ${pad(k.local, 20)} ${k.peer}`)];
}

// ───────────────────────── bind ─────────────────────────
export type BindAddr = '127.0.0.1' | '0.0.0.0' | '10.10.2.20';
export type Caller = 'lo' | 'selfip' | 'web' | 'host';
export const CALLERS: Array<{ id: Caller; who: [string, string]; cmd: string; dst: string; iface: string }> = [
  { id: 'lo', who: ['a process in the SAME container', 'một tiến trình trong CÙNG container'], cmd: 'curl 127.0.0.1:3000', dst: '127.0.0.1', iface: 'lo' },
  { id: 'selfip', who: ['the same container, via its own IP', 'cùng container, gọi bằng IP của chính nó'], cmd: 'curl 10.10.2.20:3000', dst: '10.10.2.20', iface: 'lo (local route)' },
  { id: 'web', who: ['nginx in ANOTHER container (10.10.2.10)', 'nginx ở container KHÁC (10.10.2.10)'], cmd: 'proxy_pass http://10.10.2.20:3000', dst: '10.10.2.20', iface: 'eth0' },
  { id: 'host', who: ['your laptop, through docker run -p 3000:3000', 'máy của bạn, qua docker run -p 3000:3000'], cmd: 'curl localhost:3000  ⇒ DNAT ⇒ 10.10.2.20:3000', dst: '10.10.2.20', iface: 'eth0 (after DNAT)' },
];
export interface BindResult { ok: boolean; en: string; vi: string; msg: string }
export function bindResult(bind: BindAddr, c: Caller): BindResult {
  const C = CALLERS.find((x) => x.id === c)!;
  const ok = bind === '0.0.0.0' || bind === C.dst;
  if (ok) return { ok, msg: 'HTTP/1.1 200 OK', en: `dst ${C.dst}:3000 matches the listening ${bind}:3000 ⇒ connected.`, vi: `đích ${C.dst}:3000 khớp socket nghe ${bind}:3000 ⇒ kết nối được.` };
  if (c === 'host') return { ok, msg: 'curl: connection reset / empty reply (typical)', en: `Docker rewrote the destination to ${C.dst}:3000 (DNAT) and it arrived on the container’s eth0 — but the app only listens on ${bind}. The container’s kernel answers RST; docker-proxy may already have accepted, so you see a reset or an empty reply instead of “refused”.`, vi: `Docker đã đổi đích thành ${C.dst}:3000 (DNAT) và gói tới eth0 của container — nhưng ứng dụng chỉ nghe ở ${bind}. Nhân của container trả RST; docker-proxy có thể đã accept trước, nên bạn thấy bị reset hoặc trả lời rỗng thay vì “refused”.` };
  return { ok, msg: 'ECONNREFUSED — Connection refused (RST)', en: `Nobody listens on ${C.dst}:3000 — the app listens on ${bind}:3000 only ⇒ the kernel replies RST.`, vi: `Không ai nghe ở ${C.dst}:3000 — ứng dụng chỉ nghe ở ${bind}:3000 ⇒ nhân trả RST.` };
}

// ───────────────────────── ephemeral ─────────────────────────
export const EPH = { lo: 32768, hi: 60999, timeWaitS: 60 } as const;
export const EPH_PORTS = EPH.hi - EPH.lo + 1;
/** trần kết nối mới/giây tới CÙNG một ip:port đích khi mỗi kết nối đóng giữ TIME_WAIT 60 s */
export const EPH_MAX_RATE = EPH_PORTS / EPH.timeWaitS;
export interface EphState { t: number; inUse: number; free: number; failing: boolean; exhaustAt: number | null }
export function ephemeralAt(rate: number, t: number, pool = 0): EphState {
  if (pool > 0) return { t, inUse: pool, free: EPH_PORTS - pool, failing: false, exhaustAt: null };
  const exhaustAt = rate > EPH_MAX_RATE ? EPH_PORTS / rate : null;
  const inUse = Math.min(EPH_PORTS, Math.round(rate * Math.min(t, EPH.timeWaitS)));
  return { t, inUse, free: EPH_PORTS - inUse, failing: exhaustAt !== null && t >= exhaustAt, exhaustAt };
}
