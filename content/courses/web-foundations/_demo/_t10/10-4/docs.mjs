// Lesson 10.4 — read the docs before guessing: the default sort compares STRINGS (MDN, Array.prototype.sort)
console.log([10, 9, 1].sort());
console.log([10, 9, 1].sort((a, b) => a - b));
console.log(['b', 'a', 'C'].sort(), ['b', 'a', 'C'].sort((a, b) => a.localeCompare(b)));
