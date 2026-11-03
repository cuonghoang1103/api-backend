import type { PrismaClient } from './prisma.ts';
export async function makeBooking(db: PrismaClient) {
  // id and createdAt are server-owned — BookingCreateInput does not accept them.
  return db.booking.create({ data: { lab: 'BE-201', seats: 40, id: 1 } });
}
