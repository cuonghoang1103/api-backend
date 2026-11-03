import format, { add } from './money.ts';     // default + named
import type { Money } from './money.ts';       // a type, erased at run time
const a: Money = { amount: 10, currency: 'USD' };
const b: Money = { amount: 5, currency: 'USD' };
console.log(format(add(a, b)));
