// A small LabFlow helper, full of types.
type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

interface Booking {
  lab: string;
  seats: number;
  role: Role;
  start: string;
}

export function bookingLabel(b: Booking): string {
  const who: string = b.role === 'STUDENT' ? 'student' : 'staff';
  return b.lab + ' at ' + b.start + ' (' + b.seats + ' seats, ' + who + ')';
}

console.log(bookingLabel({ lab: 'BE-201', seats: 31, role: 'STUDENT', start: '08:00' }));
