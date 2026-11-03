// LabFlow — a typed event system (Chapter 7, = Lab 7 reference solution).
// It combines mapped types, template literal types and conditional types from this chapter.
import type { LabCode } from './schedule.ts';

// The actions a booking goes through.
export type BookingAction = 'created' | 'confirmed' | 'cancelled';

// A template literal type: every event name is "booking:<action>".
export type BookingEvent = `booking:${BookingAction}`; // 'booking:created' | 'booking:confirmed' | 'booking:cancelled'

// The payload each event carries — a plain map from event name to its data.
export type EventPayloads = {
  'booking:created': { id: number; lab: LabCode };
  'booking:confirmed': { id: number };
  'booking:cancelled': { id: number; reason: string };
};

export type EventName = keyof EventPayloads;

// A conditional type with infer: the payload type for a given event name.
export type PayloadOf<E extends EventName> = EventPayloads extends Record<E, infer P> ? P : never;

// A mapped type: one array of handlers per event name, each typed to that event's payload.
type HandlerMap = {
  [K in EventName]: Array<(payload: EventPayloads[K]) => void>;
};

// A typed event bus: on/emit know the exact payload of each event name.
// handlers has an entry for EVERY event (so a new event in EventPayloads forces one here too).
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

// A mapped type that makes every field of T read-only (the built-in Readonly<T>, written out).
export type Frozen<T> = { readonly [K in keyof T]: T[K] };

// A mapped type that makes every field optional (the built-in Partial<T>, written out) — a PATCH body.
export type Patch<T> = { [K in keyof T]?: T[K] };
