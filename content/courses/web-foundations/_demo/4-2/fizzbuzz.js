// The classic interview warm-up. The order of the checks matters.
const out = [];
for (let i = 1; i <= 15; i++) {
  if (i % 15 === 0) out.push('FizzBuzz');
  else if (i % 3 === 0) out.push('Fizz');
  else if (i % 5 === 0) out.push('Buzz');
  else out.push(i);
}
console.log(out.join(' '));
