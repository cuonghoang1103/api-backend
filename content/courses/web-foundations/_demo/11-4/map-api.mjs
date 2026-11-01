const stock = new Map([['apple', 5], ['pear', 0]]);
stock.set('mango', 12);                    // insertion order is kept
for (const [fruit, qty] of stock) console.log(fruit, qty);

// counting words: the classic Map job
const words = 'to be or not to be'.split(' ');
const freq = new Map();
for (const w of words) freq.set(w, (freq.get(w) ?? 0) + 1);
console.log(freq);

// converting between Map and plain object (for JSON)
const asObject = Object.fromEntries(freq);
console.log(JSON.stringify(asObject));
console.log(JSON.stringify(freq), '<- a Map does not survive JSON.stringify');
const back = new Map(Object.entries(asObject));
console.log(back.get('be'));
