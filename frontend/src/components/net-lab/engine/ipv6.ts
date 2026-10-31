/**
 * ipv6 — engine thuần cho mô phỏng `ipv6` (Chương 2.4):
 *   • addr      — viết gọn / viết đủ địa chỉ IPv6 theo RFC 5952: bỏ số 0 đứng đầu mỗi nhóm, MỘT dấu "::" cho dãy nhóm 0
 *                 DÀI NHẤT (≥ 2 nhóm; bằng nhau thì dãy ĐẦU TIÊN — cái bẫy kinh điển). /64 = 2^64 địa chỉ. EUI-64:
 *                 MAC → link-local fe80:: (lật bit 7 của byte đầu, chèn ff:fe). NDP: địa chỉ multicast solicited-node.
 *   • happy     — Happy Eyeballs: tên có AAAA + A, đường IPv6 hỏng lặng lẽ ⇒ curl / Node 22 tự lùi về IPv4 (số đo thật);
 *                 tắt autoselect ⇒ chờ mãi (nhân bỏ cuộc sau ~127 s — TÍNH RA từ tcp_syn_retries = 6).
 *   • localhost — "localhost" = ::1 rồi 127.0.0.1; máy chủ dev chỉ nghe 127.0.0.1 ⇒ Node không autoselect: ECONNREFUSED ::1.
 * So khớp: ipaddress của Python (c24-dia-chi), ip -6 addr (fe80::c0ff:fea8:320a), tcpdump NDP (ff02::1:ff00:11).
 */

/** 8 nhóm 16 bit (số), hoặc null nếu không phải địa chỉ IPv6 hợp lệ */
export function parse6(s: string): number[] | null {
  const t = s.trim().toLowerCase();
  if (!/^[0-9a-f:]+$/.test(t) || (t.match(/::/g) ?? []).length > 1) return null;
  const [h, tail] = t.includes('::') ? t.split('::') : [t, undefined];
  const ps = (x: string) => (x === '' ? [] : x.split(':'));
  const head = ps(h), back = tail === undefined ? [] : ps(tail);
  const fill = tail === undefined ? 0 : 8 - head.length - back.length;
  if (tail === undefined ? head.length !== 8 : fill < 1) return null;
  const g = [...head, ...Array(fill).fill('0'), ...back];
  if (g.some((x) => !/^[0-9a-f]{1,4}$/.test(x))) return null;
  return g.map((x) => parseInt(x, 16));
}
export const exploded = (g: number[]) => g.map((x) => x.toString(16).padStart(4, '0')).join(':');
export interface Run { start: number; len: number }
export function zeroRuns(g: number[]): Run[] {
  const out: Run[] = [];
  for (let i = 0; i < 8; i++) {
    if (g[i] !== 0) continue;
    let j = i;
    while (j < 8 && g[j] === 0) j++;
    out.push({ start: i, len: j - i });
    i = j;
  }
  return out;
}
/** dãy được thay bằng "::": dài nhất, ≥ 2 nhóm, bằng nhau thì dãy đầu tiên (RFC 5952 §4.2.3) */
export function bestRun(g: number[]): Run | undefined {
  let best: Run | undefined;
  for (const r of zeroRuns(g)) if (r.len >= 2 && (!best || r.len > best.len)) best = r;
  return best;
}
export function compressWith(g: number[], run: Run | undefined): string {
  const h = g.map((x) => x.toString(16));
  if (!run) return h.join(':');
  return `${h.slice(0, run.start).join(':')}::${h.slice(run.start + run.len).join(':')}`;
}
export const compress = (g: number[]) => compressWith(g, bestRun(g));

export interface CompressView { full: string; groups: string[]; noLead: string[]; runs: Run[]; best?: Run; result: string }
export function compressView(s: string): CompressView | null {
  const g = parse6(s);
  if (!g) return null;
  return { full: exploded(g), groups: exploded(g).split(':'), noLead: g.map((x) => x.toString(16)), runs: zeroRuns(g), best: bestRun(g), result: compress(g) };
}

/** EUI-64: MAC 48 bit ⇒ định danh giao diện 64 bit ⇒ fe80::/64 */
export interface Eui { mac: string; flipped: string; withFffe: string; iid: string; linkLocal: string }
export function eui64(mac: string): Eui {
  const b = mac.toLowerCase().split(':').map((x) => parseInt(x, 16));
  const f = [b[0] ^ 0x02, ...b.slice(1)];
  const e = [f[0], f[1], f[2], 0xff, 0xfe, f[3], f[4], f[5]];
  const hx = (n: number) => n.toString(16).padStart(2, '0');
  const groups = [0xfe80, 0, 0, 0, (e[0] << 8) | e[1], (e[2] << 8) | e[3], (e[4] << 8) | e[5], (e[6] << 8) | e[7]];
  return { mac, flipped: f.map(hx).join(':'), withFffe: e.map(hx).join(':'), iid: [0, 2, 4, 6].map((i) => hx(e[i]) + hx(e[i + 1])).join(':'), linkLocal: compress(groups) };
}
/** địa chỉ multicast solicited-node: ff02::1:ff + 24 bit cuối */
export function solicitedNode(addr: string): string {
  const g = parse6(addr)!;
  return compress([0xff02, 0, 0, 0, 0, 1, 0xff00 | (g[6] & 0xff), g[7]]);
}
/** số địa chỉ trong một /p (BigInt, chuỗi thập phân) */
export function count6(p: number): string {
  // 2^(128 − p) bằng phép nhân đôi trên chuỗi thập phân (không cần BigInt — tsconfig nhắm ES cũ hơn 2020)
  let d = [1];
  for (let k = 0; k < 128 - p; k++) {
    let c = 0;
    d = d.map((x) => { const y = x * 2 + c; c = y >= 10 ? 1 : 0; return y % 10; });
    if (c) d.push(c);
  }
  return d.reverse().join('');
}

// ───────── Happy Eyeballs ─────────
export const HE = {
  curlV4At: 200, // curl: --happy-eyeballs-timeout-ms mặc định 200 (tài liệu curl)
  curlConnect: 210.868, // ms — time_connect thật (c24-happy)
  nodeAttempt: 250, // Node: autoSelectFamilyAttemptTimeout mặc định 250 ms (tài liệu Node)
  nodeTotal: 324, // ms — thật
  noAuto: 8002, // ms — thật, bị huỷ bằng AbortSignal.timeout(8000)
  curl6: 5003, // ms — thật (curl -6 -m 5)
  synRetries: 6,
} as const;
/** nhân bỏ cuộc một SYN không ai trả lời: 1 + 2 + 4 + … (gấp đôi mỗi lần, tcp_syn_retries lần thử lại) — TÍNH RA */
export const synGiveUpS = (retries: number = HE.synRetries) => Array.from({ length: retries + 1 }, (_, k) => 2 ** k).reduce((a, b) => a + b, 0);

export interface Bar { fam: 4 | 6; start: number; end: number; ok: boolean; real: boolean; label: string }
export interface HappyRow { who: string; bars: Bar[]; result: string; real: boolean }
export interface HappyStep { phase: 'dns' | 'try6' | 'try4' | 'connected' | 'node' | 'noauto' | 'force6' | 'v6ok'; rows: number; family: '' | '4' | '6'; connected: boolean; en: string; vi: string; tone?: 'ok' | 'warn' | 'bad'; sfx?: 'whoosh' | 'pop' | 'hit' | 'miss' | 'oops' | 'tick' | 'right' | 'thud' }
export function happyRows(broken: boolean): HappyRow[] {
  if (!broken) return [{ who: 'curl', bars: [{ fam: 6, start: 0, end: 2, ok: true, real: false, label: '[2001:db8:d::10]:80' }], result: 'Established … (2001:db8:d::10 port 80)', real: true }];
  return [
    { who: 'curl', bars: [{ fam: 6, start: 0, end: HE.curlConnect, ok: false, real: false, label: '[2001:db8:d::10]:80' }, { fam: 4, start: HE.curlV4At, end: HE.curlConnect, ok: true, real: true, label: '203.0.113.10:80' }], result: 'connected to 203.0.113.10 after 0.210868 s', real: true },
    { who: 'node 22 fetch', bars: [{ fam: 6, start: 0, end: HE.nodeAttempt, ok: false, real: false, label: 'v6' }, { fam: 4, start: HE.nodeAttempt, end: HE.nodeTotal, ok: true, real: true, label: 'v4' }], result: 'after 324 ms', real: true },
    { who: 'node --no-network-family-autoselection', bars: [{ fam: 6, start: 0, end: HE.noAuto, ok: false, real: true, label: 'v6 …' }], result: 'TimeoutError after 8002 ms', real: true },
    { who: 'curl -6', bars: [{ fam: 6, start: 0, end: HE.curl6, ok: false, real: true, label: 'v6 only' }], result: 'Connection timed out after 5003 milliseconds', real: true },
  ];
}
export function happyScript(broken: boolean): HappyStep[] {
  const dns: HappyStep = { phase: 'dns', rows: 0, family: '', connected: false, sfx: 'tick',
    en: `labflow.test has TWO addresses: an AAAA record (IPv6 2001:db8:d::10) and an A record (IPv4 203.0.113.10). The system lists IPv6 first.${broken ? ' But today the ISP silently drops every IPv6 packet to the data centre — no error message comes back.' : ''}`,
    vi: `labflow.test có HAI địa chỉ: bản ghi AAAA (IPv6 2001:db8:d::10) và bản ghi A (IPv4 203.0.113.10). Hệ thống xếp IPv6 lên trước.${broken ? ' Nhưng hôm nay nhà mạng lặng lẽ vứt mọi gói IPv6 tới trung tâm dữ liệu — không có thông báo lỗi nào quay về.' : ''}` };
  if (!broken) return [dns,
    { phase: 'try6', rows: 1, family: '6', connected: true, sfx: 'hit', tone: 'ok',
      en: 'curl tries [2001:db8:d::10]:80 first and it answers: “Established connection … from 2001:db8:a:50::10”. The server sees the laptop’s OWN address — IPv6 needs no NAT.',
      vi: 'curl thử [2001:db8:d::10]:80 trước và nó trả lời: “Established connection … from 2001:db8:a:50::10”. Máy chủ thấy địa chỉ CỦA CHÍNH laptop — IPv6 không cần NAT.' },
    { phase: 'v6ok', rows: 1, family: '6', connected: true, sfx: 'right', tone: 'ok',
      en: 'When IPv6 works, it simply wins. Now switch “IPv6 path silently broken” on to see what protects users when it does not.',
      vi: 'Khi IPv6 chạy được thì nó đơn giản là thắng. Giờ bật “đường IPv6 hỏng lặng lẽ” để xem thứ gì bảo vệ người dùng khi nó không chạy.' }];
  return [dns,
    { phase: 'try6', rows: 1, family: '', connected: false, sfx: 'whoosh', tone: 'warn',
      en: 'curl sends a SYN to [2001:db8:d::10]:80… and hears nothing. No “refused”, no “unreachable” — silence. Without help it would wait for the kernel’s retries: about 127 s (computed: 1 + 2 + 4 + 8 + 16 + 32 + 64 with tcp_syn_retries = 6).',
      vi: 'curl gửi SYN tới [2001:db8:d::10]:80… và không nghe thấy gì. Không “refused”, không “unreachable” — im lặng. Không ai giúp thì nó sẽ chờ nhân thử lại: khoảng 127 s (tính ra: 1 + 2 + 4 + 8 + 16 + 32 + 64 với tcp_syn_retries = 6).' },
    { phase: 'try4', rows: 1, family: '', connected: false, sfx: 'pop',
      en: 'Happy Eyeballs: after 200 ms without an answer (curl’s default), curl starts a SECOND attempt to 203.0.113.10:80 in parallel — “Trying 203.0.113.10:80…”. Whichever connects first wins.',
      vi: 'Happy Eyeballs (“mắt vui vẻ”): sau 200 ms không có trả lời (mặc định của curl), curl mở thêm lần thử THỨ HAI tới 203.0.113.10:80 song song — “Trying 203.0.113.10:80…”. Bên nào kết nối trước thì thắng.' },
    { phase: 'connected', rows: 1, family: '4', connected: true, sfx: 'hit', tone: 'ok',
      en: 'IPv4 answers at once: “connected to 203.0.113.10 after 0.210868 s” (real). The user lost about 0.2 s and noticed nothing.',
      vi: 'IPv4 trả lời ngay: “connected to 203.0.113.10 after 0.210868 s” (thật). Người dùng mất chừng 0,2 s và không nhận ra gì.' },
    { phase: 'node', rows: 2, family: '4', connected: true, sfx: 'hit', tone: 'ok',
      en: 'Node.js 22 does the same (it is called “network family autoselection”, 250 ms per attempt by default): fetch() got the page via IPv4 after 324 ms (real).',
      vi: 'Node.js 22 cũng làm vậy (gọi là “network family autoselection”, mặc định 250 ms mỗi lần thử): fetch() lấy được trang qua IPv4 sau 324 ms (thật).' },
    { phase: 'noauto', rows: 3, family: '4', connected: true, sfx: 'thud', tone: 'bad',
      en: 'Turn that off (node --no-network-family-autoselection, the behaviour of old Node versions): it tries ONLY the first address, IPv6, and waits. We gave up at 8 s — “TimeoutError after 8002 ms” (real). Your app would hang far longer.',
      vi: 'Tắt nó đi (node --no-network-family-autoselection, cách Node đời cũ chạy): nó CHỈ thử địa chỉ đầu tiên, IPv6, rồi chờ. Ta bỏ cuộc ở 8 s — “TimeoutError after 8002 ms” (thật). Ứng dụng của bạn sẽ treo lâu hơn nhiều.' },
    { phase: 'force6', rows: 4, family: '4', connected: true, sfx: 'right', tone: 'warn',
      en: 'curl -6 (IPv6 only) proves the IPv6 path is dead: timeout after 5003 ms (real). Lesson: “IPv6 is broken” rarely shows up as an error — it shows up as SLOW, and only for clients without Happy Eyeballs.',
      vi: 'curl -6 (chỉ IPv6) chứng minh đường IPv6 đã chết: hết giờ sau 5003 ms (thật). Bài học: “IPv6 hỏng” hiếm khi hiện ra thành lỗi — nó hiện ra thành CHẬM, và chỉ với client không có Happy Eyeballs.' },
  ];
}

// ───────── localhost ─────────
export interface LhStep { phase: 'listen' | 'resolve' | 'curl' | 'node' | 'noauto' | 'server' | 'v4only' | 'mapped'; en: string; vi: string; tone?: 'ok' | 'warn' | 'bad'; sfx?: HappyStep['sfx']; lines: number[] }
export function localhostScript(): LhStep[] {
  return [
    { phase: 'listen', lines: [3], sfx: 'tick',
      en: 'A dev server listens on 127.0.0.1:5000 — IPv4 loopback only (ss shows “127.0.0.1:5000”). Very common: Vite, Flask, many configs bind 127.0.0.1.',
      vi: 'Một dev server nghe ở 127.0.0.1:5000 — chỉ loopback IPv4 (ss ghi “127.0.0.1:5000”). Rất hay gặp: Vite, Flask, nhiều cấu hình bind 127.0.0.1.' },
    { phase: 'resolve', lines: [0, 1, 2, 4], sfx: 'pop', tone: 'warn',
      en: '“localhost” is a NAME with two addresses: ::1 (IPv6 loopback) FIRST, then 127.0.0.1. getent and Node’s dns.lookup agree.',
      vi: '“localhost” là một TÊN có hai địa chỉ: ::1 (loopback IPv6) TRƯỚC, rồi mới 127.0.0.1. getent và dns.lookup của Node đều nói vậy.' },
    { phase: 'curl', lines: [5], sfx: 'hit', tone: 'ok',
      en: 'curl http://localhost:5000/ works: it tries ::1, gets refused instantly (nobody listens on ::1 port 5000), then tries 127.0.0.1 ⇒ “dev server on 127.0.0.1:5000”.',
      vi: 'curl http://localhost:5000/ chạy được: nó thử ::1, bị từ chối ngay (không ai nghe ở ::1 cổng 5000), rồi thử 127.0.0.1 ⇒ “dev server on 127.0.0.1:5000”.' },
    { phase: 'node', lines: [6], sfx: 'hit', tone: 'ok',
      en: 'Node 22 fetch also works — autoselection tries the next address after ::1 fails.',
      vi: 'fetch của Node 22 cũng chạy — autoselection thử địa chỉ kế tiếp khi ::1 thất bại.' },
    { phase: 'noauto', lines: [7], sfx: 'oops', tone: 'bad',
      en: 'Without autoselection (Node 17–19, or the flag): it tries ONLY ::1 ⇒ “ECONNREFUSED ::1:5000”. The famous “but the server IS running!” bug. Fixes: use 127.0.0.1 in the URL, or make the server listen on both.',
      vi: 'Không có autoselection (Node 17–19, hoặc bật cờ): nó CHỈ thử ::1 ⇒ “ECONNREFUSED ::1:5000”. Lỗi nổi tiếng “nhưng server ĐANG chạy mà!”. Cách sửa: dùng 127.0.0.1 trong URL, hoặc cho server nghe cả hai.' },
    { phase: 'server', lines: [], sfx: 'tick',
      en: 'Server side, on 203.0.113.10: one app listens on 0.0.0.0:3000 (every IPv4 address — IPv4 ONLY), another on *:3001, i.e. “::” (every address, IPv6 and IPv4).',
      vi: 'Phía máy chủ, trên 203.0.113.10: một app nghe ở 0.0.0.0:3000 (mọi địa chỉ IPv4 — CHỈ IPv4), app kia ở *:3001, tức “::” (mọi địa chỉ, cả IPv6 lẫn IPv4).' },
    { phase: 'v4only', lines: [], sfx: 'oops', tone: 'bad',
      en: 'The laptop calls port 3000 over IPv4: “v4-only app sees 198.51.100.2”. Over IPv6: “Could not connect to server” — 0.0.0.0 does not include IPv6.',
      vi: 'Laptop gọi cổng 3000 qua IPv4: “v4-only app sees 198.51.100.2”. Qua IPv6: “Could not connect to server” — 0.0.0.0 không bao gồm IPv6.' },
    { phase: 'mapped', lines: [], sfx: 'right', tone: 'ok',
      en: 'Port 3001 (::) accepts both — and an IPv4 client appears as “::ffff:198.51.100.2”, an IPv4-mapped IPv6 address. If your logs, allow-lists or rate limiters compare against “198.51.100.2”, strip the “::ffff:” first.',
      vi: 'Cổng 3001 (::) nhận cả hai — và client IPv4 hiện ra là “::ffff:198.51.100.2”, địa chỉ IPv6 ánh xạ IPv4. Nếu log, danh sách cho phép hay bộ giới hạn tốc độ của bạn so với “198.51.100.2”, hãy bỏ “::ffff:” trước.' },
  ];
}
