const orders = [
  { id: 1, customer: 'An', total: 120, paid: true },
  { id: 2, customer: 'Binh', total: 80, paid: false },
  { id: 3, customer: 'Chi', total: 200, paid: true },
  { id: 4, customer: 'An', total: 40, paid: true },
];

console.log(orders.map((o) => o.total));                       // transform each
console.log(orders.filter((o) => o.paid).map((o) => o.id));    // keep some
console.log(orders.find((o) => o.total > 100));                // first match
console.log(orders.find((o) => o.total > 999));
console.log(orders.some((o) => !o.paid), orders.every((o) => o.total > 0));

const revenue = orders
  .filter((o) => o.paid)
  .reduce((sum, o) => sum + o.total, 0);                       // combine into one value
console.log('revenue', revenue);

const byCustomer = orders.reduce((acc, o) => {
  acc[o.customer] = (acc[o.customer] ?? 0) + o.total;
  return acc;
}, {});
console.log(byCustomer);

try {
  [].reduce((a, b) => a + b);                                  // no initial value
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
