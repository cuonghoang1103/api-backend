const s = '  Xin chào, Web Foundations  ';
console.log(s.length);
console.log(s.trim());
console.log(s.trim().toUpperCase());
console.log(s.includes('chào'), s.indexOf('Web'));
console.log(s.trim().slice(0, 8));
console.log('a,b,c'.split(','));
console.log('a-b-c'.replaceAll('-', '/'));

const name = 'Linh', age = 20;
console.log(`Hello ${name}, next year you will be ${age + 1}.`);   // template literal

// Strings cannot be changed; methods return a new string.
let word = 'cat';
word[0] = 'b';
console.log(word);
word = 'b' + word.slice(1);
console.log(word);

console.log('😀'.length, [...'😀'].length);
