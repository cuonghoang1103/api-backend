/** CEA201 · 10.2 — Data representation: bases, two's complement, overflow, IEEE 754, mini-float. Số do _sim.mjs (toTwos, f32Fields…) tính. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, dat } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'Data 1 — Signed numbers and floating point: concepts',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Concept questions on integer and floating-point representation.</p>', '<p>Câu hỏi khái niệm về biểu diễn số nguyên và số thực dấu chấm động.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['The range of an n-bit two’s-complement integer is …', 'Miền của số nguyên bù 2 n bit là …'], ['−2ⁿ⁻¹ … 2ⁿ⁻¹ − 1', '−2ⁿ⁻¹ + 1 … 2ⁿ⁻¹ − 1', '0 … 2ⁿ − 1', '−2ⁿ … 2ⁿ'], ['There is one more negative value than positive; zero has a single representation.', 'Có nhiều hơn một giá trị âm; số 0 chỉ có một biểu diễn.']),
    q('c2', ['Why is two’s complement preferred over sign-magnitude?', 'Vì sao bù 2 được ưa hơn dấu–độ lớn?'], ['One zero and the same adder works for signed and unsigned addition', 'It uses fewer bits', 'It represents larger numbers', 'It needs no sign bit'], ['No special hardware for the sign; subtraction = add the complement.', 'Không cần phần cứng riêng cho dấu; phép trừ = cộng số bù.']),
    q('c3', ['Sign extension of an 8-bit two’s-complement number to 16 bits is done by …', 'Mở rộng dấu số bù 2 8 bit lên 16 bit được thực hiện bằng cách …'], ['copying the sign bit into all the new high-order bits', 'filling the new bits with 0', 'filling the new bits with 1 always', 'shifting left by 8'], ['Copying the sign preserves the value.', 'Chép bit dấu giữ nguyên giá trị.']),
    q('c4', ['In IEEE 754 single precision, the exponent field is …', 'Trong IEEE 754 đơn, trường mũ là …'], ['8 bits with a bias of 127', '11 bits with a bias of 1023', '8 bits in two’s complement', '7 bits with a bias of 63'], ['value = (−1)ˢ × 1.fraction × 2^(E − 127) for normalized numbers.', 'giá trị = (−1)ˢ × 1,phần lẻ × 2^(E − 127) với số chuẩn hoá.']),
    q('c5', ['Why is 0.1 not exactly representable in binary floating point?', 'Vì sao 0,1 không biểu diễn chính xác được trong dấu chấm động nhị phân?'], ['Its binary expansion is infinite (0.000110011…)', 'It is negative', 'The exponent is too small', 'IEEE 754 forbids it'], ['Only dyadic fractions (k / 2ⁿ) are exact.', 'Chỉ phân số nhị phân k / 2ⁿ mới chính xác.']),
    q('c6', ['An overflow in two’s-complement addition is detected when …', 'Tràn khi cộng bù 2 được phát hiện khi …'], ['two operands of the same sign give a result of the opposite sign', 'a carry leaves the MSB', 'the result is zero', 'the operands have different signs'], ['Adding numbers of different signs can never overflow.', 'Cộng hai số khác dấu không bao giờ tràn.']),
  ],
  goiY: ['n bits ⇒ 2ⁿ patterns, split in two halves by the sign bit.', 'Bias moves the exponent into an unsigned field.'],
  loiHayGap: ['Believing that a carry-out always means signed overflow.', 'Zero-extending a negative number.'],
  thuatNgu: [tn('two’s complement', 'số bù 2'), tn('bias', 'độ lệch (excess)')],
  khaiNiem: ['two’s complement', 'IEEE 754'],
});

const CV = [[202, 16], [255, 16], [1000, 16], [4095, 16], [45, 8]];
const E2 = tinh({
  tieuDe: 'Data 2 — Base conversion',
  doKho: 'EASY', phut: 10,
  moTa: bi('<p>Convert each decimal number to <b>binary</b> (no leading zeros) and to <b>hexadecimal</b> (capital letters, no prefix); then convert the given hex values back to decimal.</p>', '<p>Đổi mỗi số thập phân sang <b>nhị phân</b> (không số 0 đứng đầu) và sang <b>thập lục phân</b> (chữ hoa, không tiền tố); sau đó đổi các giá trị hex cho sẵn về thập phân.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Decimal to binary and hex', 'Thập phân sang nhị phân và hex'], [{ ma: 'd', ten: 'Decimal' }, { ma: 'b', ten: 'Binary' }, { ma: 'h', ten: 'Hex' }],
    CV.map(([d]) => ({ o: { d: String(d) }, a: { b: d.toString(2), h: [d.toString(16).toUpperCase(), d.toString(16)] } })),
    [CV.map(([d]) => `${d} = ${d.toString(2)}₂ = ${d.toString(16).toUpperCase()}₁₆`).join('; ') + '. Each hex digit is exactly 4 bits.', CV.map(([d]) => `${d} = ${d.toString(2)}₂ = ${d.toString(16).toUpperCase()}₁₆`).join('; ') + '. Mỗi chữ số hex là đúng 4 bit.']),
  bang1('b2', ['Hex to decimal', 'Hex sang thập phân'], [{ ma: 'h', ten: 'Hex' }, { ma: 'd', ten: 'Decimal' }], ['7F', 'A3', '1C0', 'FFFF'].map((h) => ({ o: { h }, a: { d: String(parseInt(h, 16)) } })),
    [['7F', 'A3', '1C0', 'FFFF'].map((h) => `${h} = ${parseInt(h, 16)}`).join('; ') + '.', ['7F', 'A3', '1C0', 'FFFF'].map((h) => `${h} = ${parseInt(h, 16)}`).join('; ') + '.'])],
  goiY: ['Divide by 2 repeatedly, or use powers of two.', 'Group the binary digits by 4 from the right to get hex.'],
  loiHayGap: ['Reading the remainders of repeated division top-down (they must be read bottom-up).', 'Grouping the bits from the left.'],
  thuatNgu: [tn('hexadecimal', 'thập lục phân')],
  khaiNiem: ['number bases'],
});

const NV = [5, -5, 100, -100, -128, 127, -1];
const E3 = tinh({
  tieuDe: 'Data 3 — Two’s complement: encode and decode',
  doKho: 'EASY', phut: 12,
  moTa: bi('<p><b>Part A.</b> Write each decimal as an <b>8-bit two’s complement</b> pattern. <b>Part B.</b> Read each 8-bit pattern as a signed decimal.</p>', '<p><b>Phần A.</b> Viết mỗi số thập phân thành mẫu <b>bù 2 8 bit</b>. <b>Phần B.</b> Đọc mỗi mẫu 8 bit thành số thập phân có dấu.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Encode', 'Mã hoá'], [{ ma: 'd', ten: 'Decimal' }, { ma: 'b', ten: '8-bit pattern' }], NV.map((v) => ({ o: { d: String(v) }, a: { b: S.toTwos(v, 8) } })),
    [NV.map((v) => `${v} → ${S.toTwos(v, 8)}`).join('; ') + '. Negative n: invert the bits of |n| and add 1.', NV.map((v) => `${v} → ${S.toTwos(v, 8)}`).join('; ') + '. Số âm: đảo bit của |n| rồi cộng 1.']),
  bang1('b2', ['Decode', 'Giải mã'], [{ ma: 'b', ten: '8-bit pattern' }, { ma: 'd', ten: 'Signed decimal' }], ['11111111', '10000000', '10110100', '01111110', '11000001'].map((b) => ({ o: { b }, a: { d: String(S.fromTwos(b)) } })),
    [['11111111', '10000000', '10110100', '01111110', '11000001'].map((b) => `${b} → ${S.fromTwos(b)}`).join('; ') + '. If the MSB is 1, the value is the unsigned value − 256.', ['11111111', '10000000', '10110100', '01111110', '11000001'].map((b) => `${b} → ${S.fromTwos(b)}`).join('; ') + '. Nếu MSB là 1, giá trị = giá trị không dấu − 256.'])],
  goiY: ['Negative: invert all bits of the magnitude, then add 1.', 'Decoding: if the top bit is 1, subtract 2⁸.'],
  loiHayGap: ['Forgetting to add 1 after inverting (that gives one’s complement).', 'Reading a leading 1 as +128.'],
  thuatNgu: [tn('one’s complement', 'số bù 1')],
  khaiNiem: ['two’s complement'],
});

const NB = [4, 8, 16, 32];
const E4 = tinh({
  tieuDe: 'Data 4 — Range of n-bit integers',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>For each width give the smallest and largest value as <b>unsigned</b> and as <b>two’s-complement signed</b> integers.</p>', '<p>Với mỗi độ rộng cho giá trị nhỏ nhất và lớn nhất của số nguyên <b>không dấu</b> và <b>có dấu bù 2</b>.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Integer ranges', 'Miền số nguyên'], [{ ma: 'n', ten: 'Bits' }, { ma: 'u', ten: 'Max unsigned' }, { ma: 'lo', ten: 'Min signed' }, { ma: 'hi', ten: 'Max signed' }],
    NB.map((n) => ({ o: { n: String(n) }, a: { u: String(2 ** n - 1), lo: String(-(2 ** (n - 1))), hi: String(2 ** (n - 1) - 1) } })),
    [NB.map((n) => `${n} bits: 0..${2 ** n - 1}; ${-(2 ** (n - 1))}..${2 ** (n - 1) - 1}`).join('; ') + '.', NB.map((n) => `${n} bit: 0..${2 ** n - 1}; ${-(2 ** (n - 1))}..${2 ** (n - 1) - 1}`).join('; ') + '.'])],
  goiY: ['Unsigned: 0 to 2ⁿ − 1. Signed: −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1.', 'The two ranges contain the same number of patterns.'],
  loiHayGap: ['Using 2ⁿ instead of 2ⁿ − 1.', 'Giving the signed range as ±(2ⁿ⁻¹ − 1).'],
  thuatNgu: [tn('unsigned', 'không dấu')],
  khaiNiem: ['integer range'],
});

const AV = [[100, 27], [100, 50], [-100, -28], [-100, -29], [64, 64], [-50, 50]];
const E5 = tinh({
  tieuDe: 'Data 5 — Add in 8-bit two’s complement: result and overflow',
  doKho: 'MEDIUM', phut: 12,
  moTa: bi('<p>Add the two numbers in <b>8-bit two’s complement</b>. Give the 8-bit result pattern, the signed decimal value it represents, and whether the addition <b>overflowed</b>.</p>', '<p>Cộng hai số trong <b>bù 2 8 bit</b>. Cho mẫu kết quả 8 bit, giá trị thập phân có dấu mà nó biểu diễn và việc phép cộng có <b>tràn</b> hay không.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['8-bit addition', 'Cộng 8 bit'], [{ ma: 'x', ten: 'a + b' }, { ma: 'b', ten: 'Result bits' }, { ma: 'v', ten: 'Value' }, { ma: 'o', ten: 'Overflow', luaChon: ['Yes', 'No'] }],
    AV.map(([a, b]) => { const r = S.addTwos(a, b, 8); return { o: { x: `${a} + ${b}` }, a: { b: r.bits, v: String(r.value), o: r.overflow ? 'Yes' : 'No' } }; }),
    [AV.map(([a, b]) => { const r = S.addTwos(a, b, 8); return `${a}+${b}: ${r.bits} = ${r.value}${r.overflow ? ' (overflow: true sum ' + (a + b) + ' is outside −128..127)' : ''}`; }).join('; ') + '.', AV.map(([a, b]) => { const r = S.addTwos(a, b, 8); return `${a}+${b}: ${r.bits} = ${r.value}${r.overflow ? ' (tràn)' : ''}`; }).join('; ') + '.'])],
  goiY: ['Encode both, add as unsigned 8-bit numbers and drop the carry.', 'Overflow iff the true sum is outside −128 … 127.'],
  loiHayGap: ['Reporting the carry-out as overflow.', 'Saying that adding numbers of opposite signs can overflow.'],
  thuatNgu: [tn('overflow', 'tràn số')],
  khaiNiem: ['two’s complement addition'],
});

const FV = [-118.625, 0.15625, 1, -0.1, 100, 5.75];
const E6 = tinh({
  tieuDe: 'Data 6 — IEEE 754 single precision: encode',
  doKho: 'MEDIUM', phut: 16,
  moTa: bi('<p>Give for each value the <b>sign bit</b>, the <b>biased exponent</b> (decimal, bias 127) and the 32-bit pattern in <b>hex</b> (8 capital letters). (Values that are not exact are rounded to nearest by the hardware.)</p>', '<p>Với mỗi giá trị cho <b>bit dấu</b>, <b>số mũ lệch</b> (thập phân, bias 127) và mẫu 32 bit dạng <b>hex</b> (8 chữ hoa). (Giá trị không chính xác được phần cứng làm tròn tới giá trị gần nhất.)</p>'),
  loai: 'table',
  bang: [bang1('b1', ['IEEE 754 encoding', 'Mã hoá IEEE 754'], [{ ma: 'v', ten: 'Value' }, { ma: 's', ten: 'Sign' }, { ma: 'e', ten: 'Biased exp.' }, { ma: 'h', ten: 'Hex' }],
    FV.map((v) => { const f = S.f32Fields(v); return { o: { v: String(v) }, a: { s: f.sign, e: String(parseInt(f.exp, 2)), h: [f.hex, f.hex.toLowerCase()] } }; }),
    [FV.map((v) => { const f = S.f32Fields(v); return `${v}: s=${f.sign}, E=${parseInt(f.exp, 2)}, hex ${f.hex}`; }).join('; ') + '. E.g. −118.625 = −1110110.101₂ = −1.110110101₂ × 2⁶, so E = 6 + 127 = 133.', FV.map((v) => { const f = S.f32Fields(v); return `${v}: s=${f.sign}, E=${parseInt(f.exp, 2)}, hex ${f.hex}`; }).join('; ') + '. Vd −118,625 = −1,110110101₂ × 2⁶ nên E = 6 + 127 = 133.'])],
  goiY: ['Convert to binary, normalize to 1.xxx × 2^e, then E = e + 127.', 'The leading 1 of the significand is implicit and not stored.'],
  loiHayGap: ['Forgetting to add the bias.', 'Storing the implicit leading 1.'],
  thuatNgu: [tn('significand', 'phần định trị'), tn('biased exponent', 'số mũ lệch')],
  khaiNiem: ['IEEE 754'],
});

const decodeMini = function decodeMini(bits) {
  // 1 sign, 4 exponent (bias 7), 3 fraction
  var s = bits[0] === '1' ? -1 : 1, e = parseInt(bits.slice(1, 5), 2), f = parseInt(bits.slice(5), 2);
  if (e === 15) return f === 0 ? (s < 0 ? '-inf' : 'inf') : 'nan';
  if (e === 0) return s * (f / 8) * Math.pow(2, -6);
  return s * (1 + f / 8) * Math.pow(2, e - 7);
};
const MB = ['00111000', '01000100', '10111010', '00000011', '01110000', '01111001', '01001111'];
const E7 = jsDe({
  tieuDe: 'Data 7 — Decode an 8-bit mini-float',
  doKho: 'HARD', phut: 25,
  moTa: bi('<p>Real hardware formats are a fixed recipe. A tiny 8-bit float has <b>1 sign bit</b>, <b>4 exponent bits</b> (bias 7) and <b>3 fraction bits</b>. Write <code>decodeMini(bits)</code> (an 8-character 0/1 string) returning its value:</p><ul><li>exponent 1…14 (normalized): <code>(−1)ˢ × (1 + f/8) × 2^(E − 7)</code></li><li>exponent 0 (denormalized, includes zero): <code>(−1)ˢ × (f/8) × 2^(−6)</code></li><li>exponent 15: <code>"inf"</code> / <code>"-inf"</code> when f = 0, else <code>"nan"</code> (return these strings)</li></ul>', '<p>Định dạng thực của phần cứng là một công thức cố định. Một số thực 8 bit nhỏ có <b>1 bit dấu</b>, <b>4 bit mũ</b> (bias 7) và <b>3 bit phần lẻ</b>. Viết <code>decodeMini(bits)</code> (chuỗi 0/1 dài 8 ký tự) trả giá trị của nó:</p><ul><li>mũ 1…14 (chuẩn hoá): <code>(−1)ˢ × (1 + f/8) × 2^(E − 7)</code></li><li>mũ 0 (không chuẩn hoá, gồm số 0): <code>(−1)ˢ × (f/8) × 2^(−6)</code></li><li>mũ 15: <code>"inf"</code> / <code>"-inf"</code> khi f = 0, ngược lại <code>"nan"</code> (trả các chuỗi này)</li></ul>'),
  viDu: [{ input: 'decodeMini("00111000")', output: JSON.stringify(decodeMini('00111000')), explanation: 'E = 7, f = 0: 1.0 × 2⁰ = 1.|||E = 7, f = 0: 1,0 × 2⁰ = 1.' }, { input: 'decodeMini("01000100")', output: JSON.stringify(decodeMini('01000100')), explanation: 'E = 8, f = 4: 1.5 × 2¹ = 3.|||E = 8, f = 4: 1,5 × 2¹ = 3.' }],
  goiY: ['Slice the string: sign = bits[0], exponent = bits.slice(1, 5), fraction = bits.slice(5); parse with parseInt(…, 2).', 'Handle E = 15 and E = 0 before the general formula.', 'Math.pow(2, e) gives exact powers of two, so the results are exact.'],
  loiHayGap: ['Using 1 + f/8 for denormals (the implicit 1 is absent).', 'Forgetting that −0 is just 0 here (−1 × 0 = −0 compares equal to 0).'],
  giaiThich: '<p>IEEE-754-style formats all follow the same pattern: special exponent values mean zero/denormal and infinity/NaN, everything in between is a normalized number with an implicit leading 1 and a bias.</p>',
  khaiNiem: ['floating point', 'denormals'],
  fn: 'decodeMini',
  dau: 'function decodeMini(bits) {\n  return 0;\n}\n',
  giaiMa: dat(decodeMini, 'decodeMini'),
  ref: decodeMini,
  cases: [{ args: ['00111000'] }, { args: ['01000100'] }, { args: ['10111010'] }, { args: ['00000011'] }, { args: ['01110000'], an: true }, { args: ['11110000'], an: true }, { args: ['01111001'], an: true }, { args: ['00000000'], an: true }, { args: ['01111110'], an: true }],
});

export default doiDau({
  slug: 'cea201-10-2-data-representation',
  ten: '10.2 Data representation: integers & floating point',
  khoa: KHOA,
  baiHoc: 'cea201-quiz-ch10',
  de: [E1, E2, E3, E4, E5, E6, E7],
});
void hai; void giai; void mc; void MB;
