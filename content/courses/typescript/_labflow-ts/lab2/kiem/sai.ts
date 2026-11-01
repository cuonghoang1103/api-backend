// Lab 2 — eight uses that are WRONG. Your types must make tsc refuse every one of them.
// The grader compiles this file against YOUR src/ and expects one error, with this code, on each marked line.
import { LABS, findEntry, firstStart } from '../src/schedule.ts';
import type { LabCode, ScheduleEntry, TimeRange } from '../src/schedule.ts';

declare const today: readonly ScheduleEntry[];
declare const entry: ScheduleEntry;

findEntry(today, 7).bookedBy;                    // S1 TS2532 booking 7 may not exist
entry.note.toUpperCase();                        // S2 TS18047 a note may be NULL
entry.cancelledAt.slice(0, 10);                  // S3 TS18048 only cancelled bookings have a date
firstStart(today, 'BE-201') + 30;                // S4 TS2531 a lab may have no booking today
const three: TimeRange = [480, 600, 660];        // S5 TS2322 a range is exactly [start, end]
entry.range[0] = 0;                              // S6 TS2540 a range is never changed in place
const lab: LabCode = 'BE-999';                   // S7 TS2322 only the three LabFlow labs exist
LABS.push('BE-999');                             // S8 TS2339 the list of labs is fixed
