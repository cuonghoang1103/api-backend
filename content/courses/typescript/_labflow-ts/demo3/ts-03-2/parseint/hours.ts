// A lecturer types the hours she wants to block, as text: "07,08,09,10".
const typed = '07,08,09,10'.split(',');

const hours: number[] = typed.map(parseInt);               // passes parseInt itself as the callback
const fixed: number[] = typed.map((h) => Number.parseInt(h, 10));

console.log('map(parseInt)       →', hours);
console.log('map(h => parseInt…) →', fixed);
