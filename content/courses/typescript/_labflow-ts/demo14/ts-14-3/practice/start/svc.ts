export class Counter {
  #n = 0;
  tick(): void { this.#n += 1; }
  get value(): number { return this.#n; }
}
const c = new Counter();
c.tick();
// #n is private; read it through the getter.
export const v = c.#n;
