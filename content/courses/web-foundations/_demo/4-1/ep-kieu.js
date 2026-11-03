// Predict each line. + joins text if EITHER side is a string; - * / always try numbers.
console.log('5' + 1);
console.log('5' - 1);
console.log('5' * '2');
console.log(1 + 2 + '3');
console.log('1' + 2 + 3);
console.log(true + 1);
console.log(null + 1);
console.log(undefined + 1);
console.log([] + []);
console.log('abc' * 2);

console.log('--- == converts, === does not ---');
console.log(0 == '', 0 === '');
console.log(1 == '1', 1 === '1');
console.log(null == undefined, null === undefined);
console.log(false == '0', false === '0');
