// Before 2015: a constructor function + methods on its prototype
function User(name) {
  this.name = name;                 // own data, one copy per user
}
User.prototype.greet = function () {  // ONE method, shared by every user
  return 'Hi, ' + this.name;
};

const a = new User('Lan');
const b = new User('Minh');
console.log(a.greet(), '|', b.greet());
console.log('same greet function?', a.greet === b.greet);
console.log('prototype of a is User.prototype?', Object.getPrototypeOf(a) === User.prototype);

// What "new" does, written out by hand
function fakeNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);   // 1. new object linked to the prototype
  const result = Ctor.apply(obj, args);        // 2. run the constructor with this = obj
  return typeof result === 'object' && result !== null ? result : obj;   // 3. return it
}
const c = fakeNew(User, 'Chi');
console.log(c.greet(), '| instanceof User?', c instanceof User);
