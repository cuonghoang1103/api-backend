// mod/counter.js — a module runs once; every importer shares the same state
let count = 0;
export const next = () => ++count;
console.log('counter.js is running (this prints once, however many files import it)');
