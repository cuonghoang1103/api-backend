/** NWC204 · 5.1 — Data link layer: framing and error detection (parity, checksum, CRC). */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt } from './_nw.mjs';

const E1 = cs({
  ten: 'Link 1 — Framing and error detection concepts', kho: 'EASY', phut: 8,
  en: 'Concept questions about the data link layer.', vi: 'Câu hỏi khái niệm về tầng liên kết dữ liệu.',
  cau: [
    q('c1', ['The data link layer delivers frames between …', 'Tầng liên kết dữ liệu chuyển frame giữa …'], ['two nodes on the same link / network segment', 'two hosts on different continents', 'two processes on one host', 'two applications'], ['Layer 2 addressing (MAC) is only meaningful on one link.', 'Địa chỉ tầng 2 (MAC) chỉ có nghĩa trên một liên kết.']),
    q('c2', ['The FCS (frame check sequence) in the trailer lets the receiver …', 'FCS (chuỗi kiểm tra khung) trong trailer giúp bên nhận …'], ['detect that the frame was corrupted', 'correct the corrupted bits', 'find the sender’s IP', 'encrypt the frame'], ['CRC detects errors; the frame is discarded, retransmission is left to upper layers.', 'CRC phát hiện lỗi; frame bị huỷ, việc gửi lại do tầng trên lo.']),
    q('c3', ['What does a single even-parity bit detect?', 'Một bit chẵn lẻ (parity chẵn) phát hiện được gì?'], ['Any odd number of flipped bits', 'Any number of flipped bits', 'Only two flipped bits', 'Nothing, it corrects errors'], ['Two flips cancel out, so parity misses all even-size error sets.', 'Hai bit lật triệt tiêu nhau nên parity bỏ sót mọi lỗi có số bit chẵn.']),
    q('c4', ['CRC treats the bit string as …', 'CRC coi chuỗi bit như …'], ['a polynomial divided by a generator polynomial in modulo-2 arithmetic', 'a decimal number divided by 10 to give a check digit', 'a sum of 16-bit words with the carries wrapped around', 'a cryptographic hash computed over the IP header only'], ['The remainder of the division is the CRC.', 'Số dư của phép chia chính là CRC.']),
    q('c5', ['A receiver recomputes the CRC over data+CRC and gets a non-zero remainder. It …', 'Bên nhận tính lại CRC trên dữ liệu+CRC và được số dư khác 0. Nó …'], ['discards the frame', 'fixes the bits', 'forwards the frame anyway', 'sends a TCP RST'], ['A zero remainder means “no error detected”.', 'Số dư 0 nghĩa là “không phát hiện lỗi”.']),
  ],
  goiY: ['Detection is not correction.', 'Parity is cheap but weak; CRC is strong against bursts.'],
  loi: ['Saying CRC corrects errors.', 'Believing parity catches every error.'],
  tn: [tn('FCS', 'chuỗi kiểm tra khung'), tn('parity', 'chẵn lẻ')], kn: ['error detection'],
});

const PB = ['1011001', '1110000', '0000000', '1111111', '1010101'];
const E2 = tinh({
  tieuDe: 'Link 2 — Even parity bit', doKho: 'EASY', phut: 6,
  moTa: mt('Give the parity bit that makes the total number of 1-bits <b>even</b>.', 'Cho bit parity làm tổng số bit 1 là <b>số chẵn</b>.'),
  loai: 'table',
  bang: [bang1('b1', ['Even parity', 'Parity chẵn'], [{ ma: 'd', ten: '7-bit data' }, { ma: 'p', ten: 'Parity bit', luaChon: ['0', '1'] }],
    PB.map((d) => ({ o: { d }, a: { p: [S.evenParity(d)] } })),
    [PB.map((d) => `${d}: ${d.split('').filter((c) => c === '1').length} ones → bit ${S.evenParity(d)}`).join('; ') + '.', 'Đếm số bit 1; lẻ thì thêm 1, chẵn thì thêm 0.'])],
  goiY: ['Count the 1-bits.', 'Odd count → parity bit 1.'],
  loiHayGap: ['Computing odd parity.', 'Counting the zeros.'],
  thuatNgu: [tn('parity bit', 'bit chẵn lẻ')], khaiNiem: ['parity'],
});

const C = [['1101011011', '10011'], ['100100', '1101'], ['11010011101100', '1011'], ['10110', '101']];
const E3 = tinh({
  tieuDe: 'Link 3 — CRC remainder by hand', doKho: 'MEDIUM', phut: 15,
  moTa: mt('Append r zeros (r = degree of the generator) to the data and divide by the generator using modulo-2 (XOR) division. Give the r-bit CRC remainder.', 'Thêm r bit 0 (r = bậc của đa thức sinh) vào dữ liệu rồi chia cho đa thức sinh bằng phép chia modulo 2 (XOR). Cho số dư CRC r bit.'),
  loai: 'table',
  bang: [bang1('b1', ['CRC', 'CRC'], [{ ma: 'x', ten: 'Data / generator' }, { ma: 'c', ten: 'CRC remainder' }, { ma: 't', ten: 'Transmitted bits (data+CRC)' }],
    C.map(([d, g]) => ({ o: { x: `${d} / ${g}` }, a: { c: [S.crcBits(d, g)], t: [d + S.crcBits(d, g)] } })),
    [C.map(([d, g]) => `${d} / ${g}: CRC ${S.crcBits(d, g)}`).join('; ') + '. The transmitted frame is data followed by the CRC; dividing it by the generator leaves remainder 0.', 'Khung truyền là dữ liệu nối CRC; chia cho đa thức sinh được số dư 0.'])],
  goiY: ['XOR the generator under the leading 1, shift, repeat until fewer than r+1 bits remain.', 'Only XOR when the leading bit is 1.'],
  loiHayGap: ['Forgetting to append the r zeros before dividing.', 'Using ordinary subtraction with borrow instead of XOR.'],
  thuatNgu: [tn('generator polynomial', 'đa thức sinh')], khaiNiem: ['CRC'],
});

const E4 = cs({
  ten: 'Link 4 — What can each check catch?', kho: 'MEDIUM', phut: 10,
  en: 'Reason about the strength of the checks.', vi: 'Lập luận về độ mạnh của các phép kiểm.',
  cau: [
    q('c1', ['Two bits of a byte are flipped. Even parity …', 'Hai bit của một byte bị lật. Parity chẵn …'], ['does not detect it', 'detects it', 'corrects it', 'detects and locates it'], ['The count of 1s changes by an even amount, so parity is unchanged.', 'Số bit 1 đổi một lượng chẵn nên parity không đổi.']),
    q('c2', ['A 32-bit CRC (Ethernet FCS) detects every burst of errors up to … bits.', 'CRC 32 bit (FCS Ethernet) phát hiện mọi chùm lỗi dài tới … bit.'], ['32', '8', '16', '64'], ['A CRC of degree r catches all bursts of length ≤ r.', 'CRC bậc r bắt mọi chùm lỗi dài ≤ r.']),
    q('c3', ['Why is the FCS placed in the trailer instead of the header?', 'Vì sao FCS đặt ở trailer chứ không ở header?'], ['It is computed while the frame is being sent, after all the bits are known', 'Headers are read only by routers, which never check the frame', 'The trailer is encrypted, so the value cannot be changed on the way', 'The header has no room left, so a trailer makes the frame shorter'], ['The sender can stream the frame and append the CRC at the end.', 'Bên gửi có thể truyền liên tục rồi nối CRC ở cuối.']),
    q('c4', ['Compared to the Internet checksum, a CRC is …', 'So với Internet checksum, CRC …'], ['much better at detecting burst errors and cheap in hardware', 'weaker but simpler in software', 'able to correct single-bit errors', 'only used by TCP'], ['CRC is used at layer 2, the Internet checksum at layers 3–4.', 'CRC dùng ở tầng 2, Internet checksum ở tầng 3–4.']),
  ],
  goiY: ['Think of how errors change the pattern, not only the count.', 'Burst errors are common on real links.'],
  loi: ['Believing a longer parity makes it correct errors.', 'Forgetting that even a CRC can miss rare patterns.'],
  tn: [tn('burst error', 'lỗi chùm')], kn: ['CRC strength'],
});

function crcRemainder(data, poly) {
  var r = poly.length - 1, a = (data + new Array(r + 1).join('0')).split('');
  for (var i = 0; i + poly.length <= a.length; i++) {
    if (a[i] === '1') for (var j = 0; j < poly.length; j++) a[i + j] = a[i + j] === poly[j] ? '0' : '1';
  }
  return a.slice(a.length - r).join('');
}
const E5 = js({
  ten: 'Link 5 — Write crcRemainder(data, poly)', kho: 'MEDIUM', phut: 15,
  en: '<p>Write <code>crcRemainder(data, poly)</code> where both are bit strings. Return the CRC (a string of <code>poly.length - 1</code> bits): append that many zeros to <code>data</code> and perform modulo-2 long division.</p>',
  vi: '<p>Viết <code>crcRemainder(data, poly)</code> với cả hai là chuỗi bit. Trả CRC (chuỗi <code>poly.length - 1</code> bit): thêm chừng đó bit 0 vào <code>data</code> rồi thực hiện phép chia dài modulo 2.</p>',
  fn: 'crcRemainder', params: 'data, poly', ref: crcRemainder,
  cases: [['1101011011', '10011'], ['100100', '1101'], ['11010011101100', '1011'], ['1', '11'], ['0000', '101'], ['10101010101010', '110101'], ['11111111', '100000111']],
  goiY: ['Make an array of characters; walk i from 0 while a full generator still fits.', 'If a[i] is "1" XOR the generator into a[i..i+len-1].'],
  loi: ['Forgetting to append the zeros first.', 'Returning the whole working string instead of the last r bits.'],
  gt: ['Hardware does this with a shift register and XOR gates; the code mirrors the paper method.', 'Phần cứng dùng thanh ghi dịch và cổng XOR; mã mô phỏng đúng cách làm trên giấy.'],
  kn: ['CRC'],
});

function verifyFrame(frame, poly) {
  var a = frame.split('');
  for (var i = 0; i + poly.length <= a.length; i++) {
    if (a[i] === '1') for (var j = 0; j < poly.length; j++) a[i + j] = a[i + j] === poly[j] ? '0' : '1';
  }
  return a.slice(a.length - (poly.length - 1)).join('').indexOf('1') < 0;
}
const G = '10011';
const okFrame = (d) => d + S.crcBits(d, G);
const flip = (s, i) => s.slice(0, i) + (s[i] === '1' ? '0' : '1') + s.slice(i + 1);
const E6 = js({
  ten: 'Link 6 — Write verifyFrame(frame, poly)', kho: 'HARD', phut: 18,
  en: '<p>The receiver gets <code>frame</code> = data followed by its CRC. Write <code>verifyFrame(frame, poly)</code> returning <code>true</code> when the modulo-2 division of the whole frame by <code>poly</code> leaves a zero remainder (no error detected) and <code>false</code> otherwise. Note that a burst error longer than the CRC, or one that is itself a multiple of the generator, can slip through.</p>',
  vi: '<p>Bên nhận có <code>frame</code> = dữ liệu nối CRC. Viết <code>verifyFrame(frame, poly)</code> trả <code>true</code> khi chia modulo 2 cả frame cho <code>poly</code> được số dư 0 (không phát hiện lỗi), ngược lại <code>false</code>. Lưu ý: lỗi chùm dài hơn CRC hoặc chính là bội của đa thức sinh có thể lọt qua.</p>',
  fn: 'verifyFrame', params: 'frame, poly', ref: verifyFrame,
  cases: [[okFrame('1101011011'), G], [flip(okFrame('1101011011'), 3), G], [okFrame('1010101'), G], [flip(okFrame('1010101'), 0), G], [okFrame('1111'), G], [okFrame('1011001110') .replace(/.$/, (c) => (c === '1' ? '0' : '1')), G], [okFrame('1101011011').slice(0, 5) + '10011'.replace(/./g, '0') + okFrame('1101011011').slice(10), G], ['00000000', G]],
  goiY: ['The same long division, but without appending zeros.', 'Zero remainder means no error detected.'],
  loi: ['Appending zeros before dividing the received frame.', 'Comparing the remainder with the data instead of with zero.'],
  gt: ['That is exactly how a NIC checks the FCS: divide the entire frame; non-zero means drop it.', 'NIC kiểm FCS đúng như vậy: chia cả frame; khác 0 thì bỏ.'],
  kn: ['FCS check'],
});

function internetChecksum(words) {
  var sum = 0;
  for (var i = 0; i < words.length; i++) {
    sum += parseInt(words[i], 16);
    while (sum > 0xffff) sum = (sum & 0xffff) + (sum >>> 16);
  }
  var c = (~sum) & 0xffff, h = c.toString(16).toUpperCase();
  while (h.length < 4) h = '0' + h;
  return h;
}
const E7 = js({
  ten: 'Link 7 — The Internet checksum (one’s complement)', kho: 'HARD', phut: 20,
  en: '<p>IP, TCP and UDP use a 16-bit one’s-complement checksum. Write <code>internetChecksum(words)</code> where <code>words</code> is an array of 4-digit hex strings: add them as 16-bit numbers, <b>wrapping any carry out of bit 16 back into the low bits</b>, then take the bitwise complement. Return 4 uppercase hex digits.</p>',
  vi: '<p>IP, TCP và UDP dùng checksum bù 1 16 bit. Viết <code>internetChecksum(words)</code> với <code>words</code> là mảng chuỗi hex 4 chữ số: cộng như số 16 bit, <b>cộng vòng phần nhớ vượt bit 16 vào các bit thấp</b>, rồi lấy bù bit. Trả 4 chữ số hex viết hoa.</p>',
  fn: 'internetChecksum', params: 'words', ref: internetChecksum,
  cases: [[['4500', '0073', '0000', '4000', '4011', 'C0A8', '0001', 'C0A8', '00C7']], [['0000']], [['FFFF', 'FFFF']], [['FFFF', '0001']], [['1234', '5678', '9ABC']], [[]], [['8000', '8000', '0001']]],
  goiY: ['Fold the carry after every addition: while (sum > 0xFFFF) sum = (sum & 0xFFFF) + (sum >>> 16).', 'Complement with (~sum) & 0xFFFF; pad the hex to 4 digits.'],
  loi: ['Dropping the carry instead of adding it back.', 'Forgetting to mask with 0xFFFF after the complement (JavaScript uses 32 bits).'],
  gt: ['The receiver adds all words including the checksum; an intact packet gives 0xFFFF before complement.', 'Bên nhận cộng mọi từ kể cả checksum; gói nguyên vẹn cho 0xFFFF trước khi bù.'],
  kn: ['Internet checksum'],
});

export default doiDau({ slug: 'nwc204-5-1-error-detection', ten: '5.1 Framing and error detection', khoa: KHOA, baiHoc: 'nwc204-5-1-muc-dich-tang-lien-ket-du-lieu', de: [E1, E2, E3, E4, E5, E6, E7] });
