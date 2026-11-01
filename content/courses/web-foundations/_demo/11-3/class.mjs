class Product {
  static count = 0;             // belongs to the class, not to each product
  #price;                       // private field: only code inside the class can touch it

  constructor(name, price) {
    this.name = name;
    this.#price = price;
    Product.count++;
  }
  get price() { return this.#price; }               // getter: read like a property
  applyDiscount(percent) {
    if (percent < 0 || percent > 90) throw new RangeError('discount must be 0-90');
    this.#price = Math.round(this.#price * (1 - percent / 100));
    return this;                                     // return this => calls can be chained
  }
  toString() { return this.name + ' ' + this.#price.toLocaleString('vi-VN') + 'đ'; }
}

const p = new Product('Keyboard', 500000);
console.log(String(p.applyDiscount(10)));
console.log('price via getter:', p.price);
p.price = 1;                                         // no setter -> silently ignored? (strict: TypeError)
