const scores = [7, 9, 5];

const sortedBad = scores.sort();          // sort() CHANGES the original array
console.log('sort():', sortedBad, '| original:', scores, '| same?', sortedBad === scores);

const marks = [7, 9, 5];
const sortedGood = marks.toSorted((x, y) => x - y);     // ES2023: returns a NEW array
console.log('toSorted():', sortedGood, '| original:', marks);
console.log('toReversed():', marks.toReversed(), '| with(0, 10):', marks.with(0, 10), '| original:', marks);

// add / remove / update without mutation
const todos = [{ id: 1, done: false }, { id: 2, done: false }];
const added = [...todos, { id: 3, done: false }];
const removed = todos.filter((t) => t.id !== 1);
const toggled = todos.map((t) => (t.id === 2 ? { ...t, done: true } : t));
console.log(added.length, removed.length, toggled[1].done, '| original untouched:', todos[1].done);
console.log('unchanged item reused?', toggled[0] === todos[0]);
