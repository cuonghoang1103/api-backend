// @java: LruCache.java
// LC 146 · LRU Cache — hash map (key -> node) + doubly linked list (most recent at the front). get/put O(1).

// #region giai
class DNode {
  prev: DNode | null = null;
  next: DNode | null = null;
  constructor(public key: number, public val: number) {}
}
class LRUCache {
  private map = new Map<number, DNode>();
  private head = new DNode(0, 0);                  // sentinel: head.next = MOST recently used
  private tail = new DNode(0, 0);                  // sentinel: tail.prev = LEAST recently used
  constructor(private cap: number) { this.head.next = this.tail; this.tail.prev = this.head; }
  private unlink(n: DNode): void { n.prev!.next = n.next; n.next!.prev = n.prev; }
  private addFront(n: DNode): void {
    n.next = this.head.next; n.prev = this.head;
    this.head.next!.prev = n; this.head.next = n;
  }
  get(key: number): number {
    const n = this.map.get(key);
    if (!n) return -1;
    this.unlink(n); this.addFront(n);              // touched => most recent
    return n.val;
  }
  put(key: number, val: number): void {
    const old = this.map.get(key);
    if (old) { old.val = val; this.unlink(old); this.addFront(old); return; }
    if (this.map.size === this.cap) {              // full: evict the node just before the tail sentinel
      const lru = this.tail.prev!;
      this.unlink(lru);
      this.map.delete(lru.key);                    // this is why the node stores its KEY
    }
    const n = new DNode(key, val);
    this.map.set(key, n); this.addFront(n);
  }
  order(): string { const p: number[] = []; for (let n = this.head.next; n !== this.tail; n = n!.next) p.push(n!.key); return p.join(' '); }
}
// #endregion

const c = new LRUCache(2);
const out: string[] = [];
c.put(1, 1); out.push(`put(1,1)   order=[${c.order()}]`);
c.put(2, 2); out.push(`put(2,2)   order=[${c.order()}]`);
out.push(`get(1)=${c.get(1)}   order=[${c.order()}]`);
c.put(3, 3); out.push(`put(3,3)   order=[${c.order()}]  (2 evicted)`);
out.push(`get(2)=${c.get(2)}  order=[${c.order()}]`);
c.put(4, 4); out.push(`put(4,4)   order=[${c.order()}]  (1 evicted)`);
out.push(`get(1)=${c.get(1)} get(3)=${c.get(3)} get(4)=${c.get(4)}  order=[${c.order()}]`);
out.forEach((l) => console.log(l));
