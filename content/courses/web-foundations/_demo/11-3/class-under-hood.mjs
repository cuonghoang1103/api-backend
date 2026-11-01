class Product {
  #price = 0;
  constructor(name) { this.name = name; }
  describe() { return 'Product ' + this.name; }
}
const p = new Product('Mouse');
console.log('typeof Product:', typeof Product);
console.log('describe lives on the prototype?', Object.hasOwn(Product.prototype, 'describe'));
console.log('own keys of p:', Object.keys(p));
console.log('JSON:', JSON.stringify(p));
try {
  Product('Pen');
} catch (e) {
  console.log('calling without new ->', e.name + ': ' + e.message);
}
