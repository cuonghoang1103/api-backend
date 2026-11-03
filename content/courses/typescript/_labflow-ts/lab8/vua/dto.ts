export type MyPartial<T> = { [K in keyof T]?: T[K] };
// K is not constrained to keyof T, so MyPick accepts a key that does not exist.
export type MyPick<T, K extends PropertyKey> = { [P in K]: P extends keyof T ? T[P] : never };
export type MyOmit<T, K extends keyof T> = MyPick<T, Exclude<keyof T, K>>;

export type Booking = {
  id: number; lab: string; seats: number; purpose: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string;
};
export type User = { id: number; name: string; email: string; passwordHash: string };

export type CreateBooking = MyOmit<Booking, 'id' | 'status' | 'createdAt'>;
export type UpdateBooking = MyPartial<MyOmit<Booking, 'id' | 'createdAt'>>;
export type PublicUser = MyOmit<User, 'passwordHash'>;

export function createBooking(input: CreateBooking): Booking {
  return { ...input, id: 1, status: 'PENDING', createdAt: '2027-03-03T06:00:00Z' };
}
export function applyUpdate(b: Booking, patch: UpdateBooking): Booking { return { ...b, ...patch }; }
export function toPublic(u: User): PublicUser { return { id: u.id, name: u.name, email: u.email }; }
