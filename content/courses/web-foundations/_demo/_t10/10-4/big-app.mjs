// Lesson 10.4 — "my notes app shows notes in the wrong order" (the whole app, as you would first paste it)
const notes = [
  { id: 1, title: 'Pay rent',        date: '2026-03-01', tags: ['home'],  done: false },
  { id: 2, title: 'Learn Git',       date: '2026-01-15', tags: ['study'], done: true },
  { id: 3, title: 'Buy milk',        date: '2026-02-10', tags: ['home'],  done: false },
  { id: 4, title: 'Read MDN on sort', date: '2026-02-28', tags: ['study'], done: false },
  { id: 5, title: 'Call Lan',        date: '2026-01-02', tags: [],        done: false },
];

function byTag(list, tag) {
  return tag ? list.filter((n) => n.tags.includes(tag)) : list;
}
function oldestFirst(list) {
  return [...list].sort((a, b) => a.date > b.date);
}
function render(list) {
  return list.map((n) => (n.done ? '[x] ' : '[ ] ') + n.date + '  ' + n.title).join('\n');
}
function summary(list) {
  const open = list.filter((n) => !n.done).length;
  return list.length + ' notes, ' + open + ' open';
}

const tag = process.argv[2] ?? '';
const shown = oldestFirst(byTag(notes, tag));
console.log(render(shown));
console.log(summary(shown));
