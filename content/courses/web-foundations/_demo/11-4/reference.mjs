const a = { name: 'Lan' };
const b = a;                       // b points at the SAME object, it is not a copy
b.name = 'Minh';
console.log('a.name =', a.name);

console.log({ x: 1 } === { x: 1 }, '<- two objects, even with the same content');
console.log(a === b, '<- same object');

const nums = [1, 2, 3];
const alias = nums;
alias.push(4);
console.log('nums =', nums);

// const means "this name cannot be pointed elsewhere" — NOT "the object cannot change"
const config = { theme: 'light' };
config.theme = 'dark';
console.log('const object changed:', config.theme);
