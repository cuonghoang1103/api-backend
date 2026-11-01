import { checkSlot, needsApproval } from '../rules/booking.js';

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
}
