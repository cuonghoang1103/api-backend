// JavaScript has 7 primitive types + objects. typeof tells you which one you have.
const values = [42, 3.14, 'hello', true, undefined, null, Symbol('id'), 10n, { a: 1 }, [1, 2], function f() {}];
for (const v of values) {
  console.log(String(typeof v === 'symbol' ? v.toString() : v).padEnd(18), typeof v);
}
console.log('is it an array?', Array.isArray([1, 2]));
