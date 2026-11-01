import type { SlotCode } from '../../../src/rules/booking.ts';

// One message per slot code. as const keeps every text as a literal and makes the object read-only;
// satisfies checks that EVERY SlotCode has a message (Record<K, V> = an object with exactly the keys K).
export const SLOT_MESSAGES = {
  OFF_GRID: 'Start and end must be on the 30-minute grid.',
  END_BEFORE_START: 'The end time must be after the start time.',
  OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.',
  TOO_LONG: 'A booking can last at most 4 hours.',
} as const satisfies Record<SlotCode, string>;

export type MessageKey = keyof typeof SLOT_MESSAGES;          // the keys, as a union
export type Message = (typeof SLOT_MESSAGES)[MessageKey];     // the texts, as a union
