import { it, expect } from 'vitest';
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
});
