// Attempt A — typed event names and payloads, but a non-generic bus and Frozen does nothing.
import type { LabCode } from '../src/schedule.ts';

export type BookingAction = 'created' | 'confirmed' | 'cancelled';
export type BookingEvent = `booking:${BookingAction}`;

export type EventPayloads = {
  'booking:created': { id: number; lab: LabCode };
  'booking:confirmed': { id: number };
  'booking:cancelled': { id: number; reason: string };
};
export type EventName = keyof EventPayloads;
export type PayloadOf<E extends EventName> = EventPayloads[E];

// Not generic per event: the handler payload is unknown, so callers cannot read fields without a check.
export class EventBus {
  private handlers: { [K in EventName]: Array<(payload: unknown) => void> } = {
    'booking:created': [],
    'booking:confirmed': [],
    'booking:cancelled': [],
  };
  on(name: EventName, handler: (payload: unknown) => void): void {
    this.handlers[name].push(handler);
  }
  emit(name: EventName, payload: unknown): void {
    for (const handler of this.handlers[name]) handler(payload);
  }
  count(name: EventName): number {
    return this.handlers[name].length;
  }
}

export type Frozen<T> = T; // does nothing
export type Patch<T> = { [K in keyof T]?: T[K] };
