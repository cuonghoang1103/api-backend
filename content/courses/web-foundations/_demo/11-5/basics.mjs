const hasDigit = /\d/;                       // a regex literal: between two slashes
console.log(hasDigit.test('abc'), hasDigit.test('abc7'));

const word = 'cat';
const dynamic = new RegExp(word, 'i');       // build one from a string (flags as 2nd argument)
console.log(dynamic.test('Concatenate'), dynamic.source, dynamic.flags);

console.log('one match :', 'a1 b22 c333'.match(/\d+/));
console.log('all (g)   :', 'a1 b22 c333'.match(/\d+/g));
console.log('no match  :', 'abc'.match(/\d+/));
