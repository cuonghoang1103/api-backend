abstract class Store {
  abstract get(id: number): number | undefined;
  getOr(id: number, fallback: number): number { return this.get(id) ?? fallback; }
}
// A concrete subclass must implement get — this one forgot.
class SeatStore extends Store {}
export { SeatStore };
