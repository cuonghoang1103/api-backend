// @java: MinStack.java
// LC 155 · Min Stack — every entry also stores "the minimum of everything at or below me".

// #region giai
class MinStack {
  private st: [number, number][] = [];            // [value, min so far]
  push(x: number): void {
    const m = this.st.length ? Math.min(x, this.st[this.st.length - 1][1]) : x;
    this.st.push([x, m]);
  }
  pop(): void { this.st.pop(); }                  // the min below is still stored below: nothing to recompute
  top(): number { return this.st[this.st.length - 1][0]; }
  getMin(): number { return this.st[this.st.length - 1][1]; }
}
// #endregion

const ms = new MinStack();
const out: string[] = [];
for (const x of [5, 3, 7, 3, 1]) { ms.push(x); out.push(`push ${x} -> min ${ms.getMin()}`); }
for (let k = 0; k < 4; k++) { ms.pop(); out.push(`pop -> top ${ms.top()} min ${ms.getMin()}`); }
out.forEach((l) => console.log(l));
