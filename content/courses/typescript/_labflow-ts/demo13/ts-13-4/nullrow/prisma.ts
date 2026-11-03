// A tiny model of the types 'prisma generate' writes for the Booking model.
export type Booking = { id: number; lab: string; seats: number; createdAt: string };
export type BookingCreateInput = { lab: string; seats: number };   // id & createdAt are server-owned
export interface BookingDelegate {
  create(args: { data: BookingCreateInput }): Promise<Booking>;
  findUnique(args: { where: { id: number } }): Promise<Booking | null>;
}
export type PrismaClient = { booking: BookingDelegate };
