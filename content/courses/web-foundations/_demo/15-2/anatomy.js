try {
  const cart = null;
  cart.items.length;                    // line 3
} catch (err) {
  console.log('name:    ' + err.name);
  console.log('message: ' + err.message);
  console.log('instanceof TypeError: ' + (err instanceof TypeError) + ', instanceof Error: ' + (err instanceof Error));
  console.log('stack points at: ' + err.stack.match(/anatomy\.js:\d+:\d+/)[0]);
}

function failWithString() {
  throw 'cart is empty';                // legal JavaScript... and a bad idea
}
try {
  failWithString();
} catch (err) {
  console.log('thrown a string → typeof ' + typeof err + ', err.message: ' + err.message + ', err.stack: ' + err.stack);
}
