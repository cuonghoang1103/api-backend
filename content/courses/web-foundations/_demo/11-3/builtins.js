const list = [3, 1, 2];
console.log('list.map comes from Array.prototype?', list.map === Array.prototype.map);
console.log('own keys of list:', Object.keys(list));
console.log(Object.getPrototypeOf(Object.getPrototypeOf(list)) === Object.prototype);

// Adding to a built-in prototype changes EVERY array in the page — never do this in real code
Array.prototype.last = function () { return this[this.length - 1]; };
console.log([10, 20, 30].last());
for (const k in [1, 2]) console.log('for...in sees key:', k);   // the extra method leaks into for...in
delete Array.prototype.last;
