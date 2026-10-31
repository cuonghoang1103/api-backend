// Mock-heavy: bookLab and the repository are replaced, so the business rules never run.
import { describe, it, expect, vi } from 'vitest';
import { bookAndNotify } from '../src/notify/notify.js';
import { bookLab } from '../src/booking/service.js';

vi.mock('../src/booking/service.js', () => ({ bookLab: vi.fn() }));
const input = { lab: 'BE-201', date: '2026-11-16', seats: 31, role: 'STUDENT', start: '08:00', end: '10:00', email: 'an@fpt.edu.vn' };

describe('bookAndNotify — mock-heavy', () => {
  it('a 31-seat student booking e-mails the student', async () => {
    vi.mocked(bookLab).mockResolvedValue({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', status: 'CONFIRMED' });
    const send = vi.fn().mockResolvedValue('m');
    await bookAndNotify({ repo: {}, mailer: { send } }, input);
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: 'an@fpt.edu.vn' }));
  });

  it('passes the input to bookLab unchanged', async () => {
    vi.mocked(bookLab).mockResolvedValue({ id: 1, status: 'CONFIRMED' });
    await bookAndNotify({ repo: {}, mailer: { send: vi.fn() } }, input);
    expect(bookLab).toHaveBeenCalledWith({}, input);
  });
});
