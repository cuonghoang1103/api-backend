// @java: QueueHaiStack.java
// LC 232 · Implement Queue using Stacks — amortised O(1): each element moves from inbox to outbox at most once.

// #region giai
class MyQueue {
  private inbox: number[] = [];                    // new elements land here (top = newest)
  private outbox: number[] = [];                   // reversed: top = OLDEST, ready to leave
  moves = 0;                                       // counter only for the demo
  push(x: number): void { this.inbox.push(x); }
  private shiftOver(): void {
    if (this.outbox.length === 0) {                // ONLY when the outbox is empty
      while (this.inbox.length) { this.outbox.push(this.inbox.pop()!); this.moves++; }
    }
  }
  pop(): number { this.shiftOver(); return this.outbox.pop()!; }
  peek(): number { this.shiftOver(); return this.outbox[this.outbox.length - 1]; }
  empty(): boolean { return this.inbox.length === 0 && this.outbox.length === 0; }
}
// #endregion

const q = new MyQueue();
q.push(1); q.push(2); q.push(3);
const got: number[] = [q.pop()];
q.push(4);
got.push(q.pop(), q.pop(), q.pop());
console.log('popped in order:', JSON.stringify(got), ' empty =', q.empty());
const big = new MyQueue();
let ops = 0;
for (let i = 0; i < 100_000; i++) { big.push(i); ops++; if (i % 3 === 2) { big.pop(); ops++; } }
while (!big.empty()) { big.pop(); ops++; }
console.log('operations =', ops, ' element moves =', big.moves, ' moves per operation =', (big.moves / ops).toFixed(2));
