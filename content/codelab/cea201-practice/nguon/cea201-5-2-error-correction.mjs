/** CEA201 · 5.2 — Error detection & correction: parity, Hamming SEC / SEC-DED. */
import { doiDau, KHOA, S, bi, hai, giai, tinh, jsDe, mc, q, tn, bang1, dat, code } from './_ce.mjs';

const E1 = tinh({
  tieuDe: 'ECC 1 — Parity, Hamming distance and SEC-DED',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Concept questions on error detection and correction.</p>', '<p>Câu hỏi khái niệm về phát hiện và sửa lỗi.</p>'),
  loai: 'choice',
  cauHoi: [
    q('c1', ['A single even-parity bit can …', 'Một bit chẵn lẻ (even parity) có thể …'], ['detect any odd number of errors but not locate them', 'correct any single-bit error it detects in a word', 'detect and correct any two-bit error in a word', 'detect only 2-bit errors, never single-bit ones'], ['Parity says only “an odd number of bits flipped”.', 'Parity chỉ cho biết “một số lẻ bit đã đổi”.']),
    q('c2', ['To correct 1 error a code needs a minimum Hamming distance of …', 'Để sửa 1 lỗi, mã cần khoảng cách Hamming tối thiểu là …'], ['3', '1', '2', '4'], ['Distance d corrects ⌊(d−1)/2⌋ errors: 3 → 1.', 'Khoảng cách d sửa được ⌊(d−1)/2⌋ lỗi: 3 → 1.']),
    q('c3', ['SEC-DED means …', 'SEC-DED nghĩa là …'], ['single-error correction, double-error detection', 'single-error detection, double-error correction', 'serial error check, dual error design', 'secure error code, direct error detection'], ['One extra overall parity bit turns Hamming (distance 3) into distance 4.', 'Thêm một bit chẵn lẻ tổng biến Hamming (khoảng cách 3) thành khoảng cách 4.']),
    q('c4', ['In a Hamming code, a non-zero syndrome tells us …', 'Trong mã Hamming, hội chứng khác 0 cho ta biết …'], ['the position of the bit in error', 'the number of data bits', 'which parity bit is wrong only', 'that the data are correct'], ['With even parity the syndrome equals the position (1-based) of the flipped bit.', 'Với parity chẵn, hội chứng bằng vị trí (đánh từ 1) của bit bị lật.']),
    q('c5', ['Parity bits of a Hamming code are placed at positions …', 'Các bit kiểm tra của mã Hamming nằm ở vị trí …'], ['1, 2, 4, 8, …', '1, 3, 5, 7, …', 'the last r positions', '2, 3, 5, 7, …'], ['Each power-of-two position checks the positions whose binary index contains that bit.', 'Mỗi vị trí luỹ thừa 2 kiểm các vị trí mà chỉ số nhị phân chứa bit đó.']),
  ],
  goiY: ['Distance 3 corrects 1; distance 4 corrects 1 and detects 2.', 'Syndrome = XOR of the positions of all 1-bits of the received word.'],
  loiHayGap: ['Thinking parity can correct.', 'Putting parity bits at the end instead of at powers of two.'],
  thuatNgu: [tn('syndrome', 'hội chứng lỗi'), tn('Hamming distance', 'khoảng cách Hamming')],
  khaiNiem: ['parity', 'Hamming code', 'SEC-DED'],
});

const MS = [4, 8, 16, 32, 64, 128];
const E2 = tinh({
  tieuDe: 'ECC 2 — How many check bits do you need?',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>A Hamming code that corrects one error (SEC) needs the smallest <b>r</b> with 2ʳ ≥ m + r + 1. SEC-DED adds one overall parity bit. Fill in r, the SEC code word length m + r, and the number of check bits for SEC-DED.</p>', '<p>Mã Hamming sửa một lỗi (SEC) cần <b>r</b> nhỏ nhất thoả 2ʳ ≥ m + r + 1. SEC-DED thêm một bit chẵn lẻ tổng. Điền r, độ dài từ mã SEC m + r và số bit kiểm tra của SEC-DED.</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Check bits', 'Số bit kiểm tra'], [{ ma: 'm', ten: 'Data bits m' }, { ma: 'r', ten: 'r (SEC)' }, { ma: 'n', ten: 'm + r' }, { ma: 'd', ten: 'r + 1 (SEC-DED)' }],
    MS.map((m) => ({ o: { m: String(m) }, a: { r: String(S.hammingR(m)), n: String(m + S.hammingR(m)), d: String(S.hammingR(m) + 1) } })),
    [MS.map((m) => `m=${m}: r=${S.hammingR(m)}, n=${m + S.hammingR(m)}, SEC-DED ${S.hammingR(m) + 1}`).join('; ') + '. The relative cost falls as words get wider (that is why servers use 64+8).', MS.map((m) => `m=${m}: r=${S.hammingR(m)}, n=${m + S.hammingR(m)}, SEC-DED ${S.hammingR(m) + 1}`).join('; ') + '. Chi phí tương đối giảm khi từ dài hơn (vì thế máy chủ dùng 64+8).'])],
  goiY: ['Try r = 1, 2, 3… until 2ʳ ≥ m + r + 1.', 'SEC-DED = SEC + 1.'],
  loiHayGap: ['Forgetting the “+ r” inside m + r + 1.', 'Adding the overall parity bit twice.'],
  thuatNgu: [tn('SEC', 'sửa một lỗi')],
  khaiNiem: ['Hamming code size'],
});

const D4 = ['1011', '0110', '1111'], D8 = ['10110010', '01101001'];
const E3 = tinh({
  tieuDe: 'ECC 3 — Encode with a Hamming code (even parity)',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi('<p>Positions are numbered from 1 at the LEFT; parity bits sit at positions 1, 2, 4, 8 (even parity); the data bits fill the other positions from left to right. Write the complete code word (a string of 0/1 with no spaces).</p>', '<p>Vị trí đánh số từ 1 ở bên TRÁI; bit kiểm tra ở vị trí 1, 2, 4, 8 (parity chẵn); bit dữ liệu lấp các vị trí còn lại từ trái sang phải. Viết từ mã đầy đủ (chuỗi 0/1 không có dấu cách).</p>'),
  loai: 'table',
  bang: [bang1('b1', ['Hamming encoding', 'Mã hoá Hamming'], [{ ma: 'd', ten: 'Data' }, { ma: 'c', ten: 'Code word' }],
    [...D4, ...D8].map((d) => ({ o: { d }, a: { c: S.hammingEncode(d) } })),
    ['p1 covers positions 1,3,5,7,…; p2 covers 2,3,6,7,…; p4 covers 4,5,6,7,12,…; p8 covers 8–15. ' + [...D4, ...D8].map((d) => `${d} → ${S.hammingEncode(d)}`).join('; ') + '.', [...D4, ...D8].map((d) => `${d} → ${S.hammingEncode(d)}`).join('; ') + '.'])],
  goiY: ['Place the data first (parity positions = 0), then compute each parity so that its group has an even number of 1s.', 'The group of p_k is every position whose binary representation has bit k set.'],
  loiHayGap: ['Putting the data bits in the wrong positions (they skip the powers of two).', 'Using odd parity.'],
  thuatNgu: [tn('even parity', 'parity chẵn')],
  khaiNiem: ['Hamming encoding'],
});

const base = S.hammingEncode('10110010');
const flip = (s, p) => s.slice(0, p - 1) + (s[p - 1] === '1' ? '0' : '1') + s.slice(p);
const ERR = [0, 3, 4, 9, 12].map((p) => (p === 0 ? base : flip(base, p)));
const E4 = tinh({
  tieuDe: 'ECC 4 — Find and fix the bad bit',
  doKho: 'MEDIUM', phut: 14,
  moTa: bi(`<p>These 12-bit Hamming code words (even parity, parity at positions 1, 2, 4, 8) were read from memory; each has at most one flipped bit. Give the <b>syndrome</b> (decimal; 0 = no error) and the corrected <b>data bits</b> (8 bits).</p>`, `<p>Các từ mã Hamming 12 bit (parity chẵn, kiểm tra ở vị trí 1, 2, 4, 8) được đọc từ bộ nhớ; mỗi từ có tối đa một bit bị lật. Cho <b>hội chứng</b> (thập phân; 0 = không lỗi) và <b>bit dữ liệu</b> đã sửa (8 bit).</p>`),
  loai: 'table',
  bang: [bang1('b1', ['Syndrome and corrected data', 'Hội chứng và dữ liệu đã sửa'], [{ ma: 'w', ten: 'Received word' }, { ma: 's', ten: 'Syndrome' }, { ma: 'd', ten: 'Data' }],
    ERR.map((w) => ({ o: { w }, a: { s: String(S.hammingSyndrome(w)), d: S.hammingDecode(w) } })),
    ['Syndrome = XOR of the positions holding a 1. ' + ERR.map((w) => `${w}: syndrome ${S.hammingSyndrome(w)} → data ${S.hammingDecode(w)}`).join('; ') + '. A flipped parity bit gives a power-of-two syndrome but the data are already right.', ERR.map((w) => `${w}: hội chứng ${S.hammingSyndrome(w)} → dữ liệu ${S.hammingDecode(w)}`).join('; ') + '. Lật bit kiểm tra cho hội chứng là luỹ thừa 2 nhưng dữ liệu vẫn đúng.'])],
  goiY: ['XOR the (1-based) positions of all the 1 bits.', 'Flip the bit at the syndrome position, then drop the parity positions 1, 2, 4, 8.'],
  loiHayGap: ['Counting positions from 0.', 'Forgetting that the error can be in a parity bit itself.'],
  thuatNgu: [tn('syndrome', 'hội chứng')],
  khaiNiem: ['Hamming decoding'],
});

const fix = function hammingFix(codeWord) {
  var s = 0, i, w = codeWord.split('');
  for (i = 1; i <= w.length; i++) if (w[i - 1] === '1') s ^= i;
  if (s > 0 && s <= w.length) w[s - 1] = w[s - 1] === '1' ? '0' : '1';
  var d = '';
  for (i = 1; i <= w.length; i++) if ((i & (i - 1)) !== 0) d += w[i - 1];
  return { syndrome: s, data: d };
};
const E5 = jsDe({
  tieuDe: 'ECC 5 — Write a Hamming decoder',
  doKho: 'HARD', phut: 20,
  moTa: bi('<p>Write <code>hammingFix(word)</code> for a Hamming code word given as a string of <code>0</code>/<code>1</code> of any length (positions numbered from 1 at the left, even parity, parity bits at the powers of two). Return <code>{ syndrome, data }</code>: <code>syndrome</code> is the position of the flipped bit (0 if none) and <code>data</code> the data bits after correction (without the parity positions), as a string.</p>', '<p>Viết <code>hammingFix(word)</code> cho từ mã Hamming dạng chuỗi <code>0</code>/<code>1</code> độ dài bất kỳ (vị trí đánh từ 1 ở bên trái, parity chẵn, bit kiểm tra ở các vị trí luỹ thừa 2). Trả <code>{ syndrome, data }</code>: <code>syndrome</code> là vị trí bit bị lật (0 nếu không có) và <code>data</code> là các bit dữ liệu sau khi sửa (bỏ các vị trí kiểm tra), dạng chuỗi.</p>'),
  yeuCau: [bi('Assume at most one bit is wrong.', 'Giả sử tối đa một bit sai.')],
  viDu: [{ input: 'hammingFix("0110011")', output: JSON.stringify(fix('0110011')), explanation: 'A valid word: syndrome 0, data 1011.|||Từ hợp lệ: hội chứng 0, dữ liệu 1011.' }, { input: 'hammingFix("0110111")', output: JSON.stringify(fix('0110111')), explanation: 'Bit 5 flipped: the syndrome is 5.|||Bit 5 bị lật: hội chứng là 5.' }],
  goiY: ['The syndrome is the XOR of the indices i (1-based) where word[i-1] is "1".', 'If it is non-zero flip that position, then collect the bits whose index is not a power of two: (i & (i − 1)) !== 0.'],
  loiHayGap: ['Off-by-one: strings are 0-based, positions are 1-based.', 'Including the parity positions in the returned data.'],
  giaiThich: '<p>Even-parity Hamming codes make the XOR of the positions of the set bits equal to zero; a single flipped bit changes that XOR by exactly its position.</p>',
  khaiNiem: ['Hamming decoding', 'bit manipulation'],
  fn: 'hammingFix',
  dau: 'function hammingFix(word) {\n  return { syndrome: 0, data: "" };\n}\n',
  giaiMa: dat(fix, 'hammingFix'),
  ref: fix,
  cases: [{ args: ['0110011'] }, { args: ['0110111'] }, { args: [ERR[3]] }, { args: [S.hammingEncode('1')] }, { args: [flip(S.hammingEncode('110100111010'), 17)], an: true }, { args: [S.hammingEncode('0000')], an: true }, { args: [flip(S.hammingEncode('10101010101010101'), 1)], an: true }],
});

export default doiDau({
  slug: 'cea201-5-2-error-correction',
  ten: '5.2 Memory organization & error correction',
  khoa: KHOA,
  baiHoc: 'cea201-5-2-error-correction',
  de: [E1, E2, E3, E4, E5],
});
void hai; void giai; void mc; void code;
