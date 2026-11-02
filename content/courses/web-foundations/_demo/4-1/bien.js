// A variable is a named box for a value.
let score = 10;        // let: may change later
score = score + 5;
const name = 'Linh';   // const: this name always points to this value
console.log(name, score);

try {
  name = 'An';         // not allowed
} catch (err) {
  console.log(err.name + ': ' + err.message);
}

const user = { age: 20 };
user.age = 21;         // allowed: the box still holds the same object
console.log(user);

// var is the old keyword. It ignores blocks, so the value leaks out.
if (true) { var leak = 'I escaped'; let safe = 'I stay here'; }
console.log(leak);
console.log(typeof safe);
