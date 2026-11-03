import type { PrismaClient } from './prisma.ts';
export async function labOf(db: PrismaClient, id: number): Promise<string> {
  const row = await db.booking.findUnique({ where: { id } });
  // findUnique may return null — reading .lab without checking is refused.
  return row.lab;
}
