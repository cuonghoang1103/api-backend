// string (lower-case) is the primitive type. String (capital S) is the type of a wrapper OBJECT.
const a: String = 'BE-201';               // accepted: a primitive fits the wrapper type
const b: string = a;                      // refused
const c: string = new String('BE-201');   // refused

console.log(typeof 'BE-201', typeof new String('BE-201'));
console.log(new String('BE-201') === new String('BE-201'));
