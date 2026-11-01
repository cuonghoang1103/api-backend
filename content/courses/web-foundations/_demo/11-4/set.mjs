const tags = ['js', 'css', 'js', 'html', 'css', 'js'];
const unique = new Set(tags);
console.log(unique, '| size', unique.size);
console.log('back to array:', [...unique]);
console.log('has css?', unique.has('css'), '| has py?', unique.has('py'));

const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5]);
console.log('union        ', a.union(b));
console.log('intersection ', a.intersection(b));
console.log('difference   ', a.difference(b));

// Set uses the SAME rule as ===, so two look-alike objects are two members
const people = new Set([{ id: 1 }, { id: 1 }]);
console.log('look-alike objects in a Set:', people.size);
