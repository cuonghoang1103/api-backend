// One message per slot code — and tsc proves none is forgotten.
import type { SlotCode } from '../../../../src/rules/booking.ts';

export function slotMessage(code: SlotCode): string {
  switch (code) {
    case 'OFF_GRID': return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START': return 'The end time must be after the start time.';
    case 'OUTSIDE_HOURS': return 'LabFlow is open from 07:00 to 21:00.';
    case 'TOO_LONG': return 'A booking can last at most 4 hours.';
    default: {
      const unreachable: never = code;   // every case handled ⇒ code is never here
      throw new Error('Unknown slot code: ' + String(unreachable));
    }
  }
}
