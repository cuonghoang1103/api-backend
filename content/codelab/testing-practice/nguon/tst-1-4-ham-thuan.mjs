/**
 * Testing · 1.4 — Hàm thuần + trường hợp biên (EP/BVA thành it.each). Loại `mutation`: người học viết
 * src/rules/limits.test.js; máy chấm chạy nó với booking.js ĐÚNG rồi với 5 đột biến của đề tst-cl-1-4.
 * Ngưỡng đạt 4/5 (`nguong`) — đề minh hoạ ngưỡng k/n; lời giải mẫu vẫn diệt 5/5.
 */
import { deTuKhoa, KHOA, TN } from './_chung.mjs';

const KHOI_DAU = `import { describe, it, expect } from 'vitest';
import { isWithinBookingWindow, checkSlot, needsApproval } from './booking.js';

// Eight green tests — every value sits comfortably in the MIDDLE of its partition,
// so none of them notices a rule that is off by one.
// Tám test xanh — giá trị nào cũng nằm GIỮA vùng của nó, nên không test nào thấy luật lệch một đơn vị.

describe('isWithinBookingWindow (BR-05: 0..14 days ahead)', () => {
  it.each([
    [7, true],
    [20, false],
    [-3, false],
  ])('%i days ahead → %s', (days, expected) => {
    expect(isWithinBookingWindow(days)).toBe(expected);
  });
});

describe('checkSlot length (Lite-1: at most 240 minutes)', () => {
  it('08:00–10:00 is a valid 2-hour slot', () => {
    expect(checkSlot('08:00', '10:00')).toEqual({ ok: true, minutes: 120 });
  });

  it('08:00–14:00 is too long', () => {
    expect(checkSlot('08:00', '14:00')).toEqual({ ok: false, code: 'TOO_LONG' });
  });
});

describe('needsApproval (BR-06)', () => {
  it.each([
    { role: 'STUDENT', seats: 10, expected: false },
    { role: 'STUDENT', seats: 50, expected: true },
    { role: 'LECTURER', seats: 50, expected: false },
  ])('$role with $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });
});
`;

const LOI_GIAI = `import { describe, it, expect } from 'vitest';
import { isWithinBookingWindow, checkSlot, needsApproval } from './booking.js';

describe('isWithinBookingWindow (BR-05: 0..14 days ahead)', () => {
  // boundary value analysis: each edge, and one step either side
  it.each([
    [-1, false],   // lower boundary - 1
    [0, true],     // lower boundary: booking for today      (kills ">= 0" → "> 0")
    [1, true],
    [13, true],
    [14, true],    // upper boundary: exactly 14 is allowed  (kills "<=" → "<")
    [15, false],   // upper boundary + 1
  ])('%i days ahead → %s', (days, expected) => {
    expect(isWithinBookingWindow(days)).toBe(expected);
  });

  // the INVALID partition: not an integer number of days (kills the dropped Number.isInteger)
  it.each([2.5, NaN, '3', null])('rejects a non-integer input: %s', (value) => {
    expect(isWithinBookingWindow(value)).toBe(false);
  });
});

describe('checkSlot length (Lite-1: at most 240 minutes)', () => {
  it.each([
    { start: '08:00', end: '08:30', expected: { ok: true, minutes: 30 } },        // shortest valid slot
    { start: '08:00', end: '12:00', expected: { ok: true, minutes: 240 } },       // exactly 4 h (kills ">" → ">=")
    { start: '08:00', end: '12:30', expected: { ok: false, code: 'TOO_LONG' } },  // one grid step over
  ])('$start–$end', ({ start, end, expected }) => {
    expect(checkSlot(start, end)).toEqual(expected);
  });
});

describe('needsApproval — decision table + invalid seats', () => {
  it.each([
    { role: 'STUDENT', seats: 30, expected: false },
    { role: 'STUDENT', seats: 31, expected: true },
    { role: 'LECTURER', seats: 31, expected: false },
    { role: 'ADMIN', seats: 31, expected: false },
  ])('$role with $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });

  // 2.5 seats must be refused, not rounded or accepted (kills the dropped !Number.isInteger(seats))
  it.each([0, -5, 2.5])('throws RangeError for seats = %s', (seats) => {
    expect(() => needsApproval({ role: 'STUDENT', seats })).toThrow(RangeError);
  });
});
`;

export default {
  slug: 'tst-1-4-ham-thuan',
  ten: '1.4 Pure functions & edge cases — booking window and limits',
  khoa: KHOA,
  baiHoc: 'tst-1-4-ham-thuan',
  de: [
    deTuKhoa('tst-cl-1-4', {
      doKho: 'HARD', phut: 25,
      khaiNiem: ['equivalence partitioning', 'boundary value analysis', 'it.each', 'mutation testing'],
      tienQuyet: ['tst-1-2-matcher', 'tst-1-3-ten-test'],
      the: ['vitest', 'it.each', 'boundary', 'mutation', 'labflow-lite'],
      toiThieuTest: 8,
      nguong: 4,
      moTa: {
        en: `<p>Three pure functions from <code>src/rules/booking.js</code>, each with a numeric limit:</p>
<ul><li><code>isWithinBookingWindow(daysAhead)</code> — <b>BR-05</b>: an integer from <b>0</b> (today) to <b>14</b> days ahead, both ends included; anything else (negative, more than 14, not an integer) is <code>false</code>.</li>
<li><code>checkSlot(start, end)</code> — <b>Lite-1</b>: a slot lasts <b>at most 240 minutes</b> (exactly 4 hours is fine); longer ⇒ <code>{ ok: false, code: 'TOO_LONG' }</code>.</li>
<li><code>needsApproval({ seats, role })</code> — <code>seats</code> must be a positive <b>integer</b>, otherwise <code>RangeError</code>.</li></ul>
<p>The starter <code>src/rules/limits.test.js</code> has eight green tests that pick values from the <i>middle</i> of each partition, so it kills none of the 5 off-by-one / missing-check mutants. Turn the rules into <b>it.each</b> tables of boundary values (each edge and one step either side) plus the invalid partition. Pass mark: kill at least <b>4 of 5</b>; the model answer kills all 5.</p>`,
        vi: `<p>Ba hàm thuần trong <code>src/rules/booking.js</code>, mỗi hàm có một giới hạn số:</p>
<ul><li><code>isWithinBookingWindow(daysAhead)</code> — <b>BR-05</b>: số nguyên từ <b>0</b> (hôm nay) tới <b>14</b> ngày tới, tính cả hai đầu; còn lại (âm, quá 14, không nguyên) là <code>false</code>.</li>
<li><code>checkSlot(start, end)</code> — <b>Lite-1</b>: một khung dài <b>tối đa 240 phút</b> (đúng 4 giờ vẫn được); dài hơn ⇒ <code>{ ok: false, code: 'TOO_LONG' }</code>.</li>
<li><code>needsApproval({ seats, role })</code> — <code>seats</code> phải là <b>số nguyên</b> dương, không thì <code>RangeError</code>.</li></ul>
<p>Tệp khởi đầu <code>src/rules/limits.test.js</code> có tám test xanh, giá trị nào cũng lấy ở <i>giữa</i> vùng, nên không diệt được đột biến nào trong 5 con lệch-một-đơn-vị / thiếu-kiểm-tra. Biến các luật thành bảng <b>it.each</b> giá trị biên (từng mép và một bước hai bên) cộng vùng không hợp lệ. Đạt: diệt ít nhất <b>4/5</b>; lời giải mẫu diệt cả 5.</p>`,
      },
      yeuCau: {
        en: [
          'At least <b>8</b> tests (each <code>it.each</code> row counts as one), all green on the correct code.',
          'Use <code>it.each</code> tables for boundary values: the edge itself and one step on each side.',
          'Cover the invalid partition (non-integer days and seats).',
          'Kill at least <b>4 of the 5</b> mutants (aim for 5).',
        ],
        vi: [
          'Ít nhất <b>8</b> test (mỗi hàng <code>it.each</code> tính là một), đều xanh với code đúng.',
          'Dùng bảng <code>it.each</code> cho giá trị biên: chính mép và một bước mỗi bên.',
          'Phủ vùng không hợp lệ (số ngày và số chỗ không nguyên).',
          'Diệt ít nhất <b>4 trên 5</b> đột biến (nhắm 5).',
        ],
      },
      dauVao: { en: 'Your test file src/rules/limits.test.js (Vitest syntax).', vi: 'Tệp test src/rules/limits.test.js của bạn (cú pháp Vitest).' },
      dauRa: { en: 'Green on the correct code; red on at least 4 of the 5 mutants.', vi: 'Xanh với code đúng; đỏ với ít nhất 4 trong 5 đột biến.' },
      rangBuoc: [{ en: 'Imports: only "vitest" and ./booking.js. No fast-check here — tables of values only.', vi: 'Import: chỉ "vitest" và ./booking.js. Không có fast-check ở đây — chỉ bảng giá trị.' }],
      viDu: [{
        input: { en: 'Mutant: daysAhead < MAX_DAYS_AHEAD   (instead of <=)', vi: 'Đột biến: daysAhead < MAX_DAYS_AHEAD   (thay cho <=)' },
        output: { en: 'Survives [7, true] and [20, false] · killed by the row [14, true]', vi: 'Sống qua [7, true] và [20, false] · bị diệt bởi hàng [14, true]' },
        explanation: { en: 'Only the value ON the edge behaves differently under < and <=. That is why BVA tests the edge, not the middle.', vi: 'Chỉ giá trị NẰM TRÊN mép mới cư xử khác nhau giữa < và <=. Đó là lý do BVA test mép chứ không test giữa.' },
      }],
      goiY: [
        { en: 'For every limit write the triple: edge − 1, edge, edge + 1 (days: −1/0/1 and 13/14/15).', vi: 'Với mỗi giới hạn viết bộ ba: mép − 1, mép, mép + 1 (ngày: −1/0/1 và 13/14/15).' },
        { en: "Length limit: '08:00'–'12:00' is exactly 240 minutes and must be ok; '08:00'–'12:30' is the next grid step and must be TOO_LONG.", vi: "Giới hạn độ dài: '08:00'–'12:00' đúng 240 phút phải ok; '08:00'–'12:30' là bước lưới kế tiếp phải TOO_LONG." },
        { en: 'Invalid partition: 2.5 days must be false; 2.5 seats must throw RangeError.', vi: 'Vùng không hợp lệ: 2,5 ngày phải false; 2,5 chỗ phải ném RangeError.' },
      ],
      loiHayGap: [
        { en: 'Testing the middle of each range (7 days, 2 hours): it proves the function works "in general" and misses every off-by-one bug.', vi: 'Test giữa mỗi khoảng (7 ngày, 2 giờ): chứng minh hàm chạy "nói chung" và bỏ lọt mọi lỗi lệch một đơn vị.' },
        { en: 'Forgetting the invalid partition: integers only is part of the rule, so 2.5 needs its own row.', vi: 'Quên vùng không hợp lệ: "chỉ số nguyên" cũng là một phần của luật, nên 2,5 cần một hàng riêng.' },
        { en: "Using %s / %i in an it.each title with OBJECT rows — use $name for objects ('$role with $seats seats').", vi: "Dùng %s / %i trong tên it.each khi hàng là OBJECT — với object dùng $tên ('$role with $seats seats')." },
      ],
      giaiThich: {
        en: '<p>Off-by-one mutants (<code>&lt;=</code>→<code>&lt;</code>, <code>&gt;=</code>→<code>&gt;</code>, <code>&gt;</code>→<code>&gt;=</code>) only change the answer for the value exactly on the edge, so only a test on the edge can kill them — the classic argument for boundary value analysis. The two "dropped check" mutants (<code>Number.isInteger</code>) only change the answer for the invalid partition (2.5), so equivalence partitioning must include it. The tables keep each case to one line, and every row is reported as its own test.</p>',
        vi: '<p>Đột biến lệch một đơn vị (<code>&lt;=</code>→<code>&lt;</code>, <code>&gt;=</code>→<code>&gt;</code>, <code>&gt;</code>→<code>&gt;=</code>) chỉ đổi kết quả ở đúng giá trị trên mép, nên chỉ test trên mép mới diệt được — đúng lập luận của phân tích giá trị biên. Hai đột biến "bỏ kiểm tra" (<code>Number.isInteger</code>) chỉ đổi kết quả ở vùng không hợp lệ (2,5), nên phân vùng tương đương phải có vùng đó. Bảng giữ mỗi trường hợp gọn một dòng, và mỗi hàng được báo như một test riêng.</p>',
      },
      thuatNgu: [TN.partition, TN.boundary, TN.mutant, TN.killed],
      khoiDau: { 'src/rules/limits.test.js': KHOI_DAU },
      loiGiai: { 'src/rules/limits.test.js': LOI_GIAI },
      goiYDotBien: {
        '14 days ahead rejected': 'add the row [14, true] — the upper edge itself is allowed · thêm hàng [14, true] — chính mép trên vẫn hợp lệ',
        'booking for today rejected': 'add the row [0, true] — booking for today is allowed · thêm hàng [0, true] — đặt cho hôm nay hợp lệ',
        '2.5 days accepted': 'the invalid partition: isWithinBookingWindow(2.5) must be false · vùng không hợp lệ: isWithinBookingWindow(2.5) phải là false',
        'exactly 4 hours rejected': "test exactly 240 minutes: checkSlot('08:00', '12:00') must be ok · test đúng 240 phút: checkSlot('08:00', '12:00') phải ok",
        '2.5 seats accepted': 'needsApproval with 2.5 seats must throw RangeError · needsApproval với 2,5 chỗ phải ném RangeError',
      },
    }),
  ],
};
