/**
 * _ma (bài 13.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "prismaModel": `// A tiny model of the types 'prisma generate' writes for the Booking model.
export type Booking = { id: number; lab: string; seats: number; createdAt: string };
export type BookingCreateInput = { lab: string; seats: number };   // id & createdAt are server-owned
export interface BookingDelegate {
  create(args: { data: BookingCreateInput }): Promise<Booking>;
  findUnique(args: { where: { id: number } }): Promise<Booking | null>;
}
export type PrismaClient = { booking: BookingDelegate };`,
  "create": `import type { PrismaClient, Booking, BookingCreateInput } from './prisma.ts';
// The generated types describe exactly what the model stores and what you may create.
export async function makeBooking(db: PrismaClient, input: BookingCreateInput): Promise<Booking> {
  return db.booking.create({ data: input });
}`,
  "wrongcreate": `import type { PrismaClient } from './prisma.ts';
export async function makeBooking(db: PrismaClient) {
  // id and createdAt are server-owned — BookingCreateInput does not accept them.
  return db.booking.create({ data: { lab: 'BE-201', seats: 40, id: 1 } });
}`,
  "nullrow": `import type { PrismaClient } from './prisma.ts';
export async function labOf(db: PrismaClient, id: number): Promise<string> {
  const row = await db.booking.findUnique({ where: { id } });
  // findUnique may return null — reading .lab without checking is refused.
  return row.lab;
}`,
  "prStart": `import type { PrismaClient } from './prisma.ts';
export async function seatsOf(db: PrismaClient, id: number): Promise<number> {
  const row = await db.booking.findUnique({ where: { id } });
  // row may be null.
  return row.seats;
}`,
  "prSol": `import type { PrismaClient } from './prisma.ts';
export async function seatsOf(db: PrismaClient, id: number): Promise<number> {
  const row = await db.booking.findUnique({ where: { id } });
  return row === null ? 0 : row.seats;
}`,
};
export const OUT = {
  '11-create': `$ node_modules/.bin/tsc -p demo13/ts-13-4/create`,
  '12-wrongcreate': `$ node_modules/.bin/tsc -p demo13/ts-13-4/wrongcreate
demo13/ts-13-4/wrongcreate/repo.ts(4,64): error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'BookingCreateInput'.`,
  '13-nullrow': `$ node_modules/.bin/tsc -p demo13/ts-13-4/nullrow
demo13/ts-13-4/nullrow/repo.ts(5,10): error TS18047: 'row' is possibly 'null'.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo13/ts-13-4/practice/start
demo13/ts-13-4/practice/start/repo.ts(5,10): error TS18047: 'row' is possibly 'null'.`,
  '15-pr-sol': `$ node_modules/.bin/tsc -p demo13/ts-13-4/practice/solution`,
};
