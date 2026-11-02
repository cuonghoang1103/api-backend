const list = ['a', 'b'];
list.extra = 'surprise';

for (const k in list) console.log('in :', k, typeof k);    // keys, as strings, including extras
for (const v of list) console.log('of :', v);              // values only

const user = { name: 'Linh', age: 20 };
for (const key in user) console.log(key, '=', user[key]);  // for...in is for objects
for (const [key, value] of Object.entries(user)) console.log(key, value);
