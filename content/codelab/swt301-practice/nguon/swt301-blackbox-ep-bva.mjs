/**
 * SWT301 · 4.2 — Equivalence partitioning (SWT4 slide 15–28, LO-4.2.1 K3). Bộ luyện dễ → khó.
 */
import { doiDau, KHOA, hai, giai, lc, tn } from './_chung.mjs';
import { tinhDe, jsDe, kiemTuy, dotBienDe, TN_TEST } from './_de.mjs';

/* ───────────── E1 · phân loại giá trị (table) ───────────── */
const PV = ['valid: 12–25', 'invalid: below 12', 'invalid: above 25', 'invalid: not an integer'];
const E1 = tinhDe({
  tieuDe: 'EP 1 — Classify each value into its partition (youth card age)',
  doKho: 'EASY', phut: 6,
  moTa: {
    en: '<p><b>Specification.</b> A youth bus card is sold to people aged <b>12 to 25</b> (inclusive). Age is typed as a whole number of years.</p><p>Equivalence partitioning groups inputs that the system must treat <i>the same way</i>. Here there is one valid partition and three invalid ones (too young, too old, and input that is not a whole number). Classify each value.</p>',
    vi: '<p><b>Đặc tả.</b> Thẻ xe buýt thanh niên bán cho người từ <b>12 tới 25</b> tuổi (tính cả hai đầu). Tuổi nhập dạng số nguyên.</p><p>Phân vùng tương đương gom các input mà hệ thống phải xử lý <i>như nhau</i>. Ở đây có một vùng hợp lệ và ba vùng không hợp lệ (quá nhỏ, quá lớn, và input không phải số nguyên). Hãy xếp từng giá trị vào vùng của nó.</p>',
  },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Choose the partition of every value.', 'Chọn vùng cho từng giá trị.'),
    cot: [{ ma: 'v', ten: 'Value' }, { ma: 'p', ten: 'Partition', luaChon: PV }],
    hang: ['11', '12', '18', '25', '26', '-3', '17.5', 'twelve'].map((v, i) => ({ ma: `r${i + 1}`, o: { v } })),
    dapAn: { 'r1.p': PV[1], 'r2.p': PV[0], 'r3.p': PV[0], 'r4.p': PV[0], 'r5.p': PV[2], 'r6.p': PV[1], 'r7.p': PV[3], 'r8.p': PV[3] },
    giaiThich: giai('12, 18 and 25 are all treated the same (accepted) — one partition. −3 is below 12 just like 11: a negative age is not a new partition unless the specification says so. 17.5 and "twelve" are both rejected for not being a whole number.', '12, 18, 25 được xử lý như nhau (chấp nhận) — một vùng. −3 cũng nhỏ hơn 12 như 11: tuổi âm không thành vùng mới trừ khi đặc tả nói vậy. 17.5 và "twelve" đều bị từ chối vì không phải số nguyên.'),
  }],
  goiY: ['Hỏi: hệ thống làm gì với giá trị này? Hai giá trị bị xử lý giống hệt nhau ⇒ cùng vùng.', '−3 và 11 đều "nhỏ hơn 12"; 17.5 và "twelve" đều "không phải số nguyên".'],
  loiHayGap: ['Tách 12 và 25 thành vùng riêng — đó là GIÁ TRỊ BIÊN (bài 4.3), không phải vùng mới.', 'Coi số âm là một vùng riêng dù đặc tả không phân biệt.'],
  giaiThich: '<p>Four partitions: valid 12–25, invalid &lt; 12, invalid &gt; 25, invalid non-integer. Boundaries (12, 25) belong to the valid partition.</p>',
  thuatNgu: tn('ep', 'partition'),
  khaiNiem: ['equivalence partitioning', 'valid partition', 'invalid partition'],
});

/* ───────────── E2 · một đại diện mỗi vùng (js) ───────────── */
const E2 = jsDe({
  tieuDe: 'EP 2 — One representative per partition (mobile top-up bonus)',
  doKho: 'MEDIUM', phut: 12,
  moTa: {
    en: `<p><b>Specification — top-up bonus.</b> A mobile operator accepts top-ups that are a <b>multiple of 1,000 VND</b> between <b>10,000 and 500,000 VND</b>. The bonus is <b>0%</b> for 10,000–49,000, <b>10%</b> for 50,000–199,000 and <b>20%</b> for 200,000–500,000. Any other amount is rejected.</p>
<p>Identify every equivalence partition (valid AND invalid) and give <b>exactly one representative value per partition</b> in <code>VALUES</code>.</p>`,
    vi: `<p><b>Đặc tả — thưởng nạp tiền.</b> Nhà mạng nhận các lần nạp là <b>bội số của 1.000 đ</b> trong khoảng <b>10.000 tới 500.000 đ</b>. Thưởng <b>0%</b> cho 10.000–49.000, <b>10%</b> cho 50.000–199.000 và <b>20%</b> cho 200.000–500.000. Mọi số tiền khác bị từ chối.</p>
<p>Xác định mọi vùng tương đương (hợp lệ VÀ không hợp lệ) và đưa <b>đúng một giá trị đại diện cho mỗi vùng</b> vào <code>VALUES</code>.</p>`,
  },
  yeuCau: [
    { en: 'Every partition — the three bonus bands, too small, too large and “not a multiple of 1,000” — has exactly one value.', vi: 'Mỗi vùng — ba mức thưởng, quá nhỏ, quá lớn và “không phải bội của 1.000” — có đúng một giá trị.' },
    { en: 'No two values from the same partition (that adds a test without adding coverage).', vi: 'Không có hai giá trị cùng vùng (thêm test mà không thêm độ phủ).' },
  ],
  viDu: [{ input: 'VALUES = [5000, 20000, …]', output: '5000 → "below 10,000" · 20000 → "0% band"', explanation: 'One value per partition; any value inside the partition is as good as any other.|||Mỗi vùng một giá trị; giá trị nào trong vùng cũng tốt như nhau.' }],
  goiY: ['Có 3 vùng hợp lệ (ba mức thưởng) và 3 vùng không hợp lệ.', 'Vùng "không phải bội 1.000" nằm trên MỘT khía cạnh khác (đơn vị) — chọn một số lẻ như 25.500 để nó chỉ vi phạm luật bội số.'],
  loiHayGap: ['Quên vùng "không phải bội 1.000" vì chỉ nhìn trục số.', 'Đưa 10.000 và 49.000 cùng lúc — hai giá trị cùng một vùng 0%.', 'Dùng 9.999 làm đại diện "quá nhỏ" — nó vi phạm CẢ HAI luật (nhỏ hơn 10.000 và không phải bội 1.000), máy chấm xếp nó vào vùng "không phải bội".'],
  giaiThich: '<p>Six partitions: &lt; 10,000 · 10,000–49,000 (0%) · 50,000–199,000 (10%) · 200,000–500,000 (20%) · &gt; 500,000 · not a multiple of 1,000. EP coverage = 6/6 = 100% with six values, e.g. 5,000 · 20,000 · 100,000 · 300,000 · 600,000 · 25,500.</p>',
  thuatNgu: tn('ep', 'partition'),
  khaiNiem: ['equivalence partitioning', 'EP coverage'],
  tep: {
    'answer.js': [
      '// One representative value per equivalence partition (valid and invalid).\nconst VALUES = [\n  20000,\n];\n',
      '// Six partitions → six values.\nconst VALUES = [\n  5000,    // invalid: below 10,000\n  20000,   // valid: 0% band\n  100000,  // valid: 10% band\n  300000,  // valid: 20% band\n  600000,  // invalid: above 500,000\n  25500,   // invalid: not a multiple of 1,000\n];\n',
    ],
  },
  kiem: (() => {
    const lop = function () {
      const pv = (v) => {
        if (typeof v !== 'number' || !Number.isFinite(v)) return 'NaN';
        if (!Number.isInteger(v) || v % 1000 !== 0) return 'MULT';
        if (v < 10000) return 'LOW'; if (v <= 49000) return 'B0'; if (v <= 199000) return 'B10'; if (v <= 500000) return 'B20'; return 'HIGH';
      };
      return pv;
    };
    const ten = { LOW: 'below 10,000', B0: '0% band', B10: '10% band', B20: '20% band', HIGH: 'above 500,000', MULT: 'not a multiple of 1,000' };
    const k = (ma, moTa) => kiemTuy(moTa, new Function(`const pv = (${lop.toString()})(); const T = ${JSON.stringify(ten)};
      if (!Array.isArray(VALUES)) return 'VALUES must be an array of numbers';
      const ds = VALUES.map(pv);
      if (ds.includes('NaN')) return 'every value must be a number';
      ${ma === 'ALL' ? `const can = Object.keys(T).filter((p) => !ds.includes(p)); return can.length ? 'partition(s) without a value: ' + can.map((p) => T[p]).join(', ') : 'OK';`
    : ma === 'ONE' ? `const thua = Object.keys(T).filter((p) => ds.filter((x) => x === p).length > 1); return thua.length ? 'more than one value in: ' + thua.map((p) => T[p]).join(', ') : (VALUES.length === 6 ? 'OK' : VALUES.length + ' values — the minimum is one per partition');`
      : `return ds.includes(${JSON.stringify(ma)}) ? 'OK' : 'no value yet for: ' + T[${JSON.stringify(ma)}];`}`));
    return [
      k('B0', { en: 'A value in the 0% band', vi: 'Một giá trị ở mức 0%' }),
      k('B10', { en: 'A value in the 10% band', vi: 'Một giá trị ở mức 10%' }),
      k('B20', { en: 'A value in the 20% band', vi: 'Một giá trị ở mức 20%' }),
      k('LOW', { en: 'The invalid partition below 10,000', vi: 'Vùng không hợp lệ dưới 10.000' }),
      k('HIGH', { en: 'The invalid partition above 500,000', vi: 'Vùng không hợp lệ trên 500.000' }),
      k('MULT', { en: 'The invalid partition “not a multiple of 1,000”', vi: 'Vùng không hợp lệ “không phải bội 1.000”' }),
      k('ONE', { en: 'Exactly one value per partition (6 values)', vi: 'Đúng một giá trị mỗi vùng (6 giá trị)' }),
    ];
  })(),
});

/* ───────────── E3 · câu hỏi kiểu ISTQB (choice) ───────────── */
const E3 = tinhDe({
  tieuDe: 'EP 3 — ISTQB-style questions on equivalence partitioning',
  doKho: 'MEDIUM', phut: 10,
  moTa: {
    en: '<p>Six exam-style questions (ISTQB Foundation, K2–K3). Read each option carefully — the traps are the ones the SWT301 final exam uses: forgotten invalid partitions, boundaries mistaken for partitions, and coverage arithmetic.</p>',
    vi: '<p>Sáu câu kiểu đề thi (ISTQB Foundation, K2–K3). Đọc kỹ từng phương án — bẫy chính là các bẫy đề FE SWT301 hay dùng: quên vùng không hợp lệ, nhầm biên thành vùng, và tính độ phủ.</p>',
  },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('A field accepts whole numbers from 1 to 99. What is the minimum number of equivalence partitions (valid and invalid) for the numeric range?', 'Một trường nhận số nguyên từ 1 tới 99. Số vùng tương đương tối thiểu (hợp lệ và không hợp lệ) cho khoảng số là bao nhiêu?'),
      luaChon: lc(['a', '1'], ['b', '2'], ['c', '3'], ['d', '4']), dapAn: ['c'],
      giaiThich: giai('Below 1 (invalid), 1–99 (valid), above 99 (invalid) = 3. Boundary values are not extra partitions.', 'Dưới 1 (sai), 1–99 (đúng), trên 99 (sai) = 3. Giá trị biên không phải vùng thêm.') },
    { ma: 'q2', de: hai('A shop gives 0% discount below 100 items, 5% for 100–499 items and 10% for 500 or more (whole numbers ≥ 0). Which set covers ALL valid partitions with the fewest values?', 'Cửa hàng giảm 0% dưới 100 sản phẩm, 5% cho 100–499 và 10% từ 500 trở lên (số nguyên ≥ 0). Bộ nào phủ MỌI vùng hợp lệ với ít giá trị nhất?'),
      luaChon: lc(['a', '0, 99, 100'], ['b', '50, 250, 750'], ['c', '99, 100, 499, 500'], ['d', '100, 499']), dapAn: ['b'],
      giaiThich: giai('Three valid partitions → three values, one in each. (a) misses 500+, (c) uses four values (boundary values), (d) misses two partitions.', 'Ba vùng hợp lệ → ba giá trị, mỗi vùng một. (a) thiếu 500+, (c) dùng bốn giá trị (biên), (d) thiếu hai vùng.') },
    { ma: 'q3', de: hai('Why should each INVALID partition be tested in its own test case?', 'Vì sao mỗi vùng KHÔNG hợp lệ nên được test trong một test case riêng?'),
      luaChon: lc(['a', 'Because invalid partitions are more important than valid ones'], ['b', 'Because one rejection can mask another — you cannot tell which invalid value caused the error'], ['c', 'Because the ISTQB syllabus forbids combining partitions'], ['d', 'Because invalid inputs are slower to execute']), dapAn: ['b'],
      giaiThich: giai('Defect masking: if two invalid values are in one test and the system rejects it, you do not know whether BOTH checks work. Valid partitions may be combined.', 'Che lỗi: nếu hai giá trị sai nằm chung một test và hệ thống từ chối, bạn không biết CẢ HAI bước kiểm có chạy đúng không. Vùng hợp lệ thì được ghép chung.') },
    { ma: 'q4', de: hai('Eight partitions were identified; the tests exercise six of them. What is the equivalence-partition coverage?', 'Đã xác định 8 vùng; các test chạm 6 vùng. Độ phủ phân vùng là bao nhiêu?'),
      luaChon: lc(['a', '6%'], ['b', '75%'], ['c', '80%'], ['d', '133%']), dapAn: ['b'],
      giaiThich: giai('EP coverage = partitions tested ÷ partitions identified = 6 / 8 = 75%.', 'Độ phủ EP = số vùng đã test ÷ số vùng xác định = 6 / 8 = 75%.') },
    { ma: 'q5', de: hai('Which statement about equivalence partitioning is TRUE?', 'Phát biểu nào về phân vùng tương đương là ĐÚNG?'),
      luaChon: lc(['a', 'It applies only to numeric inputs'], ['b', 'It can be applied to inputs, outputs, internal values and time-related values'], ['c', 'It is a white-box technique'], ['d', 'Each partition must be tested with at least two values']), dapAn: ['b'],
      giaiThich: giai('EP applies to any data the system treats in groups — inputs, outputs, internal values, time, interface parameters. It is black-box; one value per partition is enough.', 'EP áp dụng cho mọi dữ liệu được xử lý theo nhóm — input, output, giá trị nội bộ, thời gian, tham số giao diện. Nó là black-box; mỗi vùng một giá trị là đủ.') },
    { ma: 'q6', de: hai('A month field accepts 1–12. Which of these is NOT a separate equivalence partition according to the specification?', 'Trường tháng nhận 1–12. Cái nào KHÔNG phải một vùng tương đương riêng theo đặc tả?'),
      luaChon: lc(['a', 'Values below 1'], ['b', 'Values from 1 to 12'], ['c', 'Values above 12'], ['d', 'The value 12']), dapAn: ['d'],
      giaiThich: giai('12 is a member (and a boundary) of the valid partition 1–12, not a partition of its own.', '12 là phần tử (và là biên) của vùng hợp lệ 1–12, không phải một vùng riêng.') },
  ],
  goiY: ['Đếm vùng = đếm cách hệ thống phản ứng khác nhau; biên KHÔNG phải vùng.', 'Độ phủ = đã test ÷ đã xác định.'],
  loiHayGap: ['Đếm biên (1 và 99) thành vùng.', 'Ghép nhiều giá trị sai trong một test.'],
  giaiThich: '<p>Answers: c · b · b · b · b · d.</p>',
  thuatNgu: tn('ep', 'partition'),
  khaiNiem: ['equivalence partitioning'],
});

/* ───────────── E4 · viết test theo EP, chấm bằng mutant ───────────── */
const DUNG4 = `function topUpBonus(amount) {
  if (!Number.isInteger(amount) || amount % 1000 !== 0) throw new RangeError('amount must be a multiple of 1,000');
  if (amount < 10000 || amount > 500000) throw new RangeError('amount out of range');
  if (amount >= 200000) return amount * 20 / 100;
  if (amount >= 50000) return amount * 10 / 100;
  return 0;
}`;
const doi4 = (a, b) => { if (!DUNG4.includes(a)) throw new Error('mutant 4.2: ' + a); return DUNG4.replace(a, b); };
const E4 = dotBienDe({
  tieuDe: 'EP 4 — Unit tests from partitions (topUpBonus) — kill the mutants',
  doKho: 'MEDIUM', phut: 15,
  moTa: {
    en: `<p><code>topUpBonus(amount)</code> implements the specification of EP 2: it returns the bonus in VND, or throws <code>RangeError</code> for an amount that is not a multiple of 1,000 or is outside 10,000–500,000.</p>
<p>Write tests in <code>tests.js</code> — <b>one test per equivalence partition</b> is the goal. The grader runs your tests against the correct function and against six faulty versions (mutants), each of which mishandles a whole partition. A mutant is <i>killed</i> when at least one of your tests passes on the correct code and fails on the mutant.</p>`,
    vi: `<p><code>topUpBonus(amount)</code> cài đặt đặc tả của EP 2: trả tiền thưởng (VND), hoặc ném <code>RangeError</code> khi số tiền không phải bội 1.000 hoặc ngoài 10.000–500.000.</p>
<p>Viết test trong <code>tests.js</code> — mục tiêu là <b>mỗi vùng tương đương một test</b>. Máy chấm chạy test của bạn trên hàm đúng và trên sáu bản lỗi (mutant), mỗi bản xử lý sai cả một vùng. Mutant bị <i>giết</i> khi có ít nhất một test đạt trên mã đúng mà trượt trên mutant.</p>`,
  },
  yeuCau: [
    { en: 'Call <code>topUpBonus(...)</code> inside each test. Values: <code>expect(topUpBonus(100000)).toBe(10000)</code>; errors: <code>expect(() => topUpBonus(600000)).toThrow(RangeError)</code>.', vi: 'Gọi <code>topUpBonus(...)</code> trong từng test. Giá trị: <code>expect(topUpBonus(100000)).toBe(10000)</code>; lỗi: <code>expect(() => topUpBonus(600000)).toThrow(RangeError)</code>.' },
    { en: 'At least 6 tests, all passing on the correct function; every mutant killed.', vi: 'Ít nhất 6 test, đạt hết trên hàm đúng; giết mọi mutant.' },
  ],
  viDu: [{ input: 'test("10% band", () => expect(topUpBonus(100000)).toBe(10000))', output: 'passes on the correct code; kills the mutant that pays 20% in the 10% band', explanation: 'One representative per partition is enough to catch partition-level faults.|||Mỗi vùng một đại diện là đủ bắt lỗi mức vùng.' }],
  goiY: ['Sáu vùng của EP 2 ⇒ sáu test. Ba vùng hợp lệ kiểm giá trị trả về; ba vùng không hợp lệ kiểm RangeError.', 'Mutant ẩn chấp nhận số tiền dưới 10.000 — vùng "quá nhỏ" phải có test riêng (vd 5.000).'],
  loiHayGap: ['Viết toThrow() cho số 25.500 nhưng lại gọi topUpBonus(25500) trực tiếp (không bọc trong hàm) ⇒ test văng lỗi thay vì kiểm lỗi.', 'Chỉ test các vùng hợp lệ — mutant chấp nhận số tiền lẻ (bỏ kiểm bội số) sống sót.'],
  giaiThich: '<p>One value per partition kills every partition-level mutant. JUnit 5 equivalent: <code>@ParameterizedTest @CsvSource({"20000,0","100000,10000","300000,60000"})</code> for the valid bands and <code>assertThrows(IllegalArgumentException.class, () -&gt; topUpBonus(600000))</code> for each invalid partition.</p>',
  thuatNgu: [...TN_TEST(), ...tn('ep')],
  ten: ['topUpBonus'], dung: DUNG4, minTest: 6,
  dotBien: [
    { ma: 'M1', moTa: { en: 'the 10% band pays 20%', vi: 'mức 10% trả 20%' }, code: doi4('return amount * 10 / 100;', 'return amount * 20 / 100;') },
    { ma: 'M2', moTa: { en: 'amounts that are not a multiple of 1,000 are accepted', vi: 'chấp nhận số tiền không phải bội 1.000' }, code: doi4(' || amount % 1000 !== 0', '') },
    { ma: 'M3', moTa: { en: 'the upper limit is 200,000 instead of 500,000', vi: 'giới hạn trên là 200.000 thay vì 500.000' }, code: doi4('amount > 500000', 'amount > 200000') },
    { ma: 'M4', moTa: { en: 'the 0% band pays 10%', vi: 'mức 0% trả 10%' }, code: doi4('return 0;', 'return amount * 10 / 100;') },
    { ma: 'M5', moTa: { en: 'the 20% band pays 15%', vi: 'mức 20% trả 15%' }, code: doi4('return amount * 20 / 100;', 'return amount * 15 / 100;') },
    { ma: 'M6', an: true, moTa: { en: 'amounts below 10,000 are accepted', vi: 'chấp nhận số tiền dưới 10.000' }, code: doi4('amount < 10000 || ', '') },
  ],
  dauTest: `// Write one test per equivalence partition of topUpBonus(amount).
test('10% band: 100,000 earns 10,000', () => {
  expect(topUpBonus(100000)).toBe(10000);
});
`,
  giaiTest: `// One test per equivalence partition (3 valid bands + 3 invalid partitions).
describe('topUpBonus — equivalence partitions', () => {
  test.each([
    [20000, 0],        // 0% band
    [100000, 10000],   // 10% band
    [300000, 60000],   // 20% band
  ])('valid partition: %i earns %i', (amount, bonus) => {
    expect(topUpBonus(amount)).toBe(bonus);
  });

  test.each([
    [5000],     // below 10,000
    [600000],   // above 500,000
    [25500],    // not a multiple of 1,000
  ])('invalid partition: %i is rejected', (amount) => {
    expect(() => topUpBonus(amount)).toThrow(RangeError);
  });
});
`,
});

/* ───────────── E5 · nhiều trường: ghép vùng hợp lệ, tách vùng sai (js) ───────────── */
const E5 = jsDe({
  tieuDe: 'EP 5 — Minimal EP test set for a three-field form (one invalid partition per test)',
  doKho: 'HARD', phut: 20,
  moTa: {
    en: `<p><b>Specification — sign-up form.</b></p>
<ul><li><b>Username</b>: 4–16 characters, letters and digits only.</li><li><b>Age</b>: a whole number from 18 to 60.</li><li><b>Country</b>: VN, SG or TH (all three are processed identically).</li></ul>
<p>The form is <code>ACCEPTED</code> when every field is valid, otherwise <code>REJECTED</code>. Design the <b>minimum</b> set of test cases that covers every equivalence partition of every field, following the rule from the slides: <b>valid partitions may be combined in one test; each invalid partition is tested on its own</b> (all other fields valid).</p>`,
    vi: `<p><b>Đặc tả — form đăng ký.</b></p>
<ul><li><b>Username</b>: 4–16 ký tự, chỉ chữ và số.</li><li><b>Age</b>: số nguyên từ 18 tới 60.</li><li><b>Country</b>: VN, SG hoặc TH (ba giá trị được xử lý như nhau).</li></ul>
<p>Form <code>ACCEPTED</code> khi mọi trường hợp lệ, ngược lại <code>REJECTED</code>. Thiết kế bộ test <b>tối thiểu</b> phủ mọi vùng tương đương của mọi trường, theo luật trên slide: <b>vùng hợp lệ được ghép chung một test; mỗi vùng không hợp lệ test riêng</b> (các trường khác hợp lệ).</p>`,
  },
  yeuCau: [
    { en: 'Partitions: Username valid · too short · too long · invalid characters; Age valid · below 18 · above 60 · not a whole number; Country valid · other.', vi: 'Các vùng: Username hợp lệ · quá ngắn · quá dài · ký tự sai; Age hợp lệ · dưới 18 · trên 60 · không phải số nguyên; Country hợp lệ · khác.' },
    { en: 'Each test: <code>{ username, age, country, expected }</code> with <code>expected</code> "ACCEPTED" or "REJECTED". A test may contain at most ONE invalid value, and that value must break only one rule.', vi: 'Mỗi test: <code>{ username, age, country, expected }</code> với <code>expected</code> "ACCEPTED" hoặc "REJECTED". Mỗi test chứa tối đa MỘT giá trị sai, và giá trị đó chỉ phạm một luật.' },
  ],
  viDu: [{ input: "{ username: 'abc', age: 30, country: 'VN', expected: 'REJECTED' }", output: 'covers “username too short”', explanation: 'Only the username is invalid, so a rejection proves the length check works.|||Chỉ username sai, nên bị từ chối chứng minh bước kiểm độ dài chạy đúng.' }],
  goiY: ['Đếm: 1 ca toàn hợp lệ + số vùng không hợp lệ (3 + 3 + 1).', 'Ký tự sai nhưng độ dài phải hợp lệ (vd "abc_12" có 6 ký tự) — nếu không, một giá trị phạm hai luật.'],
  loiHayGap: ['Một test vừa username quá ngắn vừa tuổi 17 — che lỗi.', 'Ba test hợp lệ cho VN, SG, TH — đặc tả nói ba nước xử lý như nhau ⇒ một vùng.', 'Nhập tuổi "25" (chuỗi) cho ca hợp lệ — máy chấm coi đó là "không phải số nguyên".'],
  giaiThich: '<p>10 partitions, 7 of them invalid ⇒ minimum = 1 all-valid test + 7 single-invalid tests = <b>8</b>. Example: ("an2025", 30, "VN") ACCEPTED; ("abc", 30, "VN"), ("a".repeat(17), 30, "VN"), ("an_2025", 30, "VN"), ("an2025", 17, "VN"), ("an2025", 61, "VN"), ("an2025", 30.5, "VN"), ("an2025", 30, "US") all REJECTED.</p>',
  thuatNgu: [...tn('ep', 'partition'), { en: 'defect masking', vi: 'che lỗi — một lỗi/từ chối che mất lỗi khác' }],
  khaiNiem: ['equivalence partitioning', 'combining partitions', 'defect masking'],
  tep: {
    'answer.js': [
      "// One object per test case: { username, age, country, expected: 'ACCEPTED' | 'REJECTED' }\nconst TESTS = [\n  { username: 'an2025', age: 30, country: 'VN', expected: 'ACCEPTED' },\n];\n",
      "// Minimum EP set: 1 all-valid test + 7 tests with exactly one invalid partition each.\nconst TESTS = [\n  { username: 'an2025', age: 30, country: 'VN', expected: 'ACCEPTED' },      // all valid partitions\n  { username: 'abc', age: 30, country: 'VN', expected: 'REJECTED' },         // username too short\n  { username: 'abcdefghijklmnopq', age: 30, country: 'VN', expected: 'REJECTED' }, // username too long (17)\n  { username: 'an_2025', age: 30, country: 'VN', expected: 'REJECTED' },     // invalid character\n  { username: 'an2025', age: 17, country: 'VN', expected: 'REJECTED' },      // age below 18\n  { username: 'an2025', age: 61, country: 'VN', expected: 'REJECTED' },      // age above 60\n  { username: 'an2025', age: 30.5, country: 'VN', expected: 'REJECTED' },    // age not a whole number\n  { username: 'an2025', age: 30, country: 'US', expected: 'REJECTED' },      // country not supported\n];\n",
    ],
  },
  kiem: (() => {
    const loi = function (t) {
      const v = [];
      const u = t.username;
      if (typeof u !== 'string') v.push('U_TYPE');
      else {
        if (!/^[A-Za-z0-9]*$/.test(u)) v.push('U_CHARS');
        if (u.length < 4) v.push('U_SHORT');
        if (u.length > 16) v.push('U_LONG');
      }
      const a = t.age;
      if (typeof a !== 'number' || !Number.isInteger(a)) v.push('A_NOTINT');
      else { if (a < 18) v.push('A_LOW'); if (a > 60) v.push('A_HIGH'); }
      if (['VN', 'SG', 'TH'].indexOf(t.country) < 0) v.push('C_BAD');
      return v;
    };
    const TEN = { U_SHORT: 'username too short', U_LONG: 'username too long', U_CHARS: 'username with invalid characters', A_LOW: 'age below 18', A_HIGH: 'age above 60', A_NOTINT: 'age not a whole number', C_BAD: 'unsupported country', VALID: 'all-valid test' };
    const tao = (than) => new Function(`const loi = ${loi.toString()}; const TEN = ${JSON.stringify(TEN)};
      if (!Array.isArray(TESTS) || !TESTS.length) return 'TESTS must be a non-empty array';
      const vs = TESTS.map(loi);
      ${than}`);
    const phu = (ma, moTa) => kiemTuy(moTa, tao(`return vs.some((v, i) => (${JSON.stringify(ma)} === 'VALID' ? v.length === 0 : v.length === 1 && v[0] === ${JSON.stringify(ma)}) && String(TESTS[i].expected).toUpperCase() === (v.length ? 'REJECTED' : 'ACCEPTED')) ? 'OK' : 'not covered yet: ' + TEN[${JSON.stringify(ma)}];`));
    return [
      kiemTuy({ en: 'No test mixes two invalid values (or one value that breaks two rules)', vi: 'Không test nào trộn hai giá trị sai (hoặc một giá trị phạm hai luật)' }, tao("const x = vs.findIndex((v) => v.length > 1); return x < 0 ? 'OK' : 'test #' + (x + 1) + ' breaks ' + vs[x].length + ' rules at once (' + vs[x].map((m) => TEN[m] || m).join(' + ') + ') — the rejection masks one of them';")),
      kiemTuy({ en: 'Every expected result is right (ACCEPTED only when all fields are valid)', vi: 'Mọi kết quả mong đợi đúng (ACCEPTED chỉ khi mọi trường hợp lệ)' }, tao("const x = TESTS.findIndex((t, i) => String(t.expected).toUpperCase() !== (vs[i].length ? 'REJECTED' : 'ACCEPTED')); return x < 0 ? 'OK' : 'test #' + (x + 1) + ': expected should be ' + (vs[x].length ? 'REJECTED' : 'ACCEPTED');")),
      phu('VALID', { en: 'Covers all valid partitions together', vi: 'Phủ mọi vùng hợp lệ trong một test' }),
      phu('U_SHORT', { en: 'Covers: username too short', vi: 'Phủ: username quá ngắn' }),
      phu('U_LONG', { en: 'Covers: username too long', vi: 'Phủ: username quá dài' }),
      phu('U_CHARS', { en: 'Covers: username with invalid characters', vi: 'Phủ: username có ký tự sai' }),
      phu('A_LOW', { en: 'Covers: age below 18', vi: 'Phủ: tuổi dưới 18' }),
      phu('A_HIGH', { en: 'Covers: age above 60', vi: 'Phủ: tuổi trên 60' }),
      phu('A_NOTINT', { en: 'Covers: age not a whole number', vi: 'Phủ: tuổi không phải số nguyên' }),
      phu('C_BAD', { en: 'Covers: unsupported country', vi: 'Phủ: quốc gia không hỗ trợ' }),
      kiemTuy({ en: 'Minimum size: exactly 8 tests', vi: 'Kích thước tối thiểu: đúng 8 test' }, tao("return TESTS.length === 8 ? 'OK' : TESTS.length + ' tests — the minimum is 1 all-valid + 7 single-invalid = 8';")),
    ];
  })(),
});

export default doiDau({
  slug: 'swt301-blackbox-ep-bva',
  ten: '4.2 Equivalence partitioning',
  moTaModule: 'Phân vùng tương đương: xếp giá trị vào vùng, một đại diện mỗi vùng (kể cả vùng "không phải bội 1.000"), câu hỏi ISTQB, viết test theo vùng giết 6 mutant, bộ test tối thiểu cho form ba trường (ghép vùng đúng, tách vùng sai).',
  khoa: KHOA,
  baiHoc: 'swt301-blackbox-ep-bva',
  de: [E1, E2, E3, E4, E5],
});
