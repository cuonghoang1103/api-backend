// Live-coding exercise of lesson 10.4: the busy blocks of one lab on one day.
// ranges: [{ start: "HH:MM", end: "HH:MM" }] in any order. Returns merged blocks, sorted; touching blocks merge.
import { parseTime, formatTime } from './time.js';

export function mergeBusy(ranges) {
  const sorted = ranges.map((r) => [parseTime(r.start), parseTime(r.end)]).sort((a, b) => a[0] - b[0]);
  const blocks = [];
  for (const [start, end] of sorted) {
    const last = blocks[blocks.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else blocks.push([start, end]);
  }
  return blocks.map(([start, end]) => ({ start: formatTime(start), end: formatTime(end) }));
}
