abstract class Store {
  abstract get(id: number): number | undefined;
  getOr(id: number, fallback: number): number { return this.get(id) ?? fallback; }
}
class SeatStore extends Store {
  get(id: number): number | undefined { return id === 1 ? 40 : undefined; }
}
console.log(new SeatStore().getOr(1, 0), new SeatStore().getOr(9, 0));
