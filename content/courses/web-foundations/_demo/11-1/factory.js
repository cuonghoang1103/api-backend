function multiplyBy(factor) {
  return (n) => n * factor;          // factor is captured
}
const double = multiplyBy(2);
const triple = multiplyBy(3);
console.log(double(5), triple(5));

function makeFormatter(currency, locale) {
  const fmt = new Intl.NumberFormat(locale, { style: 'currency', currency });
  return (amount) => fmt.format(amount);   // the formatter is built ONCE, reused many times
}
const vnd = makeFormatter('VND', 'vi-VN');
const usd = makeFormatter('USD', 'en-US');
console.log(vnd(125000));
console.log(usd(19.5));
