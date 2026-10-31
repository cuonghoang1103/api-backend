/**
 * _ma.mjs — SINH TỰ ĐỘNG từ dự án labflow-lite chạy thật (Node 22.23.3, Vitest 5.0.5, fast-check 4.10.2), 01/11/2026.
 * CODE = nguyên văn tệp; OUT = nguyên văn output (đường dẫn máy rút gọn thành …/). Đừng sửa tay: sửa code ⇒ chạy lại ⇒ sinh lại.
 */
export const CODE = {
  booking: `import { parseTime } from './time.js';

export const OPEN = 7 * 60;          // 07:00
export const CLOSE = 21 * 60;        // 21:00
export const STEP = 30;              // BR-04: 30-minute grid
export const MAX_MINUTES = 240;      // Lite-1: at most 4 hours
export const MAX_DAYS_AHEAD = 14;    // BR-05: at most 14 days ahead
export const APPROVAL_SEATS = 30;    // BR-06: more than 30 seats needs approval

export function checkSlot(start, end) {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s % STEP !== 0 || e % STEP !== 0) return { ok: false, code: 'OFF_GRID' };
  if (e <= s) return { ok: false, code: 'END_BEFORE_START' };
  if (s < OPEN || e > CLOSE) return { ok: false, code: 'OUTSIDE_HOURS' };
  if (e - s > MAX_MINUTES) return { ok: false, code: 'TOO_LONG' };
  return { ok: true, minutes: e - s };
}

export function isWithinBookingWindow(daysAhead) {
  return Number.isInteger(daysAhead) && daysAhead >= 0 && daysAhead <= MAX_DAYS_AHEAD;
}

export function needsApproval({ seats, role }) {
  if (!Number.isInteger(seats) || seats < 1) {
    throw new RangeError('seats must be a positive integer, got ' + seats);
  }
  if (role === 'LECTURER' || role === 'ADMIN') return false;
  return seats > APPROVAL_SEATS;
}

export function createBooking({ lab, seats, role, start, end }) {
  const slot = checkSlot(start, end);
  if (!slot.ok) throw new Error(slot.code);
  return {
    lab,
    start,
    end,
    minutes: slot.minutes,
    status: needsApproval({ seats, role }) ? 'PENDING' : 'CONFIRMED',
  };
}

// Share of opening hours already booked, added booking by booking (0..1).
export function usageRate(bookings) {
  let rate = 0;
  for (const b of bookings) rate += b.minutes / (CLOSE - OPEN);
  return rate;
}`,
  time: `// Convert between "HH:MM" and minutes since 00:00.
export function parseTime(text) {
  const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
  if (!m) throw new TypeError('Invalid time "' + text + '", expected HH:MM');
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new RangeError('Time out of range: ' + text);
  return h * 60 + min;
}

export function formatTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}`,
  config: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['tree'],                 // print the describe → it tree
    expect: { requireAssertions: true }, // a test without any expect fails (lesson 1.1)
  },
});`,
  aaa: `import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

it('a 31-seat booking by a student waits for approval', () => {
  // Arrange — build the input
  const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

  // Act — call the ONE thing under test
  const booking = createBooking(input);

  // Assert — check the result
  expect(booking.status).toBe('PENDING');
});

it('checks nothing at all', () => {
  createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
});`,
  nhieu: `import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

it('booking works', () => {
  const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  expect(b.status).toBe('CONFIRMED');   // wrong expectation here…
  expect(b.minutes).toBe(120);          // …so these two lines
  expect(b.lab).toBe('BE-201');         // never run
});`,
  soft: `import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

it('booking fields (soft)', () => {
  const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
  expect.soft(b.status).toBe('CONFIRMED');
  expect.soft(b.minutes).toBe(90);
  expect.soft(b.lab).toBe('BE-201');
});`,
  strictConfig: `import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { reporters: ['tree'], expect: { requireAssertions: true } },
});`,
  th11: `import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

it('a lecturer booking 31 seats is confirmed without approval', () => {
  // Arrange
  const input = { lab: 'BE-201', seats: 31, role: 'LECTURER', start: '13:00', end: '15:30' };
  // Act
  const booking = createBooking(input);
  // Assert
  expect(booking.status).toBe('CONFIRMED');
});

it('a 13:00–15:30 booking lasts 150 minutes', () => {
  const booking = createBooking({ lab: 'BE-201', seats: 31, role: 'LECTURER', start: '13:00', end: '15:30' });
  expect(booking.minutes).toBe(150);
});`,
  tach: `import { describe, it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

describe('createBooking — a 31-seat student booking, 08:00–10:00', () => {
  const input = { lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' };

  it('waits for approval (PENDING)', () => {
    expect(createBooking(input).status).toBe('PENDING');
  });

  it('lasts 120 minutes', () => {
    expect(createBooking(input).minutes).toBe(120);
  });

  it('keeps the lab code', () => {
    expect(createBooking(input).lab).toBe('BE-201');
  });
});`,
  dao: `import { it, expect } from 'vitest';
import { parseTime } from '../src/rules/time.js';

it('07:30 is 420 minutes (wrong expectation, arguments swapped)', () => {
  expect(420).toBe(parseTime('07:30'));
});`,
  matcher: `import { describe, it, expect } from 'vitest';
import { createBooking, checkSlot, usageRate } from '../src/rules/booking.js';
import { parseTime } from '../src/rules/time.js';

const input = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

describe('toBe vs toEqual', () => {
  it('toBe on an object', () => {
    expect(createBooking(input)).toBe({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
  });
  it('toEqual on an object', () => {
    expect(createBooking(input)).toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
  });
});

describe('numbers', () => {
  it('usage of 30 + 120 + 60 minutes is 25% (toBe)', () => {
    expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60 }])).toBe(0.25);
  });
  it('usage of 30 + 120 + 60 minutes is 25% (toBeCloseTo)', () => {
    expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60 }])).toBeCloseTo(0.25);
  });
});

describe('truthy trap', () => {
  it('an invalid slot is still truthy', () => {
    expect(checkSlot('06:30', '08:00')).toBeTruthy();
  });
});

describe('errors', () => {
  it('without a wrapper function', () => {
    expect(parseTime('7h')).toThrow();
  });
  it('with a wrapper function', () => {
    expect(() => parseTime('7h')).toThrow(TypeError);
    expect(() => parseTime('7h')).toThrow(/expected HH:MM/);
  });
});`,
  strictAfter: `import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

const input = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('toEqual ignores an undefined property', () => {
  expect({ ...createBooking(input), note: undefined })
    .toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
});

it('toStrictEqual does not', () => {
  expect({ ...createBooking(input), note: undefined })
    .toStrictEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
});

it('toMatchObject checks only the fields you name', () => {
  expect(createBooking(input)).toMatchObject({ status: 'CONFIRMED', minutes: 120 });
});

it('inline snapshot', () => {
  expect(createBooking(input)).toMatchInlineSnapshot(\`
    {
      "end": "10:00",
      "lab": "BE-201",
      "minutes": 120,
      "start": "08:00",
      "status": "CONFIRMED",
    }
  \`);
});`,
  strictAfterU: `import { it, expect } from 'vitest';
import { createBooking } from '../src/rules/booking.js';

const input = { lab: 'BE-201', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };

it('toEqual ignores an undefined property', () => {
  expect({ ...createBooking(input), note: undefined })
    .toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
});

it('toStrictEqual does not', () => {
  expect({ ...createBooking(input), note: undefined })
    .toStrictEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'CONFIRMED' });
});

it('toMatchObject checks only the fields you name', () => {
  expect(createBooking(input)).toMatchObject({ status: 'CONFIRMED', minutes: 120 });
});

it('inline snapshot', () => {
  expect(createBooking(input)).toMatchInlineSnapshot(\`
    {
      "end": "10:00",
      "lab": "BE-201",
      "minutes": 120,
      "start": "08:00",
      "status": "PENDING",
    }
  \`);
});`,
  th12: `import { it, expect } from 'vitest';
import { needsApproval, usageRate, checkSlot } from '../src/rules/booking.js';

it('rejects 0 seats with a RangeError that explains why', () => {
  expect(() => needsApproval({ role: 'STUDENT', seats: 0 })).toThrow(RangeError);
  expect(() => needsApproval({ role: 'STUDENT', seats: 0 })).toThrow(/positive integer/);
});

it('usage of 120 + 30 minutes is about 17.86% of the day', () => {
  expect(usageRate([{ minutes: 120 }, { minutes: 30 }])).toBeCloseTo(0.1786, 4);
});

it('an off-grid slot is not ok', () => {
  expect(checkSlot('08:10', '09:00')).toMatchObject({ ok: false });
  expect(checkSlot('08:10', '09:00')).not.toHaveProperty('minutes');
});

it('06:30 is rejected as OUTSIDE_HOURS (the truthy test, rewritten)', () => {
  expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTSIDE_HOURS' });
});`,
  ten: `import { describe, it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

describe('checkSlot', () => {
  describe('when the slot is valid', () => {
    it('returns ok with the length in minutes', () => {
      expect(checkSlot('08:00', '10:00')).toEqual({ ok: true, minutes: 120 });
    });
  });

  describe('when the slot breaks a rule', () => {
    it.each([
      { start: '06:30', end: '08:00', code: 'OUTSIDE_HOURS' },
      { start: '20:00', end: '21:30', code: 'OUTSIDE_HOURS' },
      { start: '08:15', end: '09:00', code: 'OFF_GRID' },
      { start: '10:00', end: '09:00', code: 'END_BEFORE_START' },
      { start: '08:00', end: '12:30', code: 'TOO_LONG' },
    ])('rejects $start–$end with $code', ({ start, end, code }) => {
      expect(checkSlot(start, end)).toEqual({ ok: false, code });
    });
  });

  it.todo('rejects a slot on a day the lab is closed');
});`,
  tenXau: `import { it, expect } from 'vitest';
import { isWithinBookingWindow } from '../src/rules/booking.js';

it('test 2', () => {
  expect(isWithinBookingWindow(14)).toBe(true);
});`,
  th13Truoc: `import { it, expect } from 'vitest';
import { parseTime } from '../src/rules/time.js';

it('test 1', () => { expect(parseTime('00:00')).toBe(0); });
it('test 2', () => { expect(parseTime('07:00')).toBe(420); });
it('test 3', () => { expect(parseTime('12:30')).toBe(750); });
it('test 4', () => { expect(parseTime('21:00')).toBe(1260); });
it('test 5', () => { expect(parseTime('23:59')).toBe(1439); });`,
  th13Sau: `import { describe, it, expect } from 'vitest';
import { parseTime } from '../src/rules/time.js';

describe('parseTime', () => {
  it.each([
    ['00:00', 0],    // midnight
    ['07:00', 420],  // opening time
    ['12:30', 750],
    ['21:00', 1260], // closing time
    ['23:59', 1439], // last minute of the day
  ])('converts %s to %i minutes', (text, minutes) => {
    expect(parseTime(text)).toBe(minutes);
  });
});`,
  bien: `import { describe, it, expect } from 'vitest';
import { isWithinBookingWindow, needsApproval } from '../src/rules/booking.js';

describe('isWithinBookingWindow (BR-05: at most 14 days ahead)', () => {
  it.each([
    [-1, false],   // lower boundary - 1
    [0, true],     // lower boundary: today
    [1, true],     // lower boundary + 1
    [13, true],    // upper boundary - 1
    [14, true],    // upper boundary: "exactly 14 is still valid"
    [15, false],   // upper boundary + 1
  ])('%i days ahead → %s', (days, expected) => {
    expect(isWithinBookingWindow(days)).toBe(expected);
  });

  it.each([1.5, NaN, '3', null])('rejects a non-integer input: %s', (value) => {
    expect(isWithinBookingWindow(value)).toBe(false);
  });
});

describe('needsApproval — decision table (role × seats > 30)', () => {
  it.each([
    { role: 'STUDENT', seats: 30, expected: false },
    { role: 'STUDENT', seats: 31, expected: true },
    { role: 'LECTURER', seats: 30, expected: false },
    { role: 'LECTURER', seats: 31, expected: false },
    { role: 'ADMIN', seats: 30, expected: false },
    { role: 'ADMIN', seats: 31, expected: false },
  ])('$role with $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });

  it.each([0, -5, 2.5])('throws RangeError for seats = %s', (seats) => {
    expect(() => needsApproval({ role: 'STUDENT', seats })).toThrow(RangeError);
  });
});`,
  thuocTinh: `import { it } from 'vitest';
import fc from 'fast-check';
import { parseTime, formatTime } from '../src/rules/time.js';

it('formatTime then parseTime gives back the same minute (0..1439)', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 1439 }), (minutes) => {
      return parseTime(formatTime(minutes)) === minutes;
    }),
  );
});`,
  th14: `import { describe, it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

describe('checkSlot — length boundary (Lite-1: at most 240 minutes)', () => {
  it.each([
    { start: '08:00', end: '08:30', expected: { ok: true, minutes: 30 } },        // shortest valid
    { start: '08:00', end: '12:00', expected: { ok: true, minutes: 240 } },       // upper boundary: exactly 4 h
    { start: '08:00', end: '12:30', expected: { ok: false, code: 'TOO_LONG' } },  // boundary + one grid step
    { start: '08:00', end: '08:00', expected: { ok: false, code: 'END_BEFORE_START' } }, // zero minutes
  ])('$start–$end', ({ start, end, expected }) => {
    expect(checkSlot(start, end)).toEqual(expected);
  });
});`,
  th14Prop: `import { it } from 'vitest';
import fc from 'fast-check';
import { checkSlot, MAX_MINUTES } from '../src/rules/booking.js';
import { formatTime } from '../src/rules/time.js';

// any time of day on the 30-minute grid: 00:00, 00:30, … 23:30
const gridTime = fc.integer({ min: 0, max: 47 }).map((i) => formatTime(i * 30));

it('never accepts a slot longer than MAX_MINUTES', () => {
  fc.assert(
    fc.property(gridTime, gridTime, (start, end) => {
      const result = checkSlot(start, end);
      return !result.ok || result.minutes <= MAX_MINUTES;
    }),
  );
});`,
  bookingTest: `import { describe, it, expect } from 'vitest';
import { checkSlot, isWithinBookingWindow, needsApproval, createBooking } from './booking.js';

describe('checkSlot', () => {
  describe('accepts', () => {
    it.each([
      { start: '07:00', end: '08:00', minutes: 60 },   // opens exactly at 07:00
      { start: '20:00', end: '21:00', minutes: 60 },   // ends exactly at 21:00
      { start: '08:00', end: '08:30', minutes: 30 },   // shortest: one grid cell
      { start: '08:00', end: '12:00', minutes: 240 },  // longest: exactly 4 hours
    ])('$start–$end ($minutes min)', ({ start, end, minutes }) => {
      expect(checkSlot(start, end)).toEqual({ ok: true, minutes });
    });
  });

  describe('rejects', () => {
    it.each([
      { start: '06:30', end: '08:00', code: 'OUTSIDE_HOURS' },    // before opening
      { start: '20:00', end: '21:30', code: 'OUTSIDE_HOURS' },    // after closing
      { start: '08:15', end: '09:00', code: 'OFF_GRID' },         // off the 30-minute grid
      { start: '08:00', end: '09:10', code: 'OFF_GRID' },
      { start: '10:00', end: '09:00', code: 'END_BEFORE_START' },
      { start: '09:00', end: '09:00', code: 'END_BEFORE_START' }, // zero minutes long
      { start: '08:00', end: '12:30', code: 'TOO_LONG' },         // 4 h 30
    ])('$start–$end with $code', ({ start, end, code }) => {
      expect(checkSlot(start, end)).toEqual({ ok: false, code });
    });
  });
});

describe('isWithinBookingWindow (BR-05)', () => {
  it.each([[-1, false], [0, true], [14, true], [15, false]])('%i days → %s', (days, ok) => {
    expect(isWithinBookingWindow(days)).toBe(ok);
  });
  it.each([1.5, NaN, '3', null])('rejects %s', (value) => {
    expect(isWithinBookingWindow(value)).toBe(false);
  });
});

describe('needsApproval (BR-06 decision table)', () => {
  it.each([
    { role: 'STUDENT', seats: 30, expected: false },
    { role: 'STUDENT', seats: 31, expected: true },
    { role: 'LECTURER', seats: 31, expected: false },
    { role: 'ADMIN', seats: 31, expected: false },
  ])('$role, $seats seats → $expected', ({ role, seats, expected }) => {
    expect(needsApproval({ role, seats })).toBe(expected);
  });
  it.each([0, -5, 2.5])('throws RangeError for %s seats', (seats) => {
    expect(() => needsApproval({ role: 'STUDENT', seats })).toThrow(RangeError);
  });
});

describe('createBooking', () => {
  it('builds a PENDING booking for 31 seats', () => {
    const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00' });
    expect(b).toEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minutes: 120, status: 'PENDING' });
  });
  it('throws the rule code for a bad slot', () => {
    expect(() => createBooking({ lab: 'BE-201', seats: 5, role: 'STUDENT', start: '06:00', end: '07:00' }))
      .toThrow('OUTSIDE_HOURS');
  });
});`,
  timeTest: `import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { parseTime, formatTime } from './time.js';

describe('parseTime', () => {
  it.each([['00:00', 0], ['07:00', 420], ['21:30', 1290], ['23:59', 1439]])('%s → %i', (text, minutes) => {
    expect(parseTime(text)).toBe(minutes);
  });
  it.each(['7:00', '07-00', '', 'abc'])('throws TypeError for "%s"', (text) => {
    expect(() => parseTime(text)).toThrow(TypeError);
  });
  it.each(['24:00', '07:60'])('throws RangeError for %s', (text) => {
    expect(() => parseTime(text)).toThrow(RangeError);
  });
});

describe('formatTime', () => {
  it('pads to HH:MM', () => {
    expect(formatTime(450)).toBe('07:30');
  });
  it('round-trips with parseTime for every minute of the day', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1439 }), (m) => {
        expect(parseTime(formatTime(m))).toBe(m); // an expect inside, so requireAssertions is satisfied
      }),
    );
  });
});`,
  weakTest: `import { describe, it, expect } from 'vitest';
import { checkSlot } from './booking.js';

describe('checkSlot', () => {
  it('accepts 08:00–10:00', () => {
    expect(checkSlot('08:00', '10:00')).toEqual({ ok: true, minutes: 120 });
  });

  it('rejects 06:30–08:00 as OUTSIDE_HOURS', () => {
    expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTSIDE_HOURS' });
  });
});`,
  dotBien: `// Plant one bug (a "mutant") at a time, run your tests, then restore the code.
// A good suite goes RED for every mutant ("killed"); a mutant that stays green ("survived") is a gap.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['src/rules/booking.js', 'daysAhead <= MAX_DAYS_AHEAD', 'daysAhead < MAX_DAYS_AHEAD', 'BR-05: 14 days ahead rejected'],
  ['src/rules/booking.js', 'return seats > APPROVAL_SEATS;', 'return seats >= APPROVAL_SEATS;', 'BR-06: 30 seats needs approval'],
  ['src/rules/booking.js', 'e > CLOSE', 'e >= CLOSE', 'slot ending at 21:00 rejected'],
  ['src/rules/booking.js', 'e - s > MAX_MINUTES', 'e - s >= MAX_MINUTES', 'exactly 4 hours rejected'],
  ['src/rules/booking.js', 'if (e <= s)', 'if (e < s)', 'zero-length slot accepted'],
  ["src/rules/booking.js", "role === 'LECTURER' || role === 'ADMIN'", "role === 'LECTURER'", 'ADMIN needs approval'],
  ['src/rules/time.js', 'h > 23', 'h > 24', '"24:00" accepted'],
  ['src/rules/time.js', 'Math.floor(minutes / 60)', 'Math.round(minutes / 60)', 'formatTime rounds the hour'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', 'src/'], { encoding: 'utf8', shell: process.platform === 'win32' });
    const dead = run.status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(file, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
};
export const OUT = {
  '01-pyramid': `$ npx vitest run test/pyramid

 RUN  v5.0.5 …/labflow-lite

 ✓ test/pyramid.unit.test.js (1 test) 2ms
   ✓ unit: 06:30 is before opening time 1ms
 ✓ test/pyramid.api.test.js (1 test) 22ms
   ✓ api: POST /bookings at 06:30 answers 400 OUTSIDE_HOURS 21ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  00:07:46
   Duration  226ms (import 63%, transform 19%, tests 14%, worker 3%)`,
  '01-toc-do': `$ npx vitest run test/do-toc-do.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ test/do-toc-do.test.js (2 tests) 152ms
   ✓ 200 unit checks 3ms
   ✓ 200 HTTP requests through Express 149ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  23:44:45
   Duration  344ms (tests 57%, import 36%, transform 7%, worker 1%)`,
  '03-fail': `$ npm test

> labflow-lite@1.0.0 test
> vitest run


 RUN  v5.0.5 …/labflow-lite

 ❯ src/rules/time.test.js (3 tests | 1 failed) 5ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ❯ formatTime (1)
     × pads hours and minutes to two digits 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/rules/time.test.js > formatTime > pads hours and minutes to two digits
AssertionError: expected '7:30' to be '07:30' // Object.is equality

Expected: "07:30"
Received: "7:30"

 ❯ src/rules/time.test.js:16:29
     14| describe('formatTime', () => {
     15|   it('pads hours and minutes to two digits', () => {
     16|     expect(formatTime(450)).toBe('07:30');
       |                             ^
     17|   });
     18| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  23:43:41
   Duration  109ms (transform 44%, import 28%, tests 19%, worker 9%)`,
  '03-file': `$ npx vitest run time

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests) 2ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  00:11:07
   Duration  96ms (import 43%, transform 27%, worker 16%, tests 14%, environment 1%)`,
  '03-filter': `$ npx vitest run -t formatTime

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests | 2 skipped) 2ms
   ↓ parseTime (2)
     ↓ turns "07:00" into 420 minutes
     ↓ counts the minutes too: "21:30" is 1290
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 1ms

 Test Files  1 passed (1)
      Tests  1 passed | 2 skipped (3)
   Start at  23:43:41
   Duration  91ms (import 43%, transform 29%, worker 16%, tests 12%)`,
  '03-node-direct': `$ node src/rules/time.test.js
file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2745
		validateTags(runner.config, suiteTags);
		                    ^

TypeError: Cannot read properties of undefined (reading 'config')
    at initSuite (file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2745:23)
    at createSuiteCollector (file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2626:2)
    at Object.suiteFn (file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2826:10)
    at chain (file://…/labflow-lite/node_modules/vitest/dist/chunks/run.BPv-BBRv.js:1870:14)
    at file://…/labflow-lite/src/rules/time.test.js:4:1
    at ModuleJob.run (node:internal/modules/esm/module_job:343:25)
    at async onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:681:26)
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:117:5)

Node.js v22.23.3`,
  '03-pass': `$ npm test

> labflow-lite@1.0.0 test
> vitest run


 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests) 2ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  23:43:40
   Duration  103ms (transform 60%, import 24%, worker 9%, tests 7%)`,
  '03-ts': `$ npx vitest run kieu

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/kieu.test.ts (1 test) 2ms
   ✓ TypeScript works with zero config 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  00:11:13
   Duration  102ms (transform 60%, import 25%, worker 9%, tests 6%)`,
  '08-fail': `$ node --test --test-reporter=spec gio.test.js
✔ 07:00 is minute 420 (0.422875ms)
✖ 21:30 is minute 1290 (0.411167ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 48.214834

✖ failing tests:

test at gio.test.js:9:1
✖ 21:30 is minute 1290 (0.411167ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  
  1260 !== 1290
  
      at TestContext.<anonymous> (file://…/thu-test/gio.test.js:10:10)
      at Test.runInAsyncScope (node:async_hooks:214:14)
      at Test.run (node:internal/test_runner/test:1047:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:744:18)
      at Test.postRun (node:internal/test_runner/test:1173:19)
      at Test.run (node:internal/test_runner/test:1101:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3) {
    generatedMessage: true,
    code: 'ERR_ASSERTION',
    actual: 1260,
    expected: 1290,
    operator: 'strictEqual',
    diff: 'simple'
  }`,
  '08-pass': `$ node --test --test-reporter=spec gio.test.js
✔ 07:00 is minute 420 (0.704208ms)
✔ 21:30 is minute 1290 (0.074041ms)
ℹ tests 2
ℹ suites 0
ℹ pass 2
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 52.915667`,
  '09-khop': `$ node --test --test-reporter=spec khop.test.js
✔ pattern with a wildcard in field 21 matches (0.461167ms)
✖ pattern with a real value in field 21 (0.137459ms)
ℹ tests 2
ℹ suites 0
ℹ pass 1
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 56.37825

✖ failing tests:

test at khop.test.js:12:1
✖ pattern with a real value in field 21 (0.137459ms)
  RangeError: no input field 21
      at file://…/thu-test/khop.js:5:35
      at Array.every (<anonymous>)
      at matches (file://…/thu-test/khop.js:3:18)
      at TestContext.<anonymous> (file://…/thu-test/khop.test.js:14:16)
      at Test.runInAsyncScope (node:async_hooks:214:14)
      at Test.run (node:internal/test_runner/test:1047:25)
      at Test.processPendingSubtests (node:internal/test_runner/test:744:18)
      at Test.postRun (node:internal/test_runner/test:1173:19)
      at Test.run (node:internal/test_runner/test:1101:12)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:296:3)`,
  '11-aaa': `$ npx vitest run demo/aaa.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/aaa.test.js (2 tests) 2ms
   ✓ a 31-seat booking by a student waits for approval 1ms
   ✓ checks nothing at all 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  00:21:47
   Duration  125ms (transform 61%, import 25%, worker 9%, tests 5%)`,
  '11-dao': `$ npx vitest run demo/dao.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/dao.test.js (1 test | 1 failed) 4ms
   × 07:30 is 420 minutes (wrong expectation, arguments swapped) 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/dao.test.js > 07:30 is 420 minutes (wrong expectation, arguments swapped)
AssertionError: expected 420 to be 450 // Object.is equality

- Expected
+ Received

- 450
+ 420

 ❯ demo/dao.test.js:5:15
      3|
      4| it('07:30 is 420 minutes (wrong expectation, arguments swapped)', () =…
      5|   expect(420).toBe(parseTime('07:30'));
       |               ^
      6| });
      7|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:21:50
   Duration  106ms (transform 45%, import 27%, tests 18%, worker 9%)`,
  '11-nhieu': `$ npx vitest run demo/nhieu-ly-do.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/nhieu-ly-do.test.js (1 test | 1 failed) 5ms
   × booking works 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/nhieu-ly-do.test.js > booking works
AssertionError: expected 'PENDING' to be 'CONFIRMED' // Object.is equality

Expected: "CONFIRMED"
Received: "PENDING"

 ❯ demo/nhieu-ly-do.test.js:6:20
      4| it('booking works', () => {
      5|   const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT',…
      6|   expect(b.status).toBe('CONFIRMED');   // wrong expectation here…
       |                    ^
      7|   expect(b.minutes).toBe(120);          // …so these two lines
      8|   expect(b.lab).toBe('BE-201');         // never run

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:21:48
   Duration  113ms (transform 46%, import 28%, tests 16%, worker 9%)`,
  '11-require': `$ npx vitest run demo/aaa.test.js --config demo/vitest.strict.config.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/aaa.test.js (2 tests | 1 failed) 4ms
   ✓ a 31-seat booking by a student waits for approval 1ms
   × checks nothing at all 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/aaa.test.js > checks nothing at all
Error: expected any number of assertion, but got none
 ❯ demo/aaa.test.js:15:1
     13| });
     14|
     15| it('checks nothing at all', () => {
       | ^
     16|   createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '0…
     17| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  00:21:47
   Duration  111ms (transform 54%, import 24%, tests 13%, worker 8%)`,
  '11-soft': `$ npx vitest run demo/soft.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/soft.test.js (1 test | 1 failed) 6ms
   × booking fields (soft) 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/soft.test.js > booking fields (soft)
AssertionError: expected 'PENDING' to be 'CONFIRMED' // Object.is equality

Expected: "CONFIRMED"
Received: "PENDING"

 ❯ demo/soft.test.js:6:25
      4| it('booking fields (soft)', () => {
      5|   const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT',…
      6|   expect.soft(b.status).toBe('CONFIRMED');
       |                         ^
      7|   expect.soft(b.minutes).toBe(90);
      8|   expect.soft(b.lab).toBe('BE-201');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo/soft.test.js > booking fields (soft)
AssertionError: expected 120 to be 90 // Object.is equality

- Expected
+ Received

- 90
+ 120

 ❯ demo/soft.test.js:7:26
      5|   const b = createBooking({ lab: 'BE-201', seats: 31, role: 'STUDENT',…
      6|   expect.soft(b.status).toBe('CONFIRMED');
      7|   expect.soft(b.minutes).toBe(90);
       |                          ^
      8|   expect.soft(b.lab).toBe('BE-201');
      9| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:21:48
   Duration  114ms (transform 44%, import 26%, tests 17%, worker 12%)`,
  '11-tach': `$ npx vitest run demo/tach.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/tach.test.js (3 tests) 2ms
   ✓ createBooking — a 31-seat student booking, 08:00–10:00 (3)
     ✓ waits for approval (PENDING) 1ms
     ✓ lasts 120 minutes 0ms
     ✓ keeps the lab code 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  00:23:56
   Duration  111ms (transform 51%, import 29%, worker 11%, tests 8%)`,
  '11-th': `$ npx vitest run demo/th11.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/th11.test.js (2 tests) 2ms
   ✓ a lecturer booking 31 seats is confirmed without approval 1ms
   ✓ a 13:00–15:30 booking lasts 150 minutes 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  00:21:49
   Duration  95ms (transform 51%, import 30%, worker 11%, tests 8%)`,
  '12-matcher': `$ npx vitest run demo/matcher.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/matcher.test.js (7 tests | 3 failed) 8ms
   ❯ toBe vs toEqual (2)
     × toBe on an object 4ms
     ✓ toEqual on an object 0ms
   ❯ numbers (2)
     × usage of 30 + 120 + 60 minutes is 25% (toBe) 1ms
     ✓ usage of 30 + 120 + 60 minutes is 25% (toBeCloseTo) 0ms
   ✓ truthy trap (1)
     ✓ an invalid slot is still truthy 0ms
   ❯ errors (2)
     × without a wrapper function 0ms
     ✓ with a wrapper function 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/matcher.test.js > toBe vs toEqual > toBe on an object
AssertionError: expected { lab: 'BE-201', start: '08:00', …(3) } to be { lab: 'BE-201', start: '08:00', …(3) } // Object.is equality

If it should pass with deep equality, replace "toBe" with "toStrictEqual"

Expected: { lab: 'BE-201', start: '08:00', …(3) }
Received: serializes to the same string


Compared values have no visual difference.

 ❯ demo/matcher.test.js:9:34
      7| describe('toBe vs toEqual', () => {
      8|   it('toBe on an object', () => {
      9|     expect(createBooking(input)).toBe({ lab: 'BE-201', start: '08:00',…
       |                                  ^
     10|   });
     11|   it('toEqual on an object', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  demo/matcher.test.js > numbers > usage of 30 + 120 + 60 minutes is 25% (toBe)
AssertionError: expected 0.24999999999999997 to be 0.25 // Object.is equality

- Expected
+ Received

- 0.25
+ 0.24999999999999997

 ❯ demo/matcher.test.js:18:77
     16| describe('numbers', () => {
     17|   it('usage of 30 + 120 + 60 minutes is 25% (toBe)', () => {
     18|     expect(usageRate([{ minutes: 30 }, { minutes: 120 }, { minutes: 60…
       |                                                                             ^
     19|   });
     20|   it('usage of 30 + 120 + 60 minutes is 25% (toBeCloseTo)', () => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  demo/matcher.test.js > errors > without a wrapper function
TypeError: Invalid time "7h", expected HH:MM
 ❯ parseTime src/rules/time.js:4:17
      2| export function parseTime(text) {
      3|   const m = /^([0-9]{2}):([0-9]{2})$/.exec(text);
      4|   if (!m) throw new TypeError('Invalid time "' + text + '", expected H…
       |                 ^
      5|   const h = Number(m[1]);
      6|   const min = Number(m[2]);
 ❯ demo/matcher.test.js:33:12

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  1 failed (1)
      Tests  3 failed | 4 passed (7)
   Start at  00:21:50
   Duration  111ms (transform 43%, tests 27%, import 23%, worker 7%)`,
  '12-snap-fail': `$ npx vitest run demo/strict.test.js -t inline

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/strict.test.js (4 tests | 1 failed | 3 skipped) 7ms
   ↓ toEqual ignores an undefined property
   ↓ toStrictEqual does not
   ↓ toMatchObject checks only the fields you name
   × inline snapshot 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/strict.test.js > inline snapshot
Error: Snapshot \`inline snapshot 1\` mismatched

- Expected
+ Received

  {
    "end": "10:00",
    "lab": "BE-201",
    "minutes": 120,
    "start": "08:00",
-   "status": "CONFIRMED",
+   "status": "PENDING",
  }

 ❯ demo/strict.test.js:21:32
     19|
     20| it('inline snapshot', () => {
     21|   expect(createBooking(input)).toMatchInlineSnapshot(\`
       |                                ^
     22|     {
     23|       "end": "10:00",

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


  Snapshots  1 failed
 Test Files  1 failed (1)
      Tests  1 failed | 3 skipped (4)
   Start at  00:21:51
   Duration  115ms (transform 49%, import 21%, tests 21%, worker 8%)`,
  '12-snap-u': `$ npx vitest run demo/strict.test.js -t inline -u

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/strict.test.js (4 tests | 3 skipped) 5ms
   ↓ toEqual ignores an undefined property
   ↓ toStrictEqual does not
   ↓ toMatchObject checks only the fields you name
   ✓ inline snapshot 4ms

  Snapshots  1 updated 
 Test Files  1 passed (1)
      Tests  1 passed | 3 skipped (4)
   Start at  00:21:52
   Duration  91ms (import 36%, tests 28%, transform 24%, worker 12%)`,
  '12-strict': `$ npx vitest run demo/strict.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/strict.test.js (4 tests | 1 failed) 9ms
   ✓ toEqual ignores an undefined property 1ms
   × toStrictEqual does not 4ms
   ✓ toMatchObject checks only the fields you name 0ms
   ✓ inline snapshot 2ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/strict.test.js > toStrictEqual does not
AssertionError: expected { lab: 'BE-201', start: '08:00', …(4) } to strictly equal { lab: 'BE-201', start: '08:00', …(3) }

- Expected
+ Received

  {
    "end": "10:00",
    "lab": "BE-201",
    "minutes": 120,
+   "note": undefined,
    "start": "08:00",
    "status": "CONFIRMED",
  }

 ❯ demo/strict.test.js:13:6
     11| it('toStrictEqual does not', () => {
     12|   expect({ ...createBooking(input), note: undefined })
     13|     .toStrictEqual({ lab: 'BE-201', start: '08:00', end: '10:00', minu…
       |      ^
     14| });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


  Snapshots  1 written
 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  00:21:51
   Duration  113ms (transform 39%, tests 30%, import 23%, worker 7%)`,
  '12-th-bug': `$ npx vitest run demo/th12.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/th12.test.js (4 tests | 2 failed) 8ms
   ✓ rejects 0 seats with a RangeError that explains why 1ms
   × usage of 120 + 30 minutes is about 17.86% of the day 2ms
   ✓ an off-grid slot is not ok 1ms
   × 06:30 is rejected as OUTSIDE_HOURS (the truthy test, rewritten) 3ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/th12.test.js > usage of 120 + 30 minutes is about 17.86% of the day
AssertionError: expected 0.16666666666666666 to be close to 0.1786, received difference is 0.011933333333333351, but expected 0.000049999999999999996
 ❯ demo/th12.test.js:10:58
      8|
      9| it('usage of 120 + 30 minutes is about 17.86% of the day', () => {
     10|   expect(usageRate([{ minutes: 120 }, { minutes: 30 }])).toBeCloseTo(0…
       |                                                          ^
     11| });
     12|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo/th12.test.js > 06:30 is rejected as OUTSIDE_HOURS (the truthy test, rewritten)
AssertionError: expected { ok: true, minutes: 90 } to deeply equal { ok: false, code: 'OUTSIDE_HOURS' }

- Expected
+ Received

  {
-   "code": "OUTSIDE_HOURS",
-   "ok": false,
+   "minutes": 90,
+   "ok": true,
  }

 ❯ demo/th12.test.js:19:39
     17|
     18| it('06:30 is rejected as OUTSIDE_HOURS (the truthy test, rewritten)', …
     19|   expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTS…
       |                                       ^
     20| });
     21|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 2 passed (4)
   Start at  00:27:24
   Duration  130ms (transform 48%, import 23%, tests 21%, worker 7%)`,
  '12-th': `$ npx vitest run demo/th12.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/th12.test.js (4 tests) 4ms
   ✓ rejects 0 seats with a RangeError that explains why 2ms
   ✓ usage of 120 + 30 minutes is about 17.86% of the day 0ms
   ✓ an off-grid slot is not ok 1ms
   ✓ 06:30 is rejected as OUTSIDE_HOURS (the truthy test, rewritten) 0ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  00:27:23
   Duration  128ms (transform 58%, import 23%, tests 10%, worker 9%)`,
  '13-only-ci': `$ CI=true npx vitest run demo/ten.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/ten.test.js (7 tests | 1 failed | 5 skipped | 1 todo) 1ms
   ❯ checkSlot (7)
     ❯ when the slot is valid (1)
       × returns ok with the length in minutes
     ↓ when the slot breaks a rule (5)
       ↓ rejects 06:30–08:00 with OUTSIDE_HOURS
       ↓ rejects 20:00–21:30 with OUTSIDE_HOURS
       ↓ rejects 08:15–09:00 with OFF_GRID
       ↓ rejects 10:00–09:00 with END_BEFORE_START
       ↓ rejects 08:00–12:30 with TOO_LONG
     □ rejects a slot on a day the lab is closed

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/ten.test.js > checkSlot > when the slot is valid > returns ok with the length in minutes
Error: [Vitest] Unexpected .only modifier. Remove it or pass --allowOnly argument to bypass this error
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 5 skipped | 1 todo (7)
   Start at  00:21:53
   Duration  96ms (transform 52%, import 33%, worker 11%, tests 4%, environment 1%)`,
  '13-only-local': `$ npx vitest run demo/ten.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/ten.test.js (7 tests | 5 skipped | 1 todo) 2ms
   ✓ checkSlot (7)
     ✓ when the slot is valid (1)
       ✓ returns ok with the length in minutes 1ms
     ↓ when the slot breaks a rule (5)
       ↓ rejects 06:30–08:00 with OUTSIDE_HOURS
       ↓ rejects 20:00–21:30 with OUTSIDE_HOURS
       ↓ rejects 08:15–09:00 with OFF_GRID
       ↓ rejects 10:00–09:00 with END_BEFORE_START
       ↓ rejects 08:00–12:30 with TOO_LONG
     □ rejects a slot on a day the lab is closed

 Test Files  1 passed (1)
      Tests  1 passed | 5 skipped | 1 todo (7)
   Start at  00:21:54
   Duration  97ms (import 53%, transform 27%, worker 10%, tests 10%)`,
  '13-ten-xau': `$ npx vitest run demo/ten-xau.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/ten-xau.test.js (1 test | 1 failed) 4ms
   × test 2 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/ten-xau.test.js > test 2
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ demo/ten-xau.test.js:5:37
      3|
      4| it('test 2', () => {
      5|   expect(isWithinBookingWindow(14)).toBe(true);
       |                                     ^
      6| });
      7|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:21:54
   Duration  109ms (transform 51%, import 24%, tests 16%, worker 9%)`,
  '13-ten': `$ npx vitest run demo/ten.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/ten.test.js (7 tests | 1 todo) 3ms
   ✓ checkSlot (7)
     ✓ when the slot is valid (1)
       ✓ returns ok with the length in minutes 1ms
     ✓ when the slot breaks a rule (5)
       ✓ rejects 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ rejects 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ rejects 08:15–09:00 with OFF_GRID 0ms
       ✓ rejects 10:00–09:00 with END_BEFORE_START 0ms
       ✓ rejects 08:00–12:30 with TOO_LONG 0ms
     □ rejects a slot on a day the lab is closed

 Test Files  1 passed (1)
      Tests  6 passed | 1 todo (7)
   Start at  00:21:53
   Duration  116ms (transform 51%, import 32%, tests 9%, worker 8%)`,
  '13-th': `$ npx vitest run demo/th13-truoc.test.js demo/th13-sau.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/th13-truoc.test.js (5 tests) 2ms
   ✓ test 1 1ms
   ✓ test 2 0ms
   ✓ test 3 0ms
   ✓ test 4 0ms
   ✓ test 5 0ms
 ✓ demo/th13-sau.test.js (5 tests) 2ms
   ✓ parseTime (5)
     ✓ converts 00:00 to 0 minutes 1ms
     ✓ converts 07:00 to 420 minutes 0ms
     ✓ converts 12:30 to 750 minutes 0ms
     ✓ converts 21:00 to 1260 minutes 0ms
     ✓ converts 23:59 to 1439 minutes 0ms

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Start at  00:21:56
   Duration  104ms (transform 51%, import 28%, worker 10%, tests 10%)`,
  '14-bien-bug': `$ npx vitest run demo/bien.test.js -t days ahead

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/bien.test.js (19 tests | 1 failed | 9 skipped) 6ms
   ❯ isWithinBookingWindow (BR-05: at most 14 days ahead) (10)
     ✓ -1 days ahead → false 1ms
     ✓ 0 days ahead → true 0ms
     ✓ 1 days ahead → true 0ms
     ✓ 13 days ahead → true 0ms
     × 14 days ahead → true 3ms
     ✓ 15 days ahead → false 0ms
     ✓ rejects a non-integer input: 1.5 0ms
     ✓ rejects a non-integer input: NaN 0ms
     ✓ rejects a non-integer input: 3 0ms
     ✓ rejects a non-integer input: null 0ms
   ↓ needsApproval — decision table (role × seats > 30) (9)
     ↓ STUDENT with 30 seats → false
     ↓ STUDENT with 31 seats → true
     ↓ LECTURER with 30 seats → false
     ↓ LECTURER with 31 seats → false
     ↓ ADMIN with 30 seats → false
     ↓ ADMIN with 31 seats → false
     ↓ throws RangeError for seats = 0
     ↓ throws RangeError for seats = -5
     ↓ throws RangeError for seats = 2.5

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/bien.test.js > isWithinBookingWindow (BR-05: at most 14 days ahead) > 14 days ahead → true
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ demo/bien.test.js:13:41
     11|     [15, false],   // upper boundary + 1
     12|   ])('%i days ahead → %s', (days, expected) => {
     13|     expect(isWithinBookingWindow(days)).toBe(expected);
       |                                         ^
     14|   });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 9 passed | 9 skipped (19)
   Start at  00:21:55
   Duration  116ms (transform 43%, import 31%, tests 19%, worker 7%)`,
  '14-bien': `$ npx vitest run demo/bien.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/bien.test.js (19 tests) 3ms
   ✓ isWithinBookingWindow (BR-05: at most 14 days ahead) (10)
     ✓ -1 days ahead → false 1ms
     ✓ 0 days ahead → true 0ms
     ✓ 1 days ahead → true 0ms
     ✓ 13 days ahead → true 0ms
     ✓ 14 days ahead → true 0ms
     ✓ 15 days ahead → false 0ms
     ✓ rejects a non-integer input: 1.5 0ms
     ✓ rejects a non-integer input: NaN 0ms
     ✓ rejects a non-integer input: 3 0ms
     ✓ rejects a non-integer input: null 0ms
   ✓ needsApproval — decision table (role × seats > 30) (9)
     ✓ STUDENT with 30 seats → false 0ms
     ✓ STUDENT with 31 seats → true 0ms
     ✓ LECTURER with 30 seats → false 0ms
     ✓ LECTURER with 31 seats → false 0ms
     ✓ ADMIN with 30 seats → false 0ms
     ✓ ADMIN with 31 seats → false 0ms
     ✓ throws RangeError for seats = 0 0ms
     ✓ throws RangeError for seats = -5 0ms
     ✓ throws RangeError for seats = 2.5 0ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  00:21:56
   Duration  91ms (import 45%, transform 26%, tests 18%, worker 11%)`,
  '14-prop-bug': `$ npx vitest run demo/thuoc-tinh.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/thuoc-tinh.test.js (1 test | 1 failed) 6ms
   × formatTime then parseTime gives back the same minute (0..1439) 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/thuoc-tinh.test.js > formatTime then parseTime gives back the same minute (0..1439)
Error: Property failed after 8 tests
{ seed: 981865028, path: "7:4", endOnFailure: true }
Counterexample: [390]
Shrunk 1 time(s)

Hint: Enable verbose mode in order to have the list of all failing values encountered during the run
 ❯ buildError node_modules/fast-check/lib/fast-check.js:2469:16
 ❯ throwIfFailed node_modules/fast-check/lib/fast-check.js:2476:8
 ❯ reportRunDetails node_modules/fast-check/lib/fast-check.js:2492:14
 ❯ Module.assert node_modules/fast-check/lib/fast-check.js:2662:7
 ❯ demo/thuoc-tinh.test.js:6:6
      4|
      5| it('formatTime then parseTime gives back the same minute (0..1439)', (…
      6|   fc.assert(
       |      ^
      7|     fc.property(fc.integer({ min: 0, max: 1439 }), (minutes) => {
      8|       return parseTime(formatTime(minutes)) === minutes;

Caused by: Error: Property failed by returning false
 ❯ Property.run node_modules/fast-check/lib/fast-check.js:1325:66
 ❯ propertyExecution node_modules/fast-check/lib/fast-check.js:2549:23
 ❯ run node_modules/fast-check/lib/fast-check.js:2639:91
 ❯ runIt node_modules/fast-check/lib/fast-check.js:2542:15
 ❯ check node_modules/fast-check/lib/fast-check.js:2655:14
 ❯ Module.assert node_modules/fast-check/lib/fast-check.js:2660:14
 ❯ demo/thuoc-tinh.test.js:6:6

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:21:57
   Duration  119ms (import 42%, transform 33%, tests 18%, worker 7%)`,
  '14-prop': `$ npx vitest run demo/thuoc-tinh.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/thuoc-tinh.test.js (1 test) 4ms
   ✓ formatTime then parseTime gives back the same minute (0..1439) 3ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  00:21:57
   Duration  111ms (import 46%, transform 37%, tests 10%, worker 7%)`,
  '14-th-bug': `$ npx vitest run demo/th14.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/th14.test.js (4 tests | 1 failed) 6ms
   ❯ checkSlot — length boundary (Lite-1: at most 240 minutes) (4)
     ✓ 08:00–08:30 1ms
     × 08:00–12:00 3ms
     ✓ 08:00–12:30 0ms
     ✓ 08:00–08:00 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/th14.test.js > checkSlot — length boundary (Lite-1: at most 240 minutes) > 08:00–12:00
AssertionError: expected { ok: false, code: 'TOO_LONG' } to deeply equal { ok: true, minutes: 240 }

- Expected
+ Received

  {
-   "minutes": 240,
-   "ok": true,
+   "code": "TOO_LONG",
+   "ok": false,
  }

 ❯ demo/th14.test.js:11:35
      9|     { start: '08:00', end: '08:00', expected: { ok: false, code: 'END_…
     10|   ])('$start–$end', ({ start, end, expected }) => {
     11|     expect(checkSlot(start, end)).toEqual(expected);
       |                                   ^
     12|   });
     13| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  00:21:58
   Duration  111ms (transform 46%, import 26%, tests 20%, worker 8%)`,
  '14-th-prop-bug': `$ npx vitest run demo/th14-prop.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo/th14-prop.test.js (1 test | 1 failed) 6ms
   × never accepts a slot longer than MAX_MINUTES 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo/th14-prop.test.js > never accepts a slot longer than MAX_MINUTES
Error: Property failed after 32 tests
{ seed: 285335653, path: "31", endOnFailure: true }
Counterexample: ["16:30","21:00"]
Shrunk 0 time(s)

Hint: Enable verbose mode in order to have the list of all failing values encountered during the run
 ❯ buildError node_modules/fast-check/lib/fast-check.js:2469:16
 ❯ throwIfFailed node_modules/fast-check/lib/fast-check.js:2476:8
 ❯ reportRunDetails node_modules/fast-check/lib/fast-check.js:2492:14
 ❯ Module.assert node_modules/fast-check/lib/fast-check.js:2662:7
 ❯ demo/th14-prop.test.js:10:6
      8|
      9| it('never accepts a slot longer than MAX_MINUTES', () => {
     10|   fc.assert(
       |      ^
     11|     fc.property(gridTime, gridTime, (start, end) => {
     12|       const result = checkSlot(start, end);

Caused by: Error: Property failed by returning false
 ❯ Property.run node_modules/fast-check/lib/fast-check.js:1325:66
 ❯ propertyExecution node_modules/fast-check/lib/fast-check.js:2549:23
 ❯ run node_modules/fast-check/lib/fast-check.js:2639:91
 ❯ runIt node_modules/fast-check/lib/fast-check.js:2542:15
 ❯ check node_modules/fast-check/lib/fast-check.js:2655:14
 ❯ Module.assert node_modules/fast-check/lib/fast-check.js:2660:14
 ❯ demo/th14-prop.test.js:10:6

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  00:38:14
   Duration  125ms (import 40%, transform 38%, tests 15%, worker 7%)`,
  '14-th-prop': `$ npx vitest run demo/th14-prop.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/th14-prop.test.js (1 test) 4ms
   ✓ never accepts a slot longer than MAX_MINUTES 3ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  00:38:13
   Duration  114ms (import 45%, transform 39%, tests 10%, worker 6%)`,
  '14-th': `$ npx vitest run demo/th14.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo/th14.test.js (4 tests) 2ms
   ✓ checkSlot — length boundary (Lite-1: at most 240 minutes) (4)
     ✓ 08:00–08:30 1ms
     ✓ 08:00–12:00 0ms
     ✓ 08:00–12:30 0ms
     ✓ 08:00–08:00 0ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  00:21:58
   Duration  101ms (transform 53%, import 30%, tests 9%, worker 8%)`,
  'lab-full': `$ npx vitest run src/

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/booking.test.js (28 tests) 5ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 0ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 0ms
 ✓ src/rules/time.test.js (12 tests) 6ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 0ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 3ms

 Test Files  2 passed (2)
      Tests  40 passed (40)
   Start at  00:42:32
   Duration  121ms (transform 44%, import 34%, tests 15%, worker 6%)`,
  'lab-mut-strong': `$ node scripts/dot-bien.mjs
✔ killed    #1 BR-05: 14 days ahead rejected
✔ killed    #2 BR-06: 30 seats needs approval
✔ killed    #3 slot ending at 21:00 rejected
✔ killed    #4 exactly 4 hours rejected
✔ killed    #5 zero-length slot accepted
✔ killed    #6 ADMIN needs approval
✔ killed    #7 "24:00" accepted
✔ killed    #8 formatTime rounds the hour

8/8 mutants killed`,
  'lab-mut-weak': `$ node scripts/dot-bien.mjs
✘ SURVIVED  #1 BR-05: 14 days ahead rejected
✘ SURVIVED  #2 BR-06: 30 seats needs approval
✘ SURVIVED  #3 slot ending at 21:00 rejected
✘ SURVIVED  #4 exactly 4 hours rejected
✘ SURVIVED  #5 zero-length slot accepted
✘ SURVIVED  #6 ADMIN needs approval
✘ SURVIVED  #7 "24:00" accepted
✔ killed    #8 formatTime rounds the hour

1/8 mutants killed`,
  'lab-req-prop': `$ npx vitest run src/rules/time.test.js -t round --config demo/vitest.strict.config.js

 RUN  v5.0.5 …/labflow-lite

 ❯ src/rules/time.test.js (12 tests | 1 failed | 11 skipped) 6ms
   ↓ parseTime (10)
     ↓ 00:00 → 0
     ↓ 07:00 → 420
     ↓ 21:30 → 1290
     ↓ 23:59 → 1439
     ↓ throws TypeError for "7:00"
     ↓ throws TypeError for "07-00"
     ↓ throws TypeError for ""
     ↓ throws TypeError for "abc"
     ↓ throws RangeError for 24:00
     ↓ throws RangeError for 07:60
   ❯ formatTime (2)
     ↓ pads to HH:MM
     × round-trips with parseTime for every minute of the day 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/rules/time.test.js > formatTime > round-trips with parseTime for every minute of the day
Error: expected any number of assertion, but got none
 ❯ src/rules/time.test.js:21:3
     19|     expect(formatTime(450)).toBe('07:30');
     20|   });
     21|   it('round-trips with parseTime for every minute of the day', () => {
       |   ^
     22|     fc.assert(fc.property(fc.integer({ min: 0, max: 1439 }), (m) => pa…
     23|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 11 skipped (12)
   Start at  00:42:31
   Duration  118ms (import 54%, tests 21%, transform 17%, worker 8%)`,
  'lab-weak-run': `$ npx vitest run src/

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/time.test.js (3 tests) 2ms
   ✓ parseTime (2)
     ✓ turns "07:00" into 420 minutes 1ms
     ✓ counts the minutes too: "21:30" is 1290 0ms
   ✓ formatTime (1)
     ✓ pads hours and minutes to two digits 0ms
 ✓ src/rules/booking.test.js (2 tests) 2ms
   ✓ checkSlot (2)
     ✓ accepts 08:00–10:00 1ms
     ✓ rejects 06:30–08:00 as OUTSIDE_HOURS 0ms

 Test Files  2 passed (2)
      Tests  5 passed (5)
   Start at  00:22:12
   Duration  113ms (transform 56%, import 25%, worker 10%, tests 8%)`,
};
