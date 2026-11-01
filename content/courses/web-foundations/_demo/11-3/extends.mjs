class Shape {
  constructor(name) { this.name = name; }
  area() { return 0; }
  describe() { return this.name + ' with area ' + this.area().toFixed(2); }
}
class Circle extends Shape {
  constructor(r) {
    super('circle');          // MUST call super before using this
    this.r = r;
  }
  area() { return Math.PI * this.r ** 2; }          // override
}
class Square extends Shape {
  constructor(side) { super('square'); this.side = side; }
  area() { return this.side ** 2; }
  describe() { return '[' + super.describe() + ']'; }  // extend the parent's version
}

for (const s of [new Circle(1), new Square(3)]) console.log(s.describe());
const c = new Circle(2);
console.log('instanceof Circle/Shape/Object:', c instanceof Circle, c instanceof Shape, c instanceof Object);
console.log('chain:', Object.getPrototypeOf(c) === Circle.prototype, Object.getPrototypeOf(Circle.prototype) === Shape.prototype);

class Broken extends Shape {
  constructor() { this.x = 1; super('broken'); }
}
try { new Broken(); } catch (e) { console.log('this before super ->', e.name + ': ' + e.message); }
