// The honest versions: return a NEW array, leave the caller's alone.
import { today, type ScheduleEntry } from '../data.ts';

export function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.toSorted((a, b) => a.range[0] - b.range[0]);   // ES2023: sorted copy
}

export function addBooking(schedule: readonly ScheduleEntry[], e: ScheduleEntry): ScheduleEntry[] {
  return [...schedule, e];                                         // copy + the new one
}

const schedule = today();
const timeline = sortByStart(schedule);
console.log('timeline:', timeline.map((e) => '#' + e.id).join(' '), '| original:', schedule.map((e) => '#' + e.id).join(' '));
console.log('after add:', addBooking(schedule, { id: 4, lab: 'BE-201', range: [900, 960], bookedBy: 'Dung' }).length, '| original:', schedule.length);
