// @java: BrowserHistory.java
// LC 1472 · Design Browser History — two stacks: the pages behind you and the pages "ahead" (undo/redo is the same shape).

// #region giai
class BrowserHistory {
  private back: string[] = [];                     // pages you can go Back to (top = most recent)
  private fwd: string[] = [];                      // pages you can go Forward to
  constructor(private cur: string) {}
  visit(url: string): void {
    this.back.push(this.cur);
    this.cur = url;
    this.fwd = [];                                 // a NEW visit kills the forward history (like typing after undo)
  }
  goBack(steps: number): string {
    while (steps-- > 0 && this.back.length) { this.fwd.push(this.cur); this.cur = this.back.pop()!; }
    return this.cur;
  }
  goForward(steps: number): string {
    while (steps-- > 0 && this.fwd.length) { this.back.push(this.cur); this.cur = this.fwd.pop()!; }
    return this.cur;
  }
}
// #endregion

const b = new BrowserHistory('cuongthai.com');
b.visit('/courses');
b.visit('/courses/dsa-interview');
b.visit('/algorithms');
console.log('back(1) =', b.goBack(1));
console.log('back(1) =', b.goBack(1));
console.log('forward(1) =', b.goForward(1));
b.visit('/roadmap');
console.log('forward(2) =', b.goForward(2), '(forward history was cleared by visit)');
console.log('back(7) =', b.goBack(7), '(stops at the first page)');
