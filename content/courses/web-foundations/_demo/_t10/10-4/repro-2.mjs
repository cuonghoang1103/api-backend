// Lesson 10.4 — step 2: no dates at all. Still wrong ⇒ the bug is in the comparator, not in the data.
console.log([3, 1, 2].sort((a, b) => a > b));
console.log([3, 1, 2].sort((a, b) => a - b));                 // what MDN says a comparator must return
console.log(['2026-03-01', '2026-01-15'].sort((a, b) => a.localeCompare(b)));
