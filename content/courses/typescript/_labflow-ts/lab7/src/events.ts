// LabFlow — a typed event system (a teammate's first version). It compiles. Is it right?
// The teammate used string names and `any` payloads to "make it flexible".

export type BookingAction = string;
export type BookingEvent = string;

export type EventPayloads = { [event: string]: any };
export type EventName = string;

export type PayloadOf<E> = any;

export class EventBus {
  private handlers: { [event: string]: Array<(payload: any) => void> } = {};

  on(name: string, handler: (payload: any) => void): void {
    (this.handlers[name] ??= []).push(handler);
  }
  emit(name: string, payload: any): void {
    for (const handler of this.handlers[name] ?? []) handler(payload);
  }
  count(name: string): number {
    return this.handlers[name]?.length ?? 0;
  }
}

// Frozen does nothing; Patch is a loose index signature.
export type Frozen<T> = T;
export type Patch<T> = { [key: string]: any };
