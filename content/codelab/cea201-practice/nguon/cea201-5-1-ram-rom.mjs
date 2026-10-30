/** CEA201 · 5.1 — RAM, ROM, DRAM vs SRAM; chip organization. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, mc, q, tn, bang1, r2 } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Memory 1 — SRAM, DRAM and the ROM family',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on semiconductor memory.</p>', '<p>Câu hỏi khái niệm về bộ nhớ bán dẫn.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['Why does DRAM need refreshing?', 'Vì sao DRAM cần làm tươi (refresh)?'], ['It stores bits as charge in capacitors that leak away', 'It uses flip-flops that lose state at random', 'Its address lines are multiplexed', 'It is non-volatile'], ['A leaking capacitor must be re-read and re-written periodically.', 'Tụ điện rò điện nên phải đọc và ghi lại định kỳ.']),
    q('c2', ['Which is used for cache memory and why?', 'Loại nào dùng cho cache và vì sao?'], ['SRAM — faster, no refresh, but larger and more expensive per bit', 'DRAM — denser, cheaper and also faster than SRAM per access', 'ROM — it keeps the frequently used data even without power', 'Flash — non-volatile, and quicker to write than to read'], ['Cache needs speed; SRAM cells (6 transistors) are fast but bulky.', 'Cache cần tốc độ; ô SRAM (6 transistor) nhanh nhưng to.']),
    q('c3', ['Which statement about ROM is correct?', 'Phát biểu nào về ROM đúng?'], ['It keeps its contents without power (non-volatile)', 'It is faster than SRAM', 'It needs periodic refresh', 'Its contents are lost at power-off'], ['ROM, PROM, EPROM, EEPROM and flash are non-volatile.', 'ROM, PROM, EPROM, EEPROM và flash không mất dữ liệu khi tắt nguồn.']),
    q('c4', ['Flash memory differs from EEPROM mainly in that it …', 'Flash khác EEPROM chủ yếu ở chỗ …'], ['erases and writes in blocks, giving higher density and lower cost', 'cannot be electrically erased and needs ultraviolet light', 'is volatile, so it loses its contents at power-off', 'needs a refresh cycle like DRAM, which lowers its cost'], ['Block erase makes flash dense and cheap, the basis of SSDs and USB sticks.', 'Xoá theo khối giúp flash dày và rẻ, nền tảng của SSD và USB.']),
    q('c5', ['Row and column addresses are multiplexed on DRAM chips in order to …', 'Địa chỉ hàng/cột được ghép kênh trên chip DRAM nhằm …'], ['halve the number of address pins', 'double the data bus width', 'speed up refresh', 'avoid the need for a clock'], ['The same pins carry the row address first and the column address next.', 'Cùng các chân mang địa chỉ hàng trước rồi địa chỉ cột sau.']),
  ],
  goiY: ['Capacitor ⇒ refresh; flip-flop ⇒ fast but big.', 'Non-volatile ≠ read-only: flash and EEPROM can be rewritten.'],
  loiHayGap: ['Thinking SRAM needs refresh.', 'Calling flash “read-only memory”.'],
  thuatNgu: [tn('volatile', 'mất dữ liệu khi mất nguồn'), tn('refresh', 'làm tươi')],
  khaiNiem: ['SRAM', 'DRAM', 'ROM', 'flash'],
});

const CH = [[1048576, 8, 262144, 8], [4194304, 32, 1048576, 8], [16777216, 16, 4194304, 4], [67108864, 64, 16777216, 8]];
const cname = (n) => (n >= 1048576 ? n / 1048576 + 'M' : n >= 1024 ? n / 1024 + 'K' : String(n));
const E2 = tinh({
  tieuDe: 'Memory 2 — Build a memory module from chips',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>A module of <b>W</b> words × <b>B</b> bits is built from chips of <b>w</b> words × <b>b</b> bits (K = 2¹⁰, M = 2²⁰). Give the <b>number of chips</b> (rows of chips for more words × chips side by side for more bits), the <b>address lines</b> of the module and of one chip, and the number of <b>chip-select</b> address bits (the module address bits not used by one chip).</p>', '<p>Một module <b>W</b> từ × <b>B</b> bit được dựng từ các chip <b>w</b> từ × <b>b</b> bit (K = 2¹⁰, M = 2²⁰). Cho <b>số chip</b> (hàng chip để tăng số từ × chip cạnh nhau để tăng số bit), <b>đường địa chỉ</b> của module và của một chip, và số bit địa chỉ <b>chọn chip</b> (bit địa chỉ module mà một chip không dùng).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Module from chips', 'Module dựng từ chip'], [{ ma: 'm', ten: 'Module / chip' }, { ma: 'n', ten: 'Chips' }, { ma: 'a', ten: 'Module addr lines' }, { ma: 'c', ten: 'Chip addr lines' }, { ma: 's', ten: 'Chip-select bits' }],
    CH.map(([W, B, w, b]) => ({ o: { m: `${cname(W)} × ${B} from ${cname(w)} × ${b}` }, a: { n: String((W / w) * (B / b)), a: String(Math.log2(W)), c: String(Math.log2(w)), s: String(Math.log2(W / w)) } })),
    [CH.map(([W, B, w, b]) => `${cname(W)}×${B} from ${cname(w)}×${b}: ${W / w} rows × ${B / b} column${B / b > 1 ? 's' : ''} = ${(W / w) * (B / b)} chips; ${Math.log2(W)} = ${Math.log2(w)} + ${Math.log2(W / w)} address bits`).join('; ') + '.', CH.map(([W, B, w, b]) => `${cname(W)}×${B} từ ${cname(w)}×${b}: ${W / w} hàng × ${B / b} cột = ${(W / w) * (B / b)} chip`).join('; ') + '.'])],
  goiY: ['chips = (W / w) × (B / b).', 'The high address bits select the row of chips; the low bits go to every chip.'],
  loiHayGap: ['Multiplying capacities in bits and forgetting the shape of the chip.', 'Using the number of chips as the number of select bits.'],
  thuatNgu: [tn('chip select', 'chọn chip')],
  khaiNiem: ['memory organization'],
});

const RF = [[8192, 64, 50], [16384, 64, 45], [32768, 32, 40]]; // rows, period ms, ns per row
const MX = [[16 * 2 ** 20, 4], [64 * 2 ** 20, 8], [256 * 2 ** 20, 16]]; // bits, width
const E3 = tinh({
  tieuDe: 'Memory 3 — DRAM refresh overhead and multiplexed address pins',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p><b>Part A.</b> Every row must be refreshed once per refresh period; refreshing one row takes <i>t</i> ns. Give the fraction of time the DRAM is busy refreshing (%, 3 decimals).</p><p><b>Part B.</b> A DRAM chip of the given capacity has a <i>b</i>-bit word. The array of 2ⁿ words is as square as possible: 2^⌈n/2⌉ rows × 2^⌊n/2⌋ columns. How many address pins are needed when the row and column addresses are <b>multiplexed</b> (the same pins used twice)? The pins must carry the longer of the two addresses, and a pin count is a whole number.</p>', '<p><b>Phần A.</b> Mỗi hàng phải được làm tươi một lần mỗi chu kỳ làm tươi; làm tươi một hàng mất <i>t</i> ns. Cho tỉ lệ thời gian DRAM bận làm tươi (%, 3 chữ số).</p><p><b>Phần B.</b> Chip DRAM có dung lượng cho trước, từ <i>b</i> bit. Mảng 2ⁿ từ được xếp gần vuông nhất: 2^⌈n/2⌉ hàng × 2^⌊n/2⌋ cột. Cần bao nhiêu chân địa chỉ khi địa chỉ hàng và cột được <b>ghép kênh</b> (dùng chung chân hai lần)? Các chân phải mang được địa chỉ dài hơn trong hai địa chỉ, và số chân là số nguyên.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Refresh overhead', 'Phụ trội làm tươi'], [{ ma: 'p', ten: 'Rows, period, time per row' }, { ma: 'o', ten: 'Busy (%)' }],
    RF.map(([r, p, t]) => ({ o: { p: `${r} rows, ${p} ms, ${t} ns/row` }, a: { o: r2(r * t * 1e-9 / (p * 1e-3) * 100, 3) } })),
    [RF.map(([r, p, t]) => `${r}×${t} ns / ${p} ms = ${(r * t * 1e-9 / (p * 1e-3) * 100).toFixed(3)}%`).join('; ') + '. Refresh costs a small but real slice of bandwidth.', RF.map(([r, p, t]) => `${r}×${t} ns / ${p} ms = ${(r * t * 1e-9 / (p * 1e-3) * 100).toFixed(3)}%`).join('; ') + '.']),
  bang1('b2', ['Multiplexed pins', 'Chân ghép kênh'], [{ ma: 'c', ten: 'Chip' }, { ma: 'w', ten: 'Words (2ⁿ)' }, { ma: 'p', ten: 'Address pins' }],
    MX.map(([bits, b]) => ({ o: { c: `${bits / 2 ** 20} Mbit, ${b}-bit word` }, a: { w: [`2^${Math.log2(bits / b)}`, String(bits / b)], p: String(Math.ceil(Math.log2(bits / b) / 2)) } })),
    [MX.map(([bits, b]) => `${bits / 2 ** 20} Mbit / ${b} = 2^${Math.log2(bits / b)} words ⇒ ⌈${Math.log2(bits / b)}/2⌉ = ${Math.ceil(Math.log2(bits / b) / 2)} multiplexed pins (instead of ${Math.log2(bits / b)})`).join('; ') + '.', MX.map(([bits, b]) => `${bits / 2 ** 20} Mbit / ${b} = 2^${Math.log2(bits / b)} từ ⇒ ⌈${Math.log2(bits / b)}/2⌉ = ${Math.ceil(Math.log2(bits / b) / 2)} chân`).join('; ') + '.'])],
  goiY: ['Busy fraction = rows × time per row ÷ period (convert to the same unit).', 'Multiplexing halves the pin count: n bits become ⌈n/2⌉ pins used twice (RAS, then CAS).'],
  loiHayGap: ['Mixing ns with ms.', 'Giving n instead of ⌈n/2⌉ pins, or leaving half a pin when n is odd.'],
  thuatNgu: [tn('RAS / CAS', 'xung chọn hàng / cột')],
  khaiNiem: ['DRAM refresh', 'address multiplexing'],
});

const SC = [['Level-1 cache of a processor', 'SRAM'], ['Main memory of a laptop', 'DRAM'], ['Firmware that is updated a few times in the product’s life', 'Flash'], ['Boot code in millions of identical toys, never changed', 'Mask ROM'], ['Solid-state drive', 'Flash'], ['Register file inside the CPU', 'SRAM']];
const E4 = tinh({
  tieuDe: 'Memory 4 — Choose the right memory technology',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Match each use to the most suitable technology: SRAM, DRAM, Flash or Mask ROM.</p>', '<p>Ghép mỗi nhu cầu với công nghệ phù hợp nhất: SRAM, DRAM, Flash hoặc Mask ROM.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Technology per use', 'Công nghệ cho từng nhu cầu'], [{ ma: 'u', ten: 'Use' }, { ma: 't', ten: 'Technology', luaChon: ['SRAM', 'DRAM', 'Flash', 'Mask ROM'] }],
    SC.map(([u, t]) => ({ o: { u }, a: { t } })),
    ['Speed-critical and small ⇒ SRAM; large and cheap but volatile ⇒ DRAM; rewritable and non-volatile ⇒ Flash; fixed forever and mass-produced ⇒ Mask ROM.', 'Cần tốc độ và nhỏ ⇒ SRAM; lớn, rẻ nhưng mất dữ liệu ⇒ DRAM; ghi lại được và không mất dữ liệu ⇒ Flash; cố định vĩnh viễn và sản xuất hàng loạt ⇒ Mask ROM.'])],
  goiY: ['Ask: must it be fast? must it survive power-off? will it be rewritten?', 'Mask ROM is programmed at the factory.'],
  loiHayGap: ['Choosing DRAM for a cache.', 'Choosing a rewritable memory where the content never changes (cost).'],
  thuatNgu: [tn('mask ROM', 'ROM lập trình bằng mặt nạ ở nhà máy')],
  khaiNiem: ['memory technologies'],
});

export default doiDau({
  slug: 'cea201-5-1-ram-rom',
  ten: '5.1 RAM, ROM, DRAM vs SRAM',
  khoa: KHOA,
  baiHoc: 'cea201-5-1-ram-rom',
  de: [E1, E2, E3, E4],
});
void hai; void giai; void mc; void S;
