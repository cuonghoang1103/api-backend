/**
 * nat — engine thuần cho mô phỏng `nat` (Chương 2.3):
 *   • home    — MASQUERADE trên homegw: viết lại địa chỉ nguồn 192.168.50.x → 198.51.100.2 khi ra wan0, ghi một dòng
 *               conntrack (bộ gốc / bộ trả lời), câu trả lời được dịch NGƯỢC theo dòng đó. Va chạm cổng: laptop và
 *               điện thoại cùng dùng cổng nguồn 41000 ⇒ bộ trả lời thứ hai sẽ trùng ⇒ nhân đổi cổng của điện thoại
 *               (lab: 41000 → 4734 — con số do NHÂN chọn, chép từ capture).
 *   • inbound — máy chủ gọi ngược: 192.168.50.10 ⇒ không có tuyến (!N); 198.51.100.2:8080 ⇒ không dòng conntrack,
 *               không DNAT ⇒ RST "Connection refused"; thêm DNAT (mở cổng) ⇒ tới laptop.
 *   • cgnat   — điện thoại 4G 100.64.0.10 sau NAT CỦA NHÀ MẠNG ⇒ máy chủ thấy 198.51.100.200; không mở cổng được.
 */
import { NAT_CONNTRACK } from './capture2';

export interface Tuple { src: string; sport: number; dst: string; dport: number }
export interface CtRow { orig: Tuple; reply: Tuple; who: string }
export const PUB = '198.51.100.2';
export const SERVER = '203.0.113.10';
/** cổng nhân chọn khi va chạm trong lần chạy thật (c23-homegw / c23-phone) */
export const LAB_COLLISION_PORT = 4734;

const same = (a: Tuple, b: Tuple) => a.src === b.src && a.sport === b.sport && a.dst === b.dst && a.dport === b.dport;
export const fmt = (t: Tuple) => `${t.src}:${t.sport} → ${t.dst}:${t.dport}`;

/**
 * SNAT/MASQUERADE một kết nối mới. Bộ trả lời mong muốn = (server → PUB:cổng gốc). Nếu một dòng khác đã giữ đúng bộ trả
 * lời đó thì câu trả lời sẽ không biết trả cho ai ⇒ phải đổi cổng. `alt` = cổng thay thế (mặc định: số nhân chọn trong lab).
 */
export function masquerade(rows: CtRow[], orig: Tuple, who: string, alt = LAB_COLLISION_PORT, pub = PUB): { row: CtRow; collided: boolean } {
  const want: Tuple = { src: orig.dst, sport: orig.dport, dst: pub, dport: orig.sport };
  const collided = rows.some((r) => same(r.reply, want));
  let port = orig.sport;
  if (collided) {
    port = alt;
    while (rows.some((r) => r.reply.dport === port && r.reply.src === orig.dst && r.reply.sport === orig.dport)) port++;
  }
  return { row: { orig, reply: { ...want, dport: port }, who }, collided };
}
/** gói trả lời tới PUB:port ⇒ tìm dòng có bộ trả lời khớp ⇒ đích thật */
export function unNat(rows: CtRow[], reply: Tuple): Tuple | undefined {
  const r = rows.find((x) => same(x.reply, reply));
  return r ? { src: reply.src, sport: reply.sport, dst: r.orig.src, dport: r.orig.sport } : undefined;
}
/** đọc một dòng `conntrack -L` thật */
export function parseConntrack(line: string): { orig: Tuple; reply: Tuple } {
  const kv = [...line.matchAll(/(src|dst|sport|dport)=(\S+)/g)].map((m) => m[2]);
  const t = (k: number): Tuple => ({ src: kv[k], sport: Number(kv[k + 2]), dst: kv[k + 1], dport: Number(kv[k + 3]) });
  return { orig: t(0), reply: t(4) };
}
export const REAL_ROWS = NAT_CONNTRACK.map(parseConntrack);

export type Where = 'lan' | 'wan' | 'back' | 'in';
export interface Pkt { where: Where; t: Tuple; rewritten?: 'src' | 'dst'; note?: string }
export interface NatStep {
  rows: CtRow[];
  pkt?: Pkt;
  /** dòng tcpdump thật đang sáng: [phía lan0, phía wan0] (chỉ số NAT_LAN_SYN / NAT_WAN_SYN) */
  lan?: number; wan?: number;
  seen?: string;
  collided?: boolean;
  focus: 'laptop' | 'phone' | 'homegw' | 'server' | 'isp' | 'mobile';
  en: string; vi: string; tone?: 'ok' | 'warn' | 'bad';
  sfx?: 'whoosh' | 'pop' | 'hit' | 'miss' | 'oops' | 'tick' | 'right' | 'thud' | 'on';
}

export function homeScript(): NatStep[] {
  const rows: CtRow[] = [];
  const out: NatStep[] = [];
  const push = (s: Omit<NatStep, 'rows'>) => out.push({ ...s, rows: rows.map((r) => ({ ...r })) });
  push({ focus: 'homegw', sfx: 'tick',
    en: 'Home network 192.168.50.0/24 uses PRIVATE addresses: the Internet has no route back to them. homegw has one public address, 198.51.100.2, and one rule: “-A POSTROUTING -o wan0 -j MASQUERADE” — rewrite the source of everything that leaves through wan0. conntrack (the kernel’s table of connections) is empty.',
    vi: 'Mạng nhà 192.168.50.0/24 dùng địa chỉ RIÊNG: Internet không có tuyến quay về chúng. homegw có một địa chỉ công cộng 198.51.100.2 và một luật: “-A POSTROUTING -o wan0 -j MASQUERADE” — viết lại địa chỉ nguồn của mọi thứ đi ra wan0. conntrack (bảng kết nối của nhân) đang trống.' });
  // 1) laptop, cổng tự chọn 41122
  const c1: Tuple = { src: '192.168.50.10', sport: 41122, dst: SERVER, dport: 80 };
  push({ focus: 'laptop', lan: 0, pkt: { where: 'lan', t: c1 }, sfx: 'whoosh',
    en: 'The laptop runs curl http://203.0.113.10/. Its SYN (“let’s connect”) leaves with source 192.168.50.10, port 41122 — the kernel picked that port. This is the packet seen on lan0.',
    vi: 'Laptop chạy curl http://203.0.113.10/. Gói SYN (“kết nối nhé”) đi với nguồn 192.168.50.10, cổng 41122 — nhân tự chọn cổng đó. Đây là gói thấy trên lan0.' });
  const a1 = masquerade(rows, c1, 'laptop'); rows.push(a1.row);
  push({ focus: 'homegw', lan: 0, wan: 0, pkt: { where: 'wan', t: { ...c1, src: PUB, sport: a1.row.reply.dport }, rewritten: 'src' }, sfx: 'pop',
    en: 'On wan0 the SAME packet now says source 198.51.100.2:41122. homegw wrote a conntrack row: original tuple (what the laptop sent) and reply tuple (what the answer will look like). Port 41122 was free, so it kept it.',
    vi: 'Trên wan0 CÙNG gói đó giờ ghi nguồn 198.51.100.2:41122. homegw ghi một dòng conntrack: bộ gốc (thứ laptop gửi) và bộ trả lời (câu trả lời sẽ trông thế nào). Cổng 41122 còn trống nên giữ nguyên.' });
  push({ focus: 'server', seen: 'you came from 198.51.100.2 port 41122', pkt: { where: 'back', t: { src: SERVER, sport: 80, dst: c1.src, dport: 41122 }, rewritten: 'dst', note: '198.51.100.2:41122 → 192.168.50.10:41122' }, sfx: 'hit', tone: 'ok',
    en: 'The server only ever sees 198.51.100.2 — it answers to 198.51.100.2:41122. homegw finds the row whose reply tuple matches and rewrites the destination back to 192.168.50.10:41122. The laptop never knows.',
    vi: 'Máy chủ chỉ thấy 198.51.100.2 — nó trả lời về 198.51.100.2:41122. homegw tìm dòng có bộ trả lời khớp và viết lại đích thành 192.168.50.10:41122. Laptop không hề biết.' });
  // 2) laptop --local-port 41000
  const c2: Tuple = { src: '192.168.50.10', sport: 41000, dst: SERVER, dport: 80 };
  push({ focus: 'laptop', lan: 1, pkt: { where: 'lan', t: c2 }, sfx: 'whoosh',
    en: 'Now the laptop deliberately uses source port 41000 (curl --local-port 41000).',
    vi: 'Giờ laptop cố ý dùng cổng nguồn 41000 (curl --local-port 41000).' });
  const a2 = masquerade(rows, c2, 'laptop'); rows.push(a2.row);
  push({ focus: 'homegw', lan: 1, wan: 1, seen: 'you came from 198.51.100.2 port 41000', pkt: { where: 'wan', t: { ...c2, src: PUB, sport: a2.row.reply.dport }, rewritten: 'src' }, sfx: 'pop',
    en: 'Reply tuple “203.0.113.10:80 → 198.51.100.2:41000” is not used by any row, so the port stays 41000. The server says “you came from 198.51.100.2 port 41000”.',
    vi: 'Bộ trả lời “203.0.113.10:80 → 198.51.100.2:41000” chưa dòng nào dùng, nên cổng giữ 41000. Máy chủ nói “you came from 198.51.100.2 port 41000”.' });
  // 3) phone, cũng 41000
  const c3: Tuple = { src: '192.168.50.11', sport: 41000, dst: SERVER, dport: 80 };
  push({ focus: 'phone', lan: 2, pkt: { where: 'lan', t: c3 }, sfx: 'whoosh', tone: 'warn',
    en: 'The phone on the same Wi-Fi ALSO uses source port 41000 to the same server. Inside the home that is fine: different source IP. But after NAT both would be 198.51.100.2:41000…',
    vi: 'Điện thoại cùng Wi-Fi CŨNG dùng cổng nguồn 41000 tới cùng máy chủ. Trong nhà thì không sao: khác IP nguồn. Nhưng sau NAT cả hai sẽ đều là 198.51.100.2:41000…' });
  const a3 = masquerade(rows, c3, 'phone'); rows.push(a3.row);
  push({ focus: 'homegw', lan: 2, wan: 2, collided: a3.collided, pkt: { where: 'wan', t: { ...c3, src: PUB, sport: a3.row.reply.dport }, rewritten: 'src', note: '41000 → 4734' }, sfx: 'oops', tone: 'warn',
    en: `Collision! The reply tuple “…→ 198.51.100.2:41000” already belongs to the laptop’s row — an answer could not tell the two apart. So homegw rewrites the PORT too: 41000 → ${a3.row.reply.dport} (the number the kernel chose in the lab). That is NAPT — “port address translation”.`,
    vi: `Va chạm! Bộ trả lời “…→ 198.51.100.2:41000” đã thuộc dòng của laptop — câu trả lời sẽ không phân biệt được hai máy. Nên homegw viết lại cả CỔNG: 41000 → ${a3.row.reply.dport} (con số nhân chọn trong lab). Đó là NAPT — “dịch địa chỉ kèm cổng”.` });
  push({ focus: 'server', seen: 'you came from 198.51.100.2 port 4734', collided: true, pkt: { where: 'back', t: { src: SERVER, sport: 80, dst: c3.src, dport: 41000 }, rewritten: 'dst', note: '198.51.100.2:4734 → 192.168.50.11:41000' }, sfx: 'hit', tone: 'ok',
    en: 'The server sees port 4734. Its answer to 198.51.100.2:4734 matches the phone’s row ⇒ rewritten to 192.168.50.11:41000. The phone still believes it used port 41000.',
    vi: 'Máy chủ thấy cổng 4734. Câu trả lời tới 198.51.100.2:4734 khớp dòng của điện thoại ⇒ viết lại thành 192.168.50.11:41000. Điện thoại vẫn tin nó đã dùng cổng 41000.' });
  push({ focus: 'homegw', collided: true, sfx: 'right', tone: 'ok',
    en: 'The real `conntrack -L` on homegw: three rows, two original tuples with port 41000, three DIFFERENT reply tuples. Three devices, one public IP — told apart only by the port. (65 535 ports per destination is why one home IP can carry a whole family.)',
    vi: '`conntrack -L` thật trên homegw: ba dòng, hai bộ gốc cùng cổng 41000, ba bộ trả lời KHÁC nhau. Ba thiết bị, một IP công cộng — phân biệt chỉ bằng cổng. (65 535 cổng cho mỗi đích là lý do một IP nhà chở được cả gia đình.)' });
  return out;
}

export interface InStep { phase: 'intro' | 'private' | 'refused' | 'dnat' | 'ok'; focus: NatStep['focus']; en: string; vi: string; tone?: NatStep['tone']; sfx?: NatStep['sfx']; lines: number[] }
export function inboundScript(dnat: boolean): InStep[] {
  const out: InStep[] = [
    { phase: 'intro', focus: 'server', lines: [], sfx: 'tick',
      en: 'The other direction: the laptop runs a dev server on port 8080 and you want to show it to a friend. The server on the Internet (203.0.113.10) tries to connect to it.',
      vi: 'Chiều ngược lại: laptop chạy một dev server ở cổng 8080 và bạn muốn khoe với bạn bè. Máy chủ ngoài Internet (203.0.113.10) thử kết nối tới nó.' },
    { phase: 'private', focus: 'server', lines: [0, 1, 2, 3], sfx: 'thud', tone: 'bad',
      en: 'Try the laptop’s own address 192.168.50.10: “Network is unreachable”. The first router (dc, 203.0.113.1) answers !N — no route. Private addresses (192.168.x.x, 10.x, 172.16–31.x) are never announced on the Internet; thousands of homes use the same 192.168.50.10.',
      vi: 'Thử địa chỉ của chính laptop 192.168.50.10: “Network is unreachable”. Router đầu tiên (dc, 203.0.113.1) trả !N — không có tuyến. Địa chỉ riêng (192.168.x.x, 10.x, 172.16–31.x) không bao giờ được quảng bá trên Internet; hàng nghìn nhà cùng dùng 192.168.50.10.' },
    { phase: 'refused', focus: 'homegw', lines: [4, 5], sfx: 'oops', tone: 'bad',
      en: 'Try the public address 198.51.100.2:8080: it reaches homegw — and “Connection refused”. This SYN starts a NEW connection, so there is no conntrack row to reverse, and no rule says where to send it. homegw itself has nothing on 8080 ⇒ its kernel answers RST.',
      vi: 'Thử địa chỉ công cộng 198.51.100.2:8080: tới được homegw — và “Connection refused”. SYN này mở kết nối MỚI, nên không có dòng conntrack nào để dịch ngược, cũng không luật nào nói gửi nó đi đâu. Bản thân homegw không có gì ở 8080 ⇒ nhân của nó trả RST.' },
  ];
  if (dnat) {
    out.push({ phase: 'dnat', focus: 'homegw', lines: [], sfx: 'on',
      en: 'Port forwarding = a DNAT rule (destination NAT) on homegw: “packets arriving on wan0 for TCP port 8080 ⇒ change the DESTINATION to 192.168.50.10:8080”. MASQUERADE rewrote the source of outgoing packets; DNAT rewrites the destination of incoming ones.',
      vi: 'Mở cổng (port forwarding) = một luật DNAT (NAT đích) trên homegw: “gói tới wan0 cho cổng TCP 8080 ⇒ đổi ĐÍCH thành 192.168.50.10:8080”. MASQUERADE viết lại nguồn của gói đi ra; DNAT viết lại đích của gói đi vào.' });
    out.push({ phase: 'ok', focus: 'laptop', lines: [], sfx: 'right', tone: 'ok',
      en: 'Again: curl http://198.51.100.2:8080/ ⇒ “hello from the laptop dev server (192.168.50.10:8080)”. homegw rewrote the destination and wrote a conntrack row, so the laptop’s answer is rewritten back to come from 198.51.100.2:8080.',
      vi: 'Thử lại: curl http://198.51.100.2:8080/ ⇒ “hello from the laptop dev server (192.168.50.10:8080)”. homegw viết lại đích và ghi một dòng conntrack, nên câu trả lời của laptop được viết ngược lại thành đến từ 198.51.100.2:8080.' });
  }
  return out;
}

export interface CgStep { phase: 'intro' | 'snat' | 'seen' | 'inbound' | 'docker'; focus: NatStep['focus']; en: string; vi: string; tone?: NatStep['tone']; sfx?: NatStep['sfx'] }
export function cgnatScript(): CgStep[] {
  return [
    { phase: 'intro', focus: 'mobile', sfx: 'tick',
      en: 'A 4G phone. Its address is 100.64.0.10 — from 100.64.0.0/10, the range reserved for carrier-grade NAT (CGNAT). It is not private like 192.168.x, but it is not public either: it only exists inside the ISP.',
      vi: 'Một điện thoại 4G. Địa chỉ của nó là 100.64.0.10 — thuộc 100.64.0.0/10, dải dành riêng cho NAT cấp nhà mạng (CGNAT). Nó không phải địa chỉ riêng kiểu 192.168.x, nhưng cũng không công cộng: nó chỉ tồn tại bên trong nhà mạng.' },
    { phase: 'snat', focus: 'isp', sfx: 'pop',
      en: 'The NAT is on the ISP’s router, not in your home: “-s 100.64.0.0/24 -o ix0 -j SNAT --to-source 198.51.100.200”. The conntrack row lives in the ISP’s kernel, shared with thousands of other customers.',
      vi: 'NAT nằm trên router của NHÀ MẠNG, không phải trong nhà bạn: “-s 100.64.0.0/24 -o ix0 -j SNAT --to-source 198.51.100.200”. Dòng conntrack nằm trong nhân của nhà mạng, chung với hàng nghìn khách khác.' },
    { phase: 'seen', focus: 'server', sfx: 'hit',
      en: 'The server sees 198.51.100.200 port 47852. Rate-limit or ban by IP and you hit everyone behind that CGNAT address at once.',
      vi: 'Máy chủ thấy 198.51.100.200 cổng 47852. Giới hạn tốc độ hay chặn theo IP là trúng mọi người đứng sau địa chỉ CGNAT đó cùng lúc.' },
    { phase: 'inbound', focus: 'isp', sfx: 'oops', tone: 'bad',
      en: 'Inbound to 198.51.100.200:8080 ⇒ “Connection refused”. To forward a port you need a DNAT rule on the box that does the NAT — and that box belongs to the ISP. On 4G (and many fibre plans) you simply cannot host a server. Fixes: IPv6, a tunnel (Cloudflare Tunnel, ngrok, Tailscale) or a VPS.',
      vi: 'Gọi vào 198.51.100.200:8080 ⇒ “Connection refused”. Muốn mở cổng thì cần luật DNAT trên đúng hộp làm NAT — mà hộp đó của nhà mạng. Trên 4G (và nhiều gói cáp quang) bạn đơn giản là không mở máy chủ được. Cách thoát: IPv6, đường hầm (Cloudflare Tunnel, ngrok, Tailscale) hoặc một VPS.' },
    { phase: 'docker', focus: 'homegw', sfx: 'right', tone: 'ok',
      en: 'You already use DNAT every day: docker run -p 18080:80 adds “-A DOCKER … --dport 18080 -j DNAT --to-destination 172.17.0.5:80”, and containers go out through MASQUERADE. Docker is a small NAT router inside your laptop.',
      vi: 'Bạn vẫn dùng DNAT hằng ngày: docker run -p 18080:80 thêm “-A DOCKER … --dport 18080 -j DNAT --to-destination 172.17.0.5:80”, và container đi ra ngoài qua MASQUERADE. Docker là một router NAT nhỏ bên trong laptop của bạn.' },
  ];
}
