type Booking = { id: string; seats: number };
const store: Booking[] = [{ id: 'bk_1', seats: 40 }];
export function bookingById(id: string): Booking | undefined {
  return store.find((b) => b.id === id);
}
console.log(bookingById('bk_1')?.seats ?? 0);
