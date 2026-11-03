// The same bug, shrunk to one line you can paste into any question.
console.log([9, 100, 25, 8].sort());
// …and the fix, once the small version showed what sort() really does:
console.log([9, 100, 25, 8].sort((a, b) => a - b));
