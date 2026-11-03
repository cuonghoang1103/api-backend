// A generic interface: the contract is the same for any element type.
interface Stack<T> {
  push(item: T): void;
  pop(): T | undefined;
  readonly size: number;
}

class ArrayStack<T> implements Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  get size(): number { return this.items.length; }
}

const labs = new ArrayStack<string>();
labs.push('BE-201');
labs.push('AL-301');
console.log(labs.pop(), labs.size);
