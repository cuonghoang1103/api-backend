// "The total is wrong." Instead of guessing, print the values you are sure about.
const prices = ['120', '80', '50'];   // values read from a form input are ALWAYS strings
let total = 0;
for (const p of prices) total = total + p;
console.log('total:', total);                    // expected 250
console.log('typeof prices[0]:', typeof prices[0]); // the assumption you never checked

let fixed = 0;
for (const p of prices) fixed = fixed + Number(p);
console.log('fixed total:', fixed);
