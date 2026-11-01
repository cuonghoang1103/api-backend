const app = 'Shop';                 // global scope: visible everywhere

function outer() {
  const user = 'Lan';               // outer's scope
  function inner() {
    const item = 'Book';            // inner's scope
    console.log(app, user, item);   // inner can look OUTWARD
  }
  inner();
  console.log(typeof item);         // outer cannot look INWARD
}

outer();
console.log(typeof user);           // global cannot see outer's variables
