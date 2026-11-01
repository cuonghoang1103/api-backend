// Three types that look alike: object, {} and Object.
const o1: object = { lab: 'BE-201' };
const o2: object = 'BE-201';          // a string is not an object
const e1: {} = 'BE-201';              // {} means "anything except null/undefined"
const e2: {} = 31;
const e3: {} = null;
const w1: Object = 31;                // the wrapper type: as loose as {}

export { o1, o2, e1, e2, e3, w1 };
