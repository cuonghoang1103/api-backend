const animal = { eats: true, describe() { return 'eats: ' + this.eats; } };
const rabbit = Object.create(animal);   // rabbit's prototype is animal
rabbit.jumps = true;

console.log('rabbit.jumps   ', rabbit.jumps);          // own property
console.log('rabbit.eats    ', rabbit.eats);           // found one step up the chain
console.log('rabbit.describe', rabbit.describe());     // method borrowed from animal
console.log('rabbit.flies   ', rabbit.flies);          // not found anywhere -> undefined

console.log('own jumps?', Object.hasOwn(rabbit, 'jumps'), '| own eats?', Object.hasOwn(rabbit, 'eats'));
console.log("'eats' in rabbit?", 'eats' in rabbit);

// Walk the chain by hand
let o = rabbit, step = 0;
while (o) {
  console.log('step', step++, Object.keys(o).length ? Object.keys(o) : '(Object.prototype: toString, hasOwnProperty, ...)');
  o = Object.getPrototypeOf(o);
}
console.log('end of chain:', o);
