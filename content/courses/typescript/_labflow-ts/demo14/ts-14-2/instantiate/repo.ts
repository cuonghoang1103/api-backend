abstract class BookingRepo {
  abstract find(id: number): string | undefined;
}
// An abstract class cannot be instantiated directly.
const repo = new BookingRepo();
export { repo };
