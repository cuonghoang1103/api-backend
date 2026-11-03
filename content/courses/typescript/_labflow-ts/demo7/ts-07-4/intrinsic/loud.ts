// Built-in template helpers transform the string type itself.
type Upper = Uppercase<'be-201'>;      // 'BE-201'
type Cap = Capitalize<'created'>;      // 'Created'
type Getter = `get${Capitalize<'code'>}`; // 'getCode'

const u: Upper = 'BE-201';
const c: Cap = 'Created';
const g: Getter = 'getCode';
console.log(u, c, g);
