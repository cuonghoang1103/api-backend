// JavaScript/TypeScript sort traps, run for real.
// #region macdinh
console.log('[10, 9, 1].sort()               =', JSON.stringify([10, 9, 1].sort()));               // compares as STRINGS: "1" < "10" < "9"
console.log('[10, 9, 1].sort((a, b) => a - b) =', JSON.stringify([10, 9, 1].sort((a, b) => a - b)));
console.log('[-1, -2, 3, -10].sort()          =', JSON.stringify([-1, -2, 3, -10].sort()));
console.log('descending (a, b) => b - a      =', JSON.stringify([10, 9, 1].sort((a, b) => b - a)));
// #endregion

// #region boolean
const wrong = [5, 1, 4, 2, 3].sort((a, b) => (a > b) as unknown as number); // returns true/false, never negative
console.log('sort((a, b) => a > b)           =', JSON.stringify(wrong));
// #endregion

// #region taicho
const original = [3, 1, 2];
const sortedCopy = original.toSorted((a, b) => a - b); // ES2023: returns a new array
const alias = original.sort((a, b) => a - b);          // sorts IN PLACE and returns the same array
console.log('toSorted copy =', JSON.stringify(sortedCopy), ' sort() returned the same array:', alias === original);
// #endregion

// #region tiengviet
const names = ['Đức', 'An', 'Bình', 'Ánh', 'Cường', 'Chi'];
console.log('names.sort()                     =', JSON.stringify([...names].sort()));
console.log("localeCompare(b, 'vi')           =", JSON.stringify([...names].sort((a, b) => a.localeCompare(b, 'vi'))));
// #endregion
