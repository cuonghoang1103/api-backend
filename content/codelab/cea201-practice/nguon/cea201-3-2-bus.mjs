/** CEA201 · 3.2 — Bus & interconnection. */
import { doiDau, KHOA, bi, hai, giai, tinh, mc, q, tn, bang1, ord, r2 } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Bus 1 — Address, data and control lines',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions about system buses and arbitration.</p>', '<p>Câu hỏi khái niệm về bus hệ thống và phân xử bus.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The width of the ADDRESS bus determines …', 'Độ rộng bus ĐỊA CHỈ quyết định …'], ['the maximum addressable memory capacity', 'the number of bits moved per transfer', 'the clock rate of the system bus', 'the number of devices on the bus'], ['n address lines can name 2ⁿ locations.', 'n đường địa chỉ gọi tên được 2ⁿ vị trí.']),
    q('c2', ['The width of the DATA bus determines …', 'Độ rộng bus DỮ LIỆU quyết định …'], ['how many bits can be transferred at one time', 'the maximum size of addressable memory', 'the number of control signals on the bus', 'the cache line size only'], ['A wider data bus moves more bits per bus cycle, raising bandwidth.', 'Bus dữ liệu rộng hơn chuyển nhiều bit hơn mỗi chu kỳ bus, tăng băng thông.']),
    q('c3', ['Why do systems use bus ARBITRATION?', 'Vì sao hệ thống dùng PHÂN XỬ bus?'], ['Only one master may drive the bus at a time', 'To raise the clock rate of every device on the bus', 'To encrypt the data sent between two masters', 'To widen the address bus when memory grows'], ['When several masters want the bus, arbitration (centralized or distributed) chooses one.', 'Khi nhiều master cùng muốn bus, phân xử (tập trung hoặc phân tán) chọn một.']),
    q('c4', ['In an ASYNCHRONOUS bus, transfers are timed by …', 'Ở bus BẤT ĐỒNG BỘ, việc truyền được định thời bởi …'], ['a handshake between master and slave', 'a global clock shared by all devices', 'the interrupt handler of the OS', 'the cache controller of the processor'], ['Request/acknowledge signals replace the common clock.', 'Tín hiệu yêu cầu/xác nhận thay cho xung nhịp chung.']),
    q('c5', ['Compared to a shared bus, a point-to-point interconnect (PCIe, QPI) …', 'So với bus dùng chung, kết nối điểm-điểm (PCIe, QPI) …'], ['avoids bus contention and scales to higher speeds', 'is cheaper because it needs fewer wires in every case', 'cannot use serial links, only parallel wires', 'supports only one device in the whole system'], ['Dedicated serial links remove the shared-bus bottleneck.', 'Liên kết nối tiếp riêng loại bỏ nút cổ chai của bus dùng chung.']),
  ],
  goiY: ['n address lines ⇒ 2ⁿ addresses.', 'Data width ≠ address width.'],
  loiHayGap: ['Mixing up the address bus with the data bus.', 'Believing a wider address bus makes transfers faster.'],
  thuatNgu: [tn('arbitration', 'phân xử bus'), tn('handshake', 'bắt tay')],
  khaiNiem: ['bus', 'arbitration'],
});

const B = [[32, 100e6, 1], [64, 133e6, 1], [16, 800e6, 2], [64, 1066e6, 2]];
const bw = (w, f, k) => (w / 8) * f * k / 1e6;
const E2 = tinh({
  tieuDe: 'Bus 2 — Bus bandwidth and address space',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>Peak bandwidth (MB/s, 10⁶ bytes) = width/8 × clock × transfers per cycle (1 for single data rate, 2 for double). Fill in the bandwidth, and for a bus with <b>A</b> address lines, the number of addressable bytes (give powers of two as 2^A).</p>', '<p>Băng thông đỉnh (MB/s, 10⁶ byte) = độ rộng/8 × clock × số lần truyền mỗi chu kỳ (1 với SDR, 2 với DDR). Điền băng thông và với bus có <b>A</b> đường địa chỉ, số byte địa chỉ hoá được (viết luỹ thừa 2 dạng 2^A).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Bandwidth', 'Băng thông'], [{ ma: 'p', ten: 'Bus' }, { ma: 'b', ten: 'MB/s' }],
    B.map(([w, f, k]) => ({ o: { p: `${w}-bit data, ${f / 1e6} MHz, ${k === 1 ? 'single' : 'double'} data rate` }, a: { b: r2(bw(w, f, k), 1) } })),
    [B.map(([w, f, k]) => `${w / 8} B × ${f / 1e6} MHz × ${k} = ${bw(w, f, k).toFixed(1)} MB/s`).join('; ') + '.', B.map(([w, f, k]) => `${w / 8} B × ${f / 1e6} MHz × ${k} = ${bw(w, f, k).toFixed(1)} MB/s`).join('; ') + '.']),
  bang1('b2', ['Address space', 'Không gian địa chỉ'], [{ ma: 'l', ten: 'Address lines' }, { ma: 'n', ten: 'Addressable bytes' }, { ma: 'm', ten: 'In MiB / GiB' }],
    [[20, '1 MiB'], [24, '16 MiB'], [32, '4 GiB'], [36, '64 GiB']].map(([a, m]) => ({ o: { l: String(a) }, a: { n: [`2^${a}`, String(2 ** a)], m: [m, m.replace(' ', '')] } })),
    ['2^A bytes: 2^20 = 1 MiB, 2^24 = 16 MiB, 2^32 = 4 GiB, 2^36 = 64 GiB.', '2^A byte: 2^20 = 1 MiB, 2^24 = 16 MiB, 2^32 = 4 GiB, 2^36 = 64 GiB.'])],
  goiY: ['Convert bits to bytes first (÷ 8).', '2^10 = 1 Ki, 2^20 = 1 Mi, 2^30 = 1 Gi.'],
  loiHayGap: ['Leaving the width in bits.', 'Forgetting the double-data-rate factor.'],
  thuatNgu: [tn('peak bandwidth', 'băng thông đỉnh'), tn('DDR', 'tốc độ dữ liệu kép')],
  khaiNiem: ['bus bandwidth', 'address lines'],
});

const E3 = tinh({
  tieuDe: 'Bus 3 — Order an asynchronous read handshake',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>On an asynchronous bus the master and slave coordinate with two control lines: <b>MSYN</b> (master ready) and <b>SSYN</b> (slave ready). Put the read cycle in order.</p>', '<p>Trên bus bất đồng bộ, master và slave phối hợp bằng hai đường điều khiển: <b>MSYN</b> (master sẵn sàng) và <b>SSYN</b> (slave sẵn sàng). Sắp thứ tự một chu kỳ đọc.</p>'),
  loai: 'order',
  cauHoi: [ord('q1', ['Asynchronous read cycle', 'Chu kỳ đọc bất đồng bộ'], ['The master puts the address and the READ command on the bus', 'The master asserts MSYN', 'The slave decodes the address, puts the data on the bus and asserts SSYN', 'The master reads the data and negates MSYN', 'The slave sees MSYN negated, removes the data and negates SSYN'], ['A full handshake: each signal change is a reply to the previous one, so no clock is needed.', 'Bắt tay đầy đủ: mỗi thay đổi tín hiệu là câu trả lời cho thay đổi trước, nên không cần clock.'], 1)],
  goiY: ['The master always starts; the slave always answers.', 'The cycle ends only after both lines are back to idle.'],
  loiHayGap: ['Reading the data before SSYN is asserted.', 'Dropping SSYN before MSYN is negated.'],
  thuatNgu: [tn('handshake', 'bắt tay'), tn('MSYN / SSYN', 'tín hiệu master/slave sẵn sàng')],
  khaiNiem: ['asynchronous bus'],
});

const M = [[4, 32, 64], [8, 64, 256], [16, 32, 1024], [2, 16, 64]]; // GiB mem, bus data width, cache line bytes
const E4 = tinh({
  tieuDe: 'Bus 4 — Sizing the buses of a small system',
  doKho: 'MEDIUM', phut: 10,
  moTa: bi('<p>A byte-addressable memory of the given size sits on a bus with the given data width. How many <b>address lines</b> are needed, and how many <b>bus transfers</b> does it take to move one cache line of the given size?</p>', '<p>Bộ nhớ đánh địa chỉ theo byte có dung lượng cho trước nằm trên bus có độ rộng dữ liệu cho trước. Cần bao nhiêu <b>đường địa chỉ</b> và cần bao nhiêu <b>lần truyền bus</b> để chuyển một dòng cache có kích thước cho trước?</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Address lines and transfers', 'Đường địa chỉ và số lần truyền'], [{ ma: 's', ten: 'System' }, { ma: 'a', ten: 'Address lines' }, { ma: 't', ten: 'Transfers per line' }],
    M.map(([g, w, l]) => ({ o: { s: `${g} GiB memory, ${w}-bit data bus, ${l}-byte cache line` }, a: { a: String(Math.log2(g * 2 ** 30)), t: String(l / (w / 8)) } })),
    [M.map(([g, w, l]) => `${g} GiB ⇒ ${Math.log2(g * 2 ** 30)} lines; ${l} B / ${w / 8} B = ${l / (w / 8)} transfers`).join('; ') + '.', M.map(([g, w, l]) => `${g} GiB ⇒ ${Math.log2(g * 2 ** 30)} đường; ${l} B / ${w / 8} B = ${l / (w / 8)} lần truyền`).join('; ') + '.'])],
  goiY: ['log₂(bytes) = number of address lines.', 'transfers = line size in bytes ÷ (data width in bits ÷ 8).'],
  loiHayGap: ['Dividing the cache line size in bits by the width in bytes.', 'Using GiB as the number of address lines.'],
  thuatNgu: [tn('cache line', 'dòng cache')],
  khaiNiem: ['address lines', 'bus transfers'],
});

export default doiDau({
  slug: 'cea201-3-2-bus',
  ten: '3.2 The bus & interconnection',
  khoa: KHOA,
  baiHoc: 'cea201-3-2-bus',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc;
