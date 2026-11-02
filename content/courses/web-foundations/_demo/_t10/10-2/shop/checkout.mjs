import { shippingLabel } from './format.mjs';

export function checkout(order) {
  const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { total, label: shippingLabel(order) };
}
