/**
 * Số liệu THẬT của phòng lab mạng (khoá Networking for Developers) — chép nguyên từ lab Docker của khoá
 * (client 10.10.1.10 → router 10.10.1.254 / 10.10.2.254 → nginx web 10.10.2.10:80 → Node api 10.10.2.20:3000) và
 * từ `curl -w` thật tới https://cuongthai.com (31/10/2026). Mọi thứ khác mà mô phỏng TÍNH RA phải được ghi nhãn
 * "tính ra" trong giao diện, không bao giờ "đo trong lab".
 *
 * Đừng sửa tay các con số ở đây: chúng là bằng chứng. engine/*.test.ts giải mã lại từng byte và so với tshark.
 */

/** Hex dump frame 4 (`GET /api/hello`), phía client — `tshark -x`, 149 byte. */
export const HELLO_HEX = `
0000  02 00 0a 0a 01 fe 02 00 0a 0a 01 0a 08 00 45 00
0010  00 87 e6 f7 40 00 40 06 3c 52 0a 0a 01 0a 0a 0a
0020  02 0a c4 34 00 50 11 27 28 34 d7 ee 1d 15 80 18
0030  00 3f 17 a1 00 00 01 01 08 0a da d4 14 10 57 99
0040  86 91 47 45 54 20 2f 61 70 69 2f 68 65 6c 6c 6f
0050  20 48 54 54 50 2f 31 2e 31 0d 0a 48 6f 73 74 3a
0060  20 31 30 2e 31 30 2e 32 2e 31 30 0d 0a 55 73 65
0070  72 2d 41 67 65 6e 74 3a 20 63 75 72 6c 2f 38 2e
0080  31 38 2e 30 0d 0a 41 63 63 65 70 74 3a 20 2a 2f
0090  2a 0d 0a 0d 0a`;

export function parseHexDump(dump: string): number[] {
  const out: number[] = [];
  for (const line of dump.split('\n')) {
    const m = line.match(/^([0-9a-f]{4})\s+((?:[0-9a-f]{2}\s?)+)/i);
    if (!m) continue;
    for (const h of m[2].trim().split(/\s+/)) out.push(parseInt(h, 16));
  }
  return out;
}
export const HELLO_BYTES: readonly number[] = parseHexDump(HELLO_HEX);

/** Cùng gói đó, hai phía router (tshark -T fields): eth.src eth.dst ip.ttl ip.checksum ip.src ip.dst tcp.srcport */
export const HOP_FIELDS = {
  client: { ethSrc: '02:00:0a:0a:01:0a', ethDst: '02:00:0a:0a:01:fe', ttl: 64, ipChecksum: 0x3c52, ipSrc: '10.10.1.10', ipDst: '10.10.2.10', srcPort: 50228, seqRaw: 287778868, ackRaw: 3622706453 },
  web: { ethSrc: '02:00:0a:0a:02:fe', ethDst: '02:00:0a:0a:02:0a', ttl: 63, ipChecksum: 0x3d52, ipSrc: '10.10.1.10', ipDst: '10.10.2.10', srcPort: 50228, seqRaw: 287778868, ackRaw: 3622706453 },
} as const;

export const MAC = {
  client: '02:00:0a:0a:01:0a',
  client2: '02:00:0a:0a:01:0b',
  routerLan: '02:00:0a:0a:01:fe',
  routerDmz: '02:00:0a:0a:02:fe',
  web: '02:00:0a:0a:02:0a',
  api: '02:00:0a:0a:02:14',
} as const;
export const IP = { client: '10.10.1.10', client2: '10.10.1.11', routerLan: '10.10.1.254', routerDmz: '10.10.2.254', web: '10.10.2.10', api: '10.10.2.20' } as const;

/** Cả cuộc hội thoại TCP của `curl http://10.10.2.10/api/hello` (phía client), tshark. */
export const HELLO_CONVO = [
  '1   0.000000   10.10.1.10 → 10.10.2.10   TCP 74 50228 → 80 [SYN] Seq=0 Win=64240 Len=0 MSS=1460 SACK_PERM TSval=3671331856 TSecr=0 WS=1024',
  '2   0.000054   10.10.2.10 → 10.10.1.10   TCP 74 80 → 50228 [SYN, ACK] Seq=0 Ack=1 Win=65160 Len=0 MSS=1460 SACK_PERM TSval=1469679249 TSecr=3671331856 WS=1024',
  '3   0.000061   10.10.1.10 → 10.10.2.10   TCP 66 50228 → 80 [ACK] Seq=1 Ack=1 Win=64512 Len=0 TSval=3671331856 TSecr=1469679249',
  '4   0.000104   10.10.1.10 → 10.10.2.10   HTTP 149 GET /api/hello HTTP/1.1',
  '5   0.000117   10.10.2.10 → 10.10.1.10   TCP 66 80 → 50228 [ACK] Seq=1 Ack=84 Win=65536 Len=0 TSval=1469679249 TSecr=3671331856',
  '6   0.004786   10.10.2.10 → 10.10.1.10   HTTP/JSON 370 HTTP/1.1 200 OK , JSON (application/json)',
  '7   0.004798   10.10.1.10 → 10.10.2.10   TCP 66 50228 → 80 [ACK] Seq=84 Ack=305 Win=64512 Len=0 TSval=3671331861 TSecr=1469679253',
  '8   0.004883   10.10.1.10 → 10.10.2.10   TCP 66 50228 → 80 [FIN, ACK] Seq=84 Ack=305 Win=64512 Len=0 TSval=3671331861 TSecr=1469679253',
  '9   0.004926   10.10.2.10 → 10.10.1.10   TCP 66 80 → 50228 [FIN, ACK] Seq=305 Ack=85 Win=65536 Len=0 TSval=1469679254 TSecr=3671331861',
  '10   0.004928   10.10.1.10 → 10.10.2.10   TCP 66 50228 → 80 [ACK] Seq=85 Ack=306 Win=64512 Len=0 TSval=3671331861 TSecr=1469679254',
] as const;

/** ARP thật (bộ đệm đã xoá): `ping 10.10.1.11` rồi `ping 10.10.2.10` (qua router) — `tcpdump -e -n` trên mạng LAN. */
export const ARP_LINES = [
  '22:20:44.141177 02:00:0a:0a:01:0a > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 10.10.1.11 tell 10.10.1.10, length 28',
  '22:20:44.141202 02:00:0a:0a:01:0a > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 10.10.1.11 tell 10.10.1.10, length 28',
  '22:20:44.141205 02:00:0a:0a:01:0b > 02:00:0a:0a:01:0a, ethertype ARP (0x0806), length 42: Reply 10.10.1.11 is-at 02:00:0a:0a:01:0b, length 28',
  '22:20:44.141206 02:00:0a:0a:01:0a > 02:00:0a:0a:01:0b, ethertype IPv4 (0x0800), length 98: 10.10.1.10 > 10.10.1.11: ICMP echo request, id 39184, seq 1, length 64',
  '22:20:44.141245 02:00:0a:0a:01:0b > 02:00:0a:0a:01:0a, ethertype IPv4 (0x0800), length 98: 10.10.1.11 > 10.10.1.10: ICMP echo reply, id 39184, seq 1, length 64',
  '22:20:44.189256 02:00:0a:0a:01:0a > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 10.10.1.254 tell 10.10.1.10, length 28',
  '22:20:44.189274 02:00:0a:0a:01:0a > ff:ff:ff:ff:ff:ff, ethertype ARP (0x0806), length 42: Request who-has 10.10.1.254 tell 10.10.1.10, length 28',
  '22:20:44.189293 02:00:0a:0a:01:fe > 02:00:0a:0a:01:0a, ethertype ARP (0x0806), length 42: Reply 10.10.1.254 is-at 02:00:0a:0a:01:fe, length 28',
  '22:20:44.189296 02:00:0a:0a:01:0a > 02:00:0a:0a:01:fe, ethertype IPv4 (0x0800), length 98: 10.10.1.10 > 10.10.2.10: ICMP echo request, id 39185, seq 1, length 64',
  '22:20:44.189892 02:00:0a:0a:01:fe > 02:00:0a:0a:01:0a, ethertype IPv4 (0x0800), length 98: 10.10.2.10 > 10.10.1.10: ICMP echo reply, id 39185, seq 1, length 64',
  '22:20:44.418203 02:00:0a:0a:01:fe > 02:00:0a:0a:01:0a, ethertype ARP (0x0806), length 42: Request who-has 10.10.1.10 tell 10.10.1.254, length 28',
  '22:20:44.418384 02:00:0a:0a:01:0a > 02:00:0a:0a:01:fe, ethertype ARP (0x0806), length 42: Reply 10.10.1.10 is-at 02:00:0a:0a:01:0a, length 28',
] as const;
/** `ip neigh` trên client sau hai lệnh ping */
export const NEIGH_AFTER = [
  '10.10.1.254 dev eth0 lladdr 02:00:0a:0a:01:fe REACHABLE',
  '10.10.1.11 dev eth0 lladdr 02:00:0a:0a:01:0b REACHABLE',
] as const;

/** GET /big — câu trả lời 3991 byte (header + 3841 byte thân). */
export const BIG = { response: 3991, body: 3841, requestFrame: 143 } as const;
/** offload TẮT (ethtool -K … tso off gso off gro off): các gói thật trên dây (cổng tạm của lần chạy cũ bỏ đi — chỉ giữ cột). */
export interface BigRow { no: number; t: string; from: 'web' | 'client'; len: number; info: string }
export const BIG_SEGMENTS_OFF: BigRow[] = [
  { no: 6, t: '0.000213', from: 'web', len: 1514, info: 'HTTP/1.1 200 OK · Seq=1 Len=1448' },
  { no: 7, t: '0.000222', from: 'client', len: 66, info: '[ACK] Ack=1449' },
  { no: 8, t: '0.000223', from: 'web', len: 1514, info: 'Seq=1449 Len=1448' },
  { no: 9, t: '0.000225', from: 'client', len: 66, info: '[ACK] Ack=2897' },
  { no: 10, t: '0.000225', from: 'web', len: 1161, info: 'Seq=2897 Len=1095 (text/plain)' },
  { no: 11, t: '0.000227', from: 'client', len: 66, info: '[ACK] Ack=3992' },
];
export const BIG_FRAMES_OFF = [1514, 1514, 1161] as const;
/** offload BẬT (mặc định): tcpdump trong máy chủ thấy MỘT "siêu gói" 4057 byte */
export const BIG_SEGMENTS_TSO: BigRow[] = [
  { no: 6, t: '0.000198', from: 'web', len: 4057, info: 'HTTP/1.1 200 OK · Seq=1 Len=3991 (text/plain)' },
  { no: 7, t: '0.000213', from: 'client', len: 66, info: '[ACK] Ack=3992' },
];
export const BIG_FRAME_TSO = 4057;

/** curl -w từ máy Mac của tác giả (mạng nhà, Hà Nội) → https://cuongthai.com/ (HTTP/2), 31/10/2026. Giây, CỘNG DỒN từ lúc bắt đầu. */
export interface CurlW { dns: number; connect: number; tls: number; ttfb: number; total: number }
export const CURL = {
  cold: [
    { dns: 0.003727, connect: 0.039891, tls: 0.056536, ttfb: 0.078450, total: 0.131903 },
    { dns: 0.002913, connect: 0.008388, tls: 0.021749, ttfb: 0.132273, total: 0.178935 },
    { dns: 0.002984, connect: 0.009604, tls: 0.020108, ttfb: 0.040271, total: 0.078407 },
  ] as CurlW[],
  warm: { dns: 0.000015, connect: 0, tls: 0, ttfb: 0.026562, total: 0.077675 } as CurlW,
  far: { dns: 0.018417, connect: 0.141404, tls: 0.181608, ttfb: 0.236487, total: 0.236695 } as CurlW,
  /** dig cuongthai.com hỏi thẳng router nhà 192.168.1.1 */
  digMs: 16,
} as const;
