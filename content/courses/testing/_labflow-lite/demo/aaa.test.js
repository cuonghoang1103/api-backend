import { it, expect } from 'vitest';
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
});
