// Lesson 9.4 — typing functions: parameters, return values, optional and default parameters
function priceWithTax(price: number, rate: number = 0.1): number {
  return Math.round(price * (1 + rate));
}
priceWithTax(25000);            // fine: rate has a default
priceWithTax('25000');          // 1. wrong argument type
priceWithTax(25000, 0.1, 2);    // 2. too many arguments

function findTitle(id: number): string {
  if (id === 1) return 'Hello World';
}                               // 3. not every path returns a string

function log(message: string, level?: 'info' | 'error'): void {
  console.log((level ?? 'info') + ': ' + message);
}
log('saved');
log('failed', 'warning');       // 4. not one of the allowed levels

type Handler = (event: { type: string; at: number }) => void;   // a function type, for callbacks
const onSave: Handler = (e) => console.log(e.type, e.at);        // e is typed without writing it
const bad: Handler = (e) => e.time;                              // 5. the event has no "time"
