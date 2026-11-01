// Line numbers matter: Node replaces types with spaces, it does not delete lines.
type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

interface Booking {
  lab: string;
  seats: number;
  role: Role;
}

function checkSeats(b: Booking): number {
  if (b.seats < 1) throw new RangeError('seats must be positive, got ' + b.seats);
  return b.seats;
}

checkSeats({ lab: 'BE-201', seats: 0, role: 'STUDENT' });
