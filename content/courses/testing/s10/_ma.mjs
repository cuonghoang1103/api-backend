/**
 * _ma.mjs (Chương 10) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  waitlist: `// BR-09 — waitlist for a taken slot (Chapter 10, built test-first in lesson 10.1).
export const WAITLIST_MAX = 3;     // at most 3 students wait for one slot
export const OFFER_MINUTES = 30;   // a freed slot is held for the first in line for 30 minutes

const refuse = (code) => ({ ok: false, code });
const minutesLater = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000);

// queue: [{ userId }], oldest first. Never changes the queue it is given; returns a new one.
export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return refuse('IS_HOLDER');
  if (queue.some((w) => w.userId === userId)) return refuse('ALREADY_WAITING');
  if (queue.length >= WAITLIST_MAX) return refuse('WAITLIST_FULL');
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}

// The slot was freed at \`now\`: offer it to the first student in line.
export function offerNext(queue, now) {
  if (queue.length === 0) return { offer: null, queue: [] };
  const [first, ...rest] = queue;
  return { offer: { userId: first.userId, expiresAt: minutesLater(now, OFFER_MINUTES) }, queue: rest };
}

export function acceptOffer(offer, now) {
  return now < offer.expiresAt ? { ok: true } : refuse('OFFER_EXPIRED');
}`,
  waitlistTest: `import { describe, it, expect } from 'vitest';
import { joinWaitlist, offerNext, acceptOffer } from './waitlist.js';

const join = (queue, userId) => joinWaitlist(queue, { userId, holderId: 'binh' });
const line = (...ids) => ids.map((userId) => ({ userId }));

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(join([], 'an')).toEqual({ ok: true, position: 1, queue: line('an') });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(join(line('an'), 'chi')).toEqual({ ok: true, position: 2, queue: line('an', 'chi') });
  });
  it('refuses a student who is already waiting', () => {
    expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('refuses a fourth student: at most 3 wait for one slot', () => {
    expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });

  it('refuses the student who already holds the slot', () => {
    expect(joinWaitlist([], { userId: 'binh', holderId: 'binh' })).toEqual({ ok: false, code: 'IS_HOLDER' });
  });

  it('says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line', () => {
    expect(join(line('an', 'chi', 'dung'), 'chi')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('never changes the queue it was given', () => {
    const queue = line('an');
    join(queue, 'chi');
    expect(queue).toEqual(line('an'));
  });
});

describe('offerNext', () => {
  const freedAt = new Date('2026-11-16T10:00:00+07:00');

  it('offers the slot to the first student in line for 30 minutes', () => {
    expect(offerNext(line('an', 'chi'), freedAt)).toEqual({
      offer: { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') },
      queue: line('chi'),
    });
  });

  it('offers nothing when nobody is waiting', () => {
    expect(offerNext([], freedAt)).toEqual({ offer: null, queue: [] });
  });
});

describe('acceptOffer', () => {
  const offer = { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') };

  it('accepts at 10:29, one minute before the offer expires', () => {
    expect(acceptOffer(offer, new Date('2026-11-16T10:29:00+07:00'))).toEqual({ ok: true });
  });

  it('refuses at 10:30: the offer has expired', () => {
    expect(acceptOffer(offer, new Date('2026-11-16T10:30:00+07:00'))).toEqual({ ok: false, code: 'OFFER_EXPIRED' });
  });
});`,
  t1: `import { describe, it, expect } from 'vitest';
import { joinWaitlist } from './waitlist.js';

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(joinWaitlist([], { userId: 'an', holderId: 'binh' })).toEqual({
      ok: true, position: 1, queue: [{ userId: 'an' }],
    });
  });
});`,
  x1: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export function joinWaitlist(queue, { userId }) {
  return { ok: true, position: 1, queue: [{ userId }] }; // fake it: the simplest code that passes
}`,
  t2: `import { describe, it, expect } from 'vitest';
import { joinWaitlist } from './waitlist.js';

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(joinWaitlist([], { userId: 'an', holderId: 'binh' })).toEqual({
      ok: true, position: 1, queue: [{ userId: 'an' }],
    });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(joinWaitlist([{ userId: 'an' }], { userId: 'chi', holderId: 'binh' })).toEqual({
      ok: true, position: 2, queue: [{ userId: 'an' }, { userId: 'chi' }],
    });
  });
});`,
  x2: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export function joinWaitlist(queue, { userId }) {
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}`,
  t3: `import { describe, it, expect } from 'vitest';
import { joinWaitlist } from './waitlist.js';

const join = (queue, userId) => joinWaitlist(queue, { userId, holderId: 'binh' });
const line = (...ids) => ids.map((userId) => ({ userId }));

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(join([], 'an')).toEqual({ ok: true, position: 1, queue: line('an') });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(join(line('an'), 'chi')).toEqual({ ok: true, position: 2, queue: line('an', 'chi') });
  });

  it('refuses a student who is already waiting', () => {
    expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('refuses a fourth student: at most 3 wait for one slot', () => {
    expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });
});`,
  x3: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export const WAITLIST_MAX = 3;

export function joinWaitlist(queue, { userId }) {
  if (queue.some((w) => w.userId === userId)) return { ok: false, code: 'ALREADY_WAITING' };
  if (queue.length >= WAITLIST_MAX) return { ok: false, code: 'WAITLIST_FULL' };
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}`,
  t4: `import { describe, it, expect } from 'vitest';
import { joinWaitlist } from './waitlist.js';

const join = (queue, userId) => joinWaitlist(queue, { userId, holderId: 'binh' });
const line = (...ids) => ids.map((userId) => ({ userId }));

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(join([], 'an')).toEqual({ ok: true, position: 1, queue: line('an') });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(join(line('an'), 'chi')).toEqual({ ok: true, position: 2, queue: line('an', 'chi') });
  });

  it('refuses a student who is already waiting', () => {
    expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('refuses a fourth student: at most 3 wait for one slot', () => {
    expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });

  it('refuses the student who already holds the slot', () => {
    expect(joinWaitlist([], { userId: 'binh', holderId: 'binh' })).toEqual({ ok: false, code: 'IS_HOLDER' });
  });
});`,
  x4: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export const WAITLIST_MAX = 3;

export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return { ok: false, code: 'IS_HOLDER' };
  if (queue.some((w) => w.userId === userId)) return { ok: false, code: 'ALREADY_WAITING' };
  if (queue.length >= WAITLIST_MAX) return { ok: false, code: 'WAITLIST_FULL' };
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}`,
  t5: `import { describe, it, expect } from 'vitest';
import { joinWaitlist, offerNext } from './waitlist.js';

const join = (queue, userId) => joinWaitlist(queue, { userId, holderId: 'binh' });
const line = (...ids) => ids.map((userId) => ({ userId }));

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(join([], 'an')).toEqual({ ok: true, position: 1, queue: line('an') });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(join(line('an'), 'chi')).toEqual({ ok: true, position: 2, queue: line('an', 'chi') });
  });
  it('refuses a student who is already waiting', () => {
    expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('refuses a fourth student: at most 3 wait for one slot', () => {
    expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });

  it('refuses the student who already holds the slot', () => {
    expect(joinWaitlist([], { userId: 'binh', holderId: 'binh' })).toEqual({ ok: false, code: 'IS_HOLDER' });
  });
});

describe('offerNext', () => {
  const freedAt = new Date('2026-11-16T10:00:00+07:00');

  it('offers the slot to the first student in line for 30 minutes', () => {
    expect(offerNext(line('an', 'chi'), freedAt)).toEqual({
      offer: { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') },
      queue: line('chi'),
    });
  });

  it('offers nothing when nobody is waiting', () => {
    expect(offerNext([], freedAt)).toEqual({ offer: null, queue: [] });
  });
});`,
  x5: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export const WAITLIST_MAX = 3;
export const OFFER_MINUTES = 30;

export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return { ok: false, code: 'IS_HOLDER' };
  if (queue.some((w) => w.userId === userId)) return { ok: false, code: 'ALREADY_WAITING' };
  if (queue.length >= WAITLIST_MAX) return { ok: false, code: 'WAITLIST_FULL' };
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}

export function offerNext(queue, now) {
  if (queue.length === 0) return { offer: null, queue: [] };
  const expiresAt = new Date(now.getTime() + OFFER_MINUTES * 60 * 1000);
  return { offer: { userId: queue[0].userId, expiresAt }, queue: queue.slice(1) };
}`,
  t6: `import { describe, it, expect } from 'vitest';
import { joinWaitlist, offerNext, acceptOffer } from './waitlist.js';

const join = (queue, userId) => joinWaitlist(queue, { userId, holderId: 'binh' });
const line = (...ids) => ids.map((userId) => ({ userId }));

describe('joinWaitlist', () => {
  it('puts the first student at position 1', () => {
    expect(join([], 'an')).toEqual({ ok: true, position: 1, queue: line('an') });
  });

  it('puts the next student behind the ones already waiting', () => {
    expect(join(line('an'), 'chi')).toEqual({ ok: true, position: 2, queue: line('an', 'chi') });
  });
  it('refuses a student who is already waiting', () => {
    expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: 'ALREADY_WAITING' });
  });

  it('refuses a fourth student: at most 3 wait for one slot', () => {
    expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });

  it('refuses the student who already holds the slot', () => {
    expect(joinWaitlist([], { userId: 'binh', holderId: 'binh' })).toEqual({ ok: false, code: 'IS_HOLDER' });
  });
});

describe('offerNext', () => {
  const freedAt = new Date('2026-11-16T10:00:00+07:00');

  it('offers the slot to the first student in line for 30 minutes', () => {
    expect(offerNext(line('an', 'chi'), freedAt)).toEqual({
      offer: { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') },
      queue: line('chi'),
    });
  });

  it('offers nothing when nobody is waiting', () => {
    expect(offerNext([], freedAt)).toEqual({ offer: null, queue: [] });
  });
});

describe('acceptOffer', () => {
  const offer = { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+07:00') };

  it('accepts at 10:29, one minute before the offer expires', () => {
    expect(acceptOffer(offer, new Date('2026-11-16T10:29:00+07:00'))).toEqual({ ok: true });
  });

  it('refuses at 10:30: the offer has expired', () => {
    expect(acceptOffer(offer, new Date('2026-11-16T10:30:00+07:00'))).toEqual({ ok: false, code: 'OFFER_EXPIRED' });
  });
});`,
  x6: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export const WAITLIST_MAX = 3;
export const OFFER_MINUTES = 30;

export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return { ok: false, code: 'IS_HOLDER' };
  if (queue.some((w) => w.userId === userId)) return { ok: false, code: 'ALREADY_WAITING' };
  if (queue.length >= WAITLIST_MAX) return { ok: false, code: 'WAITLIST_FULL' };
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}

export function offerNext(queue, now) {
  if (queue.length === 0) return { offer: null, queue: [] };
  const expiresAt = new Date(now.getTime() + OFFER_MINUTES * 60 * 1000);
  return { offer: { userId: queue[0].userId, expiresAt }, queue: queue.slice(1) };
}

export function acceptOffer(offer, now) {
  if (now.getTime() >= offer.expiresAt.getTime()) return { ok: false, code: 'OFFER_EXPIRED' };
  return { ok: true };
}`,
  x0: `// BR-09 — waitlist for a taken slot. Built test-first in lesson 10.1; this folder is one step of it.
export function joinWaitlist(queue, request) {}`,
  x7: `// BR-09 — waitlist for a taken slot (Chapter 10, built test-first in lesson 10.1).
export const WAITLIST_MAX = 3;     // at most 3 students wait for one slot
export const OFFER_MINUTES = 30;   // a freed slot is held for the first in line for 30 minutes

const refuse = (code) => ({ ok: false, code });
const minutesLater = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000);

// queue: [{ userId }], oldest first. Never changes the queue it is given; returns a new one.
export function joinWaitlist(queue, { userId, holderId }) {
  if (userId === holderId) return refuse('IS_HOLDER');
  if (queue.some((w) => w.userId === userId)) return refuse('ALREADY_WAITING');
  if (queue.length >= WAITLIST_MAX) return refuse('WAITLIST_FULL');
  const next = [...queue, { userId }];
  return { ok: true, position: next.length, queue: next };
}

// The slot was freed at \`now\`: offer it to the first student in line.
export function offerNext(queue, now) {
  if (queue.length === 0) return { offer: null, queue: [] };
  const [first, ...rest] = queue;
  return { offer: { userId: first.userId, expiresAt: minutesLater(now, OFFER_MINUTES) }, queue: rest };
}

export function acceptOffer(offer, now) {
  return now < offer.expiresAt ? { ok: true } : refuse('OFFER_EXPIRED');
}`,
  cancelSvc: `// Cancel a booking and offer the freed slot to the first student waiting for it (BR-09, lesson 10.1).
import { BookingError } from './service.js';
import { offerNext, OFFER_MINUTES } from '../rules/waitlist.js';

export const slotKey = (b) => b.lab + ' ' + b.date + ' ' + b.start + '-' + b.end;

// waitlists: a Map from slotKey to a queue [{ userId }]; userId is the student's e-mail address.
export async function cancelBooking({ repo, waitlists, mailer, now = () => new Date() }, id) {
  const booking = await repo.remove(id);
  if (!booking) throw new BookingError('NOT_FOUND');
  const key = slotKey(booking);
  const { offer, queue } = offerNext(waitlists.get(key) ?? [], now());
  waitlists.set(key, queue);
  if (offer) {
    await mailer.send({ to: offer.userId, subject: 'A seat is free: ' + key + ' (answer within ' + OFFER_MINUTES + ' minutes)' });
  }
  return { cancelled: booking.id, offeredTo: offer ? offer.userId : null };
}`,
  classicist: `// Classicist style (lesson 10.1): real repo and real waitlist Map; only the e-mail provider is replaced, by a fake.
import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from './service.js';
import { cancelBooking } from './waitlistService.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';
const now = () => new Date('2026-11-16T07:00:00+07:00');

async function setup(queue = []) {
  const deps = { repo: createMemoryRepo(), waitlists: new Map([[KEY, queue]]), mailer: createFakeMailer(), now };
  const booking = await bookLab(deps.repo, input);
  return { deps, booking };
}

describe('cancelBooking', () => {
  it('deletes the booking and offers the slot to the first student waiting', async () => {
    const { deps, booking } = await setup([{ userId: 'an@labflow.example' }, { userId: 'chi@labflow.example' }]);

    const result = await cancelBooking(deps, booking.id);

    expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@labflow.example' });
    expect(await deps.repo.findById(booking.id)).toBeNull();
    expect(deps.waitlists.get(KEY)).toEqual([{ userId: 'chi@labflow.example' }]);
    expect(deps.mailer.outbox).toEqual([
      { to: 'an@labflow.example', subject: 'A seat is free: ' + KEY + ' (answer within 30 minutes)' },
    ]);
  });

  it('sends no e-mail when nobody is waiting', async () => {
    const { deps, booking } = await setup();
    await expect(cancelBooking(deps, booking.id)).resolves.toEqual({ cancelled: booking.id, offeredTo: null });
    expect(deps.mailer.outbox).toEqual([]);
  });

  it('refuses an unknown booking with NOT_FOUND', async () => {
    const { deps } = await setup([{ userId: 'an@labflow.example' }]);
    await expect(cancelBooking(deps, 99)).rejects.toMatchObject({ name: 'BookingError', code: 'NOT_FOUND' });
    expect(deps.mailer.outbox).toEqual([]);
  });
});`,
  mockistV1: `// Mockist style, written against the FIRST version of cancelBooking (findById, then remove). Lesson 10.1.
import { describe, it, expect, vi } from 'vitest';
import { cancelBooking } from '../../src/booking/waitlistService.js';

const booking = { id: 7, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';

describe('cancelBooking (mockist)', () => {
  it('removes the booking, updates the waitlist and mails the first student', async () => {
    const repo = { findById: vi.fn().mockResolvedValue(booking), remove: vi.fn().mockResolvedValue(undefined) };
    const waitlists = { get: vi.fn().mockReturnValue([{ userId: 'an@labflow.example' }]), set: vi.fn() };
    const mailer = { send: vi.fn().mockResolvedValue('msg-1') };

    await cancelBooking({ repo, waitlists, mailer, now: () => new Date('2026-11-16T07:00:00+07:00') }, 7);

    expect(repo.findById).toHaveBeenCalledWith(7);
    expect(repo.remove).toHaveBeenCalledWith(7);
    expect(waitlists.set).toHaveBeenCalledWith(KEY, []);
    expect(mailer.send).toHaveBeenCalledTimes(1);
  });
});`,
  mockist: `// Mockist style, rewritten for the current cancelBooking (remove returns the removed row). Lesson 10.1.
import { describe, it, expect, vi } from 'vitest';
import { cancelBooking } from '../../src/booking/waitlistService.js';

const booking = { id: 7, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';

describe('cancelBooking (mockist)', () => {
  it('removes the booking, updates the waitlist and mails the first student', async () => {
    const repo = { remove: vi.fn().mockResolvedValue(booking) };
    const waitlists = { get: vi.fn().mockReturnValue([{ userId: 'an@labflow.example' }]), set: vi.fn() };
    const mailer = { send: vi.fn().mockResolvedValue('msg-1') };

    const result = await cancelBooking({ repo, waitlists, mailer, now: () => new Date('2026-11-16T07:00:00+07:00') }, 7);

    expect(repo.remove).toHaveBeenCalledWith(7);
    expect(waitlists.set).toHaveBeenCalledWith(KEY, []);
    expect(mailer.send).toHaveBeenCalledWith({ to: 'an@labflow.example', subject: 'A seat is free: ' + KEY + ' (answer within 30 minutes)' });
    expect(result).toEqual({ cancelled: 7, offeredTo: 'an@labflow.example' });
  });
});`,
  service: `import { checkSlot, needsApproval } from '../rules/booking.js';

export class BookingError extends Error {
  constructor(code, options) {
    super(code, options);
    this.name = 'BookingError';
    this.code = code;
  }
}

// An in-memory "database" whose methods are async, like a real one.
export function createMemoryRepo() {
  const rows = [];
  const latency = () => new Promise((resolve) => setTimeout(resolve, 5));
  return {
    async findOverlap(lab, date, start, end) {
      await latency();
      return rows.find((b) => b.lab === lab && b.date === date && b.start < end && start < b.end) ?? null;
    },
    async insert(booking) {
      await latency();
      const row = { id: rows.length + 1, ...booking };
      rows.push(row);
      return row;
    },
    async findById(id) {
      await latency();
      return rows.find((b) => b.id === id) ?? null;
    },
    async list() {
      await latency();
      return [...rows];
    },
    async remove(id) { // Chapter 10: cancelling deletes the row and returns it (null if there was none)
      await latency();
      const i = rows.findIndex((b) => b.id === id);
      return i === -1 ? null : rows.splice(i, 1)[0];
    },
    count: () => rows.length,
  };
}

export async function bookLab(repo, input) {
  const slot = checkSlot(input.start, input.end);
  if (!slot.ok) throw new BookingError(slot.code);
  let clash;
  try {
    clash = await repo.findOverlap(input.lab, input.date, input.start, input.end);
  } catch (err) {
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
  if (clash) throw new BookingError('OVERLAP');
  const status = needsApproval(input) ? 'PENDING' : 'CONFIRMED';
  try {
    return await repo.insert({ ...input, minutes: slot.minutes, status });
  } catch (err) {
    if (err instanceof BookingError) throw err; // Chapter 4: the database itself can say OVERLAP
    throw new BookingError('STORAGE_DOWN', { cause: err });
  }
}`,
  legacyV0: `// LabFlow v0 (2019) — monthly usage report for the faculty office.
// DO NOT CHANGE THE OUTPUT: the office pastes this text into its Excel sheet every month.
// No tests. The person who wrote it has left.
import { db } from './db.js';

export async function monthlyReport(lab) {
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var mm = m < 10 ? '0' + m : '' + m;
  var rows = await db.all('SELECT * FROM bookings');
  var hol = [];
  try {
    var r = await fetch('https://holidays.labflow.example/api/vn/' + y);
    hol = await r.json();
  } catch (e) {
    // no network: no holidays
  }
  var txt = 'LAB ' + lab + ' - ' + y + '/' + mm + '\\n';
  var n = 0, mins = 0, big = 0, wk = 0;
  for (var i = 0; i < rows.length; i++) {
    var b = rows[i];
    if (b.lab == lab && b.date.substr(0, 7) == y + '-' + mm && b.status != 'CANCELLED') {
      n++;
      var t = (parseInt(b.end.substr(0, 2)) * 60 + parseInt(b.end.substr(3, 2))) - (parseInt(b.start.substr(0, 2)) * 60 + parseInt(b.start.substr(3, 2)));
      mins = mins + t;
      if (b.seats > 30) big++;
      var day = new Date(b.date).getDay();
      if (day == 0 || day == 6 || hol.indexOf(b.date) != -1) wk++;
      txt += b.date + ' ' + b.start + '-' + b.end + ' ' + b.seats + ' seats' + (b.status == 'PENDING' ? ' (pending)' : '') + '\\n';
    }
  }
  if (n == 0) {
    txt += 'No bookings.\\n';
  } else {
    txt += 'Bookings: ' + n + '\\n';
    txt += 'Hours: ' + Math.round(mins / 60 * 10) / 10 + '\\n';
    txt += 'Large (>30 seats): ' + big + '\\n';
    txt += 'Weekend/holiday: ' + wk + '\\n';
  }
  return txt;
}`,
  legacyDb: `// LabFlow v0 — one global database connection for the whole app (2019). Lesson 10.2: the first dependency to break.
import pg from 'pg';

const url = process.env.LEGACY_DATABASE_URL ?? 'postgres://labflow:labflow@127.0.0.1:54399/labflow_v0';

export const db = {
  async all(sql) {
    const client = new pg.Client(url);
    await client.connect();
    try {
      return (await client.query(sql)).rows;
    } finally {
      await client.end();
    }
  },
};`,
  dt1: `// Lesson 10.2, step 1: just call the legacy function. (Red on purpose: it needs a database, the network and today's date.)
import { it, expect } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';

it('prints the report of BE-201', async () => {
  expect(await monthlyReport('BE-201')).toBe('?');
});`,
  dt2: `// Lesson 10.2, step 2: link seams — replace the three dependencies WITHOUT editing the legacy file,
// then expect something obviously wrong and let the failure print what the code really does. (Red on purpose.)
import { it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';

vi.mock('../legacy/db.js', () => ({ db: { all: async () => [
  { lab: 'BE-201', date: '2026-10-05', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-12', start: '13:30', end: '15:00', seats: 25, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-19', start: '09:00', end: '11:00', seats: 18, status: 'CONFIRMED' },
] } }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });                              // seam 2: the clock
  vi.setSystemTime(new Date('2026-10-31T12:00:00+07:00'));
  vi.stubGlobal('fetch', async () => ({ json: async () => [] }));       // seam 3: the network
  return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
});

it('prints the report of BE-201', async () => {
  expect(await monthlyReport('BE-201')).toBe('');
});`,
  dt3: `// Lesson 10.2, step 3: the output printed by step 2, pasted in as the expected value. It pins what the code DOES today.
import { it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';

vi.mock('../legacy/db.js', () => ({ db: { all: async () => [
  { lab: 'BE-201', date: '2026-10-05', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-12', start: '13:30', end: '15:00', seats: 25, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-19', start: '09:00', end: '11:00', seats: 18, status: 'CONFIRMED' },
] } }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });                              // seam 2: the clock
  vi.setSystemTime(new Date('2026-10-31T12:00:00+07:00'));
  vi.stubGlobal('fetch', async () => ({ json: async () => [] }));       // seam 3: the network
  return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
});

it('prints the report of BE-201', async () => {
  expect(await monthlyReport('BE-201')).toBe(
    'LAB BE-201 - 2026/10\\n' +
    '2026-10-05 08:00-10:00 20 seats\\n' +
    '2026-10-12 13:30-15:00 25 seats\\n' +
    '2026-10-19 09:00-11:00 18 seats\\n' +
    'Bookings: 3\\nHours: 5.5\\nLarge (>30 seats): 0\\nWeekend/holiday: 0\\n',
  );
});`,
  dt4: `// Lesson 10.2, step 4: a golden master. Many inputs chosen to reach every branch, the whole output kept in one
// approved file. Same link seams as step 3; the legacy file is still untouched.
import { it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';
import { ROWS, HOLIDAYS } from './rows.js';

vi.mock('../legacy/db.js', () => ({ db: { all: async () => ROWS } }));

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.stubGlobal('fetch', async () => ({ json: async () => HOLIDAYS }));
  return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
});

it('prints the same reports as before, for every lab and month we keep', async () => {
  let all = '';
  for (const today of ['2026-09-30T12:00:00+07:00', '2026-10-31T12:00:00+07:00', '2026-11-15T12:00:00+07:00']) {
    vi.setSystemTime(new Date(today));
    for (const lab of ['BE-201', 'BE-305']) all += await monthlyReport(lab) + '----\\n';
  }
  await expect(all).toMatchFileSnapshot('./__approved__/monthly-report.txt');
});`,
  rows: `// Test data for the characterization tests of lesson 10.2: every branch of monthlyReport, on purpose.
export const ROWS = [
  { lab: 'BE-201', date: '2026-10-06', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED' },
  { lab: 'BE-201', date: '2026-10-03', start: '13:30', end: '15:00', seats: 30, status: 'CONFIRMED' }, // Saturday · exactly 30 seats
  { lab: 'BE-201', date: '2026-10-04', start: '09:00', end: '11:30', seats: 31, status: 'PENDING' },   // Sunday · 31 seats
  { lab: 'BE-201', date: '2026-10-07', start: '07:00', end: '08:00', seats: 12, status: 'CANCELLED' },
  { lab: 'BE-305', date: '2026-10-06', start: '10:00', end: '12:30', seats: 40, status: 'CONFIRMED' }, // another lab
  { lab: 'BE-201', date: '2026-09-30', start: '14:00', end: '16:00', seats: 25, status: 'CONFIRMED' }, // another month
  { lab: 'BE-201', date: '2026-09-01', start: '08:00', end: '09:00', seats: 10, status: 'CONFIRMED' }, // first holiday of the list
  { lab: 'BE-201', date: '2026-09-02', start: '08:00', end: '12:00', seats: 35, status: 'CONFIRMED' }, // second holiday
  { lab: 'BE-201', date: '2026-10-20', start: '18:00', end: '21:00', seats: 28, status: 'CONFIRMED' },
];
export const HOLIDAYS = ['2026-09-01', '2026-09-02'];`,
  dotBienDacTa: `// Lesson 10.2: are the characterization tests strong enough to refactor under? Plant 10 real changes in the
// LEGACY file, one at a time, and count how many turn the given test file red.
// node demo10/dac-ta/dot-bien-dac-ta.mjs <test file>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEST = process.argv[2];
const FILE = 'demo10/legacy/monthlyReport.v0.js';
const MUTANTS = [
  ['b.seats > 30', 'b.seats >= 30', 'a 30-seat booking counts as large'],
  ["b.status != 'CANCELLED'", "b.status == 'CONFIRMED'", 'pending bookings disappear from the report'],
  ['day == 0 || day == 6', 'day == 6', 'Sunday is no longer a weekend'],
  ['hol.indexOf(b.date) != -1', 'hol.indexOf(b.date) > 0', 'the first holiday of the year is ignored'],
  ['Math.round(mins / 60 * 10) / 10', 'Math.round(mins / 60)', 'hours rounded to whole hours'],
  ["(b.status == 'PENDING' ? ' (pending)' : '')", "''", 'the (pending) mark is lost'],
  ['var m = d.getMonth() + 1;', 'var m = d.getMonth();', 'the report shows last month'],
  ["txt += 'No bookings.\\\\n';", "txt += 'No bookings this month.\\\\n';", 'the empty-month line changes (the office Excel import breaks)'],
  ['b.lab == lab && ', '', 'every lab is counted in every report'],
  ['mins = mins + t;', 'mins = t;', 'only the last booking counts toward the hours'],
];
let killed = 0;
const original = readFileSync(FILE, 'utf8');
for (const [i, [from, to, label]] of MUTANTS.entries()) {
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once');
  writeFileSync(FILE, original.replace(from, to));
  try {
    const dead = spawnSync('npx', ['vitest', 'run', TEST], { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(FILE, original);
  }
}
console.log('\\n' + killed + '/' + MUTANTS.length + ' changes caught by ' + TEST);
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
  v1Seams: `// LabFlow v0 (2019) — monthly usage report for the faculty office.
// DO NOT CHANGE THE OUTPUT: the office pastes this text into its Excel sheet every month.
// No tests. The person who wrote it has left.
// Lesson 10.2, step 5: three seams added (deps), nothing else changed. Production callers pass no deps.
import { db } from './db.js';

export async function monthlyReport(lab, deps = {}) {
  var d = deps.now ? deps.now() : new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var mm = m < 10 ? '0' + m : '' + m;
  var rows = await (deps.database || db).all('SELECT * FROM bookings');
  var hol = [];
  try {
    var r = await (deps.fetch || fetch)('https://holidays.labflow.example/api/vn/' + y);
    hol = await r.json();
  } catch (e) {
    // no network: no holidays
  }
  var txt = 'LAB ' + lab + ' - ' + y + '/' + mm + '\\n';
  var n = 0, mins = 0, big = 0, wk = 0;
  for (var i = 0; i < rows.length; i++) {
    var b = rows[i];
    if (b.lab == lab && b.date.substr(0, 7) == y + '-' + mm && b.status != 'CANCELLED') {
      n++;
      var t = (parseInt(b.end.substr(0, 2)) * 60 + parseInt(b.end.substr(3, 2))) - (parseInt(b.start.substr(0, 2)) * 60 + parseInt(b.start.substr(3, 2)));
      mins = mins + t;
      if (b.seats > 30) big++;
      var day = new Date(b.date).getDay();
      if (day == 0 || day == 6 || hol.indexOf(b.date) != -1) wk++;
      txt += b.date + ' ' + b.start + '-' + b.end + ' ' + b.seats + ' seats' + (b.status == 'PENDING' ? ' (pending)' : '') + '\\n';
    }
  }
  if (n == 0) {
    txt += 'No bookings.\\n';
  } else {
    txt += 'Bookings: ' + n + '\\n';
    txt += 'Hours: ' + Math.round(mins / 60 * 10) / 10 + '\\n';
    txt += 'Large (>30 seats): ' + big + '\\n';
    txt += 'Weekend/holiday: ' + wk + '\\n';
  }
  return txt;
}`,
  v2: `// LabFlow v0 entry point, kept for its callers. Lesson 10.2, step 6: seams as named options, logic moved to src/report/monthly.js.
import { db } from './db.js';
import { buildMonthlyReport } from '../report/monthly.js';

const HOLIDAY_API = 'https://holidays.labflow.example/api/vn/';

async function loadHolidays(fetchFn, year) {
  try {
    return await (await fetchFn(HOLIDAY_API + year)).json();
  } catch {
    return []; // as in v0: no network, no holidays
  }
}

export async function monthlyReport(lab, { database = db, fetch: fetchFn = globalThis.fetch, now = () => new Date() } = {}) {
  const today = now();
  const month = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  const rows = await database.all('SELECT * FROM bookings');
  const holidays = await loadHolidays(fetchFn, today.getFullYear());
  return buildMonthlyReport({ lab, month, rows, holidays });
}`,
  monthly: `// Monthly usage report for the faculty office — refactored from LabFlow v0 in lesson 10.2, under characterization tests.
// The TEXT must stay exactly what v0 printed: the office pastes it into Excel. Pure: no database, no network, no clock.
import { parseTime } from '../rules/time.js';

export const LARGE_SEATS = 30;

const isWeekend = (iso) => [0, 6].includes(new Date(iso + 'T00:00:00Z').getUTCDay());
const hours = (minutes) => Math.round((minutes / 60) * 10) / 10; // v0 prints "9", not "9.0" — keep it

// rows: every booking; month: "YYYY-MM"; holidays: ["YYYY-MM-DD", …]
export function buildMonthlyReport({ lab, month, rows, holidays }) {
  const kept = rows.filter((b) => b.lab === lab && b.date.startsWith(month) && b.status !== 'CANCELLED');
  const head = 'LAB ' + lab + ' - ' + month.replace('-', '/') + '\\n';
  if (kept.length === 0) return head + 'No bookings.\\n';
  const lines = kept.map((b) => b.date + ' ' + b.start + '-' + b.end + ' ' + b.seats + ' seats' + (b.status === 'PENDING' ? ' (pending)' : '') + '\\n');
  const minutes = kept.reduce((sum, b) => sum + parseTime(b.end) - parseTime(b.start), 0);
  const large = kept.filter((b) => b.seats > LARGE_SEATS).length;
  const offDays = kept.filter((b) => isWeekend(b.date) || holidays.includes(b.date)).length;
  return head + lines.join('') +
    'Bookings: ' + kept.length + '\\n' +
    'Hours: ' + hours(minutes) + '\\n' +
    'Large (>30 seats): ' + large + '\\n' +
    'Weekend/holiday: ' + offDays + '\\n';
}`,
  mrTest: `// Characterization tests of the monthly report (lesson 10.2). They pin what v0 printed — bugs and all — so that the
// code can be refactored under them. The approved file was written by v0 and has not changed since.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { monthlyReport } from './monthlyReport.js';
import { ROWS, HOLIDAYS } from '../../test/support/report-rows.js';

vi.mock('./db.js', () => ({ db: { all: async () => ROWS } })); // link seam: works for v0 and for every later version

describe('monthlyReport (characterization)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.stubGlobal('fetch', async () => ({ json: async () => HOLIDAYS }));
    return () => { vi.useRealTimers(); vi.unstubAllGlobals(); };
  });

  it('prints the same reports as v0, for every lab and month we keep', async () => {
    let all = '';
    for (const today of ['2026-09-30T12:00:00+07:00', '2026-10-31T12:00:00+07:00', '2026-11-15T12:00:00+07:00']) {
      vi.setSystemTime(new Date(today));
      for (const lab of ['BE-201', 'BE-305']) all += await monthlyReport(lab) + '----\\n';
    }
    await expect(all).toMatchFileSnapshot('./__approved__/monthly-report.txt');
  });

  it('counts no holiday when the holiday service cannot be reached, as v0 did', async () => {
    vi.setSystemTime(new Date('2026-09-30T12:00:00+07:00'));
    vi.stubGlobal('fetch', async () => { throw new TypeError('fetch failed'); });
    expect(await monthlyReport('BE-201')).toContain('Weekend/holiday: 0\\n');
  });
});`,
  monthlyTest: `// The pure core of the monthly report (lesson 10.2): no seams needed, no fake clock, any time zone.
import { describe, it, expect } from 'vitest';
import { buildMonthlyReport } from './monthly.js';
import { monthlyReport } from '../legacy/monthlyReport.js';
import { ROWS, HOLIDAYS } from '../../test/support/report-rows.js';

describe('buildMonthlyReport', () => {
  it('prints one line per kept booking and the four totals', () => {
    expect(buildMonthlyReport({ lab: 'BE-305', month: '2026-10', rows: ROWS, holidays: [] })).toBe(
      'LAB BE-305 - 2026/10\\n2026-10-06 10:00-12:30 40 seats\\nBookings: 1\\nHours: 2.5\\nLarge (>30 seats): 1\\nWeekend/holiday: 0\\n',
    );
  });

  it('counts Saturday and Sunday by the calendar date, whatever the time zone of the machine', () => {
    const rows = [{ lab: 'L', date: '2026-10-03', start: '08:00', end: '09:00', seats: 1, status: 'CONFIRMED' }];
    expect(buildMonthlyReport({ lab: 'L', month: '2026-10', rows, holidays: [] })).toContain('Weekend/holiday: 1\\n');
  });
});

describe('monthlyReport with injected dependencies (object seams)', () => {
  it('reads the bookings, the holidays and today from what it is given', async () => {
    const report = await monthlyReport('BE-201', {
      database: { all: async () => ROWS },
      fetch: async () => ({ json: async () => HOLIDAYS }),
      now: () => new Date('2026-09-30T12:00:00+07:00'),
    });
    expect(report).toContain('Weekend/holiday: 2\\n');
  });
});`,
  pr57: `// Pull request #57 "Add tests for the waitlist", AS SUBMITTED — lesson 10.3 reviews it. Every test here has a smell.
import { describe, it, expect, vi } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';
import { cancelBooking } from '../../src/booking/waitlistService.js';
import { joinWaitlist } from '../../src/rules/waitlist.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';

describe('waitlist', () => {
  it('should send mail', async () => {
    const mailer = { send: vi.fn().mockResolvedValue('msg-1') };
    await mailer.send({ to: 'an@labflow.example', subject: 'A seat is free' });
    expect(mailer.send).toHaveBeenCalled();
  });

  it('should work', async () => {
    const repo = createMemoryRepo();
    const booking = await bookLab(repo, input);
    const waitlists = new Map([[KEY, [{ userId: 'an@labflow.example' }, { userId: 'chi@labflow.example' }]]]);
    const mailer = createFakeMailer();
    const result = await cancelBooking({ repo, waitlists, mailer }, booking.id);
    expect({ booking, result, waitlists: [...waitlists], outbox: mailer.outbox }).toMatchSnapshot();
  });

  it('should return correct value', { retry: 3 }, () => {
    const student = () => 'student' + Math.floor(Math.random() * 10) + '@labflow.example';
    let queue = [];
    for (let i = 0; i < 3; i++) queue = joinWaitlist(queue, { userId: student(), holderId: 'binh@labflow.example' }).queue;
    expect(queue.length).toBe(3);
  });

  it('should handle edge case', async () => {
    const repo = createMemoryRepo();
    const booking = await bookLab(repo, input);
    const waitlists = new Map();
    const set = vi.spyOn(waitlists, 'set');
    const mailer = createFakeMailer();
    await cancelBooking({ repo, waitlists, mailer }, booking.id);
    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith(KEY, []);
    expect(mailer.outbox.length).toBe(0);
  });
});`,
  pr57Sau: `// Pull request #57 AFTER review (lesson 10.3): every test names a behaviour, controls its data and checks only what a
// user of the code can see.
import { describe, it, expect } from 'vitest';
import { bookLab, createMemoryRepo } from '../../src/booking/service.js';
import { cancelBooking } from '../../src/booking/waitlistService.js';
import { joinWaitlist } from '../../src/rules/waitlist.js';
import { createFakeMailer } from '../../test/support/fakes.js';

const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
const KEY = 'BE-201 2026-11-16 08:00-10:00';
const now = () => new Date('2026-11-16T07:00:00+07:00');
const line = (...names) => names.map((n) => ({ userId: n + '@labflow.example' }));

async function cancelWith(waitlists) {
  const repo = createMemoryRepo();
  const mailer = createFakeMailer();
  const booking = await bookLab(repo, input);
  const result = await cancelBooking({ repo, waitlists, mailer, now }, booking.id);
  return { result, outbox: mailer.outbox, booking };
}

describe('cancelBooking and the waitlist', () => {
  it('offers the freed slot by e-mail to the student who has waited longest', async () => {
    const waitlists = new Map([[KEY, line('an', 'chi')]]);
    const { result, outbox, booking } = await cancelWith(waitlists);

    expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@labflow.example' });
    expect(outbox).toEqual([{ to: 'an@labflow.example', subject: 'A seat is free: ' + KEY + ' (answer within 30 minutes)' }]);
    expect(waitlists.get(KEY)).toEqual(line('chi'));
  });

  it('sends no e-mail and leaves nobody waiting when the line was empty', async () => {
    const waitlists = new Map();
    const { result, outbox } = await cancelWith(waitlists);

    expect(result.offeredTo).toBeNull();
    expect(outbox).toEqual([]);
    expect(waitlists.get(KEY) ?? []).toEqual([]);
  });
});

describe('joinWaitlist', () => {
  it('lets three different students wait and refuses a fourth with WAITLIST_FULL', () => {
    let queue = [];
    for (const name of ['an', 'chi', 'dung']) queue = joinWaitlist(queue, { userId: name + '@labflow.example', holderId: 'binh@labflow.example' }).queue;
    expect(queue).toEqual(line('an', 'chi', 'dung'));
    expect(joinWaitlist(queue, { userId: 'em@labflow.example', holderId: 'binh@labflow.example' })).toEqual({ ok: false, code: 'WAITLIST_FULL' });
  });
});`,
  soSanh: `// Lesson 10.3: the same five changes against the test file as submitted and as reviewed.
// A bug should turn a file red; a harmless refactor should leave it green.
// node demo10/review/so-sanh.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const FILES = ['demo10/review/pr57.test.js', 'demo10/review/pr57-sau-review.test.js'];
const CHANGES = [
  ['bug', 'src/booking/waitlistService.js', 'if (offer) {', 'if (false) {', 'nobody is e-mailed'],
  ['bug', 'src/rules/waitlist.js', 'const [first, ...rest] = queue;', 'const [first, ...rest] = [...queue].reverse();', 'the slot goes to the last in line'],
  ['bug', 'src/rules/waitlist.js', 'queue.length >= WAITLIST_MAX', 'queue.length > WAITLIST_MAX', 'a fourth student can wait'],
  ['harmless', 'src/booking/service.js', 'repo.insert({ ...input, minutes: slot.minutes, status })', "repo.insert({ ...input, minutes: slot.minutes, status, source: 'web' })", 'bookings also store where they came from'],
  ['harmless', 'src/booking/waitlistService.js', 'waitlists.set(key, queue);', 'if (offer) waitlists.set(key, queue);', 'the waitlist Map is written only when it changed'],
];
const red = (file) => spawnSync('npx', ['vitest', 'run', file], { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;
const score = FILES.map(() => 0);
for (const [kind, file, from, to, label] of CHANGES) {
  const original = readFileSync(file, 'utf8');
  if (original.split(from).length !== 2) throw new Error('"' + from + '" must appear exactly once in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const cells = FILES.map((f, i) => {
      const r = red(f);
      const right = kind === 'bug' ? r : !r;
      if (right) score[i]++;
      return (r ? 'red  ' : 'green') + (right ? ' ✔' : ' ✘');
    });
    console.log(kind.padEnd(8) + ' ' + label.padEnd(48) + ' submitted: ' + cells[0] + '   reviewed: ' + cells[1]);
  } finally {
    writeFileSync(file, original);
  }
}
console.log('\\nright answers — submitted: ' + score[0] + '/' + CHANGES.length + ', reviewed: ' + score[1] + '/' + CHANGES.length);`,
  pr57Snap: `// Vitest Snapshot v1, https://vitest.dev/guide/snapshot.html

exports[\`waitlist > should work 1\`] = \`
{
  "booking": {
    "date": "2026-11-16",
    "end": "10:00",
    "id": 1,
    "lab": "BE-201",
    "minutes": 120,
    "role": "STUDENT",
    "seats": 20,
    "start": "08:00",
    "status": "CONFIRMED",
  },
  "outbox": [
    {
      "subject": "A seat is free: BE-201 2026-11-16 08:00-10:00 (answer within 30 minutes)",
      "to": "an@labflow.example",
    },
  ],
  "result": {
    "cancelled": 1,
    "offeredTo": "an@labflow.example",
  },
  "waitlists": [
    [
      "BE-201 2026-11-16 08:00-10:00",
      [
        {
          "userId": "chi@labflow.example",
        },
      ],
    ],
  ],
}
\`;`,
  busy: `// Live-coding exercise of lesson 10.4: the busy blocks of one lab on one day.
// ranges: [{ start: "HH:MM", end: "HH:MM" }] in any order. Returns merged blocks, sorted; touching blocks merge.
import { parseTime, formatTime } from './time.js';

export function mergeBusy(ranges) {
  const sorted = ranges.map((r) => [parseTime(r.start), parseTime(r.end)]).sort((a, b) => a[0] - b[0]);
  const blocks = [];
  for (const [start, end] of sorted) {
    const last = blocks[blocks.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else blocks.push([start, end]);
  }
  return blocks.map(([start, end]) => ({ start: formatTime(start), end: formatTime(end) }));
}`,
  busyTest: `// Model answer of the 20-minute live-coding exercise (lesson 10.4).
import { describe, it, expect } from 'vitest';
import { mergeBusy } from './busy.js';

const r = (start, end) => ({ start, end });

describe('mergeBusy', () => {
  it('returns no blocks for a day without bookings', () => {
    expect(mergeBusy([])).toEqual([]);
  });

  it('keeps separate bookings apart, sorted by start', () => {
    expect(mergeBusy([r('13:00', '14:00'), r('08:00', '09:00')])).toEqual([r('08:00', '09:00'), r('13:00', '14:00')]);
  });

  it.each([
    ['overlapping', [r('08:00', '10:00'), r('09:00', '11:00')], [r('08:00', '11:00')]],
    ['touching (10:00 ends, 10:00 starts)', [r('08:00', '10:00'), r('10:00', '11:00')], [r('08:00', '11:00')]],
    ['one inside the other', [r('08:00', '12:00'), r('09:00', '10:00')], [r('08:00', '12:00')]],
    ['inside, listed first', [r('09:00', '10:00'), r('08:00', '12:00')], [r('08:00', '12:00')]],
  ])('merges %s bookings into one block', (_, input, expected) => {
    expect(mergeBusy(input)).toEqual(expected);
  });

  it('does not change the array it was given', () => {
    const input = [r('10:00', '11:00'), r('08:00', '09:00')];
    mergeBusy(input);
    expect(input).toEqual([r('10:00', '11:00'), r('08:00', '09:00')]);
  });

  it('rejects a time that is not HH:MM', () => {
    expect(() => mergeBusy([r('8:00', '09:00')])).toThrow(TypeError);
  });
});`,
  ungVienYeu: `// A candidate's tests after 20 minutes, the WEAK version (lesson 10.4): two happy paths.
import { it, expect } from 'vitest';
import { mergeBusy } from '../../src/rules/busy.js';

it('test mergeBusy', () => {
  const result = mergeBusy([{ start: '08:00', end: '10:00' }, { start: '09:00', end: '11:00' }]);
  expect(result.length).toBe(1);
});

it('test mergeBusy 2', () => {
  expect(mergeBusy([{ start: '08:00', end: '09:00' }, { start: '13:00', end: '14:00' }])).toBeTruthy();
});`,
  chamBusy: `// Lesson 10.4: how strong are the tests written in a 20-minute live-coding round? Six real bugs in busy.js.
// node demo10/phong-van/cham.mjs <test file>
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const TEST = process.argv[2];
const FILE = 'src/rules/busy.js';
const MUTANTS = [
  ['start <= last[1]', 'start < last[1]', 'touching bookings stay apart'],
  ['Math.max(last[1], end)', 'end', 'a booking inside another one cuts the block short'],
  ['.sort((a, b) => a[0] - b[0])', '', 'input order is trusted (no sort)'],
  ['a[0] - b[0]', 'a[1] - b[1]', 'sorted by end time instead of start'],
  ['ranges.map(', 'ranges.sort((a, b) => a.start.localeCompare(b.start)).map(', "the caller's array is reordered"],
  ['if (last && start <= last[1])', 'if (last && start <= last[1] && end > last[1])', 'a booking inside another one becomes its own block'],
];
let killed = 0;
const original = readFileSync(FILE, 'utf8');
for (const [i, [from, to, label]] of MUTANTS.entries()) {
  if (original.split(from).length !== 2) throw new Error('Mutant ' + (i + 1) + ': must appear exactly once');
  writeFileSync(FILE, original.replace(from, to));
  try {
    const dead = spawnSync('npx', ['vitest', 'run', TEST], { encoding: 'utf8', shell: process.platform === 'win32' }).status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(FILE, original);
  }
}
console.log('\\n' + killed + '/' + MUTANTS.length + ' bugs caught by ' + TEST);
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
  clubV0: `// LabFlow v0 (2020) — price quote for a student club renting a lab for an event.
// No tests. The finance office trusts these numbers; they must not change by accident.
import { PRICES } from './club-prices.js';

export function clubFee(club, lab, date, start, end, seats) {
  var hrs = (parseInt(end.substr(0, 2)) * 60 + parseInt(end.substr(3, 2)) - parseInt(start.substr(0, 2)) * 60 - parseInt(start.substr(3, 2))) / 60;
  var price = hrs * PRICES[lab.substr(0, 2)];
  var today = new Date();
  if (today.getDay() == 0 || today.getDay() == 6) price = price * 1.5; // weekend rate
  if (club.member == true) price = price * 0.8;
  if (seats > 40) price = price + 100000;
  if (hrs >= 4) price = price - 50000;
  if (price < 0) price = 0;
  return Math.round(price / 1000) * 1000;
}`,
  prices: `// LabFlow v0 — price per hour (VND) by building, for student clubs renting a lab. Read by clubFee (Lab 10).
export const PRICES = { BE: 200000, AL: 350000 };`,
  recurringRef: `// BR-10 — a lecturer books the same slot every week for a class (Lab 10, built test-first).
export const MAX_WEEKS = 15;

const DAY = 24 * 60 * 60 * 1000;
const toDay = (iso) => Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10))) / DAY;
const toIso = (day) => new Date(day * DAY).toISOString().slice(0, 10);

// firstDate, until: "YYYY-MM-DD" (until = last day of the term, inclusive); holidays: ["YYYY-MM-DD", …]
export function weeklyDates({ firstDate, weeks, until, holidays = [] }) {
  if (!Number.isInteger(weeks) || weeks < 1 || weeks > MAX_WEEKS) return { ok: false, code: 'BAD_WEEKS' };
  if (toDay(firstDate) > toDay(until)) return { ok: false, code: 'STARTS_AFTER_TERM' };
  const dates = [];
  const skipped = [];
  for (let i = 0; i < weeks; i++) {
    const date = toIso(toDay(firstDate) + 7 * i);
    if (toDay(date) > toDay(until)) skipped.push({ date, reason: 'AFTER_TERM' });
    else if (holidays.includes(date)) skipped.push({ date, reason: 'HOLIDAY' });
    else dates.push(date);
  }
  return { ok: true, dates, skipped };
}`,
  yeuRec: `// Lab 10 — FIRST ATTEMPT (weak): written after the code, two happy paths.
import { it, expect } from 'vitest';
import { weeklyDates } from '../../src/rules/recurring.js';

it('creates weekly dates', () => {
  const r = weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: '2026-12-31' });
  expect(r.ok).toBe(true);
  expect(r.dates.length).toBe(3);
});

it('skips holidays', () => {
  const r = weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: '2026-12-31', holidays: ['2026-11-09'] });
  expect(r.dates).not.toContain('2026-11-09');
});`,
  yeuFee: `// Lab 10 — FIRST ATTEMPT (weak) at characterization: real clock, "greater than" instead of the real numbers.
import { it, expect } from 'vitest';
import { clubFee } from '../../src/legacy/clubFee.js';

it('calculates a fee', () => {
  expect(clubFee({ member: true }, 'BE-201', '2026-11-20', '08:00', '10:00', 30)).toBeGreaterThan(0);
});

it('a big event costs more', () => {
  const big = clubFee({ member: false }, 'BE-201', '2026-11-20', '08:00', '10:00', 60);
  const small = clubFee({ member: false }, 'BE-201', '2026-11-20', '08:00', '10:00', 20);
  expect(big).toBeGreaterThan(small);
});`,
  dotBien10: `// Lab 10 grader (Chapter 10). Your tests are run against code you did not write:
//   1. the characterization tests of clubFee: green on the ORIGINAL v0 (lab10/clubFee.v0.js) and on your refactored version;
//   2. the tests of weeklyDates (BR-10): green on the team's reference (lab10/recurring.ref.js);
//   3. eight planted bugs — four in v0, four in the reference — one at a time: each must turn your tests red.
// Your own files are put back after every run (finally), even if you stop the script.
// Usage: node scripts/dot-bien-10.mjs [recurring test] [clubFee test]
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const REC_TEST = process.argv[2] ?? 'src/rules/recurring.test.js';
const FEE_TEST = process.argv[3] ?? 'src/legacy/clubFee.test.js';
const TARGETS = [
  { file: 'src/legacy/clubFee.js', reference: 'lab10/clubFee.v0.js', test: FEE_TEST, mutants: [
    ['if (seats > 40)', 'if (seats >= 40)', 'an event for exactly 40 seats pays the big-event fee'],
    ['if (hrs >= 4)', 'if (hrs > 4)', 'a 4-hour event loses its long-event discount'],
    ['Math.round(price / 1000)', 'Math.floor(price / 1000)', 'prices are rounded down instead of to the nearest 1,000'],
    ['today.getDay() == 0 || ', '', 'Sunday is no longer charged the weekend rate'],
  ] },
  { file: 'src/rules/recurring.js', reference: 'lab10/recurring.ref.js', test: REC_TEST, mutants: [
    ['toDay(firstDate) + 7 * i', 'toDay(firstDate) + 7 * (i + 1)', 'the series starts one week late'],
    ['weeks > MAX_WEEKS', 'weeks >= MAX_WEEKS', 'a 15-week series is refused'],
    ['if (toDay(date) > toDay(until))', 'if (toDay(date) >= toDay(until))', 'a class on the last day of term is dropped'],
    ['else if (holidays.includes(date))', 'else if (false)', 'a class is booked on a holiday'],
  ] },
];
const green = (test) => spawnSync('npx', ['vitest', 'run', test], { encoding: 'utf8', shell: process.platform === 'win32' }).status === 0;

// Run \`test\` with \`code\` in place of \`file\`; always put the learner's file back.
function withCode(file, code, test) {
  const mine = readFileSync(file, 'utf8');
  writeFileSync(file, code);
  try { return green(test); } finally { writeFileSync(file, mine); }
}

let ok = true;
for (const t of TARGETS) {
  const pass = withCode(t.file, readFileSync(t.reference, 'utf8'), t.test);
  console.log((pass ? '✔ ' : '✘ ') + t.test + ' is green on ' + t.reference);
  ok &&= pass;
}
const mine = green(FEE_TEST);
console.log((mine ? '✔ ' : '✘ ') + FEE_TEST + ' is green on your src/legacy/clubFee.js (after your refactor)');
ok &&= mine;

let killed = 0, n = 0;
for (const t of TARGETS) {
  const ref = readFileSync(t.reference, 'utf8');
  for (const [from, to, label] of t.mutants) {
    n++;
    if (ref.split(from).length !== 2) throw new Error('Mutant ' + n + ': must appear exactly once in ' + t.reference);
    const dead = !withCode(t.file, ref.replace(from, to), t.test);
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + n + ' ' + label);
  }
}
console.log('\\n' + killed + '/' + n + ' mutants killed');
process.exitCode = ok && killed === n ? 0 : 1;`,
  clubFeeTest: `// Lab 10 — characterization tests of the club fee quote. They pin what v0 returns TODAY, bugs included,
// and must stay green, unchanged, on v0 and on the refactored code.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clubFee } from './clubFee.js';

const DAYS = { WED: '2026-11-18T10:00:00+07:00', SAT: '2026-11-21T10:00:00+07:00', SUN: '2026-11-22T10:00:00+07:00' };
const EVENT = '2026-12-02'; // a Wednesday; v0 never reads it (issue LF-212)

function quote(day, member, lab, start, end, seats) {
  vi.setSystemTime(new Date(DAYS[day]));
  return clubFee({ member }, lab, EVENT, start, end, seats);
}

describe('clubFee (characterization of v0)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    return () => vi.useRealTimers();
  });

  it.each([
    ['WED', false, 'BE-201', '08:00', '10:00', 30, 400000],
    ['WED', true, 'BE-201', '08:00', '10:00', 30, 320000],
    ['WED', false, 'BE-201', '08:00', '10:00', 40, 400000],
    ['WED', false, 'BE-201', '08:00', '10:00', 41, 500000],
    ['WED', false, 'BE-201', '08:00', '11:30', 30, 700000],
    ['WED', false, 'BE-201', '08:00', '12:00', 30, 750000],
    ['WED', true, 'AL-105', '08:00', '08:30', 30, 140000],
    ['SAT', true, 'AL-105', '08:00', '08:30', 30, 210000],
    ['SUN', false, 'AL-105', '08:00', '08:30', 30, 263000],
    ['WED', false, 'BE-201', '10:00', '08:00', 30, 0],
    ['WED', 1, 'BE-201', '08:00', '10:00', 30, 320000],
    ['WED', 'yes', 'BE-201', '08:00', '10:00', 30, 400000],
  ])('quoted on %s: member %s, %s %s–%s, %i seats ⇒ %i VND', (day, member, lab, start, end, seats, expected) => {
    expect(quote(day, member, lab, start, end, seats)).toBe(expected);
  });

  it('charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned)', () => {
    expect(quote('SAT', false, 'BE-201', '08:00', '10:00', 30)).toBe(600000);
  });

  it('returns NaN for a building it has no price for', () => {
    expect(quote('WED', false, 'XX-001', '08:00', '10:00', 30)).toBeNaN();
  });
});`,
  recurringTest: `// Lab 10 — BR-10 weekly repeating bookings, written test-first (the order of the tests is the order they were written).
import { describe, it, expect } from 'vitest';
import { weeklyDates, MAX_WEEKS } from './recurring.js';

const TERM_END = '2026-12-31';

describe('weeklyDates', () => {
  it('books the first date and the same weekday in each following week', () => {
    expect(weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: TERM_END })).toEqual({
      ok: true, dates: ['2026-11-02', '2026-11-09', '2026-11-16'], skipped: [],
    });
  });

  it('skips a holiday without adding an extra week', () => {
    expect(weeklyDates({ firstDate: '2026-11-02', weeks: 3, until: TERM_END, holidays: ['2026-11-09'] })).toEqual({
      ok: true, dates: ['2026-11-02', '2026-11-16'], skipped: [{ date: '2026-11-09', reason: 'HOLIDAY' }],
    });
  });

  it('keeps a class on the last day of term and drops the weeks after it', () => {
    expect(weeklyDates({ firstDate: '2026-12-17', weeks: 3, until: TERM_END })).toEqual({
      ok: true, dates: ['2026-12-17', '2026-12-24', '2026-12-31'], skipped: [],
    });
    expect(weeklyDates({ firstDate: '2026-12-17', weeks: 4, until: TERM_END }).skipped).toEqual([{ date: '2027-01-07', reason: 'AFTER_TERM' }]);
  });

  it('reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it', () => {
    expect(weeklyDates({ firstDate: '2026-12-24', weeks: 2, until: TERM_END, holidays: ['2026-12-31'] }).skipped).toEqual([{ date: '2026-12-31', reason: 'HOLIDAY' }]);
    expect(weeklyDates({ firstDate: '2026-12-31', weeks: 2, until: TERM_END, holidays: ['2027-01-07'] }).skipped).toEqual([{ date: '2027-01-07', reason: 'AFTER_TERM' }]);
  });

  it('crosses a month and a year correctly', () => {
    expect(weeklyDates({ firstDate: '2026-12-28', weeks: 2, until: '2027-06-30' }).dates).toEqual(['2026-12-28', '2027-01-04']);
  });

  it.each([1, MAX_WEEKS])('accepts %i week(s)', (weeks) => {
    expect(weeklyDates({ firstDate: '2026-01-05', weeks, until: TERM_END }).dates).toHaveLength(weeks);
  });

  it.each([0, MAX_WEEKS + 1, 2.5])('refuses %s weeks with BAD_WEEKS', (weeks) => {
    expect(weeklyDates({ firstDate: '2026-11-02', weeks, until: TERM_END })).toEqual({ ok: false, code: 'BAD_WEEKS' });
  });

  it('refuses a series that starts after the term, and accepts one that starts on its last day', () => {
    expect(weeklyDates({ firstDate: '2027-01-04', weeks: 1, until: TERM_END })).toEqual({ ok: false, code: 'STARTS_AFTER_TERM' });
    expect(weeklyDates({ firstDate: TERM_END, weeks: 1, until: TERM_END }).dates).toEqual([TERM_END]);
  });
});`,
  clubFeeNew: `// Price quote for a student club renting a lab — refactored from LabFlow v0 in Lab 10, under characterization tests.
// Same results as v0, its bug included: the weekend rate depends on the day the quote is MADE, not on the event
// (issue LF-212 — to be fixed in its own pull request, agreed with the finance office, not hidden in a refactor).
import { PRICES } from '../legacy/club-prices.js';

export const WEEKEND_RATE = 1.5;
export const MEMBER_RATE = 0.8;
export const BIG_EVENT_SEATS = 40;
export const BIG_EVENT_FEE = 100000;
export const LONG_EVENT_HOURS = 4;
export const LONG_EVENT_DISCOUNT = 50000;

const minutesOf = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
const isWeekend = (day) => day.getDay() === 0 || day.getDay() === 6;

export function quoteClubFee({ member, lab, start, end, seats, today }) {
  const hours = (minutesOf(end) - minutesOf(start)) / 60;
  let price = hours * PRICES[lab.slice(0, 2)];
  if (isWeekend(today)) price *= WEEKEND_RATE;
  if (member) price *= MEMBER_RATE;
  if (seats > BIG_EVENT_SEATS) price += BIG_EVENT_FEE;
  if (hours >= LONG_EVENT_HOURS) price -= LONG_EVENT_DISCOUNT;
  return Math.round(Math.max(price, 0) / 1000) * 1000;
}`,
  clubWrap: `// LabFlow v0 entry point, kept for its callers (Lab 10). The logic now lives in src/rules/clubFee.js.
import { quoteClubFee } from '../rules/clubFee.js';

export function clubFee(club, lab, date, start, end, seats) {
  // v0 compared with == true: only true (or 1) is a member — keep that, do not "simplify" to !!club.member
  return quoteClubFee({ member: club.member == true, lab, start, end, seats, today: new Date() });
}`,
  clubFeeNewTest: `// The pure quote (Lab 10): "today" is a parameter now, so no fake clock is needed.
import { describe, it, expect } from 'vitest';
import { quoteClubFee } from './clubFee.js';

const base = { member: false, lab: 'BE-201', start: '08:00', end: '10:00', seats: 30 };

describe('quoteClubFee', () => {
  it('charges 1.5 times on a Sunday and the plain price on a Monday', () => {
    expect(quoteClubFee({ ...base, today: new Date('2026-11-22T10:00:00+07:00') })).toBe(600000);
    expect(quoteClubFee({ ...base, today: new Date('2026-11-23T10:00:00+07:00') })).toBe(400000);
  });
});`,
  th101Test: `// Practice 10.1: leaveWaitlist, test-first. Step 1 — the tests, before any real code (red on purpose).
import { describe, it, expect } from 'vitest';
import { leaveWaitlist } from './leave.js';

const line = (...ids) => ids.map((userId) => ({ userId }));

describe('leaveWaitlist', () => {
  it('removes the student and moves everyone behind them up', () => {
    expect(leaveWaitlist(line('an', 'chi', 'dung'), 'chi')).toEqual({ ok: true, queue: line('an', 'dung') });
  });

  it('refuses a student who is not waiting with NOT_WAITING', () => {
    expect(leaveWaitlist(line('an'), 'em')).toEqual({ ok: false, code: 'NOT_WAITING' });
  });

  it('never changes the queue it was given', () => {
    const queue = line('an', 'chi');
    leaveWaitlist(queue, 'an');
    expect(queue).toEqual(line('an', 'chi'));
  });
});`,
  th101Do: `// Practice 10.1, step 1: only the name exists yet.
export function leaveWaitlist(queue, userId) {}`,
  th101Xanh: `// Practice 10.1, step 2: the simplest code that passes all three tests.
export function leaveWaitlist(queue, userId) {
  if (!queue.some((w) => w.userId === userId)) return { ok: false, code: 'NOT_WAITING' };
  return { ok: true, queue: queue.filter((w) => w.userId !== userId) };
}`,
  th103Truoc: `// Practice 10.3 — a test from another pull request, AS SUBMITTED. Find the smells before reading the reviewed version.
import { it, expect } from 'vitest';
import { offerNext, acceptOffer } from '../../src/rules/waitlist.js';

it('should work', async () => {
  const { offer } = offerNext([{ userId: 'an' }], new Date());
  await new Promise((resolve) => setTimeout(resolve, 1000));
  expect(acceptOffer(offer, new Date())).toBeTruthy();
});`,
  th103Sau: `// Practice 10.3 — the same test AFTER review: a fixed clock, the exact boundary, the exact result.
import { describe, it, expect } from 'vitest';
import { offerNext, acceptOffer } from '../../src/rules/waitlist.js';

const at = (hhmm) => new Date('2026-11-16T' + hhmm + ':00+07:00');

describe('acceptOffer', () => {
  const { offer } = offerNext([{ userId: 'an' }], at('10:00'));

  it('accepts the offer one minute before it expires (10:29)', () => {
    expect(acceptOffer(offer, at('10:29'))).toEqual({ ok: true });
  });

  it('refuses it at 10:30 with OFFER_EXPIRED', () => {
    expect(acceptOffer(offer, at('10:30'))).toEqual({ ok: false, code: 'OFFER_EXPIRED' });
  });
});`,
  approved: `LAB BE-201 - 2026/09
2026-09-30 14:00-16:00 25 seats
2026-09-01 08:00-09:00 10 seats
2026-09-02 08:00-12:00 35 seats
Bookings: 3
Hours: 7
Large (>30 seats): 1
Weekend/holiday: 2
----
LAB BE-305 - 2026/09
No bookings.
----
LAB BE-201 - 2026/10
2026-10-06 08:00-10:00 20 seats
2026-10-03 13:30-15:00 30 seats
2026-10-04 09:00-11:30 31 seats (pending)
2026-10-20 18:00-21:00 28 seats
Bookings: 4
Hours: 9
Large (>30 seats): 1
Weekend/holiday: 2
----
LAB BE-305 - 2026/10
2026-10-06 10:00-12:30 40 seats
Bookings: 1
Hours: 2.5
Large (>30 seats): 1
Weekend/holiday: 0
----
LAB BE-201 - 2026/11
No bookings.
----
LAB BE-305 - 2026/11
No bookings.
----`,
};
export const OUT = {
  '101-b1-do': `$ npx vitest run demo10/tdd/1-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/tdd/1-do/waitlist.test.js (1 test | 1 failed) 5ms
   ❯ joinWaitlist (1)
     × puts the first student at position 1 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/tdd/1-do/waitlist.test.js > joinWaitlist > puts the first student at position 1
AssertionError: expected undefined to deeply equal { ok: true, position: 1, …(1) }

- Expected:
{
  "ok": true,
  "position": 1,
  "queue": [
    {
      "userId": "an",
    },
  ],
}

+ Received:
undefined

 ❯ demo10/tdd/1-do/waitlist.test.js:6:66
      4| describe('joinWaitlist', () => {
      5|   it('puts the first student at position 1', () => {
      6|     expect(joinWaitlist([], { userId: 'an', holderId: 'binh' })).toEqu…
       |                                                                  ^
      7|       ok: true, position: 1, queue: [{ userId: 'an' }],
      8|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  10:12:07
   Duration  112ms (transform 51%, import 23%, tests 18%, worker 8%)`,
  '101-b1-xanh': `$ npx vitest run demo10/tdd/1-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/1-xanh/waitlist.test.js (1 test) 2ms
   ✓ joinWaitlist (1)
     ✓ puts the first student at position 1 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:12:07
   Duration  107ms (transform 53%, import 29%, worker 10%, tests 8%)`,
  '101-b2-do': `$ npx vitest run demo10/tdd/2-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/tdd/2-do/waitlist.test.js (2 tests | 1 failed) 6ms
   ❯ joinWaitlist (2)
     ✓ puts the first student at position 1 1ms
     × puts the next student behind the ones already waiting 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/tdd/2-do/waitlist.test.js > joinWaitlist > puts the next student behind the ones already waiting
AssertionError: expected { ok: true, position: 1, …(1) } to deeply equal { ok: true, position: 2, …(1) }

- Expected
+ Received

  {
    "ok": true,
-   "position": 2,
+   "position": 1,
    "queue": [
-     {
-       "userId": "an",
-     },
      {
        "userId": "chi",
      },
    ],
  }

 ❯ demo10/tdd/2-do/waitlist.test.js:12:83
     10|
     11|   it('puts the next student behind the ones already waiting', () => {
     12|     expect(joinWaitlist([{ userId: 'an' }], { userId: 'chi', holderId:…
       |                                                                                   ^
     13|       ok: true, position: 2, queue: [{ userId: 'an' }, { userId: 'chi'…
     14|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  10:12:08
   Duration  121ms (transform 49%, import 23%, tests 20%, worker 7%)`,
  '101-b2-xanh': `$ npx vitest run demo10/tdd/2-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/2-xanh/waitlist.test.js (2 tests) 2ms
   ✓ joinWaitlist (2)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  10:12:09
   Duration  112ms (transform 57%, import 24%, worker 10%, tests 8%)`,
  '101-b3-do': `$ npx vitest run demo10/tdd/3-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/tdd/3-do/waitlist.test.js (4 tests | 2 failed) 8ms
   ❯ joinWaitlist (4)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     × refuses a student who is already waiting 4ms
     × refuses a fourth student: at most 3 wait for one slot 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/tdd/3-do/waitlist.test.js > joinWaitlist > refuses a student who is already waiting
AssertionError: expected { ok: true, position: 3, …(1) } to deeply equal { ok: false, code: 'ALREADY_WAITING' }

- Expected
+ Received

  {
-   "code": "ALREADY_WAITING",
-   "ok": false,
+   "ok": true,
+   "position": 3,
+   "queue": [
+     {
+       "userId": "an",
+     },
+     {
+       "userId": "chi",
+     },
+     {
+       "userId": "an",
+     },
+   ],
  }

 ❯ demo10/tdd/3-do/waitlist.test.js:17:43
     15|
     16|   it('refuses a student who is already waiting', () => {
     17|     expect(join(line('an', 'chi'), 'an')).toEqual({ ok: false, code: '…
       |                                           ^
     18|   });
     19|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo10/tdd/3-do/waitlist.test.js > joinWaitlist > refuses a fourth student: at most 3 wait for one slot
AssertionError: expected { ok: true, position: 4, …(1) } to deeply equal { ok: false, code: 'WAITLIST_FULL' }

- Expected
+ Received

  {
-   "code": "WAITLIST_FULL",
-   "ok": false,
+   "ok": true,
+   "position": 4,
+   "queue": [
+     {
+       "userId": "an",
+     },
+     {
+       "userId": "chi",
+     },
+     {
+       "userId": "dung",
+     },
+     {
+       "userId": "em",
+     },
+   ],
  }

 ❯ demo10/tdd/3-do/waitlist.test.js:21:51
     19|
     20|   it('refuses a fourth student: at most 3 wait for one slot', () => {
     21|     expect(join(line('an', 'chi', 'dung'), 'em')).toEqual({ ok: false,…
       |                                                   ^
     22|   });
     23| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 2 passed (4)
   Start at  10:12:09
   Duration  129ms (transform 45%, tests 25%, import 23%, worker 7%)`,
  '101-b3-xanh': `$ npx vitest run demo10/tdd/3-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/3-xanh/waitlist.test.js (4 tests) 3ms
   ✓ joinWaitlist (4)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  10:12:10
   Duration  115ms (transform 56%, import 24%, tests 10%, worker 9%)`,
  '101-b4-do': `$ npx vitest run demo10/tdd/4-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/tdd/4-do/waitlist.test.js (5 tests | 1 failed) 8ms
   ❯ joinWaitlist (5)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     × refuses the student who already holds the slot 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/tdd/4-do/waitlist.test.js > joinWaitlist > refuses the student who already holds the slot
AssertionError: expected { ok: true, position: 1, …(1) } to deeply equal { ok: false, code: 'IS_HOLDER' }

- Expected
+ Received

  {
-   "code": "IS_HOLDER",
-   "ok": false,
+   "ok": true,
+   "position": 1,
+   "queue": [
+     {
+       "userId": "binh",
+     },
+   ],
  }

 ❯ demo10/tdd/4-do/waitlist.test.js:25:68
     23|
     24|   it('refuses the student who already holds the slot', () => {
     25|     expect(joinWaitlist([], { userId: 'binh', holderId: 'binh' })).toE…
       |                                                                    ^
     26|   });
     27| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Start at  10:12:11
   Duration  125ms (transform 47%, import 23%, tests 23%, worker 7%)`,
  '101-b4-xanh': `$ npx vitest run demo10/tdd/4-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/4-xanh/waitlist.test.js (5 tests) 3ms
   ✓ joinWaitlist (5)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  10:12:11
   Duration  110ms (transform 53%, import 25%, tests 12%, worker 9%)`,
  '101-b5-do': `$ npx vitest run demo10/tdd/5-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/tdd/5-do/waitlist.test.js (7 tests | 2 failed) 5ms
   ✓ joinWaitlist (5)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
   ❯ offerNext (2)
     × offers the slot to the first student in line for 30 minutes 2ms
     × offers nothing when nobody is waiting 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/tdd/5-do/waitlist.test.js > offerNext > offers the slot to the first student in line for 30 minutes
TypeError: offerNext is not a function
 ❯ demo10/tdd/5-do/waitlist.test.js:32:12
     30|
     31|   it('offers the slot to the first student in line for 30 minutes', ()…
     32|     expect(offerNext(line('an', 'chi'), freedAt)).toEqual({
       |            ^
     33|       offer: { userId: 'an', expiresAt: new Date('2026-11-16T10:30:00+…
     34|       queue: line('chi'),

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo10/tdd/5-do/waitlist.test.js > offerNext > offers nothing when nobody is waiting
TypeError: offerNext is not a function
 ❯ demo10/tdd/5-do/waitlist.test.js:39:12
     37|
     38|   it('offers nothing when nobody is waiting', () => {
     39|     expect(offerNext([], freedAt)).toEqual({ offer: null, queue: [] });
       |            ^
     40|   });
     41| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 5 passed (7)
   Start at  10:12:12
   Duration  112ms (transform 49%, import 24%, tests 18%, worker 8%)`,
  '101-b5-xanh': `$ npx vitest run demo10/tdd/5-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/5-xanh/waitlist.test.js (7 tests) 3ms
   ✓ joinWaitlist (5)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 0ms

 Test Files  1 passed (1)
      Tests  7 passed (7)
   Start at  10:12:13
   Duration  113ms (transform 54%, import 25%, tests 12%, worker 8%)`,
  '101-b6-do': `$ npx vitest run demo10/tdd/6-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/tdd/6-do/waitlist.test.js (9 tests | 2 failed) 7ms
   ✓ joinWaitlist (5)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 1ms
     ✓ offers nothing when nobody is waiting 0ms
   ❯ acceptOffer (2)
     × accepts at 10:29, one minute before the offer expires 2ms
     × refuses at 10:30: the offer has expired 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/tdd/6-do/waitlist.test.js > acceptOffer > accepts at 10:29, one minute before the offer expires
TypeError: acceptOffer is not a function
 ❯ demo10/tdd/6-do/waitlist.test.js:47:12
     45|
     46|   it('accepts at 10:29, one minute before the offer expires', () => {
     47|     expect(acceptOffer(offer, new Date('2026-11-16T10:29:00+07:00'))).…
       |            ^
     48|   });
     49|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo10/tdd/6-do/waitlist.test.js > acceptOffer > refuses at 10:30: the offer has expired
TypeError: acceptOffer is not a function
 ❯ demo10/tdd/6-do/waitlist.test.js:51:12
     49|
     50|   it('refuses at 10:30: the offer has expired', () => {
     51|     expect(acceptOffer(offer, new Date('2026-11-16T10:30:00+07:00'))).…
       |            ^
     52|   });
     53| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 7 passed (9)
   Start at  10:12:13
   Duration  129ms (transform 50%, import 23%, tests 20%, worker 7%)`,
  '101-b6-xanh': `$ npx vitest run demo10/tdd/6-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/6-xanh/waitlist.test.js (9 tests) 4ms
   ✓ joinWaitlist (5)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 0ms
   ✓ acceptOffer (2)
     ✓ accepts at 10:29, one minute before the offer expires 0ms
     ✓ refuses at 10:30: the offer has expired 1ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  10:12:14
   Duration  140ms (transform 53%, import 29%, tests 10%, worker 8%)`,
  '101-b7': `$ npx vitest run demo10/tdd/7-refactor

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/tdd/7-refactor/waitlist.test.js (9 tests) 5ms
   ✓ joinWaitlist (5)
     ✓ puts the first student at position 1 2ms
     ✓ puts the next student behind the ones already waiting 1ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 0ms
   ✓ acceptOffer (2)
     ✓ accepts at 10:29, one minute before the offer expires 0ms
     ✓ refuses at 10:30: the offer has expired 1ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  10:12:14
   Duration  121ms (transform 54%, import 26%, tests 13%, worker 7%)`,
  '101-splice': `$ node scripts/thu-loi.mjs src/booking/service.js "rows.splice(i, 1)[0]" "rows.splice(i, 1)" demo10/truong-phai/mockist.test.js demo10/truong-phai/classicist.test.js
planted in src/booking/service.js:  rows.splice(i, 1)[0]  →  rows.splice(i, 1)


 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/truong-phai/mockist.test.js (1 test) 3ms
   ✓ cancelBooking (mockist) (1)
     ✓ removes the booking, updates the waitlist and mails the first student 2ms
 ❯ demo10/truong-phai/classicist.test.js (3 tests | 2 failed) 61ms
   ❯ cancelBooking (3)
     × deletes the booking and offers the slot to the first student waiting 23ms
     × sends no e-mail when nobody is waiting 19ms
     ✓ refuses an unknown booking with NOT_FOUND 18ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/truong-phai/classicist.test.js > cancelBooking > deletes the booking and offers the slot to the first student waiting
AssertionError: expected { cancelled: undefined, …(1) } to deeply equal { cancelled: 1, …(1) }

- Expected
+ Received

  {
-   "cancelled": 1,
-   "offeredTo": "an@labflow.example",
+   "cancelled": undefined,
+   "offeredTo": null,
  }

 ❯ demo10/truong-phai/classicist.test.js:23:20
     21|     const result = await cancelBooking(deps, booking.id);
     22|
     23|     expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@lab…
       |                    ^
     24|     expect(await deps.repo.findById(booking.id)).toBeNull();
     25|     expect(deps.waitlists.get(KEY)).toEqual([{ userId: 'chi@labflow.ex…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo10/truong-phai/classicist.test.js > cancelBooking > sends no e-mail when nobody is waiting
AssertionError: expected { cancelled: undefined, …(1) } to deeply equal { cancelled: 1, offeredTo: null }

- Expected
+ Received

  {
-   "cancelled": 1,
+   "cancelled": undefined,
    "offeredTo": null,
  }

 ❯ demo10/truong-phai/classicist.test.js:33:50
     31|   it('sends no e-mail when nobody is waiting', async () => {
     32|     const { deps, booking } = await setup();
     33|     await expect(cancelBooking(deps, booking.id)).resolves.toEqual({ c…
       |                                                  ^
     34|     expect(deps.mailer.outbox).toEqual([]);
     35|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  2 failed | 2 passed (4)
   Start at  10:12:17
   Duration  174ms (tests 55%, transform 25%, import 16%, worker 4%)`,
  '101-src': `$ npx vitest run src/rules/waitlist.test.js src/booking/waitlistService.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/waitlist.test.js (11 tests) 5ms
   ✓ joinWaitlist (7)
     ✓ puts the first student at position 1 1ms
     ✓ puts the next student behind the ones already waiting 0ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
     ✓ says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line 0ms
     ✓ never changes the queue it was given 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 1ms
   ✓ acceptOffer (2)
     ✓ accepts at 10:29, one minute before the offer expires 0ms
     ✓ refuses at 10:30: the offer has expired 0ms
 ✓ src/booking/waitlistService.test.js (3 tests) 58ms
   ✓ cancelBooking (3)
     ✓ deletes the booking and offers the slot to the first student waiting 23ms
     ✓ sends no e-mail when nobody is waiting 17ms
     ✓ refuses an unknown booking with NOT_FOUND 17ms

 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  10:12:15
   Duration  183ms (tests 47%, transform 33%, import 16%, worker 4%)`,
  '101-stryker': `$ npx stryker run --mutate src/rules/waitlist.js
10:12:19 (87389) INFO ProjectReader Found 1 of 375 file(s) to be mutated.
10:12:19 (87389) INFO Instrumenter Instrumented 1 source file(s) with 45 mutant(s)
10:12:19 (87389) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
10:12:20 (87389) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
10:12:20 (87389) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
10:12:20 (87389) INFO DryRunExecutor Initial test run succeeded. Ran 14 tests in 0 seconds (net 72.82104099999992 ms, overhead 444.1789590000001 ms).

All tests
  booking/waitlistService.test.js
    ~ cancelBooking > deletes the booking and offers the slot to the first student waiting [line 18] (covered 9)
    ~ cancelBooking > sends no e-mail when nobody is waiting [line 31] (covered 6)
    ✘ cancelBooking > refuses an unknown booking with NOT_FOUND [line 37] (covered 0)
  rules/waitlist.test.js
    ✓ joinWaitlist > puts the first student at position 1 [line 8] (killed 11)
    ✓ joinWaitlist > puts the next student behind the ones already waiting [line 12] (killed 2)
    ✓ joinWaitlist > refuses a student who is already waiting [line 15] (killed 7)
    ✓ joinWaitlist > refuses a fourth student: at most 3 wait for one slot [line 19] (killed 3)
    ✓ joinWaitlist > refuses the student who already holds the slot [line 23] (killed 2)
    ~ joinWaitlist > says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line [line 27] (covered 14)
    ~ joinWaitlist > never changes the queue it was given [line 31] (covered 19)
    ✓ offerNext > offers the slot to the first student in line for 30 minutes [line 41] (killed 9)
    ✓ offerNext > offers nothing when nobody is waiting [line 48] (killed 3)
    ✓ acceptOffer > accepts at 10:29, one minute before the offer expires [line 56] (killed 5)
    ✓ acceptOffer > refuses at 10:30: the offer has expired [line 60] (killed 3)

Ran 1.58 tests per mutant on average.
-------------|------------------|----------|-----------|------------|----------|----------|
             | % Mutation score |          |           |            |          |          |
File         |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
-------------|--------|---------|----------|-----------|------------|----------|----------|
All files    | 100.00 |  100.00 |       45 |         0 |          0 |        0 |        0 |
 waitlist.js | 100.00 |  100.00 |       45 |         0 |          0 |        0 |        0 |
-------------|--------|---------|----------|-----------|------------|----------|----------|
10:12:23 (87389) INFO MutationTestReportHelper Final mutation score of 100.00 is greater than or equal to break threshold 80
10:12:23 (87389) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
10:12:23 (87389) INFO MutationTestExecutor Done in 3 seconds.`,
  '101-th-do': `$ npx vitest run demo10/th101/1-do

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/th101/1-do/leave.test.js (3 tests | 2 failed) 6ms
   ❯ leaveWaitlist (3)
     × removes the student and moves everyone behind them up 4ms
     × refuses a student who is not waiting with NOT_WAITING 1ms
     ✓ never changes the queue it was given 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/th101/1-do/leave.test.js > leaveWaitlist > removes the student and moves everyone behind them up
AssertionError: expected undefined to deeply equal { ok: true, queue: [ …(2) ] }

- Expected:
{
  "ok": true,
  "queue": [
    {
      "userId": "an",
    },
    {
      "userId": "dung",
    },
  ],
}

+ Received:
undefined

 ❯ demo10/th101/1-do/leave.test.js:9:61
      7| describe('leaveWaitlist', () => {
      8|   it('removes the student and moves everyone behind them up', () => {
      9|     expect(leaveWaitlist(line('an', 'chi', 'dung'), 'chi')).toEqual({ …
       |                                                             ^
     10|   });
     11|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  demo10/th101/1-do/leave.test.js > leaveWaitlist > refuses a student who is not waiting with NOT_WAITING
AssertionError: expected undefined to deeply equal { ok: false, code: 'NOT_WAITING' }

- Expected:
{
  "code": "NOT_WAITING",
  "ok": false,
}

+ Received:
undefined

 ❯ demo10/th101/1-do/leave.test.js:13:45
     11|
     12|   it('refuses a student who is not waiting with NOT_WAITING', () => {
     13|     expect(leaveWaitlist(line('an'), 'em')).toEqual({ ok: false, code:…
       |                                             ^
     14|   });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed | 1 passed (3)
   Start at  10:18:32
   Duration  128ms (transform 46%, import 24%, tests 20%, worker 10%)`,
  '101-th-xanh': `$ npx vitest run demo10/th101/2-xanh

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/th101/2-xanh/leave.test.js (3 tests) 3ms
   ✓ leaveWaitlist (3)
     ✓ removes the student and moves everyone behind them up 1ms
     ✓ refuses a student who is not waiting with NOT_WAITING 0ms
     ✓ never changes the queue it was given 0ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  10:18:32
   Duration  108ms (transform 56%, import 26%, tests 10%, worker 8%)`,
  '101-v1-sau': `$ npx vitest run demo10/truong-phai/mockist-v1.test.js demo10/truong-phai/classicist.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/truong-phai/mockist-v1.test.js (1 test | 1 failed) 5ms
   ❯ cancelBooking (mockist) (1)
     × removes the booking, updates the waitlist and mails the first student 3ms
 ✓ demo10/truong-phai/classicist.test.js (3 tests) 62ms
   ✓ cancelBooking (3)
     ✓ deletes the booking and offers the slot to the first student waiting 25ms
     ✓ sends no e-mail when nobody is waiting 18ms
     ✓ refuses an unknown booking with NOT_FOUND 18ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/truong-phai/mockist-v1.test.js > cancelBooking (mockist) > removes the booking, updates the waitlist and mails the first student
BookingError: NOT_FOUND
 ❯ cancelBooking src/booking/waitlistService.js:10:23
      8| export async function cancelBooking({ repo, waitlists, mailer, now = (…
      9|   const booking = await repo.remove(id);
     10|   if (!booking) throw new BookingError('NOT_FOUND');
       |                       ^
     11|   const key = slotKey(booking);
     12|   const { offer, queue } = offerNext(waitlists.get(key) ?? [], now());
 ❯ demo10/truong-phai/mockist-v1.test.js:14:5

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { code: 'NOT_FOUND' }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 3 passed (4)
   Start at  10:12:17
   Duration  166ms (tests 62%, import 18%, transform 15%, worker 5%)`,
  '101-v1-truoc': `$ node scripts/thu-loi.mjs src/booking/waitlistService.js "const booking = await repo.remove(id);" "const booking = await repo.findById(id); if (booking) await repo.remove(id);" demo10/truong-phai/mockist-v1.test.js demo10/truong-phai/classicist.test.js
planted in src/booking/waitlistService.js:  const booking = await repo.remove(id);  →  const booking = await repo.findById(id); if (booking) await repo.remove(id);


 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/truong-phai/mockist-v1.test.js (1 test) 3ms
   ✓ cancelBooking (mockist) (1)
     ✓ removes the booking, updates the waitlist and mails the first student 2ms
 ✓ demo10/truong-phai/classicist.test.js (3 tests) 68ms
   ✓ cancelBooking (3)
     ✓ deletes the booking and offers the slot to the first student waiting 30ms
     ✓ sends no e-mail when nobody is waiting 22ms
     ✓ refuses an unknown booking with NOT_FOUND 16ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  10:12:16
   Duration  204ms (tests 50%, transform 32%, import 14%, worker 4%)`,
  '102-1-ngay-tho': `$ npx vitest run demo10/dac-ta/1-ngay-tho.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/dac-ta/1-ngay-tho.test.js (1 test | 1 failed) 5ms
   × prints the report of BE-201 4ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/dac-ta/1-ngay-tho.test.js > prints the report of BE-201
Error: connect ECONNREFUSED 127.0.0.1:54399
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
Serialized Error: { errno: -61, code: 'ECONNREFUSED', syscall: 'connect', address: '127.0.0.1', port: 54399 }
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  10:12:48
   Duration  161ms (import 53%, transform 36%, tests 7%, worker 5%)`,
  '102-2-doc-loi': `$ npx vitest run demo10/dac-ta/2-doc-loi.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/dac-ta/2-doc-loi.test.js (1 test | 1 failed) 8ms
   × prints the report of BE-201 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/dac-ta/2-doc-loi.test.js > prints the report of BE-201
AssertionError: expected 'LAB BE-201 - 2026/10\\n2026-10-05 08:0…' to be '' // Object.is equality

- Expected
+ Received

+ LAB BE-201 - 2026/10
+ 2026-10-05 08:00-10:00 20 seats
+ 2026-10-12 13:30-15:00 25 seats
+ 2026-10-19 09:00-11:00 18 seats
+ Bookings: 3
+ Hours: 5.5
+ Large (>30 seats): 0
+ Weekend/holiday: 0
+

 ❯ demo10/dac-ta/2-doc-loi.test.js:20:41
     18|
     19| it('prints the report of BE-201', async () => {
     20|   expect(await monthlyReport('BE-201')).toBe('');
       |                                         ^
     21| });
     22|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  10:12:48
   Duration  162ms (transform 45%, import 30%, tests 18%, worker 7%)`,
  '102-3-chot': `$ npx vitest run demo10/dac-ta/3-chot.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/dac-ta/3-chot.test.js (1 test) 3ms
   ✓ prints the report of BE-201 3ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:12:49
   Duration  108ms (transform 55%, import 27%, tests 11%, worker 7%)`,
  '102-4-lan-dau': `$ npx vitest run demo10/dac-ta/4-golden.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/dac-ta/4-golden.test.js (1 test) 4ms
   ✓ prints the same reports as before, for every lab and month we keep 4ms

  Snapshots  1 written
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:12:50
   Duration  119ms (transform 56%, import 27%, tests 11%, worker 6%)`,
  '102-4-lan-sau': `$ npx vitest run demo10/dac-ta/4-golden.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/dac-ta/4-golden.test.js (1 test) 5ms
   ✓ prints the same reports as before, for every lab and month we keep 4ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:12:50
   Duration  101ms (import 42%, transform 25%, tests 21%, worker 11%)`,
  '102-approved': `$ head -18 demo10/dac-ta/__approved__/monthly-report.txt
LAB BE-201 - 2026/09
2026-09-30 14:00-16:00 25 seats
2026-09-01 08:00-09:00 10 seats
2026-09-02 08:00-12:00 35 seats
Bookings: 3
Hours: 7
Large (>30 seats): 1
Weekend/holiday: 2
----
LAB BE-305 - 2026/09
No bookings.
----
LAB BE-201 - 2026/10
2026-10-06 08:00-10:00 20 seats
2026-10-03 13:30-15:00 30 seats
2026-10-04 09:00-11:30 31 seats (pending)
2026-10-20 18:00-21:00 28 seats
Bookings: 4`,
  '102-cov-3': `$ npx vitest run demo10/dac-ta/3-chot.test.js --coverage --coverage.include=demo10/legacy/monthlyReport.v0.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ demo10/dac-ta/3-chot.test.js (1 test) 4ms
   ✓ prints the report of BE-201 4ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:12:51
   Duration  180ms (transform 48%, import 25%, worker 20%, tests 8%)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |   91.17 |    66.66 |     100 |   96.42 |                   
 ...lyReport.v0.js |   91.17 |    66.66 |     100 |   96.42 | 34                
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 91.17% ( 31/34 )
Branches     : 66.66% ( 12/18 )
Functions    : 100% ( 1/1 )
Lines        : 96.42% ( 27/28 )
================================================================================
ERROR: Coverage for branches (66.66%) does not meet global threshold (80%)`,
  '102-cov-4': `$ npx vitest run demo10/dac-ta/4-golden.test.js --coverage --coverage.include=demo10/legacy/monthlyReport.v0.js

 RUN  v5.0.5 …/labflow-lite
      Coverage enabled with v8

 ✓ demo10/dac-ta/4-golden.test.js (1 test) 6ms
   ✓ prints the same reports as before, for every lab and month we keep 5ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:12:52
   Duration  148ms (transform 44%, import 23%, worker 20%, tests 13%)

 % Coverage report from v8
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |                   
 ...lyReport.v0.js |     100 |      100 |     100 |     100 |                   
-------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 34/34 )
Branches     : 100% ( 18/18 )
Functions    : 100% ( 1/1 )
Lines        : 100% ( 28/28 )
================================================================================`,
  '102-gd0': `$ npx vitest run src/legacy/monthlyReport.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/legacy/monthlyReport.test.js (2 tests) 6ms
   ✓ monthlyReport (characterization) (2)
     ✓ prints the same reports as v0, for every lab and month we keep 4ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  10:13:05
   Duration  124ms (transform 58%, import 23%, tests 13%, worker 6%)`,
  '102-gd1': `$ npx vitest run src/legacy/monthlyReport.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/legacy/monthlyReport.test.js (2 tests) 6ms
   ✓ monthlyReport (characterization) (2)
     ✓ prints the same reports as v0, for every lab and month we keep 4ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 1ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  10:13:05
   Duration  114ms (transform 49%, import 27%, tests 16%, worker 7%)`,
  '102-gd2': `$ npx vitest run src/legacy/monthlyReport.test.js src/report/monthly.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/legacy/monthlyReport.test.js (2 tests) 6ms
   ✓ monthlyReport (characterization) (2)
     ✓ prints the same reports as v0, for every lab and month we keep 4ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 1ms
 ✓ src/report/monthly.test.js (3 tests) 3ms
   ✓ buildMonthlyReport (2)
     ✓ prints one line per kept booking and the four totals 1ms
     ✓ counts Saturday and Sunday by the calendar date, whatever the time zone of the machine 0ms
   ✓ monthlyReport with injected dependencies (object seams) (1)
     ✓ reads the bookings, the holidays and today from what it is given 1ms

 Test Files  2 passed (2)
      Tests  5 passed (5)
   Start at  10:13:06
   Duration  133ms (import 48%, transform 36%, tests 10%, worker 6%)`,
  '102-mut-3': `$ node demo10/dac-ta/dot-bien-dac-ta.mjs demo10/dac-ta/3-chot.test.js
✘ SURVIVED  #1 a 30-seat booking counts as large
✘ SURVIVED  #2 pending bookings disappear from the report
✘ SURVIVED  #3 Sunday is no longer a weekend
✘ SURVIVED  #4 the first holiday of the year is ignored
✔ killed    #5 hours rounded to whole hours
✘ SURVIVED  #6 the (pending) mark is lost
✔ killed    #7 the report shows last month
✘ SURVIVED  #8 the empty-month line changes (the office Excel import breaks)
✘ SURVIVED  #9 every lab is counted in every report
✔ killed    #10 only the last booking counts toward the hours

3/10 changes caught by demo10/dac-ta/3-chot.test.js`,
  '102-mut-4': `$ node demo10/dac-ta/dot-bien-dac-ta.mjs demo10/dac-ta/4-golden.test.js
✔ killed    #1 a 30-seat booking counts as large
✔ killed    #2 pending bookings disappear from the report
✔ killed    #3 Sunday is no longer a weekend
✔ killed    #4 the first holiday of the year is ignored
✔ killed    #5 hours rounded to whole hours
✔ killed    #6 the (pending) mark is lost
✔ killed    #7 the report shows last month
✔ killed    #8 the empty-month line changes (the office Excel import breaks)
✔ killed    #9 every lab is counted in every report
✔ killed    #10 only the last booking counts toward the hours

10/10 changes caught by demo10/dac-ta/4-golden.test.js`,
  '102-truot': `$ node scripts/thu-loi.mjs src/report/monthly.js "Math.round((minutes / 60) * 10) / 10" "(minutes / 60).toFixed(1)" src/legacy/monthlyReport.test.js
planted in src/report/monthly.js:  Math.round((minutes / 60) * 10) / 10  →  (minutes / 60).toFixed(1)


 RUN  v5.0.5 …/labflow-lite

 ❯ src/legacy/monthlyReport.test.js (2 tests | 1 failed) 8ms
   ❯ monthlyReport (characterization) (2)
     × prints the same reports as v0, for every lab and month we keep 7ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 1ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/legacy/monthlyReport.test.js > monthlyReport (characterization) > prints the same reports as v0, for every lab and month we keep
Error: Snapshot \`monthlyReport (characterization) > prints the same reports as v0, for every lab and month we keep 1\` mismatched

- Expected
+ Received

@@ -1,11 +1,11 @@
  LAB BE-201 - 2026/09
  2026-09-30 14:00-16:00 25 seats
  2026-09-01 08:00-09:00 10 seats
  2026-09-02 08:00-12:00 35 seats
  Bookings: 3
- Hours: 7
+ Hours: 7.0
  Large (>30 seats): 1
  Weekend/holiday: 2
  ----
  LAB BE-305 - 2026/09
  No bookings.
@@ -14,11 +14,11 @@
  2026-10-06 08:00-10:00 20 seats
  2026-10-03 13:30-15:00 30 seats
  2026-10-04 09:00-11:30 31 seats (pending)
  2026-10-20 18:00-21:00 28 seats
  Bookings: 4
- Hours: 9
+ Hours: 9.0
  Large (>30 seats): 1
  Weekend/holiday: 2
  ----
  LAB BE-305 - 2026/10
  2026-10-06 10:00-12:30 40 seats

 ❯ src/legacy/monthlyReport.test.js:22:5
     20|       for (const lab of ['BE-201', 'BE-305']) all += await monthlyRepo…
     21|     }
     22|     await expect(all).toMatchFileSnapshot('./__approved__/monthly-repo…
       |     ^
     23|   });
     24|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


  Snapshots  1 failed
 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  10:13:21
   Duration  124ms (transform 42%, import 28%, tests 23%, worker 8%)`,
  '102-tz-do': `$ TZ=America/New_York npx vitest run demo10/dac-ta/4-golden.test.js

 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/dac-ta/4-golden.test.js (1 test | 1 failed) 7ms
   × prints the same reports as before, for every lab and month we keep 7ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/dac-ta/4-golden.test.js > prints the same reports as before, for every lab and month we keep
Error: Snapshot \`prints the same reports as before, for every lab and month we keep 1\` mismatched

- Expected
+ Received

@@ -16,11 +16,11 @@
  2026-10-04 09:00-11:30 31 seats (pending)
  2026-10-20 18:00-21:00 28 seats
  Bookings: 4
  Hours: 9
  Large (>30 seats): 1
- Weekend/holiday: 2
+ Weekend/holiday: 1
  ----
  LAB BE-305 - 2026/10
  2026-10-06 10:00-12:30 40 seats
  Bookings: 1
  Hours: 2.5

 ❯ demo10/dac-ta/4-golden.test.js:21:3
     19|     for (const lab of ['BE-201', 'BE-305']) all += await monthlyReport…
     20|   }
     21|   await expect(all).toMatchFileSnapshot('./__approved__/monthly-report…
       |   ^
     22| });
     23|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


  Snapshots  1 failed
 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  23:13:10
   Duration  109ms (import 40%, tests 29%, transform 21%, worker 10%)`,
  '102-tz-moi': `$ for tz in UTC Asia/Ho_Chi_Minh America/New_York; do echo "TZ=$tz"; TZ=$tz npx vitest run src/legacy/monthlyReport.test.js src/report/monthly.test.js | grep -E "Tests  "; done
TZ=UTC
      Tests  5 passed (5)
TZ=Asia/Ho_Chi_Minh
      Tests  5 passed (5)
TZ=America/New_York
      Tests  5 passed (5)`,
  '102-tz-v0': `$ for tz in UTC Asia/Ho_Chi_Minh America/New_York; do echo "TZ=$tz"; TZ=$tz npx vitest run demo10/dac-ta/4-golden.test.js 2>&1 | grep -E "Tests  "; done
TZ=UTC
      Tests  1 passed (1)
TZ=Asia/Ho_Chi_Minh
      Tests  1 passed (1)
TZ=America/New_York
      Tests  1 failed (1)`,
  '103-impl': `$ node scripts/thu-loi.mjs src/booking/waitlistService.js "waitlists.set(key, queue);" "if (offer) waitlists.set(key, queue);" demo10/review/pr57.test.js demo10/review/pr57-sau-review.test.js
planted in src/booking/waitlistService.js:  waitlists.set(key, queue);  →  if (offer) waitlists.set(key, queue);


 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/review/pr57-sau-review.test.js (3 tests) 39ms
   ✓ cancelBooking and the waitlist (2)
     ✓ offers the freed slot by e-mail to the student who has waited longest 19ms
     ✓ sends no e-mail and leaves nobody waiting when the line was empty 18ms
   ✓ joinWaitlist (1)
     ✓ lets three different students wait and refuses a fourth with WAITLIST_FULL 0ms
 ❯ demo10/review/pr57.test.js (4 tests | 1 failed) 40ms
   ❯ waitlist (4)
     ✓ should send mail 1ms
     ✓ should work 19ms
     ✓ should return correct value 0ms
     × should handle edge case 18ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/review/pr57.test.js > waitlist > should handle edge case
AssertionError: expected "set" to be called 1 times, but got 0 times
 ❯ demo10/review/pr57.test.js:41:17
     39|     const mailer = createFakeMailer();
     40|     await cancelBooking({ repo, waitlists, mailer }, booking.id);
     41|     expect(set).toHaveBeenCalledTimes(1);
       |                 ^
     42|     expect(set).toHaveBeenCalledWith(KEY, []);
     43|     expect(mailer.outbox.length).toBe(0);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 6 passed (7)
   Start at  10:14:33
   Duration  185ms (tests 51%, transform 29%, import 16%, worker 4%)`,
  '103-mock': `$ node scripts/thu-loi.mjs src/booking/waitlistService.js "if (offer) {" "if (false) {" demo10/review/pr57.test.js -t "should send mail"
planted in src/booking/waitlistService.js:  if (offer) {  →  if (false) {


 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/review/pr57.test.js (4 tests | 3 skipped) 2ms
   ✓ waitlist (4)
     ✓ should send mail 1ms
     ↓ should work
     ↓ should return correct value
     ↓ should handle edge case

 Test Files  1 passed (1)
      Tests  1 passed | 3 skipped (4)
   Start at  10:13:46
   Duration  120ms (transform 54%, import 31%, worker 8%, tests 7%)`,
  '103-pr-diff': `$ git diff main...pr/57-waitlist-tests -- demo10/review/pr57.test.js
diff --git a/demo10/review/pr57.test.js b/demo10/review/pr57.test.js
new file mode 100644
index 0000000..6c8da65
--- /dev/null
+++ b/demo10/review/pr57.test.js
@@ -0,0 +1,45 @@
+// Pull request #57 "Add tests for the waitlist", AS SUBMITTED — lesson 10.3 reviews it. Every test here has a smell.
+import { describe, it, expect, vi } from 'vitest';
+import { bookLab, createMemoryRepo } from '../../src/booking/service.js';
+import { cancelBooking } from '../../src/booking/waitlistService.js';
+import { joinWaitlist } from '../../src/rules/waitlist.js';
+import { createFakeMailer } from '../../test/support/fakes.js';
+
+const input = { lab: 'BE-201', date: '2026-11-16', seats: 20, role: 'STUDENT', start: '08:00', end: '10:00' };
+const KEY = 'BE-201 2026-11-16 08:00-10:00';
+
+describe('waitlist', () => {
+  it('should send mail', async () => {
+    const mailer = { send: vi.fn().mockResolvedValue('msg-1') };
+    await mailer.send({ to: 'an@labflow.example', subject: 'A seat is free' });
+    expect(mailer.send).toHaveBeenCalled();
+  });
+
+  it('should work', async () => {
+    const repo = createMemoryRepo();
+    const booking = await bookLab(repo, input);
+    const waitlists = new Map([[KEY, [{ userId: 'an@labflow.example' }, { userId: 'chi@labflow.example' }]]]);
+    const mailer = createFakeMailer();
+    const result = await cancelBooking({ repo, waitlists, mailer }, booking.id);
+    expect({ booking, result, waitlists: [...waitlists], outbox: mailer.outbox }).toMatchSnapshot();
+  });
+
+  it('should return correct value', { retry: 3 }, () => {
+    const student = () => 'student' + Math.floor(Math.random() * 10) + '@labflow.example';
+    let queue = [];
+    for (let i = 0; i < 3; i++) queue = joinWaitlist(queue, { userId: student(), holderId: 'binh@labflow.example' }).queue;
+    expect(queue.length).toBe(3);
+  });
+
+  it('should handle edge case', async () => {
+    const repo = createMemoryRepo();
+    const booking = await bookLab(repo, input);
+    const waitlists = new Map();
+    const set = vi.spyOn(waitlists, 'set');
+    const mailer = createFakeMailer();
+    await cancelBooking({ repo, waitlists, mailer }, booking.id);
+    expect(set).toHaveBeenCalledTimes(1);
+    expect(set).toHaveBeenCalledWith(KEY, []);
+    expect(mailer.outbox.length).toBe(0);
+  });
+});`,
  '103-pr-stat': `$ git diff --stat main...pr/57-waitlist-tests
 demo10/review/__snapshots__/pr57.test.js.snap | 37 ++++++++++++++++++++++
 demo10/review/pr57.test.js                    | 45 +++++++++++++++++++++++++++
 2 files changed, 82 insertions(+)`,
  '103-pr-xanh': `$ npx vitest run demo10/review/pr57.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/review/pr57.test.js (4 tests) 43ms
   ✓ waitlist (4)
     ✓ should send mail 1ms
     ✓ should work 19ms
     ✓ should return correct value 4ms (retry x3)
     ✓ should handle edge case 18ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  10:13:45
   Duration  180ms (tests 65%, transform 15%, import 15%, worker 5%)`,
  '103-retry-co': `$ node scripts/lap-lai.mjs 30 demo10/review/pr57.test.js -t "should return correct value"
red in 0/30 runs (17.8 s)`,
  '103-retry-khong': `$ sed "s/{ retry: 3 }, //" demo10/review/pr57.test.js > demo10/review/khong-retry.test.js && node scripts/lap-lai.mjs 30 demo10/review/khong-retry.test.js -t "should return correct value"; rm demo10/review/khong-retry.test.js
red in 10/30 runs (22.6 s)`,
  '103-retry-thay': `$ for i in 1 2 3 4 5 6; do npx vitest run demo10/review/pr57.test.js -t "should return correct value" | grep "should return"; done
     ✓ should return correct value 1ms
     ✓ should return correct value 4ms (retry x1)
     ✓ should return correct value 1ms
     ✓ should return correct value 1ms
     ✓ should return correct value 1ms
     ✓ should return correct value 1ms`,
  '103-sau-lap': `$ node scripts/lap-lai.mjs 30 demo10/review/pr57-sau-review.test.js --sequence.shuffle
red in 0/30 runs (18.3 s)`,
  '103-snap-diff': `$ git diff -- demo10/review/__snapshots__
diff --git a/demo10/review/__snapshots__/pr57.test.js.snap b/demo10/review/__snapshots__/pr57.test.js.snap
index 56ff0ed..9418116 100644
--- a/demo10/review/__snapshots__/pr57.test.js.snap
+++ b/demo10/review/__snapshots__/pr57.test.js.snap
@@ -16,19 +16,19 @@ exports[\`waitlist > should work 1\`] = \`
   "outbox": [
     {
       "subject": "A seat is free: BE-201 2026-11-16 08:00-10:00 (answer within 30 minutes)",
-      "to": "an@labflow.example",
+      "to": "chi@labflow.example",
     },
   ],
   "result": {
     "cancelled": 1,
-    "offeredTo": "an@labflow.example",
+    "offeredTo": "chi@labflow.example",
   },
   "waitlists": [
     [
       "BE-201 2026-11-16 08:00-10:00",
       [
         {
-          "userId": "chi@labflow.example",
+          "userId": "an@labflow.example",
         },
       ],
     ],`,
  '103-snap-do': `$ node scripts/thu-loi.mjs src/rules/waitlist.js "const [first, ...rest] = queue;" "const [first, ...rest] = [...queue].reverse();" demo10/review/pr57.test.js
planted in src/rules/waitlist.js:  const [first, ...rest] = queue;  →  const [first, ...rest] = [...queue].reverse();


 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/review/pr57.test.js (4 tests | 1 failed) 44ms
   ❯ waitlist (4)
     ✓ should send mail 1ms
     × should work 23ms
     ✓ should return correct value 0ms
     ✓ should handle edge case 18ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/review/pr57.test.js > waitlist > should work
Error: Snapshot \`waitlist > should work 1\` mismatched

- Expected
+ Received

@@ -11,23 +11,23 @@
      "status": "CONFIRMED",
    },
    "outbox": [
      {
        "subject": "A seat is free: BE-201 2026-11-16 08:00-10:00 (answer within 30 minutes)",
-       "to": "an@labflow.example",
+       "to": "chi@labflow.example",
      },
    ],
    "result": {
      "cancelled": 1,
-     "offeredTo": "an@labflow.example",
+     "offeredTo": "chi@labflow.example",
    },
    "waitlists": [
      [
        "BE-201 2026-11-16 08:00-10:00",
        [
          {
-           "userId": "chi@labflow.example",
+           "userId": "an@labflow.example",
          },
        ],
      ],
    ],
  }

 ❯ demo10/review/pr57.test.js:24:83
     22|     const mailer = createFakeMailer();
     23|     const result = await cancelBooking({ repo, waitlists, mailer }, bo…
     24|     expect({ booking, result, waitlists: [...waitlists], outbox: maile…
       |                                                                                   ^
     25|   });
     26|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


  Snapshots  1 failed
 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)
   Start at  10:13:47
   Duration  175ms (tests 56%, transform 26%, import 14%, worker 3%)`,
  '103-snap-u': `$ node scripts/thu-loi.mjs src/rules/waitlist.js "const [first, ...rest] = queue;" "const [first, ...rest] = [...queue].reverse();" demo10/review/pr57.test.js -u
planted in src/rules/waitlist.js:  const [first, ...rest] = queue;  →  const [first, ...rest] = [...queue].reverse();


 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/review/pr57.test.js (4 tests) 41ms
   ✓ waitlist (4)
     ✓ should send mail 1ms
     ✓ should work 20ms
     ✓ should return correct value 0ms
     ✓ should handle edge case 18ms

  Snapshots  1 updated 
 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  10:13:47
   Duration  150ms (tests 63%, import 17%, transform 15%, worker 4%)`,
  '103-so-sanh': `$ node demo10/review/so-sanh.mjs
bug      nobody is e-mailed                               submitted: red   ✔   reviewed: red   ✔
bug      the slot goes to the last in line                submitted: red   ✔   reviewed: red   ✔
bug      a fourth student can wait                        submitted: green ✘   reviewed: red   ✔
harmless bookings also store where they came from         submitted: red   ✘   reviewed: green ✔
harmless the waitlist Map is written only when it changed submitted: red   ✘   reviewed: green ✔

right answers — submitted: 2/5, reviewed: 5/5`,
  '103-ten-tot': `$ node scripts/thu-loi.mjs src/rules/waitlist.js "const [first, ...rest] = queue;" "const [first, ...rest] = [...queue].reverse();" demo10/review/pr57-sau-review.test.js
planted in src/rules/waitlist.js:  const [first, ...rest] = queue;  →  const [first, ...rest] = [...queue].reverse();


 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/review/pr57-sau-review.test.js (3 tests | 1 failed) 42ms
   ❯ cancelBooking and the waitlist (2)
     × offers the freed slot by e-mail to the student who has waited longest 23ms
     ✓ sends no e-mail and leaves nobody waiting when the line was empty 18ms
   ✓ joinWaitlist (1)
     ✓ lets three different students wait and refuses a fourth with WAITLIST_FULL 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/review/pr57-sau-review.test.js > cancelBooking and the waitlist > offers the freed slot by e-mail to the student who has waited longest
AssertionError: expected { cancelled: 1, …(1) } to deeply equal { cancelled: 1, …(1) }

- Expected
+ Received

  {
    "cancelled": 1,
-   "offeredTo": "an@labflow.example",
+   "offeredTo": "chi@labflow.example",
  }

 ❯ demo10/review/pr57-sau-review.test.js:27:20
     25|     const { result, outbox, booking } = await cancelWith(waitlists);
     26|
     27|     expect(result).toEqual({ cancelled: booking.id, offeredTo: 'an@lab…
       |                    ^
     28|     expect(outbox).toEqual([{ to: 'an@labflow.example', subject: 'A se…
     29|     expect(waitlists.get(KEY)).toEqual(line('chi'));

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  10:13:48
   Duration  152ms (tests 59%, transform 24%, import 13%, worker 3%)`,
  '103-th-bug': `$ node scripts/thu-loi.mjs src/rules/waitlist.js "now < offer.expiresAt ?" "false ?" demo10/review/th103-truoc.test.js demo10/review/th103-sau.test.js
planted in src/rules/waitlist.js:  now < offer.expiresAt ?  →  false ?


 RUN  v5.0.5 …/labflow-lite

 ❯ demo10/review/th103-sau.test.js (2 tests | 1 failed) 6ms
   ❯ acceptOffer (2)
     × accepts the offer one minute before it expires (10:29) 5ms
     ✓ refuses it at 10:30 with OFFER_EXPIRED 0ms
 ✓ demo10/review/th103-truoc.test.js (1 test) 1003ms
   ✓ should work 1002ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo10/review/th103-sau.test.js > acceptOffer > accepts the offer one minute before it expires (10:29)
AssertionError: expected { ok: false, code: 'OFFER_EXPIRED' } to deeply equal { ok: true }

- Expected
+ Received

  {
-   "ok": true,
+   "code": "OFFER_EXPIRED",
+   "ok": false,
  }

 ❯ demo10/review/th103-sau.test.js:11:45
      9|
     10|   it('accepts the offer one minute before it expires (10:29)', () => {
     11|     expect(acceptOffer(offer, at('10:29'))).toEqual({ ok: true });
       |                                             ^
     12|   });
     13|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 1 passed (2)
      Tests  1 failed | 2 passed (3)
   Start at  10:18:43
   Duration  1.10s (tests 96%, transform 2%, import 1%)`,
  '103-th-sau': `$ npx vitest run demo10/review/th103-sau.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/review/th103-sau.test.js (2 tests) 2ms
   ✓ acceptOffer (2)
     ✓ accepts the offer one minute before it expires (10:29) 1ms
     ✓ refuses it at 10:30 with OFFER_EXPIRED 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  10:18:35
   Duration  103ms (transform 52%, import 29%, worker 10%, tests 9%)`,
  '103-th-truoc': `$ npx vitest run demo10/review/th103-truoc.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/review/th103-truoc.test.js (1 test) 1003ms
   ✓ should work 1002ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:18:33
   Duration  1.10s (tests 98%, transform 1%, import 1%)`,
  '104-cham-mau': `$ node demo10/phong-van/cham.mjs src/rules/busy.test.js
✔ killed    #1 touching bookings stay apart
✔ killed    #2 a booking inside another one cuts the block short
✔ killed    #3 input order is trusted (no sort)
✔ killed    #4 sorted by end time instead of start
✔ killed    #5 the caller's array is reordered
✔ killed    #6 a booking inside another one becomes its own block

6/6 bugs caught by src/rules/busy.test.js`,
  '104-cham-yeu': `$ node demo10/phong-van/cham.mjs demo10/phong-van/ung-vien-yeu.test.js
✘ SURVIVED  #1 touching bookings stay apart
✘ SURVIVED  #2 a booking inside another one cuts the block short
✘ SURVIVED  #3 input order is trusted (no sort)
✘ SURVIVED  #4 sorted by end time instead of start
✘ SURVIVED  #5 the caller's array is reordered
✘ SURVIVED  #6 a booking inside another one becomes its own block

0/6 bugs caught by demo10/phong-van/ung-vien-yeu.test.js`,
  '104-mau': `$ npx vitest run src/rules/busy.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/busy.test.js (8 tests) 4ms
   ✓ mergeBusy (8)
     ✓ returns no blocks for a day without bookings 1ms
     ✓ keeps separate bookings apart, sorted by start 0ms
     ✓ merges overlapping bookings into one block 0ms
     ✓ merges touching (10:00 ends, 10:00 starts) bookings into one block 0ms
     ✓ merges one inside the other bookings into one block 0ms
     ✓ merges inside, listed first bookings into one block 0ms
     ✓ does not change the array it was given 0ms
     ✓ rejects a time that is not HH:MM 0ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  10:15:15
   Duration  107ms (transform 50%, import 28%, tests 13%, worker 8%)`,
  '104-yeu': `$ npx vitest run demo10/phong-van/ung-vien-yeu.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo10/phong-van/ung-vien-yeu.test.js (2 tests) 2ms
   ✓ test mergeBusy 1ms
   ✓ test mergeBusy 2 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  10:15:11
   Duration  108ms (transform 57%, import 27%, worker 9%, tests 7%)`,
  '105-mutation': `$ npm run test:mutation

> labflow-lite@1.0.0 test:mutation
> stryker run

10:15:35 (97855) INFO ProjectReader Found 10 of 341 file(s) to be mutated.
10:15:35 (97855) INFO Instrumenter Instrumented 10 source file(s) with 396 mutant(s)
10:15:35 (97855) INFO ConcurrencyTokenProvider Creating 9 test runner process(es).
10:15:35 (97855) INFO BroadcastReporter Detected that current console does not support the "progress" reporter, downgrading to "progress-append-only" reporter
10:15:35 (97855) INFO DryRunExecutor Starting initial test run (vitest test runner with "perTest" coverage analysis). This may take a while.
10:15:38 (97855) INFO DryRunExecutor Initial test run succeeded. Ran 155 tests in 2 seconds (net 402.0931300000011 ms, overhead 1695.906869999999 ms).
Mutation testing 58% (elapsed: <1m, remaining: <1m) 309/396 tested (4 survived, 2 timed out)

All tests
  api/server.test.js
    ✓ POST /api/bookings > 201 with Location and the public booking [line 8] (killed 34)
    ✘ POST /api/bookings > 401 without a token [line 16] (covered 0)
    ✘ POST /api/bookings > 400 VALIDATION for seats 0, and for a role in the body [line 21] (covered 0)
    ✓ POST /api/bookings > 422 for a rule, 409 for a taken slot [line 30] (killed 7)
    ~ who may read what > the owner reading booking 1 → 200 [line 47] (covered 73)
    ~ who may read what > another student reading booking 1 → 404 [line 47] (covered 73)
    ~ who may read what > a lecturer reading booking 1 → 404 [line 47] (covered 73)
    ~ who may read what > an admin reading booking 1 → 200 [line 47] (covered 73)
    ✘ who may read what > STUDENT on the admin list → 403 [line 53] (covered 0)
    ✘ who may read what > LECTURER on the admin list → 403 [line 53] (covered 0)
    ✘ who may read what > ADMIN on the admin list → 200 [line 53] (covered 0)
    ✘ who may read what > an expired token → 401 (clock fixed in 2030) [line 58] (covered 0)
  booking
    service.test.js
      ~ bookLab > stores a confirmed booking [line 7] (covered 73)
      ~ bookLab > rejects a rule violation with its code before touching the database [line 11] (covered 44)
      ~ bookLab > rejects an overlapping booking with OVERLAP [line 16] (covered 73)
      ~ bookLab > accepts the slot that starts when the previous one ends [line 22] (covered 73)
      ~ bookLab > turns a failing lookup into STORAGE_DOWN and keeps the cause [line 28] (covered 52)
      ~ bookLab > turns a failing insert into STORAGE_DOWN [line 36] (covered 73)
    waitlistService.test.js
      ~ cancelBooking > deletes the booking and offers the slot to the first student waiting [line 18] (covered 82)
      ~ cancelBooking > sends no e-mail when nobody is waiting [line 31] (covered 79)
      ~ cancelBooking > refuses an unknown booking with NOT_FOUND [line 37] (covered 73)
  legacy
    clubFee.test.js
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND [line 33] (killed 21)
      ✓ clubFee (characterization of v0) > quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND [line 33] (killed 2)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND [line 33] (killed 1)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND [line 33] (killed 2)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND [line 33] (killed 1)
      ✓ clubFee (characterization of v0) > quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND [line 33] (killed 3)
      ~ clubFee (characterization of v0) > quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND [line 33] (covered 32)
      ✓ clubFee (characterization of v0) > quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND [line 33] (killed 6)
      ✓ clubFee (characterization of v0) > quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND [line 33] (killed 1)
      ~ clubFee (characterization of v0) > quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND [line 33] (covered 31)
      ~ clubFee (characterization of v0) > quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND [line 33] (covered 32)
      ~ clubFee (characterization of v0) > quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND [line 33] (covered 31)
      ~ clubFee (characterization of v0) > charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) [line 37] (covered 32)
      ~ clubFee (characterization of v0) > returns NaN for a building it has no price for [line 41] (covered 31)
    monthlyReport.test.js
      ~ monthlyReport (characterization) > prints the same reports as v0, for every lab and month we keep [line 16] (covered 21)
      ~ monthlyReport (characterization) > counts no holiday when the holiday service cannot be reached, as v0 did [line 25] (covered 21)
  notify/notify.test.js
    ✘ buildMail (pure) > CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn [line 13] (covered 0)
    ✘ buildMail (pure) > PENDING booking with 31 seats → mail to approvals@labflow.example [line 13] (covered 0)
    ~ bookAndNotify > a confirmed booking e-mails the student once [line 19] (covered 73)
    ~ bookAndNotify > a 31-seat student booking e-mails only the approver [line 26] (covered 73)
    ~ bookAndNotify > a failed e-mail keeps the booking and reports notified: false [line 32] (covered 73)
    ~ bookAndNotify > a failed e-mail is logged with the booking id and the reason [line 39] (covered 73)
    ~ bookAndNotify > a rejected booking sends no e-mail [line 45] (covered 44)
  report/monthly.test.js
    ~ buildMonthlyReport > prints one line per kept booking and the four totals [line 8] (covered 21)
    ~ buildMonthlyReport > counts Saturday and Sunday by the calendar date, whatever the time zone of the machine [line 14] (covered 21)
    ~ monthlyReport with injected dependencies (object seams) > reads the bookings, the holidays and today from what it is given [line 21] (covered 21)
  rules
    booking.test.js
      ✓ checkSlot > accepts > 07:00–08:00 (60 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 20:00–21:00 (60 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–08:30 (30 min) [line 11] (killed 1)
      ✓ checkSlot > accepts > 08:00–12:00 (240 min) [line 11] (killed 1)
      ~ checkSlot > rejects > 06:30–08:00 with OUTSIDE_HOURS [line 25] (covered 44)
      ✓ checkSlot > rejects > 20:00–21:30 with OUTSIDE_HOURS [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:15–09:00 with OFF_GRID [line 25] (killed 6)
      ✓ checkSlot > rejects > 08:00–09:10 with OFF_GRID [line 25] (killed 1)
      ✓ checkSlot > rejects > 10:00–09:00 with END_BEFORE_START [line 25] (killed 4)
      ✓ checkSlot > rejects > 09:00–09:00 with END_BEFORE_START [line 25] (killed 1)
      ✓ checkSlot > rejects > 08:00–12:30 with TOO_LONG [line 25] (killed 4)
      ✓ isWithinBookingWindow (BR-05) > -1 days → false [line 32] (killed 7)
      ✓ isWithinBookingWindow (BR-05) > 0 days → true [line 32] (killed 3)
      ✓ isWithinBookingWindow (BR-05) > 14 days → true [line 32] (killed 1)
      ✓ isWithinBookingWindow (BR-05) > 15 days → false [line 32] (killed 1)
      ~ isWithinBookingWindow (BR-05) > rejects 1.5 [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects NaN [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects 3 [line 35] (covered 6)
      ~ isWithinBookingWindow (BR-05) > rejects null [line 35] (covered 6)
      ✓ needsApproval (BR-06 decision table) > STUDENT, 30 seats → false [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > STUDENT, 31 seats → true [line 46] (killed 4)
      ✓ needsApproval (BR-06 decision table) > LECTURER, 31 seats → false [line 46] (killed 5)
      ✓ needsApproval (BR-06 decision table) > ADMIN, 31 seats → false [line 46] (killed 2)
      ✓ needsApproval (BR-06 decision table) > throws RangeError for 0 seats [line 49] (killed 4)
      ~ needsApproval (BR-06 decision table) > throws RangeError for -5 seats [line 49] (covered 10)
      ~ needsApproval (BR-06 decision table) > throws RangeError for 2.5 seats [line 49] (covered 7)
      ✓ createBooking > builds a PENDING booking for 31 seats [line 55] (killed 1)
      ✓ createBooking > throws the rule code for a bad slot [line 59] (killed 2)
    busy.test.js
      ✓ mergeBusy > returns no blocks for a day without bookings [line 8] (killed 2)
      ✓ mergeBusy > keeps separate bookings apart, sorted by start [line 12] (killed 19)
      ✓ mergeBusy > merges overlapping bookings into one block [line 21] (killed 3)
      ✓ mergeBusy > merges touching (10:00 ends, 10:00 starts) bookings into one block [line 21] (killed 1)
      ~ mergeBusy > merges one inside the other bookings into one block [line 21] (covered 46)
      ~ mergeBusy > merges inside, listed first bookings into one block [line 21] (covered 46)
      ~ mergeBusy > does not change the array it was given [line 25] (covered 45)
      ~ mergeBusy > rejects a time that is not HH:MM [line 31] (covered 16)
    cancel.test.js
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 07:00, a 09:00 booking can be cancelled → true [line 12] (killed 3)
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 08:00, a 09:00 booking can be cancelled → true [line 12] (killed 1)
      ✓ canCancel (Lite-3: until 60 minutes before the start) > at 08:01, a 09:00 booking can be cancelled → false [line 12] (killed 3)
      ~ canCancel (Lite-3: until 60 minutes before the start) > at 09:30, a 09:00 booking can be cancelled → false [line 12] (covered 7)
    checkin.test.js
      ✓ checkIn (BR-07) > at 07:49 → { ok: false, code: 'TOO_EARLY' } [line 15] (killed 9)
      ✓ checkIn (BR-07) > at 07:50 → { ok: true, late: false } [line 15] (killed 10)
      ✓ checkIn (BR-07) > at 08:00 → { ok: true, late: false } [line 15] (killed 1)
      ✓ checkIn (BR-07) > at 08:01 → { ok: true, late: true } [line 15] (killed 1)
      ✓ checkIn (BR-07) > at 08:15 → { ok: true, late: true } [line 15] (killed 1)
      ✓ checkIn (BR-07) > at 08:16 → { ok: false, code: 'NO_SHOW' } [line 15] (killed 4)
      ✓ checkIn (BR-07) > refuses a PENDING booking [line 19] (killed 4)
      ~ checkIn (BR-07) > refuses a CANCELLED booking [line 19] (covered 8)
      ✓ bannedUntil (BR-08) > bans for 7 days after the third no-show [line 25] (killed 25)
      ~ bannedUntil (BR-08) > counts from the latest no-show, whatever the order [line 28] (covered 30)
      ✓ bannedUntil (BR-08) > two no-shows are not enough [line 31] (killed 1)
      ✓ bannedUntil (BR-08) > the ban still holds on its last day, and is over the day after [line 34] (killed 2)
      ✓ bannedUntil (BR-08) > a no-show 30 days ago no longer counts; 29 days ago still does [line 39] (killed 5)
      ✓ bannedUntil (BR-08) > a no-show today already counts [line 43] (killed 1)
      ✓ bannedUntil (BR-08) > ignores no-shows dated after today [line 46] (killed 1)
      ✓ createNoShowLog > keeps each student separate, in order [line 52] (killed 9)
    clubFee.test.js
      ~ quoteClubFee > charges 1.5 times on a Sunday and the plain price on a Monday [line 8] (covered 32)
    code.test.js
      ✓ makeBookingCode > is "LF-" and 6 characters from the readable alphabet [line 6] (killed 10)
      ✓ makeBookingCode > the same seed gives the same code; 20 codes from one seed are all different [line 9] (killed 3)
      ~ makeBookingCode > can produce the first and the last character of the alphabet [line 14] (covered 9)
      ~ newBookingRecord > takes its id and clock from the caller [line 21] (covered 11)
    days.test.js
      ✓ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (killed 11)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead [line 10] (covered 7)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead [line 10] (covered 7)
      ~ daysAheadVN (BR-05 counted in Viet Nam time) > now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead [line 10] (covered 7)
    mutation-gaps.test.js
      ✓ booking rules: the cases nobody wrote > one seat is a valid booking [line 8] (killed 1)
      ✓ booking rules: the cases nobody wrote > the error says what was wrong [line 11] (killed 1)
      ✓ booking rules: the cases nobody wrote > a small student booking is CONFIRMED [line 14] (killed 6)
      ✓ booking rules: the cases nobody wrote > usageRate adds up the booked share of the 14 opening hours [line 17] (killed 4)
      ✓ parseTime: only exactly HH:MM > refuses 08:000 [line 23] (killed 4)
      ✓ parseTime: only exactly HH:MM > refuses 108:00 [line 23] (killed 1)
      ~ parseTime: only exactly HH:MM > the TypeError is ours, not a crash on null [line 26] (covered 12)
      ✓ parseTime: only exactly HH:MM > says which time is out of range [line 29] (killed 4)
      ✓ newBookingRecord without injected helpers > makes a UUID and stamps the current time [line 35] (killed 4)
    recurring.test.js
      ✓ weeklyDates > books the first date and the same weekday in each following week [line 8] (killed 33)
      ✓ weeklyDates > skips a holiday without adding an extra week [line 14] (killed 3)
      ✓ weeklyDates > keeps a class on the last day of term and drops the weeks after it [line 20] (killed 4)
      ✓ weeklyDates > reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it [line 27] (killed 1)
      ~ weeklyDates > crosses a month and a year correctly [line 32] (covered 43)
      ✓ weeklyDates > accepts 1 week(s) [line 36] (killed 1)
      ✓ weeklyDates > accepts 15 week(s) [line 36] (killed 1)
      ✓ weeklyDates > refuses 0 weeks with BAD_WEEKS [line 40] (killed 8)
      ✓ weeklyDates > refuses 16 weeks with BAD_WEEKS [line 40] (killed 1)
      ~ weeklyDates > refuses 2.5 weeks with BAD_WEEKS [line 40] (covered 11)
      ✓ weeklyDates > refuses a series that starts after the term, and accepts one that starts on its last day [line 44] (killed 4)
    time.test.js
      ~ parseTime > 00:00 → 0 [line 6] (covered 21)
      ~ parseTime > 07:00 → 420 [line 6] (covered 21)
      ~ parseTime > 21:30 → 1290 [line 6] (covered 21)
      ✓ parseTime > 23:59 → 1439 [line 6] (killed 2)
      ~ parseTime > throws TypeError for "7:00" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "07-00" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "" [line 9] (covered 12)
      ~ parseTime > throws TypeError for "abc" [line 9] (covered 12)
      ~ parseTime > throws RangeError for 24:00 [line 12] (covered 17)
      ✓ parseTime > throws RangeError for 07:60 [line 12] (killed 1)
      ~ formatTime > pads to HH:MM [line 18] (covered 6)
      ~ formatTime > round-trips with parseTime for every minute of the day [line 21] (covered 27)
    waitlist.test.js
      ✓ joinWaitlist > puts the first student at position 1 [line 8] (killed 11)
      ✓ joinWaitlist > puts the next student behind the ones already waiting [line 12] (killed 2)
      ✓ joinWaitlist > refuses a student who is already waiting [line 15] (killed 7)
      ✓ joinWaitlist > refuses a fourth student: at most 3 wait for one slot [line 19] (killed 3)
      ✓ joinWaitlist > refuses the student who already holds the slot [line 23] (killed 2)
      ~ joinWaitlist > says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line [line 27] (covered 14)
      ~ joinWaitlist > never changes the queue it was given [line 31] (covered 19)
      ✓ offerNext > offers the slot to the first student in line for 30 minutes [line 41] (killed 9)
      ✓ offerNext > offers nothing when nobody is waiting [line 48] (killed 3)
      ✓ acceptOffer > accepts at 10:29, one minute before the offer expires [line 56] (killed 5)
      ✓ acceptOffer > refuses at 10:30: the offer has expired [line 60] (killed 3)

[Survived] ArithmeticOperator
src/rules/code.js:16:10
-       t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
+       t ^= t - Math.imul(t ^ t >>> 7, t | 61);

[Survived] StringLiteral
src/rules/days.js:7:44
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + "") - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);

[Survived] StringLiteral
src/rules/days.js:7:81
-     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + 'T00:00:00Z')) / DAY_MS);
+     return Math.round((Date.parse(dateText + 'T00:00:00Z') - Date.parse(todayVN + "")) / DAY_MS);

[Survived] ArrayDeclaration
src/rules/recurring.js:9:67
-   export function weeklyDates({ firstDate, weeks, until, holidays = [] }) {
+   export function weeklyDates({ firstDate, weeks, until, holidays = ["Stryker was here"] }) {

Ran 3.15 tests per mutant on average.
--------------|------------------|----------|-----------|------------|----------|----------|
              | % Mutation score |          |           |            |          |          |
File          |  total | covered | # killed | # timeout | # survived | # no cov | # errors |
--------------|--------|---------|----------|-----------|------------|----------|----------|
All files     |  98.99 |   98.99 |      390 |         2 |          4 |        0 |        0 |
 booking.js   | 100.00 |  100.00 |       94 |         0 |          0 |        0 |        0 |
 busy.js      | 100.00 |  100.00 |       19 |         0 |          0 |        0 |        0 |
 cancel.js    | 100.00 |  100.00 |        7 |         0 |          0 |        0 |        0 |
 checkin.js   | 100.00 |  100.00 |       74 |         0 |          0 |        0 |        0 |
 clubFee.js   | 100.00 |  100.00 |       37 |         0 |          0 |        0 |        0 |
 code.js      |  94.74 |   94.74 |       17 |         1 |          1 |        0 |        0 |
 days.js      |  84.62 |   84.62 |       11 |         0 |          2 |        0 |        0 |
 recurring.js |  98.28 |   98.28 |       56 |         1 |          1 |        0 |        0 |
 time.js      | 100.00 |  100.00 |       30 |         0 |          0 |        0 |        0 |
 waitlist.js  | 100.00 |  100.00 |       45 |         0 |          0 |        0 |        0 |
--------------|--------|---------|----------|-----------|------------|----------|----------|
10:15:50 (97855) INFO MutationTestReportHelper Final mutation score of 98.99 is greater than or equal to break threshold 80
10:15:50 (97855) INFO HtmlReporter Your report can be found at: file://…/labflow-lite/reports/mutation/index.html
10:15:50 (97855) INFO MutationTestExecutor Done in 15 seconds.`,
  '105-ref-run': `$ npx vitest run src/rules/recurring.test.js src/legacy/clubFee.test.js src/rules/clubFee.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/clubFee.test.js (1 test) 2ms
   ✓ quoteClubFee (1)
     ✓ charges 1.5 times on a Sunday and the plain price on a Monday 2ms
 ✓ src/rules/recurring.test.js (11 tests) 6ms
   ✓ weeklyDates (11)
     ✓ books the first date and the same weekday in each following week 2ms
     ✓ skips a holiday without adding an extra week 0ms
     ✓ keeps a class on the last day of term and drops the weeks after it 0ms
     ✓ reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it 0ms
     ✓ crosses a month and a year correctly 0ms
     ✓ accepts 1 week(s) 1ms
     ✓ accepts 15 week(s) 0ms
     ✓ refuses 0 weeks with BAD_WEEKS 0ms
     ✓ refuses 16 weeks with BAD_WEEKS 0ms
     ✓ refuses 2.5 weeks with BAD_WEEKS 0ms
     ✓ refuses a series that starts after the term, and accepts one that starts on its last day 0ms
 ✓ src/legacy/clubFee.test.js (14 tests) 6ms
   ✓ clubFee (characterization of v0) (14)
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 2ms
     ✓ quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND 0ms
     ✓ quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND 0ms
     ✓ quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND 0ms
     ✓ quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND 1ms
     ✓ quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND 0ms
     ✓ quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 0ms
     ✓ charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) 0ms
     ✓ returns NaN for a building it has no price for 0ms

 Test Files  3 passed (3)
      Tests  26 passed (26)
   Start at  10:15:26
   Duration  112ms (transform 40%, import 32%, tests 18%, worker 9%)`,
  '105-ref': `$ node scripts/dot-bien-10.mjs
✔ src/legacy/clubFee.test.js is green on lab10/clubFee.v0.js
✔ src/rules/recurring.test.js is green on lab10/recurring.ref.js
✔ src/legacy/clubFee.test.js is green on your src/legacy/clubFee.js (after your refactor)
✔ killed    #1 an event for exactly 40 seats pays the big-event fee
✔ killed    #2 a 4-hour event loses its long-event discount
✔ killed    #3 prices are rounded down instead of to the nearest 1,000
✔ killed    #4 Sunday is no longer charged the weekend rate
✔ killed    #5 the series starts one week late
✔ killed    #6 a 15-week series is refused
✔ killed    #7 a class on the last day of term is dropped
✔ killed    #8 a class is booked on a holiday

8/8 mutants killed`,
  '105-truot': `$ node scripts/thu-loi.mjs src/legacy/clubFee.js "member: club.member == true" "member: !!club.member" src/legacy/clubFee.test.js
planted in src/legacy/clubFee.js:  member: club.member == true  →  member: !!club.member


 RUN  v5.0.5 …/labflow-lite

 ❯ src/legacy/clubFee.test.js (14 tests | 1 failed) 10ms
   ❯ clubFee (characterization of v0) (14)
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 3ms
     ✓ quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND 0ms
     ✓ quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND 0ms
     ✓ quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND 0ms
     ✓ quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND 1ms
     ✓ quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND 0ms
     ✓ quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     × quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 4ms
     ✓ charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) 0ms
     ✓ returns NaN for a building it has no price for 0ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/legacy/clubFee.test.js > clubFee (characterization of v0) > quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND
AssertionError: expected 320000 to be 400000 // Object.is equality

- Expected
+ Received

- 400000
+ 320000

 ❯ src/legacy/clubFee.test.js:34:56
     32|     ['WED', 'yes', 'BE-201', '08:00', '10:00', 30, 400000],
     33|   ])('quoted on %s: member %s, %s %s–%s, %i seats ⇒ %i VND', (day, mem…
     34|     expect(quote(day, member, lab, start, end, seats)).toBe(expected);
       |                                                        ^
     35|   });
     36|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 13 passed (14)
   Start at  10:15:32
   Duration  118ms (transform 40%, tests 27%, import 26%, worker 7%)`,
  '105-unit': `$ npm run test:unit

> labflow-lite@1.0.0 test:unit
> vitest run src/


 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/recurring.test.js (11 tests) 8ms
   ✓ weeklyDates (11)
     ✓ books the first date and the same weekday in each following week 3ms
     ✓ skips a holiday without adding an extra week 1ms
     ✓ keeps a class on the last day of term and drops the weeks after it 0ms
     ✓ reports HOLIDAY inside the term, but AFTER_TERM for a holiday after it 0ms
     ✓ crosses a month and a year correctly 0ms
     ✓ accepts 1 week(s) 1ms
     ✓ accepts 15 week(s) 0ms
     ✓ refuses 0 weeks with BAD_WEEKS 0ms
     ✓ refuses 16 weeks with BAD_WEEKS 0ms
     ✓ refuses 2.5 weeks with BAD_WEEKS 0ms
     ✓ refuses a series that starts after the term, and accepts one that starts on its last day 0ms
 ✓ src/rules/waitlist.test.js (11 tests) 6ms
   ✓ joinWaitlist (7)
     ✓ puts the first student at position 1 2ms
     ✓ puts the next student behind the ones already waiting 1ms
     ✓ refuses a student who is already waiting 0ms
     ✓ refuses a fourth student: at most 3 wait for one slot 0ms
     ✓ refuses the student who already holds the slot 0ms
     ✓ says ALREADY_WAITING, not WAITLIST_FULL, to a student already in a full line 0ms
     ✓ never changes the queue it was given 0ms
   ✓ offerNext (2)
     ✓ offers the slot to the first student in line for 30 minutes 0ms
     ✓ offers nothing when nobody is waiting 1ms
   ✓ acceptOffer (2)
     ✓ accepts at 10:29, one minute before the offer expires 0ms
     ✓ refuses at 10:30: the offer has expired 0ms
 ✓ src/rules/busy.test.js (8 tests) 4ms
   ✓ mergeBusy (8)
     ✓ returns no blocks for a day without bookings 1ms
     ✓ keeps separate bookings apart, sorted by start 0ms
     ✓ merges overlapping bookings into one block 0ms
     ✓ merges touching (10:00 ends, 10:00 starts) bookings into one block 0ms
     ✓ merges one inside the other bookings into one block 0ms
     ✓ merges inside, listed first bookings into one block 0ms
     ✓ does not change the array it was given 0ms
     ✓ rejects a time that is not HH:MM 0ms
 ✓ src/legacy/clubFee.test.js (14 tests) 10ms
   ✓ clubFee (characterization of v0) (14)
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 5ms
     ✓ quoted on WED: member true, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 40 seats ⇒ 400000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–10:00, 41 seats ⇒ 500000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–11:30, 30 seats ⇒ 700000 VND 0ms
     ✓ quoted on WED: member false, BE-201 08:00–12:00, 30 seats ⇒ 750000 VND 0ms
     ✓ quoted on WED: member true, AL-105 08:00–08:30, 30 seats ⇒ 140000 VND 0ms
     ✓ quoted on SAT: member true, AL-105 08:00–08:30, 30 seats ⇒ 210000 VND 0ms
     ✓ quoted on SUN: member false, AL-105 08:00–08:30, 30 seats ⇒ 263000 VND 1ms
     ✓ quoted on WED: member false, BE-201 10:00–08:00, 30 seats ⇒ 0 VND 0ms
     ✓ quoted on WED: member 1, BE-201 08:00–10:00, 30 seats ⇒ 320000 VND 0ms
     ✓ quoted on WED: member yes, BE-201 08:00–10:00, 30 seats ⇒ 400000 VND 0ms
     ✓ charges the weekend rate when the QUOTE is made on a weekend, whatever the event date (LF-212, pinned) 0ms
     ✓ returns NaN for a building it has no price for 0ms
 ✓ src/legacy/monthlyReport.test.js (2 tests) 10ms
   ✓ monthlyReport (characterization) (2)
     ✓ prints the same reports as v0, for every lab and month we keep 8ms
     ✓ counts no holiday when the holiday service cannot be reached, as v0 did 1ms
 ✓ src/booking/service.test.js (6 tests) 65ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 15ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 21ms
     ✓ accepts the slot that starts when the previous one ends 25ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 1ms
     ✓ turns a failing insert into STORAGE_DOWN 1ms
 ✓ src/booking/waitlistService.test.js (3 tests) 68ms
   ✓ cancelBooking (3)
     ✓ deletes the booking and offers the slot to the first student waiting 29ms
     ✓ sends no e-mail when nobody is waiting 18ms
     ✓ refuses an unknown booking with NOT_FOUND 20ms
 ✓ src/rules/booking.test.js (28 tests) 7ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 2ms
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
 ✓ src/ci/shard.test.js (13 tests) 13ms
   ✓ splitIntoShards (8)
     ✓ longest first, each into the lightest shard → 4 + 3 + 3 seconds 9ms
     ✓ every file exactly once, whatever the number of shards 0ms
     ✓ more shards than files → the extra shards are empty, not an error 0ms
     ✓ the input order does not matter: every CI machine computes the same split 0ms
     ✓ a file without a timing counts as UNKNOWN_MS 0ms
     ✓ total 0 is refused 0ms
     ✓ total -1 is refused 0ms
     ✓ total 1.5 is refused 0ms
   ✓ pickShard (4)
     ✓ "1/3" is the first shard, "3/3" the last (1-based, like --shard) 1ms
     ✓ 0/3 does not exist 0ms
     ✓ 4/3 does not exist 0ms
     ✓ a malformed spec is a SyntaxError 0ms
   ✓ durationsFromReport (1)
     ✓ relative file → milliseconds, from a Vitest JSON report 0ms
 ✓ src/lib/retry.test.js (3 tests) 13ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 4ms
     ✓ waits 1 s then 2 s between attempts 3ms
     ✓ gives up after 3 attempts and rethrows the last error 4ms
 ✓ src/lib/mailer.test.js (4 tests) 80ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 36ms
     ✓ 429 → RATE_LIMITED 9ms
     ✓ 400 → MAIL_FAILED with the status as the cause 9ms
     ✓ 503 → MAIL_FAILED with the status as the cause 16ms
 ✓ src/rules/mutation-gaps.test.js (9 tests) 16ms
   ✓ booking rules: the cases nobody wrote (4)
     ✓ one seat is a valid booking 1ms
     ✓ the error says what was wrong 1ms
     ✓ a small student booking is CONFIRMED 0ms
     ✓ usageRate adds up the booked share of the 14 opening hours 0ms
   ✓ parseTime: only exactly HH:MM (4)
     ✓ refuses 08:000 0ms
     ✓ refuses 108:00 0ms
     ✓ the TypeError is ours, not a crash on null 0ms
     ✓ says which time is out of range 0ms
   ✓ newBookingRecord without injected helpers (1)
     ✓ makes a UUID and stamps the current time 6ms
 ✓ src/notify/notify.test.js (7 tests) 58ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 13ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 15ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/ci/policy.test.js (15 tests) 50ms
   ✓ checkWorkflow (15)
     ✓ a workflow that follows every rule passes all 8 11ms
     ✓ R1: npm install instead of npm ci 3ms
     ✓ R2: a setup-node step without cache: npm 3ms
     ✓ R3: no PostgreSQL service 4ms
     ✓ R3: a service without a health check 5ms
     ✓ R3: the URL points at a port nobody published 3ms
     ✓ R4: browsers without their system libraries 2ms
     ✓ R5: the gate name changes with the event 3ms
     ✓ R6: a gate without if: always() is skipped when a job fails 3ms
     ✓ R6: a gate that never reads the results 3ms
     ✓ R7: the gate forgot a blocking job 2ms
     ✓ R7: the gate needs the report-only quarantine job 1ms
     ✓ R7: quarantined tests inside a blocking job 1ms
     ✓ R8: continue-on-error on a matrix job hides red legs 2ms
     ✓ R8: a Node version below engines 1ms
 ✓ src/rules/code.test.js (4 tests) 23ms
   ✓ makeBookingCode (3)
     ✓ is "LF-" and 6 characters from the readable alphabet 3ms
     ✓ the same seed gives the same code; 20 codes from one seed are all different 0ms
     ✓ can produce the first and the last character of the alphabet 0ms
   ✓ newBookingRecord (1)
     ✓ takes its id and clock from the caller 16ms
 ✓ src/auth/login-guard.test.js (5 tests) 5ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/rules/time.test.js (12 tests) 13ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 2ms
     ✓ 07:00 → 420 1ms
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
     ✓ round-trips with parseTime for every minute of the day 7ms
 ✓ src/rules/checkin.test.js (16 tests) 11ms
   ✓ checkIn (BR-07) (8)
     ✓ at 07:49 → { ok: false, code: 'TOO_EARLY' } 1ms
     ✓ at 07:50 → { ok: true, late: false } 0ms
     ✓ at 08:00 → { ok: true, late: false } 0ms
     ✓ at 08:01 → { ok: true, late: true } 0ms
     ✓ at 08:15 → { ok: true, late: true } 0ms
     ✓ at 08:16 → { ok: false, code: 'NO_SHOW' } 0ms
     ✓ refuses a PENDING booking 0ms
     ✓ refuses a CANCELLED booking 0ms
   ✓ bannedUntil (BR-08) (7)
     ✓ bans for 7 days after the third no-show 6ms
     ✓ counts from the latest no-show, whatever the order 0ms
     ✓ two no-shows are not enough 0ms
     ✓ the ban still holds on its last day, and is over the day after 0ms
     ✓ a no-show 30 days ago no longer counts; 29 days ago still does 0ms
     ✓ a no-show today already counts 0ms
     ✓ ignores no-shows dated after today 1ms
   ✓ createNoShowLog (1)
     ✓ keeps each student separate, in order 0ms
 ✓ src/ci/workflow.test.js (14 tests) 8ms
   ✓ .github/workflows/test.yml (14)
     ✓ R1 npm ci, never npm install 2ms
     ✓ R2 setup-node caches the npm downloads 1ms
     ✓ R3 integration tests get a healthy PostgreSQL service 0ms
     ✓ R4 Playwright browsers come with their system libraries 1ms
     ✓ R5 one gate job named exactly ci-ok 0ms
     ✓ R6 the gate runs even when a job it needs failed 0ms
     ✓ R7 every blocking job is required; report-only jobs never block 0ms
     ✓ R8 a red matrix leg makes the job red 0ms
     ✓ runs on pull requests and on pushes to main 1ms
     ✓ the unit job tests every Node version that package.json supports, and only those 0ms
     ✓ the integration job uses the same PostgreSQL major version as production (17) and waits for it 0ms
     ✓ e2e installs Chromium with its system libraries before running Playwright 0ms
     ✓ reports are uploaded even when the tests are red 0ms
     ✓ the gate requires exactly unit, integration and e2e 0ms
 ✓ src/lib/retry-last.test.js (1 test) 8ms
   ✓ gives up right after the 3rd attempt: no wait after the last one 6ms
 ✓ src/rules/cancel.test.js (4 tests) 5ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 1ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 1ms
 ✓ src/rules/days.test.js (4 tests) 7ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 3ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 1ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 1ms
 ✓ src/ci/summary.test.js (11 tests) 6ms
   ✓ testHeadline (4)
     ✓ green: how many passed out of how many 1ms
     ✓ red: the number of failures comes first 1ms
     ✓ a single failure is enough to be red 0ms
     ✓ skipped tests are said out loud, not hidden in the total 0ms
   ✓ failedTests (2)
     ✓ one line per failed test: relative file, full name, first line of the error 0ms
     ✓ nothing failed → empty 0ms
   ✓ coverageTable (2)
     ✓ two decimals, the minimum, and a mark per metric 0ms
     ✓ exactly at the minimum passes; just under fails 0ms
   ✓ mergeReports (1)
     ✓ unit + web: the counts add up and every file is kept 1ms
   ✓ stepSummary (2)
     ✓ title, headline, failures, then coverage — separated by blank lines 0ms
     ✓ without coverage there is no table 0ms
 ✓ src/ci/gate.test.js (7 tests) 3ms
   ✓ decideMerge — the ci-ok gate (7)
     ✓ every required job succeeded → may merge 1ms
     ✓ a required job that is failure blocks the merge 0ms
     ✓ a required job that is cancelled blocks the merge 0ms
     ✓ a required job that is skipped blocks the merge 0ms
     ✓ a required job missing from needs blocks (someone deleted it from the workflow) 0ms
     ✓ every problem is listed, not only the first 0ms
     ✓ a job that is not required never blocks (report-only, e.g. quarantine) 0ms
 ✓ src/notify/reminder.test.js (1 test) 3ms
   ✓ sends "Reminder: <lab> at <start> tomorrow" to the student 2ms
 ✓ src/report/monthly.test.js (3 tests) 3ms
   ✓ buildMonthlyReport (2)
     ✓ prints one line per kept booking and the four totals 1ms
     ✓ counts Saturday and Sunday by the calendar date, whatever the time zone of the machine 0ms
   ✓ monthlyReport with injected dependencies (object seams) (1)
     ✓ reads the bookings, the holidays and today from what it is given 1ms
 ✓ src/rules/clubFee.test.js (1 test) 3ms
   ✓ quoteClubFee (1)
     ✓ charges 1.5 times on a Sunday and the plain price on a Monday 2ms
 ✓ src/api/server.test.js (12 tests) 172ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 40ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 6ms
     ✓ 422 for a rule, 409 for a taken slot 24ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 23ms
     ✓ another student reading booking 1 → 404 21ms
     ✓ a lecturer reading booking 1 → 404 21ms
     ✓ an admin reading booking 1 → 200 20ms
     ✓ STUDENT on the admin list → 403 2ms
     ✓ LECTURER on the admin list → 403 1ms
     ✓ ADMIN on the admin list → 200 7ms
     ✓ an expired token → 401 (clock fixed in 2030) 1ms

 Test Files  28 passed (28)
      Tests  229 passed (229)
   Start at  10:15:33
   Duration  758ms (import 37%, transform 33%, tests 27%, worker 3%)`,
  '105-yeu-run': `$ npx vitest run lab10/yeu

 RUN  v5.0.5 …/labflow-lite

 ✓ lab10/yeu/recurring.test.js (2 tests) 3ms
   ✓ creates weekly dates 2ms
   ✓ skips holidays 1ms
 ✓ lab10/yeu/clubFee.test.js (2 tests) 2ms
   ✓ calculates a fee 2ms
   ✓ a big event costs more 0ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  10:15:19
   Duration  106ms (transform 53%, import 27%, tests 11%, worker 9%)`,
  '105-yeu': `$ node scripts/dot-bien-10.mjs lab10/yeu/recurring.test.js lab10/yeu/clubFee.test.js
✔ lab10/yeu/clubFee.test.js is green on lab10/clubFee.v0.js
✔ lab10/yeu/recurring.test.js is green on lab10/recurring.ref.js
✔ lab10/yeu/clubFee.test.js is green on your src/legacy/clubFee.js (after your refactor)
✘ SURVIVED  #1 an event for exactly 40 seats pays the big-event fee
✘ SURVIVED  #2 a 4-hour event loses its long-event discount
✘ SURVIVED  #3 prices are rounded down instead of to the nearest 1,000
✘ SURVIVED  #4 Sunday is no longer charged the weekend rate
✘ SURVIVED  #5 the series starts one week late
✘ SURVIVED  #6 a 15-week series is refused
✘ SURVIVED  #7 a class on the last day of term is dropped
✔ killed    #8 a class is booked on a holiday

1/8 mutants killed`,
};
