console.log(add(2, 3));                 // works: declarations are hoisted

function add(a, b) {                    // declaration
  return a + b;
}

const multiply = function (a, b) {      // expression
  return a * b;
};

const square = (x) => x * x;            // arrow, implicit return

const greet = (name) => {               // arrow with a body: needs return
  const text = 'Hi ' + name;
  return text;
};

console.log(multiply(2, 3), square(4), greet('Linh'));

try {
  later();
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
const later = () => 'too early';
