const a = ['a', 'b', 'c'];
a.push('d');                      // add at the end (changes the array)
console.log(a, a.length);
console.log(a.pop(), a);          // remove from the end
a.unshift('z');                   // add at the start
console.log(a.shift(), a);        // remove from the start

console.log(a[0], a[a.length - 1], a.at(-1), a[99]);
console.log(a.indexOf('b'), a.indexOf('x'), a.includes('c'));

console.log(a.slice(1, 3), a);    // copy of a part: does NOT change a
const removed = a.splice(1, 1);   // removes from a: DOES change it
console.log(removed, a);

console.log(['x', 'y'].concat(['z']), [...a, 'new']);
console.log('a b c'.split(' ').reverse().join(' '));
