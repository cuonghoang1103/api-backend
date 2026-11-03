// A method decorator wraps the method; its context is typed by ClassMethodDecoratorContext.
function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return function (this: T, ...args: A): R {
    console.log('call', String(ctx.name));
    return fn.call(this, ...args);
  };
}
class BookingService {
  @logged
  book(lab: string): string { return 'booked ' + lab; }
}
console.log(new BookingService().book('BE-201'));
