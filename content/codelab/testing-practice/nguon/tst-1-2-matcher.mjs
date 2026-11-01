/**
 * Testing · 1.2 — Matcher nói đúng điều bạn muốn. Loại `mutation`: người học viết src/rules/time.test.js;
 * máy chấm chạy nó với time.js + booking.js ĐÚNG rồi với 6 đột biến của đề tst-cl-1-2 (_de-codelab-mutation.json).
 * Bộ khởi đầu dùng matcher LỎNG (toThrow() trần, toBeTruthy, toBeDefined) ⇒ xanh mà không diệt được gì.
 */
import { deTuKhoa, KHOA, TN } from './_chung.mjs';

const KHOI_DAU = `import { describe, it, expect } from 'vitest';
import { parseTime, formatTime } from './time.js';
import { usageRate } from './booking.js';

// Five green tests that kill NOTHING: every matcher here is too loose.
// Năm test xanh mà không diệt được đột biến nào: matcher nào cũng quá lỏng.

describe('parseTime', () => {
  it('reads 07:30', () => {
    expect(parseTime('07:30')).toBe(450);
  });

  it('reads 23:59', () => {
    expect(parseTime('23:59')).toBeDefined();
  });

  it('rejects a bad format', () => {
    expect(() => parseTime('7h')).toThrow();
  });
});

describe('formatTime', () => {
  it('formats 600 minutes', () => {
    expect(formatTime(600)).toBeTruthy();
  });
});

describe('usageRate', () => {
  it('a full day is 100%', () => {
    expect(usageRate([{ minutes: 840 }])).toBeCloseTo(1);
  });
});
`;

const LOI_GIAI = `import { describe, it, expect } from 'vitest';
import { parseTime, formatTime } from './time.js';
import { usageRate } from './booking.js';

describe('parseTime', () => {
  it.each([
    ['00:00', 0],
    ['07:30', 450],
    ['23:59', 1439],   // the last valid minute
  ])('reads %s as %i minutes', (text, minutes) => {
    expect(parseTime(text)).toBe(minutes);
  });

  // out of range ⇒ RangeError, one test per field (kills h > 24 and min > 60)
  it('rejects hour 24 with a RangeError', () => {
    expect(() => parseTime('24:00')).toThrow(RangeError);
  });

  it('rejects minute 60 with a RangeError', () => {
    expect(() => parseTime('07:60')).toThrow(RangeError);
  });

  // bad FORMAT is a different error class than bad RANGE — name it (kills TypeError → RangeError)
  it('rejects a bad format with a TypeError that explains the expected format', () => {
    expect(() => parseTime('7h')).toThrow(TypeError);
    expect(() => parseTime('7h')).toThrow(/expected HH:MM/);
  });
});

describe('formatTime', () => {
  // exact strings, not toBeTruthy: 450 = 7.5 h catches Math.round, "07" catches the missing padStart
  it('formats 450 minutes as "07:30"', () => {
    expect(formatTime(450)).toBe('07:30');
  });

  it('formats midnight as "00:00"', () => {
    expect(formatTime(0)).toBe('00:00');
  });
});

describe('usageRate', () => {
  it('is 0 with no bookings', () => {
    expect(usageRate([])).toBe(0);
  });

  // TWO bookings, so "only the last one counts" gives a different answer; floats ⇒ toBeCloseTo with 4 digits
  it('adds 120 + 30 minutes up to about 17.86% of the day', () => {
    expect(usageRate([{ minutes: 120 }, { minutes: 30 }])).toBeCloseTo(0.1786, 4);
  });
});
`;

export default {
  slug: 'tst-1-2-matcher',
  ten: '1.2 Matchers that say what you mean — time & usage rate',
  khoa: KHOA,
  baiHoc: 'tst-1-2-matcher',
  de: [
    deTuKhoa('tst-cl-1-2', {
      doKho: 'MEDIUM', phut: 20,
      khaiNiem: ['toBe vs toEqual', 'toThrow(ErrorClass)', 'toBeCloseTo', 'mutation testing'],
      tienQuyet: ['tst-1-1-cau-truc'],
      the: ['vitest', 'matchers', 'mutation', 'labflow-lite'],
      toiThieuTest: 5,
      moTa: {
        en: `<p>Two small modules of LabFlow Lite. In <code>src/rules/time.js</code>: <code>parseTime('HH:MM')</code> returns minutes since midnight, throws a <b><code>TypeError</code></b> when the text is not in <code>HH:MM</code> format (message ends with <code>expected HH:MM</code>) and a <b><code>RangeError</code></b> when the hour is above 23 or the minute above 59; <code>formatTime(minutes)</code> turns minutes back into a zero-padded <code>"HH:MM"</code>. In <code>src/rules/booking.js</code>: <code>usageRate(bookings)</code> adds up <code>b.minutes / 840</code> (the 14 opening hours) for every booking.</p>
<p>The starter file <code>src/rules/time.test.js</code> has five tests that are all green — and kill <b>none</b> of the 6 mutants, because their matchers are too loose: <code>toThrow()</code> accepts any error, <code>toBeTruthy()</code> accepts any non-empty string, <code>toBeDefined()</code> accepts any number. Rewrite and extend it until every mutant dies.</p>`,
        vi: `<p>Hai module nhỏ của LabFlow Lite. Trong <code>src/rules/time.js</code>: <code>parseTime('HH:MM')</code> trả số phút tính từ nửa đêm, ném <b><code>TypeError</code></b> khi chuỗi sai dạng <code>HH:MM</code> (thông báo kết thúc bằng <code>expected HH:MM</code>) và <b><code>RangeError</code></b> khi giờ lớn hơn 23 hoặc phút lớn hơn 59; <code>formatTime(minutes)</code> đổi số phút về <code>"HH:MM"</code> có số 0 đứng đầu. Trong <code>src/rules/booking.js</code>: <code>usageRate(bookings)</code> cộng <code>b.minutes / 840</code> (14 giờ mở cửa) của từng lượt đặt.</p>
<p>Tệp khởi đầu <code>src/rules/time.test.js</code> có năm test đều xanh — mà <b>không diệt</b> được đột biến nào trong 6 con, vì matcher quá lỏng: <code>toThrow()</code> chấp nhận mọi lỗi, <code>toBeTruthy()</code> chấp nhận mọi chuỗi khác rỗng, <code>toBeDefined()</code> chấp nhận mọi số. Viết lại và bổ sung tới khi mọi đột biến chết.</p>`,
      },
      yeuCau: {
        en: [
          'At least <b>5</b> tests, all green on the correct code, each with at least one <code>expect</code>.',
          'Use the matcher that says exactly what you mean: <code>toBe</code> for exact strings/numbers, <code>toThrow(ErrorClass)</code> / <code>toThrow(/message/)</code> for errors, <code>toBeCloseTo(value, digits)</code> for fractions.',
          'Kill <b>all 6</b> mutants.',
        ],
        vi: [
          'Ít nhất <b>5</b> test, đều xanh với code đúng, mỗi test có ít nhất một <code>expect</code>.',
          'Dùng matcher nói đúng ý: <code>toBe</code> cho chuỗi/số chính xác, <code>toThrow(LớpLỗi)</code> / <code>toThrow(/thông báo/)</code> cho lỗi, <code>toBeCloseTo(giá trị, số chữ số)</code> cho số thực.',
          'Diệt <b>cả 6</b> đột biến.',
        ],
      },
      dauVao: { en: 'Your test file src/rules/time.test.js (Vitest syntax).', vi: 'Tệp test src/rules/time.test.js của bạn (cú pháp Vitest).' },
      dauRa: { en: 'Green on the correct code; red on each of the 6 mutants.', vi: 'Xanh với code đúng; đỏ với từng đột biến trong 6 đột biến.' },
      rangBuoc: [{ en: 'Imports: only "vitest", ./time.js and ./booking.js.', vi: 'Import: chỉ "vitest", ./time.js và ./booking.js.' }],
      viDu: [{
        input: { en: "Mutant: throw new RangeError('Invalid time …')  (bad format now throws the wrong class)", vi: "Đột biến: throw new RangeError('Invalid time …')  (sai dạng nay ném nhầm lớp lỗi)" },
        output: { en: "Survives expect(() => parseTime('7h')).toThrow() · killed by .toThrow(TypeError)", vi: "Sống qua expect(() => parseTime('7h')).toThrow() · bị diệt bởi .toThrow(TypeError)" },
        explanation: { en: 'A bare toThrow() only asks "did something throw?" — both versions throw. Naming the class asks the question the code answers.', vi: 'toThrow() trần chỉ hỏi "có ném gì không?" — cả hai bản đều ném. Ghi rõ lớp lỗi mới hỏi đúng câu mà code trả lời.' },
      }],
      goiY: [
        { en: 'Replace every loose matcher in the starter with an exact one: what string exactly should formatTime(600) return?', vi: 'Thay mọi matcher lỏng trong bộ khởi đầu bằng matcher chính xác: formatTime(600) phải trả ĐÚNG chuỗi nào?' },
        { en: 'Pick inputs where the bug shows: 7.5 hours (450 min) separates Math.floor from Math.round; 07:00 needs the leading zero; two bookings separate "+=" from "=".', vi: 'Chọn đầu vào làm lỗi lộ ra: 7,5 giờ (450 phút) tách Math.floor khỏi Math.round; 07:00 cần số 0 đứng đầu; hai lượt đặt tách "+=" khỏi "=".' },
        { en: "Boundaries of parseTime: '24:00' and '07:60' must throw RangeError; '7h' must throw TypeError.", vi: "Biên của parseTime: '24:00' và '07:60' phải ném RangeError; '7h' phải ném TypeError." },
      ],
      loiHayGap: [
        { en: 'expect(0.1 + 0.2).toBe(0.3) style: comparing a computed fraction with toBe fails on the CORRECT code (floating point). Use toBeCloseTo(value, 4).', vi: 'Kiểu expect(0.1 + 0.2).toBe(0.3): so số thực vừa tính bằng toBe là đỏ ngay với code ĐÚNG (dấu phẩy động). Dùng toBeCloseTo(giá trị, 4).' },
        { en: 'toBeCloseTo with the default 2 digits is loose: 0.18 is "close to" 0.1786. Say how close you need.', vi: 'toBeCloseTo với mặc định 2 chữ số là lỏng: 0,18 vẫn "gần" 0,1786. Hãy nói cần gần tới đâu.' },
        { en: "expect(parseTime('7h')).toThrow() without a wrapper function: the error escapes before expect runs.", vi: "expect(parseTime('7h')).toThrow() không có hàm bọc: lỗi bật ra trước khi expect kịp chạy." },
      ],
      giaiThich: {
        en: '<p>A matcher is the question your test asks. <code>toBeTruthy()</code> asks "is it anything at all?", which "7:00", "08:30" and "07:30" all answer yes; <code>toBe(\'07:30\')</code> asks the real question. The same goes for errors: <code>toThrow(TypeError)</code> separates "wrong format" from "out of range", which the code deliberately reports with two different classes. For fractions, <code>toBeCloseTo(0.1786, 4)</code> both survives floating-point noise on the correct code and rejects the "last booking only" result (0.0357).</p>',
        vi: '<p>Matcher là câu hỏi mà test đặt ra. <code>toBeTruthy()</code> hỏi "có gì không?", mà "7:00", "08:30" hay "07:30" đều trả lời có; <code>toBe(\'07:30\')</code> mới hỏi đúng câu. Lỗi cũng vậy: <code>toThrow(TypeError)</code> tách "sai dạng" khỏi "ngoài khoảng" — hai trường hợp code cố ý báo bằng hai lớp lỗi khác nhau. Với số thực, <code>toBeCloseTo(0.1786, 4)</code> vừa chịu được sai số dấu phẩy động của code đúng, vừa loại kết quả "chỉ lượt cuối" (0,0357).</p>',
      },
      thuatNgu: [TN.matcher, TN.mutant, TN.killed],
      khoiDau: { 'src/rules/time.test.js': KHOI_DAU },
      loiGiai: { 'src/rules/time.test.js': LOI_GIAI },
      goiYDotBien: {
        '"24:00" accepted': "test the hour boundary: parseTime('24:00') must throw RangeError · test biên giờ: parseTime('24:00') phải ném RangeError",
        '"07:60" accepted': "test the minute boundary: parseTime('07:60') must throw RangeError · test biên phút: parseTime('07:60') phải ném RangeError",
        'bad format throws the wrong error class': 'name the error class: toThrow(TypeError), not a bare toThrow() · ghi rõ lớp lỗi: toThrow(TypeError), không dùng toThrow() trần',
        'formatTime rounds the hour': 'use a half hour: formatTime(450) must be exactly "07:30" · dùng nửa giờ: formatTime(450) phải đúng "07:30"',
        '"7:00" instead of "07:00"': 'compare the exact string of a morning time (toBe("07:00")), not toBeTruthy · so đúng chuỗi của một giờ buổi sáng (toBe("07:00")), không toBeTruthy',
        'usageRate counts only the last booking': 'give usageRate TWO bookings and check the sum with toBeCloseTo(…, 4) · cho usageRate HAI lượt đặt và kiểm tổng bằng toBeCloseTo(…, 4)',
      },
    }),
  ],
};
