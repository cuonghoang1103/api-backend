class Box<T> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
  // A method may add its OWN type parameter U, independent of the class's T.
  map<U>(f: (value: T) => U): Box<U> {
    return new Box(f(this.value));
  }
}

const n = new Box(10);
const text = n.map((x) => 'seats: ' + x);   // Box<string>
console.log(text.value);
