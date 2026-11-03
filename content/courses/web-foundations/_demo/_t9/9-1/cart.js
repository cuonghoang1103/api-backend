// Lesson 9.1 — plain JavaScript: the price arrives as a string from a form field
function total(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function label(items) {
  return 'Total: ' + items.reduce((sum, item) => sum + item.price, 0) + ' VND';
}

const cart = [
  { name: 'Notebook', price: 25000, qty: 2 },
  { name: 'Pen', price: '5000', qty: 3 },   // from <input>.value — a string!
];
console.log(total(cart));
console.log(label(cart));
