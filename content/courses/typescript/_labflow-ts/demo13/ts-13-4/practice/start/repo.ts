import type { PrismaClient } from './prisma.ts';
export async function seatsOf(db: PrismaClient, id: number): Promise<number> {
  const row = await db.booking.findUnique({ where: { id } });
  // row may be null.
  return row.seats;
}
