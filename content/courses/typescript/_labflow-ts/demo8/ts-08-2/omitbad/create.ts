type Booking = {
  id: number; lab: string; seats: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
};
type CreateBooking = Omit<Booking, 'id' | 'status'>;

// A client must not send id — Omit removed it, so this is refused.
const bad: CreateBooking = { lab: 'BE-201', seats: 40, id: 99 };
console.log(bad);
