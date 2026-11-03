// logged is a METHOD decorator — ClassMethodDecoratorContext.
function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return fn;
}
class BookingService {
  // Applying a method decorator to a field is a type error.
  @logged
  count = 0;
}
export { BookingService };
