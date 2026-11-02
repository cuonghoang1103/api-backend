function day(n) {
  let out = '';
  switch (n) {
    case 6:
      out += 'Saturday ';      // no break: falls through!
    case 7:
      out += 'Sunday ';
      break;
    default:
      out += 'Weekday ';
  }
  return out;
}
console.log(day(6));
console.log(day(7));
console.log(day(1));

// A lookup object is often clearer than a switch.
const prices = { coffee: 30, tea: 20 };
console.log(prices.coffee ?? 'not sold', prices.juice ?? 'not sold');

// switch compares with ===
switch ('1') { case 1: console.log('number'); break; default: console.log('no match'); }
