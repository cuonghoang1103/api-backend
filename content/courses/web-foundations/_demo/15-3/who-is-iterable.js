const sources = {
  array: ['a', 'b'],
  string: 'hi',
  Set: new Set([1, 1, 2]),
  Map: new Map([['vn', 'Việt Nam'], ['jp', 'Japan']]),
};
for (const [name, value] of Object.entries(sources)) {
  const items = [];
  for (const item of value) items.push(item);
  console.log(name.padEnd(7) + '→', items);
}

const user = { name: 'Lan', age: 20 };
try {
  for (const x of user) console.log(x);
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
console.log('use Object.entries →', Object.entries(user));
