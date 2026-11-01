// A mutable tuple still has every array method — push included.
type TimeRange = [start: number, end: number];

const r: TimeRange = [480, 600];
r.push(660);                                      // tsc says nothing
console.log('a "pair" with', r.length, 'elements:', r);
