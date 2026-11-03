// Lab 7 — CORRECT uses. They must keep compiling with your types (part B).
import { EventBus } from '../src/events.ts';
import type { BookingEvent, EventName, PayloadOf, Frozen, Patch } from '../src/events.ts';

const bus = new EventBus();

// on/emit are typed per event: the handler's payload is exactly that event's payload.
bus.on('booking:created', (p) => console.log(p.id, p.lab));       // p: { id: number; lab: LabCode }
bus.on('booking:cancelled', (p) => console.log(p.reason));        // p: { id: number; reason: string }
bus.emit('booking:created', { id: 1, lab: 'BE-201' });
bus.emit('booking:cancelled', { id: 1, reason: 'exam week' });
const n: number = bus.count('booking:confirmed');

// The template literal event name, the conditional payload, and the two mapped types.
const name: BookingEvent = 'booking:confirmed';
const key: EventName = 'booking:created';
const payload: PayloadOf<'booking:created'> = { id: 1, lab: 'AL-301' };
const frozen: Frozen<{ code: string; seats: number }> = { code: 'BE-201', seats: 40 };
const seats: number = frozen.seats;                               // reading is fine; writing is not
const patch: Patch<{ id: number; name: string }> = { name: 'New name' }; // every field optional
console.log(n, name, key, payload, seats, patch);
