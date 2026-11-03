// Declarations are found before the code runs (hoisting), with different results.
console.log(typeof oldStyle, oldStyle);
var oldStyle = 1;

try {
  console.log(newStyle);
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
let newStyle = 2;

try {
  console.log(notDeclared);
} catch (err) {
  console.log(err.name + ': ' + err.message);
}
