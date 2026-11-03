type Booking = { id: string; seats: number };
const store: Booking[] = [{ id: 'bk_1', seats: 40 }];
// The lookup may miss, but the return type promises a Booking.
export function bookingById(id: string): Booking {
  return store.find((b) => b.id === id);
}
