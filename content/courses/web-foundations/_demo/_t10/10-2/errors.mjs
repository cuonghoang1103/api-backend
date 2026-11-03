// Lesson 10.2 — the five error names you will meet most, each caught and printed as name: message
const tries = {
  'typo in a name':           () => { const total = 1; return totl + 1; },
  'calling a non-function':   () => { const user = { name: 'Lan' }; return user.getName(); },
  'reading through undefined':() => { const order = {}; return order.customer.name; },
  'invalid JSON':             () => JSON.parse("{ name: 'Lan' }"),
  'number out of range':      () => (3.14159).toFixed(101),
  'too much recursion':       () => { const f = (n) => f(n + 1); return f(0); },
};
for (const [what, fn] of Object.entries(tries)) {
  try { fn(); } catch (e) { console.log(what.padEnd(26), '→', e.name + ': ' + e.message); }
}
