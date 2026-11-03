import type { Booking } from '../service.ts';
import { BookingService } from '../service.ts';
import { MemoryRepo } from '../memory.ts';

const b: Booking = { id: 1, lab: 'BE-201' };
const svc = new BookingService(new MemoryRepo());
const made: Booking = svc.book(2, 'CS-101');
const found: Booking | undefined = svc.find(2);

export { b, made, found };
