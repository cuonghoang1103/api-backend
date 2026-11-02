const fruits = ['apple', 'banana', 'cherry'];

for (let i = 0; i < fruits.length; i++) console.log(i, fruits[i]);   // classic
for (const f of fruits) console.log(f);                              // values
fruits.forEach((f, i) => console.log(i + ':', f));                   // method

let n = 3;
while (n > 0) { console.log('countdown', n); n--; }

for (let i = 1; i <= 10; i++) {
  if (i === 2) continue;   // skip the rest of this round
  if (i === 4) break;      // leave the loop
  console.log('i =', i);
}
