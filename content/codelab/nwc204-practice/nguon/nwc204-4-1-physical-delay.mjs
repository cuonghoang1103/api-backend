/** NWC204 · 4.1 — Physical layer: bandwidth, throughput and transmission time. */
import { doiDau, KHOA, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const E1 = cs({
  ten: 'Physical 1 — Bandwidth, throughput, latency, goodput', kho: 'EASY', phut: 8,
  en: 'Vocabulary of the physical layer and of performance.', vi: 'Từ vựng tầng vật lý và hiệu năng.',
  cau: [
    q('c1', ['The capacity of a medium to carry data, in bits per second, is its …', 'Khả năng chứa dữ liệu của môi trường, tính bằng bit/giây, là …'], ['bandwidth', 'throughput', 'latency', 'goodput'], ['Bandwidth is the theoretical capacity; throughput is what you really get.', 'Băng thông là dung lượng lý thuyết; thông lượng là cái thực nhận.']),
    q('c2', ['Throughput is usually … the bandwidth.', 'Thông lượng thường … băng thông.'], ['lower than', 'higher than', 'exactly equal to', 'unrelated to'], ['Congestion, errors and overhead keep throughput under the nominal bandwidth.', 'Tắc nghẽn, lỗi và header khiến thông lượng thấp hơn băng thông danh định.']),
    q('c3', ['Goodput is the …', 'Goodput là …'], ['rate of useful application data (headers and retransmissions excluded)', 'raw bit rate on the wire (headers and retransmissions included)', 'number of bits the link can hold while they travel', 'time a bit needs to cross the link from end to end'], ['Goodput = throughput minus overhead.', 'Goodput = thông lượng trừ chi phí header.']),
    q('c4', ['The maximum length of a UTP Ethernet segment is …', 'Chiều dài tối đa một đoạn cáp UTP Ethernet là …'], ['100 m', '10 m', '1 km', '550 m'], ['UTP signals attenuate; 100 m is the standard limit.', 'Tín hiệu UTP suy hao; 100 m là giới hạn chuẩn.']),
    q('c5', ['Compared to copper, fibre-optic cable is …', 'So với cáp đồng, cáp quang …'], ['immune to EMI and reaches much longer distances', 'cheaper and easier to terminate in the field', 'limited to 100 m, the same as copper UTP', 'only usable indoors, away from sunlight'], ['Light does not suffer electromagnetic interference.', 'Ánh sáng không bị nhiễu điện từ.']),
  ],
  goiY: ['“Capacity” → bandwidth; “what I measured” → throughput; “useful bits” → goodput.', '100 m for UTP; fibre goes km.'],
  loi: ['Using bandwidth and throughput as synonyms.', 'Thinking latency is measured in bits per second.'],
  tn: [tn('goodput', 'thông lượng hữu ích'), tn('attenuation', 'suy hao')], kn: ['bandwidth', 'throughput'],
});

const F = [[1e6 * 8, 10e6], [25e6 * 8, 100e6], [700e6 * 8, 1e9], [4.7e9 * 8, 54e6]];
const fmt = (s) => (s >= 100 ? s.toFixed(1) : s >= 1 ? s.toFixed(2) : s.toFixed(4));
const E2 = tinh({
  tieuDe: 'Physical 2 — Transmission time of a file', doKho: 'EASY', phut: 8,
  moTa: mt('Transmission time = bits ÷ link rate (1 MB = 10⁶ bytes, 1 Mbps = 10⁶ bit/s). Give the time in seconds (2 decimals).', 'Thời gian truyền = số bit ÷ tốc độ đường truyền (1 MB = 10⁶ byte, 1 Mbps = 10⁶ bit/s). Tính bằng giây (2 chữ số thập phân).'),
  loai: 'table',
  bang: [bang1('b1', ['Transmission time', 'Thời gian truyền'], [{ ma: 'x', ten: 'File and link' }, { ma: 't', ten: 'Seconds' }],
    F.map(([b, r]) => ({ o: { x: `${b / 8e6} MB over ${r / 1e6} Mbps` }, a: { t: [(b / r).toFixed(2), String(+(b / r).toFixed(2))] } })),
    [F.map(([b, r]) => `${b / 8e6} MB = ${b / 1e6} Mbit; ÷ ${r / 1e6} Mbps = ${(b / r).toFixed(2)} s`).join('; ') + '.', 'Đổi byte sang bit (× 8) rồi chia cho tốc độ.'])],
  goiY: ['Convert bytes to bits first (× 8).', 'Keep the units consistent: Mbit ÷ Mbps = s.'],
  loiHayGap: ['Forgetting that a byte has 8 bits (answer 8× too small).', 'Mixing MB and Mb.'],
  thuatNgu: [tn('transmission time', 'thời gian truyền')], khaiNiem: ['transmission delay'],
});

const D = [[1500 * 8, 100e6, 100e3], [1500 * 8, 10e6, 2000e3], [64 * 8, 1e9, 10e3], [1e6 * 8, 1e9, 5000e3]];
const S = 2e8; // m/s in copper/fibre
const E3 = tinh({
  tieuDe: 'Physical 3 — Transmission plus propagation delay', doKho: 'MEDIUM', phut: 12,
  moTa: mt('Transmission delay = L ÷ R. Propagation delay = distance ÷ 2×10⁸ m/s. Give both and the total in milliseconds (3 decimals).', 'Trễ truyền = L ÷ R. Trễ lan truyền = khoảng cách ÷ 2×10⁸ m/s. Tính cả hai và tổng, đơn vị mili-giây (3 chữ số thập phân).'),
  loai: 'table',
  bang: [bang1('b1', ['Delays (ms)', 'Trễ (ms)'], [{ ma: 'x', ten: 'Case' }, { ma: 't', ten: 'Transmission' }, { ma: 'p', ten: 'Propagation' }, { ma: 'a', ten: 'Total' }],
    D.map(([l, r, d]) => ({ o: { x: `${l / 8} B, ${r / 1e6} Mbps, ${d / 1000} km` }, a: { t: [(l / r * 1000).toFixed(3), String(+(l / r * 1000).toFixed(3))], p: [(d / S * 1000).toFixed(3), String(+(d / S * 1000).toFixed(3))], a: [(l / r * 1000 + d / S * 1000).toFixed(3), String(+(l / r * 1000 + d / S * 1000).toFixed(3))] } })),
    ['Transmission depends on size and rate; propagation on distance only. Propagation dominates in every row here: even the 1 MB file needs only 8 ms to go onto the 1 Gbps link, against 25 ms of travel over 5000 km.', 'Trễ truyền phụ thuộc kích thước và tốc độ; trễ lan truyền chỉ phụ thuộc khoảng cách. Ở mọi dòng của bảng này trễ lan truyền đều trội: ngay cả tệp 1 MB cũng chỉ mất 8 ms để đẩy lên đường 1 Gbps, so với 25 ms đi hết 5000 km.'])],
  goiY: ['Convert km to m before dividing by 2×10⁸.', 'Multiply seconds by 1000 to get ms.'],
  loiHayGap: ['Dividing distance by the link rate.', 'Forgetting to convert km to m.'],
  thuatNgu: [tn('propagation delay', 'trễ lan truyền')], khaiNiem: ['propagation delay'],
});

const bdp = (r, rttMs) => r * rttMs / 1000 / 8;
const E4 = cs({
  ten: 'Physical 4 — Quick numeric checks', kho: 'MEDIUM', phut: 10,
  en: 'Pick the correct value (units matter).', vi: 'Chọn giá trị đúng (chú ý đơn vị).',
  cau: [
    mcNum('c1', ['How long does a 2 GB (2×10⁹ B) file take over a 100 Mbps link at full rate?', 'Truyền tệp 2 GB (2×10⁹ B) qua đường 100 Mbps hết tốc độ mất bao lâu?'], 160, [20, 16, 200], (x) => x + ' s', ['2×10⁹ × 8 = 16×10⁹ bit ÷ 10⁸ = 160 s.', '2×10⁹ × 8 = 16×10⁹ bit ÷ 10⁸ = 160 s.']),
    mcNum('c2', ['A 1 Gbps link has RTT 40 ms. The bandwidth-delay product (bytes in flight to fill the pipe) is …', 'Đường 1 Gbps có RTT 40 ms. Tích băng thông-trễ (số byte cần “bay” để lấp đầy ống) là …'], bdp(1e9, 40), [bdp(1e9, 40) * 8, bdp(1e9, 40) / 8, bdp(1e9, 4)], (x) => x.toLocaleString('en-US') + ' B', ['BDP = 10⁹ × 0.04 / 8 = 5,000,000 bytes.', 'BDP = 10⁹ × 0,04 / 8 = 5.000.000 byte.']),
    mcNum('c3', ['A file of 40 MB takes 8 s. The average throughput is …', 'Tệp 40 MB mất 8 s. Thông lượng trung bình là …'], 40, [5, 320, 4], (x) => x + ' Mbps', ['40 MB × 8 = 320 Mbit ÷ 8 s = 40 Mbps.', '40 MB × 8 = 320 Mbit ÷ 8 s = 40 Mbps.']),
    mcNum('c4', ['An Ethernet frame of 12,000 bits on a 1 Gbps link needs … µs of transmission time.', 'Frame Ethernet 12.000 bit trên đường 1 Gbps cần … µs để truyền.'], 12, [120, 1.2, 0.12], (x) => x + ' µs', ['12000 ÷ 10⁹ = 12 µs.', '12000 ÷ 10⁹ = 12 µs.']),
  ],
  goiY: ['Write the formula and the units line by line.', 'BDP = rate × RTT, then ÷ 8 for bytes.'],
  loi: ['Treating MB/s and Mbps as the same unit.', 'Using the one-way delay instead of the RTT for the BDP.'],
  tn: [tn('bandwidth-delay product', 'tích băng thông × trễ')], kn: ['BDP'],
});

function transferTime(bytes, bps, km) {
  var trans = bytes * 8 / bps * 1000, prop = km * 1000 / 2e8 * 1000;
  return { transmissionMs: Math.round(trans * 1000) / 1000, propagationMs: Math.round(prop * 1000) / 1000, totalMs: Math.round((trans + prop) * 1000) / 1000 };
}
const E5 = js({
  ten: 'Physical 5 — Write transferTime(bytes, bps, km)', kho: 'MEDIUM', phut: 12,
  en: '<p>Write <code>transferTime(bytes, bps, km)</code> returning <code>{ transmissionMs, propagationMs, totalMs }</code>, each rounded to 3 decimals (<code>Math.round(x * 1000) / 1000</code>). Propagation speed is 2×10⁸ m/s.</p>',
  vi: '<p>Viết <code>transferTime(bytes, bps, km)</code> trả <code>{ transmissionMs, propagationMs, totalMs }</code>, mỗi số làm tròn 3 chữ số (<code>Math.round(x * 1000) / 1000</code>). Tốc độ lan truyền 2×10⁸ m/s.</p>',
  fn: 'transferTime', params: 'bytes, bps, km', ref: transferTime,
  cases: [[1500, 100e6, 100], [1500, 10e6, 2000], [64, 1e9, 10], [1e6, 1e9, 5000], [1, 1e6, 0], [9000, 1e10, 40000]],
  goiY: ['bits = bytes × 8; transmission = bits ÷ bps (seconds) × 1000 for ms.', 'Round the total from the unrounded parts, not from the rounded ones.'],
  loi: ['Rounding each part first and adding the rounded values.', 'Using km as metres.'],
  gt: ['The two delays are independent: one grows with size/rate, the other with distance.', 'Hai loại trễ độc lập: một loại tăng theo kích thước/tốc độ, loại kia tăng theo khoảng cách.'],
  kn: ['transmission delay', 'propagation delay'],
});

function pathDelay(bits, hops) {
  var t = 0;
  for (var i = 0; i < hops.length; i++) t += bits / hops[i].bps * 1000 + hops[i].km * 1000 / 2e8 * 1000;
  return Math.round(t * 1000) / 1000;
}
const E6 = js({
  ten: 'Physical 6 — Store-and-forward over several links', kho: 'HARD', phut: 18,
  en: '<p>A packet of <code>bits</code> bits crosses a path of links <code>hops = [{ bps, km }, …]</code>. Every router stores the whole packet before forwarding it (<b>store-and-forward</b>), so the packet is transmitted once per link. Write <code>pathDelay(bits, hops)</code> returning the end-to-end delay in ms rounded to 3 decimals (no queuing, propagation 2×10⁸ m/s).</p>',
  vi: '<p>Một gói <code>bits</code> bit đi qua đường gồm các liên kết <code>hops = [{ bps, km }, …]</code>. Mỗi router nhận trọn gói rồi mới chuyển tiếp (<b>store-and-forward</b>) nên gói được truyền một lần trên mỗi liên kết. Viết <code>pathDelay(bits, hops)</code> trả trễ đầu-cuối tính bằng ms, làm tròn 3 chữ số (không xếp hàng, lan truyền 2×10⁸ m/s).</p>',
  fn: 'pathDelay', params: 'bits, hops', ref: pathDelay,
  cases: [[12000, [{ bps: 1e8, km: 1 }]], [12000, [{ bps: 1e8, km: 1 }, { bps: 1e7, km: 500 }, { bps: 1e8, km: 1 }]], [8e6, [{ bps: 1e9, km: 10 }, { bps: 1e9, km: 3000 }]], [12000, []], [1e6, [{ bps: 1e6, km: 0 }, { bps: 2e6, km: 0 }, { bps: 4e6, km: 0 }]], [500, [{ bps: 1e9, km: 20000 }]]],
  goiY: ['Add transmission + propagation for each link, then sum over links.', 'An empty path costs 0.'],
  loi: ['Transmitting the packet only once in total (cut-through thinking).', 'Rounding inside the loop.'],
  gt: ['With store-and-forward every hop pays the full transmission time again; that is why the bottleneck and the hop count both matter.', 'Với store-and-forward, mỗi chặng trả lại đủ thời gian truyền; nên cả nút cổ chai lẫn số chặng đều quan trọng.'],
  kn: ['store-and-forward'],
});

void tinh;
export default doiDau({ slug: 'nwc204-4-1-physical-delay', ten: '4.1 Physical layer: bandwidth and delay', khoa: KHOA, baiHoc: 'nwc204-4-1-tang-vat-ly-va-cap-dong', de: [E1, E2, E3, E4, E5, E6] });
