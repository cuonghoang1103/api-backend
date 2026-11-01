import { LABS } from '../../src/rules/schedule.ts';
import type { TimeRange } from '../../src/rules/schedule.ts';
import type { SlotCode } from '../../src/rules/booking.ts';

// Q6 a mutable tuple still has push
const r: [number, number] = [480, 600];
r.push(660);
console.log('Q6', r.length, JSON.stringify(r));

// Q7 an inferred array is not a tuple
function minutesOf(range: TimeRange): number { return range[1] - range[0]; }
const fromForm = [480, 600];
minutesOf(fromForm);

// Q8 exhaustive switch
type Code2 = SlotCode | 'LAB_CLOSED';
function message(code: Code2): string {
  switch (code) {
    case 'OFF_GRID': return 'Use the 30-minute grid';
    case 'END_BEFORE_START': return 'End must be after start';
    case 'OUTSIDE_HOURS': return 'Labs open 07:00-21:00';
    case 'TOO_LONG': return 'At most 4 hours';
    default: {
      const unreachable: never = code;
      return unreachable;
    }
  }
}

// Q9 never[]
const day = { lab: 'BE-201', bookings: [] };
day.bookings.push({ id: 1 });

// Q10 includes with a string
const text: string = 'BE-201';
LABS.includes(text);
console.log(message('OFF_GRID'));
