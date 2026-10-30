/** NWC204 · 11.2 — IPv6 subnetting and EUI-64. */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'IPv6 subnet 1 — Plan with /48 and /64', kho: 'EASY', phut: 8,
  en: 'IPv6 subnetting is a counting exercise on the subnet-ID field.', vi: 'Chia mạng IPv6 thực chất là đếm trên trường subnet ID.',
  cau: [
    mcNum('c1', ['How many /64 subnets are in a /48?', 'Một /48 có bao nhiêu mạng /64?'], 65536, [256, 16, 4096], (x) => x.toLocaleString('en-US'), ['2^(64−48) = 65,536.', '2^(64−48) = 65.536.']),
    q('c2', ['A normal LAN in IPv6 gets a …', 'Một LAN bình thường trong IPv6 được cấp …'], ['/64', '/48', '/126', '/32'], ['SLAAC needs 64 bits of interface ID, so LANs are /64 even for 2 hosts.', 'SLAAC cần 64 bit interface ID nên LAN luôn /64 dù chỉ 2 host.']),
    q('c3', ['2001:db8:acad::/48 — the 4th hextet is the …', '2001:db8:acad::/48 — nhóm thứ 4 là …'], ['subnet ID', 'interface ID', 'global routing prefix', 'EtherType'], ['Global prefix 48 bits + 16-bit subnet ID + 64-bit interface ID.', 'Prefix toàn cục 48 bit + subnet ID 16 bit + interface ID 64 bit.']),
    q('c4', ['Which is the 11th /64 (counting from subnet 0) of 2001:db8:acad::/48?', 'Mạng /64 thứ 11 (đếm từ subnet 0) của 2001:db8:acad::/48 là?'], [S.ipv6Subnet64('2001:db8:acad::', 11), S.ipv6Subnet64('2001:db8:acad::', 17), S.ipv6Subnet64('2001:db8:acad::', 10), S.ipv6Subnet64('2001:db8:acad::', 0)], ['Subnet 11 is written 0xb in hex.', 'Subnet 11 viết 0xb dạng hex.']),
  ],
  goiY: ['Subnet ID is hexadecimal.', 'Every LAN is /64.'],
  loi: ['Using /126 or /127 on user LANs.', 'Writing the subnet number in decimal.'],
  tn: [tn('subnet ID', 'mã mạng con')], kn: ['IPv6 subnetting'],
});

const M = ['00:1A:2B:3C:4D:5E', 'A8:BB:CC:DD:EE:FF', '52:54:00:12:34:56', '02:42:AC:11:00:02'];
const E2 = tinh({
  tieuDe: 'IPv6 subnet 2 — EUI-64 interface IDs', doKho: 'MEDIUM', phut: 12,
  moTa: mt('EUI-64: split the 48-bit MAC in the middle, insert <b>ff:fe</b>, and <b>flip the 7th bit</b> (U/L) of the first byte. Write the 64-bit interface ID as four hextets without leading zeros (e.g. <code>21a:2bff:fe3c:4d5e</code>).', 'EUI-64: tách MAC 48 bit ở giữa, chèn <b>ff:fe</b> và <b>đảo bit thứ 7</b> (U/L) của byte đầu. Viết interface ID 64 bit thành bốn nhóm bỏ số 0 đầu (vd <code>21a:2bff:fe3c:4d5e</code>).'),
  loai: 'table',
  bang: [bang1('b1', ['EUI-64', 'EUI-64'], [{ ma: 'm', ten: 'MAC' }, { ma: 'i', ten: 'Interface ID' }],
    M.map((m) => ({ o: { m }, a: { i: [S.eui64(m)] } })),
    [M.map((m) => `${m} → ${S.eui64(m)}`).join('; ') + '. The first byte is XORed with 0x02.', 'Byte đầu được XOR với 0x02.'])],
  goiY: ['00 → 02, A8 → AA, 52 → 50, 02 → 00 in the first byte.', 'Insert fffe between the 3rd and 4th byte.'],
  loiHayGap: ['Forgetting to flip the U/L bit.', 'Inserting ff:fe at the end.'],
  thuatNgu: [tn('EUI-64', 'định danh 64 bit mở rộng')], khaiNiem: ['EUI-64'],
});

const E3 = js({
  ten: 'IPv6 subnet 3 — Write eui64(mac) and ipv6Subnet64(prefix48, n)', kho: 'HARD', phut: 20,
  en: '<p>Write <code>eui64(mac)</code> that turns a MAC (<code>"00:1A:2B:3C:4D:5E"</code>, <code>:</code> or <code>-</code> separated, any case) into the interface ID as four lowercase hextets without leading zeros: <code>"21a:2bff:fe3c:4d5e"</code>.</p>',
  vi: '<p>Viết <code>eui64(mac)</code> đổi MAC (<code>"00:1A:2B:3C:4D:5E"</code>, ngăn cách bằng <code>:</code> hoặc <code>-</code>, hoa/thường đều được) thành interface ID gồm bốn nhóm hex thường bỏ số 0 đầu: <code>"21a:2bff:fe3c:4d5e"</code>.</p>',
  fn: 'eui64', params: 'mac', ref: S.eui64,
  cases: [['00:1A:2B:3C:4D:5E'], ['a8-bb-cc-dd-ee-ff'], ['52:54:00:12:34:56'], ['02:42:AC:11:00:02'], ['FF:FF:FF:FF:FF:FF'], ['00:00:00:00:00:00']],
  goiY: ['Split on [:-] and parse each byte with parseInt(x, 16).', 'Combine byte pairs into 16-bit groups and print with toString(16).'],
  loi: ['Printing groups with leading zeros.', 'Flipping the wrong bit (use ^ 2, not ^ 1).'],
  gt: ['Stable EUI-64 IDs leak the hardware address, which is why modern OSes use random privacy addresses instead.', 'ID EUI-64 cố định làm lộ địa chỉ phần cứng nên HĐH hiện đại dùng địa chỉ riêng tư ngẫu nhiên.'],
  kn: ['EUI-64', 'SLAAC'],
});

void tinh;
export default doiDau({ slug: 'nwc204-11-2-ipv6-subnet-eui64', ten: '11.2 IPv6 subnetting and EUI-64', khoa: KHOA, baiHoc: 'nwc204-11-2-cau-hinh-va-chia-subnet-ipv6', de: [E1, E2, E3] });
