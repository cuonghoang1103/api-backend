/** CEA201 · LAB chương 9 — ALU n bit có cờ Z N C V. */
import { doiDau, KHOA, bi, tab, jsDe, dat } from './_ce.mjs';

const alu = function alu(op, a, b, bits) {
  var mask = Math.pow(2, bits) - 1, top = Math.pow(2, bits - 1), res = 0, c = 0, v = 0, sa = a >= top ? 1 : 0, sb = b >= top ? 1 : 0, t;
  a = a & mask; b = b & mask;
  sa = a >= top ? 1 : 0; sb = b >= top ? 1 : 0;
  if (op === 'ADD') { t = a + b; res = t & mask; c = t > mask ? 1 : 0; v = sa === sb && (res >= top ? 1 : 0) !== sa ? 1 : 0; }
  else if (op === 'SUB') { t = a + ((~b) & mask) + 1; res = t & mask; c = t > mask ? 1 : 0; v = sa !== sb && (res >= top ? 1 : 0) !== sa ? 1 : 0; }
  else if (op === 'AND') res = a & b;
  else if (op === 'OR') res = a | b;
  else if (op === 'XOR') res = a ^ b;
  else if (op === 'NOT') res = (~a) & mask;
  else if (op === 'SHL') { res = (a * 2) & mask; c = sa; }
  else if (op === 'SHR') { res = Math.floor(a / 2); c = a & 1; }
  else if (op === 'SAR') { res = Math.floor(a / 2) + (sa ? top : 0); c = a & 1; }
  return { result: res, Z: res === 0 ? 1 : 0, N: res >= top ? 1 : 0, C: c, V: v };
};
const LAB = jsDe({
  tieuDe: 'Lab 9 — An n-bit ALU with condition flags',
  doKho: 'HARD', phut: 60, diem: 60, dangBai: 'lab',
  moTa: bi(`<p><b>Scenario.</b> You are specifying the ALU of a small CPU. Write <code>alu(op, a, b, bits)</code>: <code>a</code> and <code>b</code> are unsigned integers in <code>0 … 2^bits − 1</code> (the bit patterns of the operands); return <code>{ result, Z, N, C, V }</code> — the n-bit result (unsigned) and the four condition flags (0/1).</p>
<table><thead><tr><th>op</th><th>result</th><th>C</th><th>V</th></tr></thead><tbody>
<tr><td>ADD</td><td>(a + b) mod 2ⁿ</td><td>carry-out of the top bit</td><td>operands have the same sign bit and the result has a different one</td></tr>
<tr><td>SUB</td><td>a − b computed as a + ¬b + 1 (n bits)</td><td>carry-out of that addition (C = 1 means “no borrow”)</td><td>operands have different sign bits and the result sign differs from a’s</td></tr>
<tr><td>AND / OR / XOR</td><td>bitwise</td><td>0</td><td>0</td></tr>
<tr><td>NOT</td><td>¬a (b ignored)</td><td>0</td><td>0</td></tr>
<tr><td>SHL</td><td>a shifted left by 1, n bits</td><td>the bit shifted out (old top bit)</td><td>0</td></tr>
<tr><td>SHR</td><td>logical shift right by 1</td><td>the bit shifted out (old bit 0)</td><td>0</td></tr>
<tr><td>SAR</td><td>arithmetic shift right by 1 (sign bit kept)</td><td>the bit shifted out</td><td>0</td></tr>
</tbody></table>
<p><b>Z</b> = 1 when the result is 0; <b>N</b> = the top bit of the result. “Sign bit” = the top bit of an n-bit pattern (two’s complement).</p>
<h4>Sample (4 bits)</h4>${tab(['call', 'result'], [['alu("ADD", 7, 1, 4)', JSON.stringify(alu('ADD', 7, 1, 4))], ['alu("SUB", 3, 5, 4)', JSON.stringify(alu('SUB', 3, 5, 4))], ['alu("SAR", 12, 0, 4)', JSON.stringify(alu('SAR', 12, 0, 4))]])}`,
  `<p><b>Tình huống.</b> Bạn đặc tả ALU của một CPU nhỏ. Viết <code>alu(op, a, b, bits)</code>: <code>a</code> và <code>b</code> là số nguyên không dấu trong <code>0 … 2^bits − 1</code> (mẫu bit của toán hạng); trả <code>{ result, Z, N, C, V }</code> — kết quả n bit (không dấu) và bốn cờ điều kiện (0/1).</p>
<table><thead><tr><th>op</th><th>kết quả</th><th>C</th><th>V</th></tr></thead><tbody>
<tr><td>ADD</td><td>(a + b) mod 2ⁿ</td><td>nhớ ra của bit cao nhất</td><td>hai toán hạng cùng bit dấu và kết quả khác bit dấu đó</td></tr>
<tr><td>SUB</td><td>a − b tính bằng a + ¬b + 1 (n bit)</td><td>nhớ ra của phép cộng đó (C = 1 nghĩa là “không mượn”)</td><td>hai toán hạng khác bit dấu và dấu kết quả khác dấu của a</td></tr>
<tr><td>AND / OR / XOR</td><td>theo từng bit</td><td>0</td><td>0</td></tr>
<tr><td>NOT</td><td>¬a (b bị bỏ qua)</td><td>0</td><td>0</td></tr>
<tr><td>SHL</td><td>a dịch trái 1, n bit</td><td>bit bị đẩy ra (bit cao cũ)</td><td>0</td></tr>
<tr><td>SHR</td><td>dịch phải logic 1</td><td>bit bị đẩy ra (bit 0 cũ)</td><td>0</td></tr>
<tr><td>SAR</td><td>dịch phải số học 1 (giữ bit dấu)</td><td>bit bị đẩy ra</td><td>0</td></tr>
</tbody></table>
<p><b>Z</b> = 1 khi kết quả bằng 0; <b>N</b> = bit cao nhất của kết quả. “Bit dấu” = bit cao nhất của mẫu n bit (bù 2).</p>`),
  yeuCau: [bi('Do not use floating point; use integer / bitwise operations. For <code>bits</code> up to 16 numbers stay exact.', 'Không dùng số thực; dùng phép toán số nguyên / theo bit. Với <code>bits</code> tới 16 các số luôn chính xác.')],
  viDu: [{ input: 'alu("ADD", 7, 1, 4)', output: JSON.stringify(alu('ADD', 7, 1, 4)), explanation: '7 + 1 = 8 = 1000₂: signed overflow (0111 + 0001), no carry-out.|||7 + 1 = 8 = 1000₂: tràn có dấu (0111 + 0001), không có nhớ ra.' }, { input: 'alu("SUB", 3, 5, 4)', output: JSON.stringify(alu('SUB', 3, 5, 4)), explanation: '3 − 5 = −2 = 1110₂; the borrow shows as C = 0.|||3 − 5 = −2 = 1110₂; việc mượn thể hiện bằng C = 0.' }],
  goiY: ['Let mask = 2^bits − 1 and top = 2^(bits−1). Use `& mask` to keep n bits (for bits ≤ 16 JavaScript bitwise operators are safe).', 'SUB: t = a + ((~b) & mask) + 1; C = t > mask; the result is t & mask.', 'Compute Z and N from the result at the end, not per operation.'],
  loiHayGap: ['Forgetting `& mask` after `~` (JavaScript ~ is 32-bit).', 'Reporting C = borrow for SUB (the flag is the carry of the add-complement form: no borrow ⇒ C = 1).', 'Computing V from the carry instead of from the sign bits.'],
  giaiThich: '<p>An ALU is a set of combinational functions plus flag logic. Subtraction reuses the adder (a + ¬b + 1), which is why the carry flag has the “no borrow” meaning; the overflow flag only looks at sign bits.</p>',
  khaiNiem: ['ALU', 'condition flags', 'two’s complement'],
  fn: 'alu',
  tep: 'answer.js',
  dau: 'function alu(op, a, b, bits) {\n  return { result: 0, Z: 0, N: 0, C: 0, V: 0 };\n}\n',
  giaiMa: '// Reference solution\n' + dat(alu, 'alu'),
  ref: alu,
  cases: [{ args: ['ADD', 7, 1, 4] }, { args: ['SUB', 3, 5, 4] }, { args: ['SAR', 12, 0, 4] }, { args: ['AND', 12, 10, 4] }, { args: ['ADD', 200, 100, 8], an: true }, { args: ['SUB', 128, 1, 8], an: true }, { args: ['SUB', 5, 5, 8], an: true }, { args: ['SHL', 0xC0, 0, 8], an: true }, { args: ['SHR', 1, 0, 8], an: true }, { args: ['NOT', 0, 0, 16], an: true }, { args: ['ADD', 0xFFFF, 1, 16], an: true }, { args: ['XOR', 0xAAAA, 0x5555, 16], an: true }, { args: ['SAR', 0x8001, 0, 16], an: true }, { args: ['OR', 0, 0, 4], an: true }],
});

export default doiDau({
  slug: 'cea201-9-lab-alu',
  ten: 'Lab 9 — An n-bit ALU with condition flags',
  khoa: KHOA,
  baiHoc: 'cea201-quiz-ch9',
  de: [LAB],
});
