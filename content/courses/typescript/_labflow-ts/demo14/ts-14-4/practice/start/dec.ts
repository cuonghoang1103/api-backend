function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return fn;
}
class Svc {
  // A method decorator cannot go on a field.
  @logged
  name = 'x';
}
export { Svc };
