import type { PrismaClient } from './prisma.ts';
export async function seatsOf(db: PrismaClient, id: number): Promise<number> {
  const row = await db.booking.findUnique({ where: { id } });
  return row === null ? 0 : row.seats;
}
