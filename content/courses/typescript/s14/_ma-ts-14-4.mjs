/**
 * _ma (bài 14.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "decRun": `// A method decorator wraps the method; its context is typed by ClassMethodDecoratorContext.
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
console.log(new BookingService().book('BE-201'));`,
  "wrongtarget": `// logged is a METHOD decorator — ClassMethodDecoratorContext.
function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return fn;
}
class BookingService {
  // Applying a method decorator to a field is a type error.
  @logged
  count = 0;
}
export { BookingService };`,
  "prStart": `function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return fn;
}
class Svc {
  // A method decorator cannot go on a field.
  @logged
  name = 'x';
}
export { Svc };`,
  "prSol": `function logged<T, A extends unknown[], R>(fn: (this: T, ...args: A) => R, ctx: ClassMethodDecoratorContext): (this: T, ...args: A) => R {
  return fn;
}
class Svc {
  @logged
  greet(): string { return 'hi'; }
}
export { Svc };`,
};
export const OUT = {
  '11-run': `$ node_modules/.bin/tsc -p demo14/ts-14-4/run/tsconfig.emit.json && node demo14/ts-14-4/run/out/dec.js
call book
booked BE-201`,
  '12-wrongtarget': `$ node_modules/.bin/tsc -p demo14/ts-14-4/wrongtarget
demo14/ts-14-4/wrongtarget/dec.ts(7,4): error TS1240: Unable to resolve signature of property decorator when called as an expression.
  Argument of type 'undefined' is not assignable to parameter of type '(this: unknown, ...args: unknown[]) => unknown'.
demo14/ts-14-4/wrongtarget/dec.ts(7,4): error TS1270: Decorator function return type '(this: unknown, ...args: unknown[]) => unknown' is not assignable to type 'void | ((this: BookingService, value: number) => number)'.
  Type '(this: unknown, ...args: unknown[]) => unknown' is not assignable to type '(this: BookingService, value: number) => number'.
    Type 'unknown' is not assignable to type 'number'.`,
  '13-pr-start': `$ node_modules/.bin/tsc -p demo14/ts-14-4/practice/start
demo14/ts-14-4/practice/start/dec.ts(6,4): error TS1240: Unable to resolve signature of property decorator when called as an expression.
  Argument of type 'undefined' is not assignable to parameter of type '(this: unknown, ...args: unknown[]) => unknown'.
demo14/ts-14-4/practice/start/dec.ts(6,4): error TS1270: Decorator function return type '(this: unknown, ...args: unknown[]) => unknown' is not assignable to type 'void | ((this: Svc, value: string) => string)'.
  Type '(this: unknown, ...args: unknown[]) => unknown' is not assignable to type '(this: Svc, value: string) => string'.
    Type 'unknown' is not assignable to type 'string'.`,
  '14-pr-sol': `$ node_modules/.bin/tsc -p demo14/ts-14-4/practice/solution`,
};
