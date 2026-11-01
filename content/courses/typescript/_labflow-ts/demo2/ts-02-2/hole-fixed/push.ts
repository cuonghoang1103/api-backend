// The course's TimeRange: a READONLY tuple. No push, no reassigning a position.
type TimeRange = readonly [start: number, end: number];

const r: TimeRange = [480, 600];
r.push(660);
r[0] = 420;
console.log(r);
