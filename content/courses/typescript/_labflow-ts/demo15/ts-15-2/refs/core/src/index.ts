export type Booking = { id: number; lab: string };
export const make = (id: number, lab: string): Booking => ({ id, lab });
