// Primitives are copied. Objects are shared: the variable holds a reference.
let a = 10;
let b = a;
b = 99;
console.log(a, b);

const user1 = { name: 'Linh' };
const user2 = user1;       // same object, two names
user2.name = 'An';
console.log(user1.name);

const copy = { ...user1 }; // a new object
copy.name = 'Chi';
console.log(user1.name, copy.name);

console.log({ a: 1 } === { a: 1 });   // two different objects
console.log(user1 === user2);         // same object
