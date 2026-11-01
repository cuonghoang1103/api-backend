// Same page, but sortByStart promises (in its type) not to change what it receives.
import { today, type ScheduleEntry } from '../data.ts';

function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.sort((a: ScheduleEntry, b: ScheduleEntry) => a.range[0] - b.range[0]);
}

function addBooking(schedule: readonly ScheduleEntry[], e: ScheduleEntry): void {
  schedule.push(e);
}

console.log(sortByStart(today()).length, addBooking);
