function greet(name = 'friend', punctuation = '!') {   // default parameters
  return `Hello ${name}${punctuation}`;
}
console.log(greet());
console.log(greet('Linh'));
console.log(greet('Linh', '?'));
console.log(greet(undefined, '?'));     // undefined uses the default
console.log(greet(null));               // null does not

function sum(...nums) {                 // rest: collects into an array
  return nums.reduce((total, n) => total + n, 0);
}
console.log(sum(1, 2, 3), sum());

function createCard({ title, price = 0 }) {   // destructure an options object
  return `${title}: ${price}`;
}
console.log(createCard({ title: 'Book' }));

function addTax(cart) { cart.total *= 1.1; }  // objects are shared: this changes the caller's
const cart = { total: 100 };
addTax(cart);
console.log(cart.total);
