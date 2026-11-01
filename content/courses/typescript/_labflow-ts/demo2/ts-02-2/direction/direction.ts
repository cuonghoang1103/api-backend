// Which way does assignment go? mutable -> readonly is fine; readonly -> mutable is refused.
import { today, type ScheduleEntry } from '../data.ts';

function show(list: readonly ScheduleEntry[]): number { return list.length; }
function shuffle(list: ScheduleEntry[]): void { list.reverse(); }

const mine: ScheduleEntry[] = today();
const shared: readonly ScheduleEntry[] = today();

show(mine);       // a function that only reads may take my mutable array
shuffle(shared);  // a function that may change it must NOT get a read-only one
