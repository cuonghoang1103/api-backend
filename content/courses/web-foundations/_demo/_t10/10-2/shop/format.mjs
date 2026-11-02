// Lesson 10.2 — the bug lives here, two calls away from where the program started
export function shippingLabel(order) {
  return order.customer.name + ', ' + order.customer.address.city.toUpperCase();
}
