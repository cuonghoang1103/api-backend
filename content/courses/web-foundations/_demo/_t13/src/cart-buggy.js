// The SAME module after a "small refactor" by a teammate: > instead of >=
export { subtotal, applyCoupon } from './cart.js';
import { subtotal, applyCoupon } from './cart.js';

export function shipping(amount) {
  return amount > 500_000 ? 0 : 30_000;
}

export function total(items, couponPercent) {
  const sub = subtotal(items);
  const discounted = couponPercent ? applyCoupon(sub, couponPercent) : sub;
  return discounted + shipping(discounted);
}
