// A pure function: same input, same output, changes nothing outside.
const addPure = (cart, item) => [...cart, item];

let log = 0;
const addImpure = (cart, item) => {
  log++;             // changes something outside
  cart.push(item);   // changes the input
  return cart;
};

const a = ['pen'];
const b = addPure(a, 'book');
console.log(a, b);

const c = ['pen'];
const d = addImpure(c, 'book');
console.log(c, d, c === d, 'log =', log);
