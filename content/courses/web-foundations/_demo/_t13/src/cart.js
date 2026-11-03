// Money is stored in whole đồng (integers) — never in floating-point thousands.
export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

// Shipping: 30 000đ, free from 500 000đ (inclusive)
export function shipping(amount) {
  return amount >= 500_000 ? 0 : 30_000;
}

// A coupon is a percentage between 1 and 50
export function applyCoupon(amount, percent) {
  if (!Number.isInteger(percent) || percent < 1 || percent > 50) {
    throw new RangeError('coupon must be an integer from 1 to 50');
  }
  return Math.round(amount * (100 - percent) / 100);
}

export function total(items, couponPercent) {
  const sub = subtotal(items);
  const discounted = couponPercent ? applyCoupon(sub, couponPercent) : sub;
  return discounted + shipping(discounted);
}
