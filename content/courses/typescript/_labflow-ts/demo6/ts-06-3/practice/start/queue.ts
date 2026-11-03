// A queue that should work for any element type — but it is hard-coded to string.
export class Queue {
  private items: string[] = [];
  enqueue(item: string): void { this.items.push(item); }
  dequeue(): string | undefined { return this.items.shift(); }
  get size(): number { return this.items.length; }
}

const nums = new Queue();
nums.enqueue(42);   // should be allowed if Queue were generic over number
