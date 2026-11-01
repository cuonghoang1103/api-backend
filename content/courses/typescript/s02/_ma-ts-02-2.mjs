/**
 * _ma (bài 2.2) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "data": `// One day of lab BE-201, in the order the bookings were MADE (id 1 first).
// range = [start, end] in minutes since 00:00 — 480 is 08:00.
export type ScheduleEntry = { id: number; lab: string; range: [number, number]; bookedBy: string };

export function today(): ScheduleEntry[] {
  return [
    { id: 1, lab: 'BE-201', range: [780, 900], bookedBy: 'An' },     // 13:00–15:00
    { id: 2, lab: 'BE-201', range: [480, 600], bookedBy: 'Binh' },   // 08:00–10:00
    { id: 3, lab: 'BE-201', range: [600, 720], bookedBy: 'Chi' },    // 10:00–12:00
  ];
}`,
  "basics": `// Two spellings of the same array type, and what tsc infers on its own.
const labs: string[] = ['BE-201', 'BE-202'];
const starts: Array<number> = [480, 600];
const mixed = ['BE-201', 480];              // inferred: (string | number)[]

labs.push('AL-301');                          // fine: a string
labs.push(301);                               // a number in a list of strings
starts.push('08:00');                         // a string in a list of numbers
const first: string = mixed[0];               // could be a number`,
  "mutate": `// The schedule page: a timeline sorted by start time, and "latest booking" = the last one made.
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
console.log('same array?', timeline === schedule);`,
  "readonly": `// Same page, but sortByStart promises (in its type) not to change what it receives.
import { today, type ScheduleEntry } from '../data.ts';

function sortByStart(schedule: readonly ScheduleEntry[]): ScheduleEntry[] {
  return schedule.sort((a: ScheduleEntry, b: ScheduleEntry) => a.range[0] - b.range[0]);
}

function addBooking(schedule: readonly ScheduleEntry[], e: ScheduleEntry): void {
  schedule.push(e);
}

console.log(sortByStart(today()).length, addBooking);`,
  "fixed": `// The honest versions: return a NEW array, leave the caller's alone.
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
console.log('after add:', addBooking(schedule, { id: 4, lab: 'BE-201', range: [900, 960], bookedBy: 'Dung' }).length, '| original:', schedule.length);`,
  "direction": `// Which way does assignment go? mutable -> readonly is fine; readonly -> mutable is refused.
import { today, type ScheduleEntry } from '../data.ts';

function show(list: readonly ScheduleEntry[]): number { return list.length; }
function shuffle(list: ScheduleEntry[]): void { list.reverse(); }

const mine: ScheduleEntry[] = today();
const shared: readonly ScheduleEntry[] = today();

show(mine);       // a function that only reads may take my mutable array
shuffle(shared);  // a function that may change it must NOT get a read-only one`,
  "erased": `// readonly lives only in the type. After type stripping it is a normal array.
const shared: readonly number[] = [480, 600];
const sneaky = shared as number[];            // a lie tsc accepts (lesson 1.2)
sneaky.push(720);
console.log('readonly array, after push:', shared);

// Object.freeze is the RUNTIME lock — and tsc already types it as readonly.
const frozen = Object.freeze([480, 600]);     // type: readonly number[]
try {
  (frozen as number[]).push(720);
} catch (e) {
  console.log('frozen array:', (e as Error).constructor.name + ':', (e as Error).message);
}`,
  "range": `// A time range is exactly two numbers, and position matters: [start, end].
import { parseTime } from '../../../src/rules/time.ts';

export type TimeRange = [start: number, end: number];   // a labelled tuple

export function toRange(text: string): TimeRange {
  const [from, to] = text.split('-');                  // '08:00-10:00'
  return [parseTime(from ?? ''), parseTime(to ?? '')];
}

const [start, end] = toRange('08:00-10:00');           // destructure by position
console.log('start', start, 'end', end, 'minutes', end - start);`,
  "wrong": `import { toRange, type TimeRange } from './range.ts';

const tooLong: TimeRange = [480, 600, 660];      // three numbers
const wrongType: TimeRange = ['08:00', '10:00']; // strings, not minutes
const third = toRange('08:00-10:00')[2];         // there is no position 2

const guess = [480, 600];                         // what does tsc infer here?
const r: TimeRange = guess;`,
  "hole": `// A mutable tuple still has every array method — push included.
type TimeRange = [start: number, end: number];

const r: TimeRange = [480, 600];
r.push(660);                                      // tsc says nothing
console.log('a "pair" with', r.length, 'elements:', r);`,
  "holeFixed": `// The course's TimeRange: a READONLY tuple. No push, no reassigning a position.
type TimeRange = readonly [start: number, end: number];

const r: TimeRange = [480, 600];
r.push(660);
r[0] = 420;
console.log(r);`,
  "index": `// The course tsconfig has noUncheckedIndexedAccess (lesson 1.2). Tuples and arrays answer differently.
type TimeRange = readonly [start: number, end: number];

const range: TimeRange = [480, 600];
const starts: readonly number[] = [480, 600, 780];

const a: number = range[0];     // a tuple KNOWS it has position 0
const b: number = starts[0];    // an array might be empty
console.log(a, b);`,
  "entries": `// Object.entries turns an object into a list of [key, value] pairs — tuples.
const minutesByLab = { 'BE-201': 360, 'BE-202': 120, 'AL-301': 0 };

for (const [lab, minutes] of Object.entries(minutesByLab)) {
  console.log(lab.padEnd(7), String(minutes).padStart(3), 'min');
}
const pairs: [number, number][] = Object.entries(minutesByLab);`,
  "prStart": `// Practice start: a range typed as a plain number[].
import { parseTime } from '../../../../src/rules/time.ts';

export function toRange(text: string): number[] {
  const [from, to] = text.split('-');
  return [parseTime(from ?? ''), parseTime(to ?? '')];
}

export function minutesOf(range: number[]): number {
  return range[1] - range[0];
}

console.log(minutesOf(toRange('08:00-10:00')));
console.log(minutesOf([600, 480, 30]));          // nonsense, accepted`,
  "prSol": `// Practice solution: a readonly labelled tuple says "exactly two numbers, start then end".
import { parseTime } from '../../../../src/rules/time.ts';

export type TimeRange = readonly [start: number, end: number];

export function toRange(text: string): TimeRange {
  const [from, to] = text.split('-');
  return [parseTime(from ?? ''), parseTime(to ?? '')];
}

export function minutesOf(range: TimeRange): number {
  return range[1] - range[0];
}

console.log(minutesOf(toRange('08:00-10:00')));`,
  "prBad": `import { minutesOf } from '../solution/range.ts';

minutesOf([600, 480, 30]);                        // three numbers: refused now`,
  "java": `// Java comparison (PRO192): List.of gives an unmodifiable list — but the check happens at RUNTIME.
import java.util.List;

public class Schedule {
    public static void main(String[] args) {
        List<Integer> starts = List.of(480, 600, 780);
        System.out.println("compiled fine, size " + starts.size());
        starts.add(900);                       // javac accepts this line
    }
}`,
  "demoTsconfig": `{ "extends": "../../../tsconfig.json", "include": ["."] }`,
};
export const OUT = {
  '10-basics': `$ npx tsc -p demo2/ts-02-2/arrays
demo2/ts-02-2/arrays/basics.ts(7,11): error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.
demo2/ts-02-2/arrays/basics.ts(8,13): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
demo2/ts-02-2/arrays/basics.ts(9,7): error TS2322: Type 'string | number | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.`,
  '11-mutate-tsc': `$ npx tsc -p demo2/ts-02-2/mutate`,
  '12-mutate-run': `$ node demo2/ts-02-2/mutate/page.ts
latest booking before: #3
timeline: 08:00 #2, 10:00 #3, 13:00 #1
latest booking after:  #1 (should be #3)
same array? true`,
  '13-readonly': `$ npx tsc -p demo2/ts-02-2/readonly
demo2/ts-02-2/readonly/page.ts(5,19): error TS2339: Property 'sort' does not exist on type 'readonly ScheduleEntry[]'.
demo2/ts-02-2/readonly/page.ts(9,12): error TS2339: Property 'push' does not exist on type 'readonly ScheduleEntry[]'.`,
  '14-fixed-run': `$ node demo2/ts-02-2/fixed/fixed.ts
timeline: #2 #3 #1 | original: #1 #2 #3
after add: 4 | original: 3`,
  '14-fixed-tsc': `$ npx tsc -p demo2/ts-02-2/fixed`,
  '15-direction': `$ npx tsc -p demo2/ts-02-2/direction
demo2/ts-02-2/direction/direction.ts(11,9): error TS4104: The type 'readonly ScheduleEntry[]' is 'readonly' and cannot be assigned to the mutable type 'ScheduleEntry[]'.`,
  '16-runtime': `$ node demo2/ts-02-2/runtime/erased.ts
readonly array, after push: [ 480, 600, 720 ]
frozen array: TypeError: Cannot add property 2, object is not extensible`,
  '17-runtime-tsc': `$ npx tsc -p demo2/ts-02-2/runtime`,
  '20-range-run': `$ node demo2/ts-02-2/tuple/range.ts
start 480 end 600 minutes 120`,
  '21-tuple-wrong': `$ npx tsc -p demo2/ts-02-2/tuple
demo2/ts-02-2/tuple/wrong.ts(3,7): error TS2322: Type '[number, number, number]' is not assignable to type 'TimeRange'.
  Source has 3 element(s) but target allows only 2.
demo2/ts-02-2/tuple/wrong.ts(4,31): error TS2322: Type 'string' is not assignable to type 'number'.
demo2/ts-02-2/tuple/wrong.ts(4,40): error TS2322: Type 'string' is not assignable to type 'number'.
demo2/ts-02-2/tuple/wrong.ts(5,38): error TS2493: Tuple type 'TimeRange' of length '2' has no element at index '2'.
demo2/ts-02-2/tuple/wrong.ts(8,7): error TS2322: Type 'number[]' is not assignable to type 'TimeRange'.
  Target requires 2 element(s) but source may have fewer.`,
  '22-hole-tsc': `$ npx tsc -p demo2/ts-02-2/hole`,
  '23-hole-run': `$ node demo2/ts-02-2/hole/push.ts
a "pair" with 3 elements: [ 480, 600, 660 ]`,
  '24-hole-fixed': `$ npx tsc -p demo2/ts-02-2/hole-fixed
demo2/ts-02-2/hole-fixed/push.ts(5,3): error TS2339: Property 'push' does not exist on type 'TimeRange'.
demo2/ts-02-2/hole-fixed/push.ts(6,3): error TS2540: Cannot assign to '0' because it is a read-only property.`,
  '25-index': `$ npx tsc -p demo2/ts-02-2/index
demo2/ts-02-2/index/entries.ts(7,7): error TS2322: Type '[string, number][]' is not assignable to type '[number, number][]'.
  Type '[string, number]' is not assignable to type '[number, number]'.
    Type at position 0 in source is not compatible with type at position 0 in target.
      Type 'string' is not assignable to type 'number'.
demo2/ts-02-2/index/index.ts(8,7): error TS2322: Type 'number | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.`,
  '26-entries-run': `$ node demo2/ts-02-2/index/entries.ts
BE-201  360 min
BE-202  120 min
AL-301    0 min`,
  '30-pr-start-tsc': `$ npx tsc -p demo2/ts-02-2/practice/start
demo2/ts-02-2/practice/start/range.ts(10,10): error TS2532: Object is possibly 'undefined'.
demo2/ts-02-2/practice/start/range.ts(10,21): error TS2532: Object is possibly 'undefined'.`,
  '31-pr-start-run': `$ node demo2/ts-02-2/practice/start/range.ts
120
-120`,
  '32-pr-sol-tsc': `$ npx tsc -p demo2/ts-02-2/practice/solution`,
  '33-pr-sol-run': `$ node demo2/ts-02-2/practice/solution/range.ts
120`,
  '34-pr-refused': `$ npx tsc -p demo2/ts-02-2/practice/refused
demo2/ts-02-2/practice/refused/bad.ts(3,11): error TS2345: Argument of type '[number, number, number]' is not assignable to parameter of type 'TimeRange'.
  Source has 3 element(s) but target allows only 2.`,
  '40-java': `$ java demo2/ts-02-2/java/Schedule.java
compiled fine, size 3
Exception in thread "main" java.lang.UnsupportedOperationException
	at java.base/java.util.ImmutableCollections.uoe(ImmutableCollections.java:142)
	at java.base/java.util.ImmutableCollections$AbstractImmutableCollection.add(ImmutableCollections.java:147)
…`,
};
