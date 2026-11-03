// Lesson 9.1 — types are erased: they cannot check data that arrives at runtime
interface Product {
  id: number;
  name: string;
  price: number;
}
const body = '{"id": 7, "title": "Ruler", "price": "8000"}';   // what a server really sent
const product = JSON.parse(body) as Product;                  // "trust me" — TypeScript cannot check this
console.log(typeof product.price, product.price * 2);
console.log(product.name.toUpperCase());
