// Runs as a module, so strict mode is ON (like every file in Vite, React, Next.js)
function whoAmI() {
  return this ? this.name : String(this);
}

// Rule 1 — new: this is the brand-new object
function Person(name) { this.name = name; }
const p = new Person('Lan');
console.log('1. new        ->', p.name);

// Rule 2 — explicit: call / apply / bind decide this
console.log('2. call       ->', whoAmI.call({ name: 'An' }));
console.log('2. bind       ->', whoAmI.bind({ name: 'Binh' })());

// Rule 3 — method call: this is the object BEFORE the dot
const user = { name: 'Chi', whoAmI };
console.log('3. user.who() ->', user.whoAmI());

// Rule 4 — plain call: nothing before the dot, so this is undefined (strict)
console.log('4. whoAmI()   ->', whoAmI());
