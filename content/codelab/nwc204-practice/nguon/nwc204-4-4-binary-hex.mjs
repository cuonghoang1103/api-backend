/** NWC204 · 4.4 — Binary, hexadecimal and dotted decimal (web-added chapter 4B). */
import { doiDau, KHOA, S, tinh, q, bang1, tn, cs, js, mt, mcNum } from './_nw.mjs';

const D = [13, 77, 150, 200, 255, 192];
const E1 = tinh({
  tieuDe: 'Binary 1 — Decimal to 8-bit binary', doKho: 'EASY', phut: 8,
  moTa: mt('Convert each decimal number (0–255) to 8-bit binary. Use the table 128-64-32-16-8-4-2-1.', 'Đổi mỗi số thập phân (0–255) sang nhị phân 8 bit. Dùng bảng 128-64-32-16-8-4-2-1.'),
  loai: 'table',
  bang: [bang1('b1', ['Decimal → binary', 'Thập phân → nhị phân'], [{ ma: 'd', ten: 'Decimal' }, { ma: 'b', ten: '8-bit binary' }],
    D.map((d) => ({ o: { d: String(d) }, a: { b: [S.toBin(d, 8)] } })),
    [D.map((d) => `${d} = ${S.toBin(d, 8)}`).join('; ') + '. Subtract the largest column that fits, write 1, continue; otherwise write 0.', 'Trừ cột lớn nhất còn vừa, ghi 1, tiếp tục; không vừa thì ghi 0.'])],
  goiY: ['Start with 128: does it fit? Then 64, 32 …', '255 is all ones; 192 = 128 + 64.'],
  loiHayGap: ['Writing fewer than 8 digits (leading zeros are part of an octet).', 'Reading the columns left to right as 1-2-4-8.'],
  thuatNgu: [tn('octet', 'nhóm 8 bit')], khaiNiem: ['binary'],
});

const B = ['00101101', '11000000', '10101010', '01111111'];
const E2 = tinh({
  tieuDe: 'Binary 2 — Binary to decimal and hexadecimal', doKho: 'EASY', phut: 8,
  moTa: mt('Convert each 8-bit binary number to decimal and to two hexadecimal digits (uppercase). Tip: split into two nibbles of 4 bits.', 'Đổi mỗi số nhị phân 8 bit sang thập phân và sang hai chữ số hex (chữ hoa). Mẹo: tách thành hai nibble 4 bit.'),
  loai: 'table',
  bang: [bang1('b1', ['Binary → decimal, hex', 'Nhị phân → thập phân, hex'], [{ ma: 'b', ten: 'Binary' }, { ma: 'd', ten: 'Decimal' }, { ma: 'h', ten: 'Hex' }],
    B.map((b) => ({ o: { b }, a: { d: [String(parseInt(b, 2))], h: [parseInt(b, 2).toString(16).toUpperCase().padStart(2, '0')] } })),
    [B.map((b) => `${b} = ${parseInt(b, 2)} = 0x${parseInt(b, 2).toString(16).toUpperCase().padStart(2, '0')}`).join('; ') + '.', 'Mỗi nibble 4 bit là một chữ số hex.'])],
  goiY: ['Nibble values: 0000=0 … 1001=9, 1010=A, 1011=B, 1100=C, 1101=D, 1110=E, 1111=F.', 'Decimal = high nibble × 16 + low nibble.'],
  loiHayGap: ['Dropping the leading zero in hex (0x2D, not 0x2D5).', 'Mixing up A–F values.'],
  thuatNgu: [tn('nibble', 'nửa byte (4 bit)')], khaiNiem: ['hexadecimal'],
});

const E3 = cs({
  ten: 'Binary 3 — Why hex? Powers of two and ranges', kho: 'MEDIUM', phut: 8,
  en: 'Conceptual and quick numeric questions.', vi: 'Câu hỏi khái niệm và số nhanh.',
  cau: [
    q('c1', ['Why do MAC addresses and IPv6 use hexadecimal?', 'Vì sao địa chỉ MAC và IPv6 dùng hệ thập lục phân?'], ['One hex digit equals exactly 4 bits, so long binary strings become short and easy to read', 'Hex is faster for the CPU', 'Hex numbers cannot be mistyped', 'Routers only understand hex'], ['4 bits per digit: a 48-bit MAC is 12 hex digits.', '4 bit mỗi chữ số: MAC 48 bit là 12 chữ số hex.']),
    mcNum('c2', ['The largest value of one IPv4 octet is …', 'Giá trị lớn nhất của một octet IPv4 là …'], 255, [256, 254, 128], null, ['2⁸ − 1 = 255.', '2⁸ − 1 = 255.']),
    mcNum('c3', ['How many different addresses can 12 host bits provide?', '12 bit host cho bao nhiêu địa chỉ khác nhau?'], 4096, [2048, 4094, 1024], (x) => String(x), ['2¹² = 4096 (4094 usable hosts after removing network and broadcast).', '2¹² = 4096 (dùng được 4094 host sau khi bỏ địa chỉ mạng và broadcast).']),
    q('c4', ['The hexadecimal number 0xFF equals …', 'Số hex 0xFF bằng …'], ['255', '256', '15', '127'], ['15 × 16 + 15 = 255.', '15 × 16 + 15 = 255.']),
    q('c5', ['A MAC address has 48 bits. How many hex digits is that?', 'MAC có 48 bit. Đó là bao nhiêu chữ số hex?'], ['12', '6', '8', '16'], ['48 ÷ 4 = 12 (shown as six pairs).', '48 ÷ 4 = 12 (viết thành sáu cặp).']),
  ],
  goiY: ['Hex digit = 4 bits; octet = 2 hex digits.', 'n bits give 2ⁿ values.'],
  loi: ['Answering 256 for the largest octet value.', 'Forgetting that all-zero and all-one host values are reserved.'],
  tn: [tn('hexadecimal', 'thập lục phân')], kn: ['powers of two'],
});

const IPS = ['192.168.1.10', '10.0.0.255', '172.16.64.3', '8.8.4.4'];
const E4 = tinh({
  tieuDe: 'Binary 4 — Dotted decimal to binary', doKho: 'MEDIUM', phut: 10,
  moTa: mt('Write each IPv4 address as four 8-bit groups separated by dots.', 'Viết mỗi địa chỉ IPv4 thành bốn nhóm 8 bit cách nhau bằng dấu chấm.'),
  loai: 'table',
  bang: [bang1('b1', ['IPv4 → binary', 'IPv4 → nhị phân'], [{ ma: 'i', ten: 'IPv4' }, { ma: 'b', ten: 'Binary' }],
    IPS.map((ip) => ({ o: { i: ip }, a: { b: [S.ipToBin(ip)] } })),
    [IPS.map((ip) => `${ip} = ${S.ipToBin(ip)}`).join('; ') + '.', 'Đổi từng octet riêng, giữ dấu chấm.'])],
  goiY: ['Convert one octet at a time.', 'Keep all 8 digits of every octet.'],
  loiHayGap: ['Converting the whole address as one number.', 'Dropping leading zeros inside an octet.'],
  thuatNgu: [tn('dotted decimal', 'dạng thập phân có chấm')], khaiNiem: ['IPv4 binary'],
});

function ipToBinary(ip) {
  return ip.split('.').map(function (o) { var s = Number(o).toString(2); while (s.length < 8) s = '0' + s; return s; }).join('.');
}
const E5 = js({
  ten: 'Binary 5 — Write ipToBinary(ip)', kho: 'EASY', phut: 10,
  en: '<p>Write <code>ipToBinary(ip)</code> that turns a dotted-decimal IPv4 string into four dot-separated 8-bit groups, e.g. <code>"192.168.1.1"</code> → <code>"11000000.10101000.00000001.00000001"</code>.</p>',
  vi: '<p>Viết <code>ipToBinary(ip)</code> đổi chuỗi IPv4 thập phân có chấm thành bốn nhóm 8 bit cách nhau bằng dấu chấm, vd <code>"192.168.1.1"</code> → <code>"11000000.10101000.00000001.00000001"</code>.</p>',
  fn: 'ipToBinary', params: 'ip', ref: ipToBinary,
  cases: [['192.168.1.1'], ['0.0.0.0'], ['255.255.255.255'], ['10.1.2.3'], ['172.16.0.254'], ['8.8.8.8']],
  goiY: ['split(".") then map each part with Number(x).toString(2).', 'Pad on the left with "0" until the length is 8.'],
  loi: ['Forgetting padStart/padding so 1 becomes "1" instead of "00000001".', 'Joining with "" instead of ".".'],
  gt: ['Each octet is independent: convert, pad to 8, join.', 'Mỗi octet độc lập: đổi, đệm đủ 8, nối lại.'],
  kn: ['binary conversion'],
});

function hexToIp(hex) {
  var s = String(hex).replace(/^0x/i, ''), out = [];
  for (var i = 0; i < 8; i += 2) out.push(parseInt(s.substr(i, 2), 16));
  return out.join('.');
}
const E6 = js({
  ten: 'Binary 6 — Write hexToIp(hex)', kho: 'MEDIUM', phut: 12,
  en: '<p>Write <code>hexToIp(hex)</code>: <code>hex</code> is 8 hexadecimal digits (upper or lower case, optionally prefixed with <code>0x</code>) holding a 32-bit IPv4 address, e.g. <code>"C0A80164"</code> → <code>"192.168.1.100"</code>.</p>',
  vi: '<p>Viết <code>hexToIp(hex)</code>: <code>hex</code> gồm 8 chữ số hex (hoa hoặc thường, có thể có tiền tố <code>0x</code>) chứa địa chỉ IPv4 32 bit, vd <code>"C0A80164"</code> → <code>"192.168.1.100"</code>.</p>',
  fn: 'hexToIp', params: 'hex', ref: hexToIp,
  cases: [['C0A80164'], ['0x0A000001'], ['ffffffff'], ['00000000'], ['AC10FE01'], ['0x08080808'], ['7F000001']],
  goiY: ['Strip an optional 0x prefix first.', 'Every 2 hex digits are one octet: parseInt(pair, 16).'],
  loi: ['Parsing the whole 8 digits as one number and forgetting to split into octets.', 'Not handling the 0x prefix or lowercase digits.'],
  gt: ['Two hex digits are exactly one octet, so no arithmetic beyond parseInt is needed.', 'Hai chữ số hex đúng bằng một octet nên chỉ cần parseInt.'],
  kn: ['hexadecimal', 'IPv4'],
});

export default doiDau({ slug: 'nwc204-4-4-binary-hex', ten: '4.4 Binary, hexadecimal and dotted decimal', khoa: KHOA, baiHoc: 'nwc204-4b-1-he-nhi-phan-va-chuyen-doi-8-bit', de: [E1, E2, E3, E4, E5, E6] });
