import type { PrismaClient, Booking, BookingCreateInput } from './prisma.ts';
// The generated types describe exactly what the model stores and what you may create.
export async function makeBooking(db: PrismaClient, input: BookingCreateInput): Promise<Booking> {
  return db.booking.create({ data: input });
}
