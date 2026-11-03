function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return fn;
}
class Svc {
  @logged
  greet(): string { return 'hi'; }
}
export { Svc };
