import type { SlotCode } from '../../../src/rules/booking.ts';

// Someone forgot TOO_LONG.
export const SLOT_MESSAGES = {
  OFF_GRID: 'Start and end must be on the 30-minute grid.',
  END_BEFORE_START: 'The end time must be after the start time.',
  OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.',
} as const satisfies Record<SlotCode, string>;

SLOT_MESSAGES.OFF_GRID = 'Use the grid!';      // as const made every property read-only
