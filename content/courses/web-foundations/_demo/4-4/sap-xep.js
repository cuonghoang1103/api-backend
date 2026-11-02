const nums = [10, 9, 100, 1];
console.log([...nums].sort());                     // compares as text!
console.log([...nums].sort((a, b) => a - b));      // ascending
console.log([...nums].sort((a, b) => b - a));      // descending

const a = [3, 1, 2];
const b = a.sort();                                // sorts in place, and returns the same array
console.log(a, a === b);
console.log([3, 1, 2].toSorted(), 'does not change the original');

const names = ['Đức', 'An', 'Ánh', 'Bình', 'an'];
console.log([...names].sort());                                      // by code: Đ goes last
console.log([...names].sort((x, y) => x.localeCompare(y, 'vi')));    // Vietnamese order

const people = [{ n: 'A', age: 30 }, { n: 'B', age: 20 }];
console.log(people.sort((x, y) => x.age - y.age).map((p) => p.n));
