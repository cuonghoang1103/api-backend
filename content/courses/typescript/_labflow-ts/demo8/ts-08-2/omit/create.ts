type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};

// A create DTO is the resource minus the fields the server owns.
type CreateBooking = Omit<Booking, 'id' | 'status' | 'createdAt'>;

function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}

console.log(createBooking({ lab: 'BE-201', seats: 40, purpose: 'Lab' }));
