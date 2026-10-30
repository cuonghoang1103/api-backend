/** NWC204 · 6.1 — The Ethernet frame and the MAC address. */
import { doiDau, KHOA, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'Ethernet 1 — Frame fields and sizes', kho: 'EASY', phut: 8,
  en: 'Ethernet II frame fields.', vi: 'Các trường của frame Ethernet II.',
  cau: [
    q('c1', ['How long is an Ethernet MAC address?', 'Địa chỉ MAC Ethernet dài bao nhiêu?'], ['48 bits (6 bytes)', '32 bits', '64 bits', '128 bits'], ['Written as 12 hex digits.', 'Viết bằng 12 chữ số hex.']),
    q('c2', ['The minimum and maximum size of an Ethernet frame (header+data+FCS) are …', 'Kích thước tối thiểu và tối đa của frame Ethernet (header+dữ liệu+FCS) là …'], ['64 and 1518 bytes', '46 and 1500 bytes', '20 and 65535 bytes', '128 and 9000 bytes'], ['Data field 46–1500 plus 14 header and 4 FCS bytes.', 'Trường dữ liệu 46–1500 cộng 14 byte header và 4 byte FCS.']),
    q('c3', ['The Type/EtherType field 0x0800 means the payload is …', 'Trường Type/EtherType 0x0800 nghĩa là dữ liệu là …'], ['IPv4', 'ARP', 'IPv6', 'VLAN tag'], ['0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6, 0x8100 = 802.1Q.', '0x0800 = IPv4, 0x0806 = ARP, 0x86DD = IPv6, 0x8100 = 802.1Q.']),
    q('c4', ['The first 24 bits of a MAC address identify …', '24 bit đầu của địa chỉ MAC xác định …'], ['the manufacturer (OUI)', 'the network', 'the VLAN', 'the switch port'], ['OUI = Organizationally Unique Identifier; the other 24 bits are vendor-assigned.', 'OUI = mã nhà sản xuất; 24 bit sau do hãng gán.']),
    q('c5', ['The destination MAC ff:ff:ff:ff:ff:ff is …', 'MAC đích ff:ff:ff:ff:ff:ff là …'], ['the Ethernet broadcast address', 'a multicast group', 'an invalid address', 'the gateway'], ['Delivered to every device on the LAN.', 'Gửi tới mọi thiết bị trên LAN.']),
  ],
  goiY: ['Header 14 B = 6 + 6 + 2; trailer FCS 4 B.', 'Minimum 64 B ⇒ data padded to at least 46 B.'],
  loi: ['Counting the preamble inside the 64–1518 bytes.', 'Thinking the MAC address identifies a network.'],
  tn: [tn('OUI', 'mã nhà sản xuất'), tn('EtherType', 'loại giao thức tầng trên')], kn: ['Ethernet frame'],
});

function classifyMac(mac) {
  var m = mac.toLowerCase().replace(/[-.]/g, ':'), parts = m.split(':');
  var first = parseInt(parts[0], 16);
  var type = m === 'ff:ff:ff:ff:ff:ff' ? 'broadcast' : ((first & 1) ? 'multicast' : 'unicast');
  var oui = parts.slice(0, 3).map(function (x) { return x.toUpperCase(); }).join(':');
  return { type: type, local: (first & 2) !== 0, oui: oui };
}
const MACS = ['00:1A:2B:3C:4D:5E', '01:00:5E:00:00:FB', 'ff:ff:ff:ff:ff:ff', '02:42:AC:11:00:02', '33:33:00:00:00:01'];
const E2 = tinh({
  tieuDe: 'Ethernet 2 — Classify the MAC address', doKho: 'MEDIUM', phut: 10,
  moTa: mt('The least-significant bit of the first byte is the I/G bit (1 = group address). The second least-significant bit is the U/L bit (1 = locally administered). Classify each address (unicast, multicast, broadcast) and say whether it is locally administered.', 'Bit thấp nhất của byte đầu là bit I/G (1 = địa chỉ nhóm). Bit thấp thứ hai là bit U/L (1 = do quản trị cục bộ). Phân loại từng địa chỉ (unicast, multicast, broadcast) và cho biết có phải cục bộ không.'),
  loai: 'table',
  bang: [bang1('b1', ['MAC classes', 'Phân loại MAC'], [{ ma: 'm', ten: 'MAC' }, { ma: 't', ten: 'Type', luaChon: ['unicast', 'multicast', 'broadcast'] }, { ma: 'l', ten: 'Locally administered?', luaChon: ['yes', 'no'] }],
    MACS.map((m) => ({ o: { m }, a: { t: [classifyMac(m).type], l: [classifyMac(m).local ? 'yes' : 'no'] } })),
    [MACS.map((m) => `${m}: ${classifyMac(m).type}, local=${classifyMac(m).local}`).join('; ') + '. 0x01 → multicast bit; 0x02 → local bit; ff:… → broadcast.', 'Byte đầu 0x01 → bit multicast; 0x02 → bit cục bộ; ff:… → broadcast.'])],
  goiY: ['Write the first byte in binary and look at the last two bits.', 'Broadcast is a special multicast: all ones.'],
  loiHayGap: ['Looking at the most significant bit.', 'Calling every address that starts with 0 a unicast.'],
  thuatNgu: [tn('I/G bit', 'bit cá nhân/nhóm'), tn('U/L bit', 'bit toàn cục/cục bộ')], khaiNiem: ['MAC address'],
});

const PAY = [20, 46, 100, 1500, 1];
const frameOf = (p) => 14 + Math.max(p, 46) + 4;
const E3 = tinh({
  tieuDe: 'Ethernet 3 — Padding and frame size', doKho: 'MEDIUM', phut: 8,
  moTa: mt('Frame size = 14 (header) + data (padded to at least 46) + 4 (FCS). Also give the bytes occupied on the wire including the 8-byte preamble and the 12-byte inter-frame gap.', 'Kích thước frame = 14 (header) + dữ liệu (đệm tối thiểu 46) + 4 (FCS). Cho thêm số byte chiếm trên đường dây gồm preamble 8 byte và khoảng cách giữa frame 12 byte.'),
  loai: 'table',
  bang: [bang1('b1', ['Frame size', 'Kích thước frame'], [{ ma: 'p', ten: 'Payload (bytes)' }, { ma: 'f', ten: 'Frame (bytes)' }, { ma: 'w', ten: 'On the wire' }],
    PAY.map((p) => ({ o: { p: String(p) }, a: { f: [String(frameOf(p))], w: [String(frameOf(p) + 20)] } })),
    [PAY.map((p) => `${p} B → frame ${frameOf(p)} B, wire ${frameOf(p) + 20} B`).join('; ') + '. Padding is added when the payload is below 46 B.', 'Đệm thêm khi dữ liệu dưới 46 B.'])],
  goiY: ['max(payload, 46) first.', 'Wire = frame + 8 + 12.'],
  loiHayGap: ['Forgetting the padding for tiny payloads.', 'Adding the preamble to the frame size that is compared with 64/1518.'],
  thuatNgu: [tn('padding', 'đệm')], khaiNiem: ['frame size'],
});

const E4 = cs({
  ten: 'Ethernet 4 — Frame numbers', kho: 'MEDIUM', phut: 8,
  en: 'Compute with the Ethernet limits.', vi: 'Tính theo các giới hạn Ethernet.',
  cau: [
    mcNum('c1', ['What is the maximum frame rate on a 1 Gbps link with minimum-size frames (64 B + 20 B overhead)?', 'Tốc độ frame tối đa trên đường 1 Gbps với frame nhỏ nhất (64 B + 20 B overhead) là?'], Math.floor(1e9 / (84 * 8)), [Math.floor(1e9 / (64 * 8)), Math.floor(1e9 / (1518 * 8)), 1e9 / 8], (x) => Math.round(x).toLocaleString('en-US') + ' fps', ['1 Gbps ÷ (84 × 8 bits) ≈ 1,488,095 frames/s.', '1 Gbps ÷ (84 × 8 bit) ≈ 1.488.095 frame/giây.']),
    mcNum('c2', ['A 1500-byte payload is sent as one frame. The efficiency (payload ÷ wire bytes with 38 B overhead) is …', 'Dữ liệu 1500 byte gửi trong một frame. Hiệu suất (dữ liệu ÷ byte trên dây với overhead 38 B) là …'], 1500 / 1538 * 100, [1500 / 1518 * 100, 1500 / 1500 * 100, 1500 / 1558 * 100], (x) => x.toFixed(1) + '%', ['1500 / (1500 + 18 + 20) = 97.5%.', '1500 / (1500 + 18 + 20) = 97,5%.']),
    q('c3', ['A frame arrives with a 30-byte total length. The switch will treat it as a …', 'Frame tới với tổng độ dài 30 byte. Switch coi nó là …'], ['runt (below the 64-byte minimum) and discard it', 'valid frame (it is above the 18-byte header)', 'jumbo frame (it needs a larger MTU to pass)', 'giant frame (above the 1518-byte maximum)'], ['Frames shorter than 64 B are runts, usually the debris of collisions.', 'Frame ngắn hơn 64 B là runt, thường là mảnh vụn sau va chạm.']),
    q('c4', ['The default MTU of Ethernet (largest payload) is …', 'MTU mặc định của Ethernet (dữ liệu lớn nhất) là …'], ['1500 bytes', '1518 bytes', '9000 bytes', '576 bytes'], ['MTU counts the payload only.', 'MTU chỉ tính phần dữ liệu.']),
  ],
  goiY: ['On the wire each frame costs +20 B (preamble 8 + gap 12).', 'MTU is the payload limit.'],
  loi: ['Using 1518 as the MTU.', 'Forgetting the preamble and gap in the frame rate.'],
  tn: [tn('runt', 'frame quá ngắn'), tn('MTU', 'đơn vị truyền tối đa')], kn: ['frame rate'],
});

function ethernetFrame(payload) {
  var padded = Math.max(payload, 46), frame = 14 + padded + 4, wire = frame + 20;
  return { padded: padded, frameBytes: frame, wireBytes: wire, efficiency: Math.round(payload / wire * 10000) / 100 };
}
const E5 = js({
  ten: 'Ethernet 5 — Write ethernetFrame(payload) and classifyMac(mac)', kho: 'MEDIUM', phut: 18,
  en: '<p>Write <code>ethernetFrame(payload)</code> returning <code>{ padded, frameBytes, wireBytes, efficiency }</code>: <code>padded</code> = the data field after padding to 46 B; <code>frameBytes</code> = 14 + padded + 4; <code>wireBytes</code> = frameBytes + 20; <code>efficiency</code> = payload ÷ wireBytes × 100 rounded to 2 decimals.</p>',
  vi: '<p>Viết <code>ethernetFrame(payload)</code> trả <code>{ padded, frameBytes, wireBytes, efficiency }</code>: <code>padded</code> = trường dữ liệu sau khi đệm tới 46 B; <code>frameBytes</code> = 14 + padded + 4; <code>wireBytes</code> = frameBytes + 20; <code>efficiency</code> = payload ÷ wireBytes × 100 làm tròn 2 chữ số.</p>',
  fn: 'ethernetFrame', params: 'payload', ref: ethernetFrame,
  cases: [[1500], [46], [20], [1], [100], [1400], [0]],
  goiY: ['padded = Math.max(payload, 46).', 'Round with Math.round(x * 100) / 100 after multiplying by 100.'],
  loi: ['Computing efficiency from the padded size instead of the real payload.', 'Forgetting the 20 bytes of preamble and gap in wireBytes.'],
  gt: ['Small packets are very inefficient on Ethernet: a 20-byte payload still occupies 84 bytes of wire time.', 'Gói nhỏ rất kém hiệu quả: dữ liệu 20 byte vẫn chiếm 84 byte thời gian trên dây.'],
  kn: ['frame size', 'padding'],
});
const E6 = js({
  ten: 'Ethernet 6 — Write classifyMac(mac)', kho: 'HARD', phut: 18,
  en: '<p>Write <code>classifyMac(mac)</code> accepting a MAC written with <code>:</code>, <code>-</code> or Cisco-style dots and returning <code>{ type, local, oui }</code>: <code>type</code> is <code>"broadcast"</code> (ff:ff:ff:ff:ff:ff), <code>"multicast"</code> (I/G bit set) or <code>"unicast"</code>; <code>local</code> is <code>true</code> when the U/L bit is set; <code>oui</code> = first three bytes in uppercase joined with <code>:</code>.</p>',
  vi: '<p>Viết <code>classifyMac(mac)</code> nhận MAC viết bằng <code>:</code> hoặc <code>-</code> và trả <code>{ type, local, oui }</code>: <code>type</code> là <code>"broadcast"</code> (ff:ff:ff:ff:ff:ff), <code>"multicast"</code> (bit I/G bật) hoặc <code>"unicast"</code>; <code>local</code> là <code>true</code> khi bit U/L bật; <code>oui</code> = ba byte đầu viết hoa nối bằng <code>:</code>.</p>',
  fn: 'classifyMac', params: 'mac', ref: classifyMac,
  cases: [['00:1A:2B:3C:4D:5E'], ['01:00:5E:00:00:FB'], ['FF-FF-FF-FF-FF-FF'], ['02:42:ac:11:00:02'], ['33-33-00-00-00-01'], ['fe:ed:be:ef:00:01'], ['a8:5e:45:00:00:00']],
  goiY: ['parseInt(firstByte, 16) & 1 is the I/G bit, & 2 the U/L bit.', 'Normalise "-" to ":" and lowercase before comparing with the broadcast address.'],
  loi: ['Testing only for ff:ff:ff:ff:ff:ff and calling everything else unicast.', 'Not uppercasing the OUI.'],
  gt: ['The same two low bits of the first byte explain why Docker (02:42…) and IPv6 multicast (33:33…) MACs look the way they do.', 'Hai bit thấp của byte đầu giải thích vì sao MAC Docker (02:42…) và multicast IPv6 (33:33…) có dạng đó.'],
  kn: ['MAC address', 'I/G bit'],
});

export default doiDau({ slug: 'nwc204-6-1-ethernet-mac', ten: '6.1 The Ethernet frame and the MAC address', khoa: KHOA, baiHoc: 'nwc204-6-1-khung-ethernet-va-dia-chi-mac', de: [E1, E2, E3, E4, E5, E6] });
