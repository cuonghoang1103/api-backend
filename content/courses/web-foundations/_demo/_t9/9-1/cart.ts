// Lesson 9.1 — the same code with types: the mistake is reported before anything runs
interface CartItem {
  name: string;
  price: number;
  qty: number;
}
function total(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}
function label(items: CartItem[]): string {
  return 'Total: ' + items.reduce((sum, item) => sum + item.price, 0) + ' VND';
}

const cart: CartItem[] = [
  { name: 'Notebook', price: 25000, qty: 2 },
  { name: 'Pen', price: '5000', qty: 3 },
];
console.log(total(cart));
console.log(label(cart));
