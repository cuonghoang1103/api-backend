// Lab 7 — eight uses that are WRONG. Your advanced types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { EventBus } from '../src/events.ts';
import type { BookingEvent, PayloadOf, Frozen, Patch } from '../src/events.ts';

declare const bus: EventBus;

bus.emit('booking:creatd', { id: 1, lab: 'BE-201' });                        // S1 TS2345 a misspelled event name
bus.emit('booking:created', { id: 1 });                                      // S2 TS2741 the created payload needs a lab
bus.on('booking:cancelled', (p) => { void p.reasn; });                       // S3 TS2551 the cancelled payload has no reasn
const e: BookingEvent = 'booking:expired';                                   // S4 TS2322 'expired' is not a booking event
type Bad = PayloadOf<'booking:deleted'>;                                     // S5 TS2344 'booking:deleted' is not an event
type Lab = { readonly code: string; name: string };
const f: Frozen<Lab> = { code: 'BE-201', name: 'X' };
f.name = 'Renamed';                                                          // S6 TS2540 Frozen makes every field read-only
const patch: Patch<{ id: number; name: string }> = { ides: 1 };              // S7 TS2353 a misspelled key in a PATCH body
bus.on('booking:confirmed', (p: { id: number; reason: string }) => { void p; }); // S8 TS2345 a handler asking for a wider payload
export { e, f, patch };
