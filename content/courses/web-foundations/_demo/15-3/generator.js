function* range(from, to) {
  console.log('  (generator starts)');
  for (let n = from; n <= to; n++) {
    console.log('  (about to yield ' + n + ')');
    yield n;                               // pause here, hand out n
  }
  console.log('  (generator ends)');
}

const gen = range(1, 3);
console.log('created — nothing has run yet');
console.log(gen.next());
console.log('...the caller can do other work here...');
console.log(gen.next());
console.log([...gen]);                     // takes what is left
console.log('a generator is an iterator: ' + (typeof gen.next === 'function' && typeof gen[Symbol.iterator] === 'function'));
