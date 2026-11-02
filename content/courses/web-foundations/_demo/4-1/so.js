console.log(0.1 + 0.2);                      // binary fractions are approximate
console.log((0.1 + 0.2).toFixed(2));         // toFixed returns a STRING
console.log(typeof (0.1 + 0.2).toFixed(2));
console.log(0.1 + 0.2 === 0.3);
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);

console.log(Number('42'), Number('12px'), Number(''), Number(' 7 '));
console.log(parseInt('12px'), parseFloat('3.5kg'), parseInt('abc'));

console.log(1 / 0, -1 / 0, 0 / 0);
console.log(NaN === NaN, Number.isNaN(0 / 0));

console.log(Number.MAX_SAFE_INTEGER, 9007199254740992 + 1);  // integers lose precision here
console.log(Math.round(2.5), Math.round(-2.5), Math.floor(2.9), Math.ceil(2.1));
