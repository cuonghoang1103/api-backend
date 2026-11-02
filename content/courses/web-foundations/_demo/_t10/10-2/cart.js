// Lesson 10.2 — a bug you find by WATCHING values: data-* attributes are always strings
const cart = [{ name: 'Notebook', price: 25000, qty: 2 }];

function cartTotal(items, shipping) {
  let total = 0;
  for (const item of items) total = total + item.price * item.qty;   // "5000" * 1 is 5000 — the string hides here
  return total + shipping;                                            // …and shows up here
}

document.querySelector('#add').addEventListener('click', (event) => {
  const { price, shipping } = event.target.dataset;                  // { price: "5000", shipping: "15000" }
  cart.push({ name: 'Pen', price, qty: 1 });
  const total = cartTotal(cart, shipping);
  console.log('total is', total, typeof total);
  document.querySelector('#total').textContent = 'Total: ' + total + ' VND';
  window.lastLabel.textContent = 'updated';                          // lastLabel was never created → TypeError
});
