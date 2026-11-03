// Three real bugs, none of which stops the file from running.
export function addToCart(cart, item, qty) {
  const discount = 0.1;
  if (qty = 0) {
    return cart;
  }
  if (item.price == '0') {
    console.log('free item');
  }
  cart.push({ ...item, qty });
  return totl(cart);
}
