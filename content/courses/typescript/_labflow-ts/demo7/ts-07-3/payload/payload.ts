import type { EventPayloads, EventName } from '../../../src/rules/events.ts';

// infer the payload for a given event name out of the payload map.
type PayloadOf<E extends EventName> = EventPayloads extends Record<E, infer P> ? P : never;

const created: PayloadOf<'booking:created'> = { id: 1, lab: 'BE-201' };
const cancelled: PayloadOf<'booking:cancelled'> = { id: 1, reason: 'exam' };
console.log(created.lab, cancelled.reason);
