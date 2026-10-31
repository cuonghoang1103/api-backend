/**
 * encap — engine thuần cho mô phỏng `encap` (đóng gói): MỘT request đi xuống ngăn xếp, qua dây, rồi đi lên lại.
 *
 *   • giải mã frame THẬT 149 byte `GET /api/hello` (capture.ts) thành từng trường, kèm vị trí byte để tô trong hex dump;
 *   • dãy bước gửi (app → TCP → IP → Ethernet → NIC → dây) rồi nhận (router đổi vỏ Ethernet, máy web bóc dần vỏ);
 *   • `hop`: dựng lại frame phía web từ frame phía client (đổi MAC, TTL − 1, tính lại checksum IP) — phải ra đúng
 *     0x3d52 như tshark đo ở phía bên kia router;
 *   • `mtu`: cắt câu trả lời 3991 byte theo MTU (1500 đo trong lab; 1420 / 9000 là TÍNH RA).
 */
import { HELLO_BYTES, HOP_FIELDS, MAC } from './capture';

export type LayerId = 'eth' | 'ip' | 'tcp' | 'http';
export const LAYERS: LayerId[] = ['eth', 'ip', 'tcp', 'http'];
export const LAYER_RANGE: Record<LayerId, [number, number]> = { eth: [0, 14], ip: [14, 34], tcp: [34, 66], http: [66, 149] };
export const LAYER_COLOR: Record<LayerId, string> = { eth: '#7c3aed', ip: '#0891b2', tcp: '#d97706', http: '#16a34a' };
export const LAYER_NAME: Record<LayerId, [string, string]> = {
  eth: ['Ethernet (layer 2, the link)', 'Ethernet (tầng 2, đường nối)'],
  ip: ['IPv4 (layer 3, the network)', 'IPv4 (tầng 3, mạng)'],
  tcp: ['TCP (layer 4, transport)', 'TCP (tầng 4, vận chuyển)'],
  http: ['HTTP (layer 7, the app’s bytes)', 'HTTP (tầng 7, byte của ứng dụng)'],
};
export const layerOf = (off: number): LayerId => (off < 14 ? 'eth' : off < 34 ? 'ip' : off < 66 ? 'tcp' : 'http');

const hex2 = (b: number) => b.toString(16).padStart(2, '0');
export const macAt = (B: readonly number[], o: number) => B.slice(o, o + 6).map(hex2).join(':');
export const ipAt = (B: readonly number[], o: number) => B.slice(o, o + 4).join('.');
export const u16 = (B: readonly number[], o: number) => (B[o] << 8) | B[o + 1];
export const u32 = (B: readonly number[], o: number) => ((B[o] << 24) >>> 0) + (B[o + 1] << 16) + (B[o + 2] << 8) + B[o + 3];
export const hex4 = (n: number) => `0x${n.toString(16).padStart(4, '0')}`;

/** Checksum IPv4 (RFC 791): tổng bù-một của các từ 16 bit trong header, ô checksum coi như 0. */
export function ipChecksum(B: readonly number[], ipOff = 14): number {
  const ihl = (B[ipOff] & 0x0f) * 4;
  let sum = 0;
  for (let i = 0; i < ihl; i += 2) if (i !== 10) sum += u16(B, ipOff + i);
  while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
  return ~sum & 0xffff;
}
/** Tổng "pseudo-header" của TCP (IP nguồn, IP đích, giao thức, độ dài TCP) — đúng thứ nhân để lại khi giao phần còn lại cho card mạng. */
export function tcpPseudoSum(B: readonly number[], ipOff = 14): number {
  const len = u16(B, ipOff + 2) - (B[ipOff] & 0x0f) * 4;
  let sum = u16(B, ipOff + 12) + u16(B, ipOff + 14) + u16(B, ipOff + 16) + u16(B, ipOff + 18) + B[ipOff + 9] + len;
  while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
  return sum;
}

export interface Field {
  id: string; layer: LayerId; off: number; len: number; name: [string, string]; value: string;
  /** giải thích bằng lời thường cho người mới */
  en: string; vi: string;
}

export function decode(B: readonly number[] = HELLO_BYTES): Field[] {
  const tcpOff = 34;
  const flags = B[tcpOff + 13];
  const fl = [[0x10, 'ACK'], [0x08, 'PSH'], [0x02, 'SYN'], [0x01, 'FIN'], [0x04, 'RST']].filter(([m]) => flags & (m as number)).map(([, n]) => n);
  const http = String.fromCharCode(...B.slice(66));
  const F: Field[] = [
    { id: 'eth.dst', layer: 'eth', off: 0, len: 6, name: ['Destination MAC', 'MAC đích'], value: macAt(B, 0),
      en: 'MAC = the hardware address of a network card, 6 bytes, only meaningful on ONE local network. This is the next box on the way (here: the router), NOT the web server.',
      vi: 'MAC = địa chỉ phần cứng của một card mạng, 6 byte, chỉ có nghĩa trong MỘT mạng cục bộ. Đây là hộp kế tiếp trên đường đi (ở đây: router), KHÔNG phải máy web.' },
    { id: 'eth.src', layer: 'eth', off: 6, len: 6, name: ['Source MAC', 'MAC nguồn'], value: macAt(B, 6),
      en: 'The sender’s own network card (the client container’s eth0).', vi: 'Card mạng của chính người gửi (eth0 của container client).' },
    { id: 'eth.type', layer: 'eth', off: 12, len: 2, name: ['EtherType', 'EtherType'], value: hex4(u16(B, 12)),
      en: '0x0800 = "what is inside me is IPv4". The receiver uses it to know which code unwraps the next layer.', vi: '0x0800 = "bên trong tôi là IPv4". Bên nhận dựa vào nó để biết đoạn mã nào bóc lớp tiếp theo.' },
    { id: 'ip.vihl', layer: 'ip', off: 14, len: 1, name: ['Version + header length', 'Phiên bản + độ dài header'], value: `${B[14] >> 4} / ${(B[14] & 15) * 4} B`,
      en: '0x45: version 4, header 5 × 4 = 20 bytes (no options).', vi: '0x45: phiên bản 4, header 5 × 4 = 20 byte (không có tuỳ chọn).' },
    { id: 'ip.len', layer: 'ip', off: 16, len: 2, name: ['Total length', 'Tổng độ dài'], value: `${u16(B, 16)}`,
      en: '135 = 20 (IP) + 32 (TCP) + 83 (HTTP). Ethernet’s 14 bytes are not counted: IP does not know about the link below it.', vi: '135 = 20 (IP) + 32 (TCP) + 83 (HTTP). 14 byte Ethernet không được tính: IP không biết gì về đường nối bên dưới.' },
    { id: 'ip.id', layer: 'ip', off: 18, len: 2, name: ['Identification', 'Số nhận dạng'], value: hex4(u16(B, 18)),
      en: 'A number used only if the packet ever had to be cut into fragments.', vi: 'Một con số chỉ dùng nếu gói phải bị cắt nhỏ (phân mảnh).' },
    { id: 'ip.flags', layer: 'ip', off: 20, len: 2, name: ['Flags (DF)', 'Cờ (DF)'], value: hex4(u16(B, 20)),
      en: '0x4000 = Don’t Fragment: Linux prefers to learn the path’s MTU instead of letting routers cut packets.', vi: '0x4000 = Không phân mảnh (DF): Linux muốn tự dò MTU của đường đi thay vì để router cắt gói.' },
    { id: 'ip.ttl', layer: 'ip', off: 22, len: 1, name: ['TTL (time to live)', 'TTL (thời gian sống)'], value: `${B[22]}`,
      en: 'A hop counter: every router subtracts 1; at 0 the packet is thrown away. It stops a packet from looping forever.', vi: 'Bộ đếm chặng: mỗi router trừ 1; về 0 thì gói bị vứt. Nó ngăn một gói chạy vòng mãi mãi.' },
    { id: 'ip.proto', layer: 'ip', off: 23, len: 1, name: ['Protocol', 'Giao thức'], value: `${B[23]} (TCP)`,
      en: '6 = "inside me is TCP" (17 would be UDP, 1 ICMP).', vi: '6 = "bên trong tôi là TCP" (17 là UDP, 1 là ICMP).' },
    { id: 'ip.sum', layer: 'ip', off: 24, len: 2, name: ['Header checksum', 'Checksum header'], value: hex4(u16(B, 24)),
      en: 'Checksum = a small sum of the header bytes, so the receiver can detect a corrupted header. Only the IP header is covered.', vi: 'Checksum = một tổng nhỏ của các byte header, để bên nhận phát hiện header bị hỏng. Chỉ phủ phần header IP.' },
    { id: 'ip.src', layer: 'ip', off: 26, len: 4, name: ['Source IP', 'IP nguồn'], value: ipAt(B, 26),
      en: 'IP address = the address of a machine across ALL networks. The client.', vi: 'Địa chỉ IP = địa chỉ của một máy xuyên qua MỌI mạng. Đây là client.' },
    { id: 'ip.dst', layer: 'ip', off: 30, len: 4, name: ['Destination IP', 'IP đích'], value: ipAt(B, 30),
      en: 'The web server — the FINAL destination. Compare with the destination MAC: different machines!', vi: 'Máy web — đích CUỐI CÙNG. So với MAC đích: hai máy khác nhau!' },
    { id: 'tcp.sport', layer: 'tcp', off: 34, len: 2, name: ['Source port', 'Cổng nguồn'], value: `${u16(B, 34)}`,
      en: 'Port = a number that picks ONE program’s socket inside a machine. 50228 is a temporary (ephemeral) port the kernel gave curl.', vi: 'Cổng = con số chọn socket của MỘT chương trình trong một máy. 50228 là cổng tạm (ephemeral) nhân cấp cho curl.' },
    { id: 'tcp.dport', layer: 'tcp', off: 36, len: 2, name: ['Destination port', 'Cổng đích'], value: `${u16(B, 36)}`,
      en: '80 = HTTP. On the web machine, nginx listens on port 80.', vi: '80 = HTTP. Trên máy web, nginx nghe ở cổng 80.' },
    { id: 'tcp.seq', layer: 'tcp', off: 38, len: 4, name: ['Sequence number', 'Số thứ tự'], value: `${u32(B, 38)}`,
      en: 'Which byte of the stream this is (Wireshark shows it relative: 1). Lets the receiver put bytes back in order.', vi: 'Đây là byte thứ mấy của dòng dữ liệu (Wireshark hiện dạng tương đối: 1). Giúp bên nhận xếp byte lại đúng thứ tự.' },
    { id: 'tcp.ack', layer: 'tcp', off: 42, len: 4, name: ['Acknowledgement', 'Số xác nhận'], value: `${u32(B, 42)}`,
      en: '"I have received everything up to here from you."', vi: '"Tôi đã nhận đủ mọi thứ tới đây từ bạn."' },
    { id: 'tcp.flags', layer: 'tcp', off: 46, len: 2, name: ['Header length + flags', 'Độ dài header + cờ'], value: `${(B[46] >> 4) * 4} B · ${fl.join(',')}`,
      en: '0x8018: TCP header is 8 × 4 = 32 bytes; flags PSH (hand it to the app now) + ACK.', vi: '0x8018: header TCP dài 8 × 4 = 32 byte; cờ PSH (giao ngay cho ứng dụng) + ACK.' },
    { id: 'tcp.win', layer: 'tcp', off: 48, len: 2, name: ['Window', 'Cửa sổ'], value: `${u16(B, 48)} × 1024`,
      en: 'How much more the sender can receive. 63 × 1024 (window scale from the handshake) = 64 512 bytes.', vi: 'Người gửi còn nhận thêm được bao nhiêu. 63 × 1024 (hệ số nhân thoả thuận lúc bắt tay) = 64 512 byte.' },
    { id: 'tcp.sum', layer: 'tcp', off: 50, len: 2, name: ['TCP checksum', 'Checksum TCP'], value: hex4(u16(B, 50)),
      en: `Captured on the sending machine, this is NOT the final checksum: ${hex4(tcpPseudoSum(B))} is just the pseudo-header sum (IPs + protocol + length). The kernel leaves the rest to the network card ("checksum offload") — Wireshark may flag it as wrong.`,
      vi: `Bắt ở máy gửi, đây CHƯA phải checksum cuối cùng: ${hex4(tcpPseudoSum(B))} chỉ là tổng pseudo-header (hai IP + giao thức + độ dài). Nhân để phần còn lại cho card mạng ("checksum offload") — Wireshark có thể báo sai.` },
    { id: 'tcp.opts', layer: 'tcp', off: 54, len: 12, name: ['Options: timestamps', 'Tuỳ chọn: timestamp'], value: `TSval ${u32(B, 58)}`,
      en: '12 bytes: NOP, NOP, timestamp (10 B). They make the header 32 instead of 20 bytes — and are why each full segment carries 1448, not 1460 bytes.', vi: '12 byte: NOP, NOP, timestamp (10 B). Chúng làm header dài 32 thay vì 20 byte — và là lý do mỗi đoạn đầy chở 1448 chứ không phải 1460 byte.' },
    { id: 'http', layer: 'http', off: 66, len: 83, name: ['HTTP request (83 bytes)', 'Request HTTP (83 byte)'], value: JSON.stringify(http.split('\r\n')[0]),
      en: 'Plain text written by curl. The kernel never looks inside: to TCP it is just 83 bytes.', vi: 'Chữ thường do curl viết. Nhân không bao giờ nhìn vào trong: với TCP nó chỉ là 83 byte.' },
  ];
  return F;
}

/** Frame phía web: router thay hai MAC, trừ TTL, tính lại checksum IP. Mọi thứ khác giữ nguyên từng byte. */
export function hopRewrite(B: readonly number[] = HELLO_BYTES): number[] {
  const out = [...B];
  const mac = (s: string) => s.split(':').map((h) => parseInt(h, 16));
  out.splice(0, 6, ...mac(MAC.web));
  out.splice(6, 6, ...mac(MAC.routerDmz));
  out[22] -= 1;
  const sum = ipChecksum(out);
  out[24] = sum >> 8; out[25] = sum & 0xff;
  return out;
}
export const WEB_BYTES: readonly number[] = hopRewrite();

export interface HopField { id: string; name: [string, string]; client: string; web: string; changes: boolean; en: string; vi: string }
export function hopFields(): HopField[] {
  const a = HELLO_BYTES, b = WEB_BYTES;
  const row = (id: string, name: [string, string], f: (B: readonly number[]) => string, en: string, vi: string): HopField => ({ id, name, client: f(a), web: f(b), changes: f(a) !== f(b), en, vi });
  return [
    row('eth.dst', ['Destination MAC', 'MAC đích'], (B) => macAt(B, 0), 'A MAC is only valid on one local network. On the far side the next box is the web server itself.', 'MAC chỉ có giá trị trong một mạng cục bộ. Ở phía bên kia, hộp kế tiếp chính là máy web.'),
    row('eth.src', ['Source MAC', 'MAC nguồn'], (B) => macAt(B, 6), 'The router SENDS the new frame from its OTHER card (eth1, on the 10.10.2.0/24 network).', 'Router GỬI frame mới từ card KHÁC của nó (eth1, ở mạng 10.10.2.0/24).'),
    row('ip.ttl', ['TTL', 'TTL'], (B) => `${B[22]}`, 'Every router subtracts 1. traceroute uses exactly this to find the routers on a path.', 'Router nào cũng trừ 1. traceroute dùng đúng điều này để tìm các router trên đường.'),
    row('ip.sum', ['IP checksum', 'Checksum IP'], (B) => hex4(u16(B, 24)), 'TTL is inside the IP header, so its checksum must be recomputed: 0x3c52 → 0x3d52 (TTL is the high byte of a 16-bit word, so −1 there is +0x100 in the checksum).', 'TTL nằm trong header IP nên checksum phải tính lại: 0x3c52 → 0x3d52 (TTL là byte cao của một từ 16 bit, nên −1 ở đó thành +0x100 trong checksum).'),
    row('ip.src', ['Source IP', 'IP nguồn'], (B) => ipAt(B, 26), 'End-to-end address: never changes on a normal router (only NAT would rewrite it).', 'Địa chỉ đầu-cuối: router thường không bao giờ đổi (chỉ NAT mới viết lại).'),
    row('ip.dst', ['Destination IP', 'IP đích'], (B) => ipAt(B, 30), 'Still the web server — that is how every router knows where the packet is going.', 'Vẫn là máy web — nhờ vậy mọi router biết gói đang đi đâu.'),
    row('tcp.sport', ['Source port', 'Cổng nguồn'], (B) => `${u16(B, 34)}`, 'Routers do not open TCP at all.', 'Router không hề mở lớp TCP.'),
    row('tcp.dport', ['Destination port', 'Cổng đích'], (B) => `${u16(B, 36)}`, 'Still 80 — nginx on the web machine.', 'Vẫn 80 — nginx trên máy web.'),
    row('tcp.seq', ['Sequence number', 'Số thứ tự'], (B) => `${u32(B, 38)}`, 'Measured identical on both sides (tcp.seq_raw).', 'Đo được giống hệt ở hai phía (tcp.seq_raw).'),
    row('http', ['HTTP bytes', 'Byte HTTP'], (B) => `${B.length - 66} B`, 'The payload is untouched, byte for byte.', 'Phần hàng hoá còn nguyên từng byte.'),
  ];
}

// ───────────────────────── dãy bước đóng gói / bóc gói ─────────────────────────
export type Side = 'client' | 'router' | 'web';
export interface EncapStep {
  side: Side;
  /** các lớp đang có trên gói, từ ngoài vào trong */
  have: LayerId[];
  /** lớp vừa thêm / vừa bóc (tô trong hex dump) */
  hot?: LayerId;
  /** đang xem byte của frame nào */
  bytes: 'client' | 'web';
  /** chỗ trong máy (khái niệm của WhereBox) + nhãn ngắn */
  where: string; place: [string, string];
  call: string;
  en: string; vi: string;
  /** trên dây: + preamble 8 + FCS 4 + khoảng nghỉ 12 (không có trong capture) */
  wire?: boolean;
  tone?: 'ok' | 'warn';
}

export function encapSteps(): EncapStep[] {
  const app: [string, string] = ['curl (user space, app memory)', 'curl (không gian người dùng, bộ nhớ app)'];
  return [
    { side: 'client', have: [], bytes: 'client', where: 'app-buffer', place: app, call: 'curl http://10.10.2.10/api/hello',
      en: 'You type a URL. curl builds the request as plain text in its own memory. Nothing has touched the network yet.',
      vi: 'Bạn gõ một URL. curl dựng request dạng chữ thường trong bộ nhớ của nó. Chưa có gì chạm vào mạng.' },
    { side: 'client', have: ['http'], hot: 'http', bytes: 'client', where: 'socket', place: ['socket send buffer (kernel RAM)', 'bộ đệm gửi của socket (RAM của nhân)'], call: 'send(sock, "GET /api/hello HTTP/1.1\\r\\n…", 83) = 83',
      en: 'curl hands 83 bytes to its socket with send(). They are COPIED into the kernel’s send buffer. From here on the app is out of the picture.',
      vi: 'curl trao 83 byte cho socket bằng send(). Chúng được CHÉP vào bộ đệm gửi của nhân. Từ đây ứng dụng không còn dính dáng.' },
    { side: 'client', have: ['tcp', 'http'], hot: 'tcp', bytes: 'client', where: 'tcp-stack', place: ['kernel TCP code (CPU core)', 'mã TCP của nhân (lõi CPU)'], call: 'tcp_sendmsg → tcp_transmit_skb',
      en: 'Kernel TCP puts its 32-byte header IN FRONT: ports 50228 → 80 (which program), sequence/ack numbers (which byte), flags PSH, ACK, and 12 bytes of timestamps.',
      vi: 'TCP của nhân đặt header 32 byte của nó PHÍA TRƯỚC: cổng 50228 → 80 (chương trình nào), số thứ tự/xác nhận (byte thứ mấy), cờ PSH, ACK, và 12 byte timestamp.' },
    { side: 'client', have: ['ip', 'tcp', 'http'], hot: 'ip', bytes: 'client', where: 'tcp-stack', place: ['kernel IP code (CPU core)', 'mã IP của nhân (lõi CPU)'], call: 'ip_queue_xmit → route lookup',
      en: 'IP prepends 20 bytes: from 10.10.1.10 to 10.10.2.10, TTL 64, protocol 6 (TCP), checksum. The routing table says 10.10.2.10 is NOT on our network ⇒ send it to the router 10.10.1.254.',
      vi: 'IP thêm 20 byte phía trước: từ 10.10.1.10 tới 10.10.2.10, TTL 64, giao thức 6 (TCP), checksum. Bảng định tuyến nói 10.10.2.10 KHÔNG ở mạng mình ⇒ gửi cho router 10.10.1.254.' },
    { side: 'client', have: ['eth', 'ip', 'tcp', 'http'], hot: 'eth', bytes: 'client', where: 'nic-frame', place: ['NIC driver (kernel)', 'driver card mạng (nhân)'], call: 'neigh_output → dev_queue_xmit',
      en: 'Ethernet prepends 14 bytes: destination MAC = the ROUTER’s card (02:00:0a:0a:01:fe, found by ARP), source = our card, type 0x0800 (IPv4). 14 + 20 + 32 + 83 = 149 bytes.',
      vi: 'Ethernet thêm 14 byte phía trước: MAC đích = card của ROUTER (02:00:0a:0a:01:fe, tìm bằng ARP), nguồn = card của mình, kiểu 0x0800 (IPv4). 14 + 20 + 32 + 83 = 149 byte.' },
    { side: 'client', have: ['eth', 'ip', 'tcp', 'http'], bytes: 'client', where: 'wire', place: ['network chip → cable / virtual bridge', 'chip mạng → dây / cầu ảo'], call: 'NIC: 149 bytes on the wire', wire: true,
      en: 'The network chip sends the 149 bytes as signals. On a real cable it also adds an 8-byte preamble, a 4-byte FCS (frame checksum) and a 12-byte pause — the capture never shows those. In the Docker lab the “cable” is a virtual bridge inside the host kernel.',
      vi: 'Chip mạng gửi 149 byte thành tín hiệu. Trên dây thật nó thêm 8 byte mở đầu (preamble), 4 byte FCS (checksum của frame) và 12 byte nghỉ — capture không bao giờ thấy chúng. Ở lab Docker, “dây” là một cầu ảo bên trong nhân của máy chủ.' },
    { side: 'router', have: ['ip', 'tcp', 'http'], hot: 'eth', bytes: 'client', where: 'nic-frame', place: ['router: eth0 → routing → eth1', 'router: eth0 → định tuyến → eth1'], call: 'ip_forward: TTL 64 → 63',
      en: 'The router’s card sees its own MAC as destination ⇒ accepts it, throws the Ethernet envelope away, reads only the IP header: to 10.10.2.10 ⇒ out of eth1. TTL − 1, new checksum, NEW Ethernet envelope. (Preset “hop” compares both sides.)',
      vi: 'Card của router thấy MAC đích là của mình ⇒ nhận, vứt phong bì Ethernet, chỉ đọc header IP: tới 10.10.2.10 ⇒ ra cổng eth1. TTL − 1, checksum mới, phong bì Ethernet MỚI. (Kịch bản “hop” so hai phía.)' },
    { side: 'web', have: ['eth', 'ip', 'tcp', 'http'], hot: 'eth', bytes: 'web', where: 'nic-frame', place: ['web: network chip → driver', 'web: chip mạng → driver'], call: 'netif_receive_skb',
      en: 'The web machine’s card: destination MAC 02:00:0a:0a:02:0a is mine ⇒ keep it (a frame for another MAC would be dropped right here). Type 0x0800 ⇒ give it to IPv4 and drop the 14 bytes.',
      vi: 'Card của máy web: MAC đích 02:00:0a:0a:02:0a là của mình ⇒ giữ (frame cho MAC khác bị bỏ ngay tại đây). Kiểu 0x0800 ⇒ giao cho IPv4 và bỏ 14 byte.' },
    { side: 'web', have: ['ip', 'tcp', 'http'], hot: 'ip', bytes: 'web', where: 'tcp-stack', place: ['web: kernel IP', 'web: IP của nhân'], call: 'ip_rcv → ip_local_deliver',
      en: 'IP: checksum OK, destination 10.10.2.10 is one of my addresses, protocol 6 ⇒ hand it to TCP and drop the 20 bytes.',
      vi: 'IP: checksum đúng, đích 10.10.2.10 là một địa chỉ của mình, giao thức 6 ⇒ giao cho TCP và bỏ 20 byte.' },
    { side: 'web', have: ['tcp', 'http'], hot: 'tcp', bytes: 'web', where: 'socket', place: ['web: kernel TCP → socket lookup', 'web: TCP của nhân → tìm socket'], call: 'tcp_v4_rcv: (10.10.1.10:50228 → 10.10.2.10:80)',
      en: 'TCP finds the socket by the 4 numbers source IP, source port, destination IP, destination port ⇒ the connection nginx accepted. The 83 bytes wait in that socket’s receive buffer; an ACK goes back.',
      vi: 'TCP tìm socket bằng 4 con số IP nguồn, cổng nguồn, IP đích, cổng đích ⇒ kết nối nginx đã accept. 83 byte chờ trong bộ đệm nhận của socket đó; một ACK được gửi lại.' },
    { side: 'web', have: ['http'], hot: 'http', bytes: 'web', where: 'app-buffer', place: ['nginx (user space)', 'nginx (không gian người dùng)'], call: 'nginx: recv(conn, …) = 83', tone: 'ok',
      en: 'nginx reads exactly the 83 bytes curl wrote — no headers left. Every layer only ever read its own envelope.',
      vi: 'nginx đọc đúng 83 byte curl đã viết — không còn header nào. Mỗi tầng chỉ đọc phong bì của riêng nó.' },
  ];
}

// ───────────────────────── MTU / MSS / offload ─────────────────────────
export const ETH_HDR = 14, IP_HDR = 20, TCP_HDR = 20, TS_OPT = 12;
/** byte "vô hình" trên dây mỗi frame: preamble+SFD 8, FCS 4, khoảng nghỉ 12 */
export const WIRE_EXTRA = 24;
export interface Cut { mtu: number; mss: number; perSeg: number; segs: number[]; frames: number[]; wireBytes: number; efficiency: number }
export function cutResponse(bytes: number, mtu: number, ts = true): Cut {
  const mss = mtu - IP_HDR - TCP_HDR;
  const perSeg = mss - (ts ? TS_OPT : 0);
  const segs: number[] = [];
  for (let left = bytes; left > 0; left -= perSeg) segs.push(Math.min(perSeg, left));
  const hdr = ETH_HDR + IP_HDR + TCP_HDR + (ts ? TS_OPT : 0);
  const frames = segs.map((x) => x + hdr);
  const wireBytes = frames.reduce((a, f) => a + f + WIRE_EXTRA, 0);
  return { mtu, mss, perSeg, segs, frames, wireBytes, efficiency: Math.round((1000 * bytes) / wireBytes) / 10 };
}
/** offload bật: nhân đưa xuống MỘT siêu gói, card (TSO) hoặc driver (GSO) cắt sau — tcpdump đứng TRƯỚC chỗ cắt. */
export const superFrame = (bytes: number, ts = true) => bytes + ETH_HDR + IP_HDR + TCP_HDR + (ts ? TS_OPT : 0);
