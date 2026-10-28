/**
 * SWT301 · 8.5 — Hands-on JUnit: build.xml (Ant + JaCoCo, JUnit 4.13.2) → JUnit 5; viết test (chấm bằng mutant) như @ParameterizedTest,
 * assertThrows, @BeforeEach — bản JavaScript chạy được trong trình duyệt, kèm bản JUnit 5 tương đương trong lời giải.
 */
import { doiDau, KHOA, hai, giai, lc, preMa } from './_chung.mjs';
import { tinhDe, dotBienDe, TN_TEST } from './_de.mjs';

const J5 = ['@BeforeEach', '@AfterEach', '@BeforeAll', '@AfterAll', '@Disabled', 'assertThrows(...)', '@ParameterizedTest + @CsvSource', '@Tag', 'Assertions.assertEquals(expected, actual, message)'];
const E1 = tinhDe({
  tieuDe: 'JUnit practice 1 — Migrate a JUnit 4 test class to JUnit 5',
  doKho: 'EASY', phut: 6,
  moTa: { en: '<p>The course kit runs JUnit 4.13.2 (<code>junit-4.13.2.jar</code> + <code>hamcrest-core-1.3.jar</code>). Modern projects use JUnit 5 (Jupiter) with Maven. Give the JUnit 5 replacement of each JUnit 4 construct.</p>', vi: '<p>Bộ công cụ của môn chạy JUnit 4.13.2 (<code>junit-4.13.2.jar</code> + <code>hamcrest-core-1.3.jar</code>). Dự án hiện đại dùng JUnit 5 (Jupiter) với Maven. Cho bản thay thế JUnit 5 của từng cấu trúc JUnit 4.</p>' },
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('JUnit 4 → JUnit 5', 'JUnit 4 → JUnit 5'),
    cot: [{ ma: 'j4', ten: 'JUnit 4' }, { ma: 'j5', ten: 'JUnit 5', luaChon: J5 }],
    hang: ['@Before', '@After', '@BeforeClass (static, once per class)', '@AfterClass', '@Ignore', '@Test(expected = IllegalArgumentException.class)', '@RunWith(Parameterized.class) with a @Parameters method', '@Category(SlowTests.class)', 'Assert.assertEquals(message, expected, actual)'].map((j4, i) => ({ ma: `r${i}`, o: { j4 } })),
    dapAn: Object.fromEntries(J5.map((v, i) => [`r${i}.j5`, v])),
    giaiThich: giai('JUnit 5 renames the lifecycle annotations, replaces @Ignore with @Disabled, @Category with @Tag, the expected attribute with assertThrows (which also lets you check the message), the Parameterized runner with @ParameterizedTest, and moves the message to the LAST argument.', 'JUnit 5 đổi tên các annotation vòng đời, thay @Ignore bằng @Disabled, @Category bằng @Tag, thuộc tính expected bằng assertThrows (kiểm được cả message), runner Parameterized bằng @ParameterizedTest, và chuyển message xuống tham số CUỐI.'),
  }],
  goiY: ['Before/After → BeforeEach/AfterEach; BeforeClass/AfterClass → BeforeAll/AfterAll.', 'Message của assert ở JUnit 5 nằm cuối.'],
  loiHayGap: ['Giữ @Ignore trong JUnit 5 — engine Jupiter không xét nó, test vẫn chạy.', 'Để message ở đầu assertEquals của JUnit 5 — nó sẽ bị hiểu là giá trị mong đợi.'],
  giaiThich: '<p>Rows map in the order of the list.</p>',
  thuatNgu: [{ en: 'JUnit Jupiter', vi: 'engine/API của JUnit 5' }, { en: 'lifecycle annotation', vi: 'annotation vòng đời test' }],
  khaiNiem: ['JUnit 5'],
});

const E2 = tinhDe({
  tieuDe: 'JUnit practice 2 — What does “ant jacoco-report” run, in which order?',
  doKho: 'EASY', phut: 4,
  moTa: { en: `<p>The course’s <code>build.xml</code> declares these targets:</p>${preMa(`<target name="clean">
<target name="compile" depends="clean">
<target name="compile-tests" depends="compile">
<target name="test-with-jacoco" depends="compile-tests">
<target name="jacoco-report" depends="test-with-jacoco">`)}<p>Ant runs every dependency first. Put the targets executed by <code>ant jacoco-report</code> in order.</p>`, vi: `<p><code>build.xml</code> của môn khai báo các target như trên. Ant chạy mọi phụ thuộc trước. Sắp các target được chạy bởi <code>ant jacoco-report</code> theo thứ tự.</p>` },
  loai: 'order',
  cauHoi: [{ ma: 'o1', de: hai('Execution order', 'Thứ tự chạy'), muc: lc(['d', 'test-with-jacoco — run **/*Test with the JaCoCo agent (jacoco.exec)'], ['b', 'compile — javac src → build/classes'], ['e', 'jacoco-report — HTML/CSV/XML coverage report'], ['a', 'clean — delete build/ and report/'], ['c', 'compile-tests — javac test (JUnit on the classpath)']), dapAn: ['a', 'b', 'c', 'd', 'e'], giaiThich: giai('Follow the depends chain backwards from jacoco-report.', 'Lần ngược chuỗi depends từ jacoco-report.') }],
  goiY: ['Mỗi target chạy phụ thuộc của nó trước.', 'clean luôn chạy đầu tiên.'],
  loiHayGap: ['Cho rằng chỉ target được gọi mới chạy.', 'Đặt compile-tests trước compile.'],
  giaiThich: '<p>clean → compile → compile-tests → test-with-jacoco → jacoco-report.</p>',
  thuatNgu: [{ en: 'Ant target', vi: 'mục tiêu build của Ant' }, { en: 'JaCoCo agent', vi: 'tác tử đo coverage gắn vào JVM' }],
  khaiNiem: ['build tools'],
});

const E3 = tinhDe({
  tieuDe: 'JUnit practice 3 — Read a JUnit failure report',
  doKho: 'MEDIUM', phut: 6,
  moTa: { en: `<p>Running the course suite printed:</p>${preMa(`There was 1 failure:
1) refundIsHalfBetween2And24Hours(RefundCalculatorTest)
java.lang.AssertionError: expected:<50000> but was:<0>
    at org.junit.Assert.assertEquals(Assert.java:647)
    at RefundCalculatorTest.refundIsHalfBetween2And24Hours(RefundCalculatorTest.java:19)

FAILURES!!!
Tests run: 6,  Failures: 1`)}<p>Five questions about this report.</p>`, vi: `<p>Chạy bộ test của môn in ra như trên. Năm câu hỏi về báo cáo này.</p>` },
  loai: 'choice',
  cauHoi: [
    { ma: 'q1', de: hai('Which value did the code under test return?', 'Mã đang test trả về giá trị nào?'), luaChon: lc(['a', '50000'], ['b', '0'], ['c', '19'], ['d', '647']), dapAn: ['b'], giaiThich: giai('assertEquals(expected, actual): “but was” is the actual value.', 'assertEquals(expected, actual): “but was” là giá trị thực tế.') },
    { ma: 'q2', de: hai('Where is the failing assertion?', 'Assertion trượt nằm ở đâu?'), luaChon: lc(['a', 'Assert.java line 647'], ['b', 'RefundCalculatorTest.java line 19'], ['c', 'RefundCalculator.java line 19'], ['d', 'Unknown']), dapAn: ['b'], giaiThich: giai('The first frame in YOUR code; Assert.java is the library.', 'Khung đầu tiên trong mã CỦA BẠN; Assert.java là thư viện.') },
    { ma: 'q3', de: hai('How many tests passed?', 'Bao nhiêu test đạt?'), luaChon: lc(['a', '6'], ['b', '5'], ['c', '1'], ['d', '0']), dapAn: ['b'], giaiThich: giai('6 run, 1 failure, 0 errors.', '6 chạy, 1 failure, 0 error.') },
    { ma: 'q4', de: hai('A failure differs from an error in JUnit 4 because…', 'Failure khác error trong JUnit 4 vì…'), luaChon: lc(['a', 'they are the same'], ['b', 'a failure is an assertion that did not hold; an error is an unexpected exception thrown by the test or the code'], ['c', 'errors are warnings'], ['d', 'failures are compile errors']), dapAn: ['b'], giaiThich: giai('Both make the build red; the cause differs.', 'Cả hai làm build đỏ; nguyên nhân khác nhau.') },
    { ma: 'q5', de: hai('What should the tester do first?', 'Tester nên làm gì trước?'), luaChon: lc(['a', 'Change the expected value to 0'], ['b', 'Check the expected value against the specification (2–24 h → 50%), then report the defect with this evidence'], ['c', 'Delete the test'], ['d', 'Mark it @Ignore']), dapAn: ['b'], giaiThich: giai('Expected results come from the specification, never from the code.', 'Kết quả mong đợi lấy từ đặc tả, không bao giờ từ mã.') },
  ],
  goiY: ['“expected:<A> but was:<B>” — B là thực tế.', 'Tìm dòng đầu tiên thuộc lớp test của bạn trong stack trace.'],
  loiHayGap: ['Đọc nhầm dòng của Assert.java.', 'Sửa giá trị mong đợi cho test “xanh”.'],
  giaiThich: '<p>Answers: b · b · b · b · b.</p>',
  thuatNgu: [{ en: 'stack trace', vi: 'vết ngăn xếp lời gọi' }, { en: 'failure vs error', vi: 'assertion trượt vs ngoại lệ ngoài dự kiến' }],
  khaiNiem: ['JUnit'],
});

/* E4 — RefundCalculator (bản JS) — test.each ≈ @ParameterizedTest, toThrow ≈ assertThrows */
const DUNG4 = `function refund(price, hoursBefore) {
  if (!Number.isInteger(price) || price < 0) throw new RangeError('INVALID_PRICE');
  if (typeof hoursBefore !== 'number' || hoursBefore < 0) throw new RangeError('ALREADY_STARTED');
  if (hoursBefore >= 24) return price;
  if (hoursBefore >= 2) return Math.floor(price / 2);
  return 0;
}`;
const doi4 = (a, b) => { if (!DUNG4.includes(a)) throw new Error('mutant: ' + a); return DUNG4.replace(a, b); };
const E4 = dotBienDe({
  tieuDe: 'JUnit practice 4 — Parameterised boundary tests for refund (kill the mutants)',
  doKho: 'MEDIUM', phut: 18,
  moTa: { en: `<p>LabBook refunds a cancelled booking: ≥ 24 hours before the start → 100%; 2 to under 24 hours → 50% (rounded down); under 2 hours → 0. The price must be a non-negative integer and hoursBefore must not be negative, otherwise a <code>RangeError</code> (<code>INVALID_PRICE</code> / <code>ALREADY_STARTED</code>).</p>${preMa(DUNG4)}<p>Write the tests in <code>tests.js</code> with <code>test.each</code> (the JavaScript twin of <code>@ParameterizedTest @CsvSource</code>) and <code>expect(...).toThrow(RangeError)</code> (twin of <code>assertThrows</code>). The solution also shows the JUnit 5 version.</p>`, vi: `<p>LabBook hoàn tiền khi huỷ: ≥ 24 giờ trước → 100%; từ 2 tới dưới 24 giờ → 50% (làm tròn xuống); dưới 2 giờ → 0. Giá phải là số nguyên không âm và hoursBefore không âm, nếu không ném <code>RangeError</code>. Viết test trong <code>tests.js</code> bằng <code>test.each</code> (bản JS của <code>@ParameterizedTest @CsvSource</code>) và <code>toThrow(RangeError)</code> (bản JS của <code>assertThrows</code>). Lời giải có kèm bản JUnit 5.</p>` },
  yeuCau: [{ en: 'Cover both boundaries (24 and 2) from both sides, the rounding and both exceptions.', vi: 'Phủ cả hai biên (24 và 2) từ hai phía, phép làm tròn và cả hai ngoại lệ.' }],
  viDu: [{ input: 'refund(50001, 2)', output: '25000', explanation: 'Exactly 2 hours is still 50%, rounded down.|||Đúng 2 giờ vẫn được 50%, làm tròn xuống.' }],
  goiY: ['Biên 24: 24 → 100%, 23.99 → 50%. Biên 2: 2 → 50%, 1.99 → 0.', 'Giá lẻ để bắt làm tròn: 50001 → 25000.', 'Ngoại lệ: giá âm, giá 10.5, hoursBefore −1.'],
  loiHayGap: ['Chỉ test giá trị giữa khoảng (48 giờ, 10 giờ, 1 giờ) — mutant lệch biên sống sót.', 'Dùng giá chẵn nên không thấy lỗi làm tròn.'],
  giaiThich: `<p>Boundary rows kill the off-by-one mutants; the odd price kills the rounding mutant; the two toThrow tests kill the validation mutants. JUnit 5:</p>${preMa(`@ParameterizedTest
@CsvSource({"100000,24,100000", "100000,23.99,50000", "100000,2,50000", "100000,1.99,0", "50001,2,25000"})
void refundByHours(int price, double hours, int expected) {
    assertEquals(expected, calc.refund(price, hours));
}

@Test
void negativePriceIsRejected() {
    IllegalArgumentException e = assertThrows(IllegalArgumentException.class, () -> calc.refund(-1, 30));
    assertEquals("INVALID_PRICE", e.getMessage());
}`)}`,
  thuatNgu: [...TN_TEST(), { en: '@ParameterizedTest', vi: 'test tham số hoá của JUnit 5' }, { en: 'assertThrows', vi: 'khẳng định có ném ngoại lệ' }],
  ten: ['refund'], dung: DUNG4, minTest: 8,
  dotBien: [
    { ma: 'M1', moTa: { en: 'exactly 24 hours gives only 50%', vi: 'đúng 24 giờ chỉ được 50%' }, code: doi4('hoursBefore >= 24', 'hoursBefore > 24') },
    { ma: 'M2', moTa: { en: 'exactly 2 hours gives 0', vi: 'đúng 2 giờ được 0' }, code: doi4('hoursBefore >= 2', 'hoursBefore > 2') },
    { ma: 'M3', moTa: { en: 'half is rounded up', vi: 'nửa giá làm tròn lên' }, code: doi4('Math.floor(price / 2)', 'Math.ceil(price / 2)') },
    { ma: 'M4', moTa: { en: 'a negative price is accepted', vi: 'nhận giá âm' }, code: doi4('|| price < 0', '') },
    { ma: 'M5', moTa: { en: 'a negative hoursBefore returns 0 instead of throwing', vi: 'hoursBefore âm trả 0 thay vì ném lỗi' }, code: doi4("if (typeof hoursBefore !== 'number' || hoursBefore < 0) throw new RangeError('ALREADY_STARTED');\n", '') },
    { ma: 'M6', an: true, moTa: { en: 'a non-integer price is accepted', vi: 'nhận giá không nguyên' }, code: doi4('!Number.isInteger(price) || ', 'typeof price !== \'number\' || ') },
    { ma: 'M7', an: true, moTa: { en: 'the 50% band starts at 1 hour', vi: 'mức 50% bắt đầu từ 1 giờ' }, code: doi4('hoursBefore >= 2', 'hoursBefore >= 1') },
  ],
  dauTest: "// RefundCalculator — parameterised boundary tests (JUnit 5: @ParameterizedTest @CsvSource).\ntest.each([\n  [100000, 48, 100000],\n])('refund(%p, %p) = %p', (price, hours, expected) => {\n  expect(refund(price, hours)).toBe(expected);\n});\n",
  giaiTest: `// RefundCalculator — parameterised boundary tests (JUnit 5: @ParameterizedTest @CsvSource).
test.each([
  [100000, 48, 100000],
  [100000, 24, 100000],     // boundary: exactly 24 h → 100 %
  [100000, 23.99, 50000],   // just below 24 h → 50 %
  [100000, 2, 50000],       // boundary: exactly 2 h → 50 %
  [100000, 1.99, 0],        // just below 2 h → 0
  [100000, 1, 0],
  [50001, 2, 25000],        // odd price: 50 % is rounded DOWN
  [0, 30, 0],               // a free lab
])('refund(%p, %p) = %p', (price, hours, expected) => {
  expect(refund(price, hours)).toBe(expected);
});

// JUnit 5: assertThrows(IllegalArgumentException.class, () -> calc.refund(-1, 30));
test.each([[-1, 30], [10.5, 30]])('price %p is rejected', (price, hours) => {
  expect(() => refund(price, hours)).toThrow(RangeError);
});

test('a booking that already started cannot be refunded', () => {
  expect(() => refund(100000, -1)).toThrow(RangeError);
});
`,
});

/* E5 — WaitList: @BeforeEach ≈ beforeEach */
const DUNG5 = `class WaitList {
  constructor() { this.items = []; }
  add(id) {
    if (this.items.includes(id)) throw new Error('DUPLICATE');
    this.items.push(id);
    return this.items.length;
  }
  promote() {
    return this.items.length ? this.items.shift() : null;
  }
  position(id) {
    const i = this.items.indexOf(id);
    return i < 0 ? -1 : i + 1;
  }
  remove(id) {
    const i = this.items.indexOf(id);
    if (i < 0) return false;
    this.items.splice(i, 1);
    return true;
  }
  get size() { return this.items.length; }
}`;
const doi5 = (a, b) => { if (!DUNG5.includes(a)) throw new Error('mutant: ' + a); return DUNG5.replace(a, b); };
const E5 = dotBienDe({
  tieuDe: 'JUnit practice 5 — A fresh fixture per test: unit-test the WaitList',
  doKho: 'MEDIUM', phut: 16,
  moTa: { en: `<p>LabBook keeps the waiting list of a full lab in a <code>WaitList</code>: <code>add(id)</code> appends a student and returns the new size (a student already waiting → <code>Error('DUPLICATE')</code>); <code>promote()</code> removes and returns the <b>first</b> student (FIFO), or <code>null</code> when empty; <code>position(id)</code> is 1-based, −1 if absent; <code>remove(id)</code> returns true/false; <code>size</code> is the number waiting.</p>${preMa(DUNG5)}<p>Use <code>beforeEach</code> (JUnit 5: <code>@BeforeEach</code>) to create a fresh list with three students before every test, so the tests stay independent.</p>`, vi: `<p>LabBook giữ danh sách chờ của phòng đầy trong <code>WaitList</code> với các hàm như mô tả và mã ở trên (FIFO, vị trí tính từ 1, trùng thì ném DUPLICATE, rỗng thì promote trả null). Dùng <code>beforeEach</code> (JUnit 5: <code>@BeforeEach</code>) tạo danh sách mới có ba sinh viên trước mỗi test để các test độc lập.</p>` },
  yeuCau: [{ en: 'Each test must work alone — never rely on the order in which tests run.', vi: 'Mỗi test phải tự chạy được — không dựa vào thứ tự chạy test.' }],
  viDu: [{ input: "w.add('s1'); w.add('s2'); w.promote()", output: "'s1'", explanation: 'First come, first served.|||Ai đến trước được trước.' }],
  goiY: ['beforeEach: w = new WaitList(); w.add("s1"); w.add("s2"); w.add("s3");', 'Kiểm promote lần lượt trả s1 rồi s2; position sau khi remove phải dịch lên.', 'Rỗng: promote() === null, không ném lỗi.'],
  loiHayGap: ['Dùng chung một danh sách cho mọi test — test sau phụ thuộc test trước.', 'Chỉ kiểm size mà không kiểm AI được nâng.'],
  giaiThich: '<p>A fresh fixture per test (beforeEach / @BeforeEach) keeps tests independent; FIFO, 1-based positions, duplicates and the empty case each kill one mutant.</p>',
  thuatNgu: [...TN_TEST(), { en: 'fixture', vi: 'trạng thái dựng sẵn cho test' }, { en: 'FIFO', vi: 'vào trước ra trước' }],
  ten: ['WaitList'], dung: DUNG5, minTest: 7,
  dotBien: [
    { ma: 'M1', moTa: { en: 'promote takes the LAST student (LIFO)', vi: 'promote lấy người CUỐI (LIFO)' }, code: doi5('this.items.shift()', 'this.items.pop()') },
    { ma: 'M2', moTa: { en: 'duplicates are accepted', vi: 'nhận trùng' }, code: doi5("    if (this.items.includes(id)) throw new Error('DUPLICATE');\n", '') },
    { ma: 'M3', moTa: { en: 'position is 0-based', vi: 'vị trí tính từ 0' }, code: doi5('i < 0 ? -1 : i + 1', 'i < 0 ? -1 : i') },
    { ma: 'M4', moTa: { en: 'promote on an empty list throws', vi: 'promote khi rỗng ném lỗi' }, code: doi5("return this.items.length ? this.items.shift() : null;", "if (!this.items.length) throw new Error('EMPTY');\n    return this.items.shift();") },
    { ma: 'M5', moTa: { en: 'remove never removes but answers true', vi: 'remove không xoá nhưng trả true' }, code: doi5('    this.items.splice(i, 1);\n', '') },
    { ma: 'M6', an: true, moTa: { en: 'add returns the old size', vi: 'add trả kích thước cũ' }, code: doi5('this.items.push(id);\n    return this.items.length;', 'const n = this.items.length;\n    this.items.push(id);\n    return n;') },
    { ma: 'M7', an: true, moTa: { en: 'remove of an absent student answers true', vi: 'remove người không có trả true' }, code: doi5('if (i < 0) return false;', 'if (i < 0) return true;') },
  ],
  dauTest: "// WaitList tests — JUnit 5: @BeforeEach creates the fixture.\nlet w;\nbeforeEach(() => {\n  w = new WaitList();\n  w.add('s1');\n  w.add('s2');\n  w.add('s3');\n});\n\ntest('three students are waiting', () => {\n  expect(w.size).toBe(3);\n});\n",
  giaiTest: `// WaitList tests — JUnit 5: @BeforeEach creates a fresh fixture for every test.
let w;
beforeEach(() => {
  w = new WaitList();
  w.add('s1');
  w.add('s2');
  w.add('s3');
});

test('three students are waiting', () => {
  expect(w.size).toBe(3);
});

test('add returns the new size', () => {
  expect(w.add('s4')).toBe(4);
});

test('promote is first come, first served', () => {
  expect(w.promote()).toBe('s1');
  expect(w.promote()).toBe('s2');
  expect(w.size).toBe(1);
});

test('a student cannot wait twice', () => {
  expect(() => w.add('s2')).toThrow('DUPLICATE');
  expect(w.size).toBe(3);
});

test('positions are 1-based; absent is -1', () => {
  expect(w.position('s1')).toBe(1);
  expect(w.position('s3')).toBe(3);
  expect(w.position('nobody')).toBe(-1);
});

test('remove takes the student out and the others move up', () => {
  expect(w.remove('s2')).toBe(true);
  expect(w.position('s3')).toBe(2);
  expect(w.size).toBe(2);
  expect(w.remove('s2')).toBe(false);
});

test('promote on an empty list returns null', () => {
  const empty = new WaitList();
  expect(empty.promote()).toBeNull();
});
`,
});

export default doiDau({
  slug: 'swt301-junit-hands-on',
  ten: '8.5 Hands-on: JUnit 4 kit → JUnit 5',
  moTaModule: 'Chuyển JUnit 4 sang JUnit 5, thứ tự target của build.xml (Ant + JaCoCo), đọc báo cáo failure, viết test tham số hoá biên + assertThrows cho refund và test có fixture @BeforeEach cho WaitList (chấm bằng mutant, kèm bản JUnit 5).',
  khoa: KHOA,
  baiHoc: 'swt301-junit-hands-on',
  de: [E1, E2, E3, E4, E5],
});
