// Attempt B — fully typed event bus and Frozen, but Patch is a loose index signature.
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

type HandlerMap = { [K in EventName]: Array<(payload: EventPayloads[K]) => void> };

export class EventBus {
  private handlers: HandlerMap = {
    'booking:created': [],
    'booking:confirmed': [],
    'booking:cancelled': [],
  };
  on<K extends EventName>(name: K, handler: (payload: EventPayloads[K]) => void): void {
    this.handlers[name].push(handler);
  }
  emit<K extends EventName>(name: K, payload: EventPayloads[K]): void {
    for (const handler of this.handlers[name]) handler(payload);
  }
  count<K extends EventName>(name: K): number {
    return this.handlers[name].length;
  }
}

export type Frozen<T> = { readonly [K in keyof T]: T[K] };
// Loose: any key is allowed, so a typo in a PATCH body is not caught.
export type Patch<T> = { [key: string]: unknown };
