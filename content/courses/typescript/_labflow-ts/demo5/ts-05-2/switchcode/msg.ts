import type { SlotCode } from '../../../src/rules/booking.ts';

// Each case narrows code to one literal; the message is chosen by value.
export function slotMessage(code: SlotCode): string {
  switch (code) {
    case 'OFF_GRID':
      return 'Start and end must be on the 30-minute grid.';
    case 'END_BEFORE_START':
      return 'The end time is before the start time.';
    case 'OUTSIDE_HOURS':
      return 'The lab is only open 07:00–21:00.';
    case 'TOO_LONG':
      return 'A booking is at most 4 hours.';
  }
}

console.log(slotMessage('OFF_GRID'));
console.log(slotMessage('TOO_LONG'));
