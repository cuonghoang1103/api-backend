const product = { name: 'Book', price: 100, tags: ['a', 'b'], stock: undefined, added: new Date(0), fn() {} };

const text = JSON.stringify(product);        // object → text, to send or to save
console.log(text);
console.log(typeof text);
console.log(JSON.stringify({ a: 1, b: [1, 2] }, null, 2));

const back = JSON.parse(text);               // text → object
console.log(back.tags[1], typeof back.added);

try {
  JSON.parse("{name: 'Linh'}");              // JSON needs double quotes and quoted keys
} catch (err) {
  console.log(err.name + ': ' + err.message);
}

const deep = structuredClone({ a: { b: 1 } });   // a real deep copy
console.log(deep);
