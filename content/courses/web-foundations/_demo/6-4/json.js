// What survives the trip through JSON, and what does not.
const order = {
  id: 7,
  total: 125000,
  paid: false,
  note: undefined,                         // disappears
  items: ['pen', 'mug'],
  createdAt: new Date('2026-11-02T09:30:00Z'), // becomes a string
  discount: NaN,                           // becomes null
  print() { return 'order 7'; },           // disappears
};
const text = JSON.stringify(order);
console.log('sent    :', text);

const back = JSON.parse(text);
console.log('typeof createdAt after parse:', typeof back.createdAt);
console.log('has note?', 'note' in back, '| discount:', back.discount);

// pretty output for humans: indent with 2 spaces
console.log(JSON.stringify({ id: 1, tags: ['a'] }, null, 2));

// large integers lose precision as JS numbers
console.log('big id  :', JSON.parse('{"id": 9007199254740993}').id);

// JSON is stricter than JS object literals
for (const bad of ["{'name': 'Pen'}", '{name: "Pen"}', '{"name": "Pen",}', '<!doctype html><h1>502 Bad Gateway</h1>']) {
  try {
    JSON.parse(bad);
  } catch (err) {
    console.log('parse error:', bad.slice(0, 22).padEnd(22), '→', err.message);
  }
}
