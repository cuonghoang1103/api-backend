// Test data for the characterization tests of the monthly report (lesson 10.2): every branch, on purpose.
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
export const HOLIDAYS = ['2026-09-01', '2026-09-02'];
