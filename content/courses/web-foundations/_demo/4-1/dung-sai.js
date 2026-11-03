// In an if, every value is treated as true or false. Exactly these are falsy:
const falsy = [false, 0, -0, 0n, '', null, undefined, NaN];
console.log(falsy.map(Boolean));

// Everything else is truthy, including these surprises:
const surprises = ['0', 'false', ' ', [], {}, () => {}];
console.log(surprises.map(Boolean));

const items = [];
if (items) console.log('an empty array is truthy!');
if (items.length) console.log('never printed'); else console.log('use items.length');
