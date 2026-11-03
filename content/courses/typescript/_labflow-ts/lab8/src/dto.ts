// A teammate wrote the DTO layer by hand, with any where the types got hard. It compiles and runs,
// but it refuses nothing — a create body with an id, a leaked password, a typo'd patch all slip through.
export type MyPartial<T> = any;
export type MyPick<T, K> = any;
export type MyOmit<T, K> = any;

export type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};
export type User = { id: number; name: string; email: string; passwordHash: string };

export type CreateBooking = any;
export type UpdateBooking = any;
export type PublicUser = any;

export function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}
export function applyUpdate(b: Booking, patch: UpdateBooking): Booking {
  return { ...b, ...patch };
}
export function toPublic(u: User): PublicUser {
  return { id: u.id, name: u.name, email: u.email };
}
