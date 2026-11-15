// @java: CircularQueue.java
// LC 622 · Design Circular Queue — a fixed array, two indices that wrap around with %.

// #region giai
class MyCircularQueue {
  private a: number[];
  private head = 0;                                // index of the front element
  private size = 0;                                // a COUNT tells "full" from "empty" (head == tail in both!)
  constructor(private cap: number) { this.a = new Array(cap); }
  enQueue(x: number): boolean {
    if (this.size === this.cap) return false;
    this.a[(this.head + this.size) % this.cap] = x; // tail is computed, not stored
    this.size++;
    return true;
  }
  deQueue(): boolean {
    if (this.size === 0) return false;
    this.head = (this.head + 1) % this.cap;
    this.size--;
    return true;
  }
  Front(): number { return this.size === 0 ? -1 : this.a[this.head]; }
  Rear(): number { return this.size === 0 ? -1 : this.a[(this.head + this.size - 1) % this.cap]; }
  isEmpty(): boolean { return this.size === 0; }
  isFull(): boolean { return this.size === this.cap; }
}
// #endregion

const q = new MyCircularQueue(3);
const log: string[] = [];
log.push(`enQueue 1,2,3,4 -> ${[1, 2, 3, 4].map((x) => q.enQueue(x)).join(',')}`);
log.push(`Rear=${q.Rear()} isFull=${q.isFull()}`);
log.push(`deQueue -> ${q.deQueue()}  enQueue 4 -> ${q.enQueue(4)}  Front=${q.Front()} Rear=${q.Rear()}`);
log.push(`deQueue x3 -> ${[q.deQueue(), q.deQueue(), q.deQueue()].join(',')}  deQueue again -> ${q.deQueue()}  isEmpty=${q.isEmpty()} Front=${q.Front()}`);
log.forEach((l) => console.log(l));
