// An abstract class names the shape a subclass must fill in.
abstract class BookingRepo {
  abstract find(id: number): string | undefined;
  describe(id: number): string { return this.find(id) ?? 'not found'; }
}
class MemoryRepo extends BookingRepo {
  private rows = new Map<number, string>([[1, 'BE-201']]);
  find(id: number): string | undefined { return this.rows.get(id); }
}
const repo: BookingRepo = new MemoryRepo();
console.log(repo.describe(1), '/', repo.describe(2));
