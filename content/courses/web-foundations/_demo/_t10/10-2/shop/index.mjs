// Lesson 10.2 — run me: one order works, the second crashes. Read the stack trace bottom-up.
import { checkout } from './checkout.mjs';

const orders = [
  { id: 1, customer: { name: 'Lan', address: { city: 'Da Nang' } }, items: [{ price: 25000, qty: 2 }] },
  { id: 2, customer: { name: 'Minh' }, items: [{ price: 5000, qty: 3 }] },          // pick-up order: no address
];
for (const order of orders) {
  console.log('order', order.id, checkout(order));
}
