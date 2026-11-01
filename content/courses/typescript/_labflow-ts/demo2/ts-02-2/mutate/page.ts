// The schedule page: a timeline sorted by start time, and "latest booking" = the last one made.
import { today, type ScheduleEntry } from '../data.ts';
import { formatTime } from '../../../src/rules/time.ts';

function sortByStart(schedule: ScheduleEntry[]): ScheduleEntry[] {
  return schedule.sort((a, b) => a.range[0] - b.range[0]);
}

const schedule = today();
console.log('latest booking before:', '#' + schedule.at(-1)?.id);
const timeline = sortByStart(schedule);
console.log('timeline:', timeline.map((e) => formatTime(e.range[0]) + ' #' + e.id).join(', '));
console.log('latest booking after: ', '#' + schedule.at(-1)?.id, '(should be #3)');
console.log('same array?', timeline === schedule);
