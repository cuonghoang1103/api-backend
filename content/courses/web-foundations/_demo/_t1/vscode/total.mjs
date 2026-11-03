// A tiny script to step through with the debugger (F5 with launch.json).
const prices = [450000, 150000, 99000];
let sum = 0;
for (const price of prices) {
  sum += price;            // put a breakpoint here and watch `sum` grow
}
console.log('Total:', sum);
