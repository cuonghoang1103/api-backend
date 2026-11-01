// An object turns EVERY key into a string
const visits = {};
visits[1] = 'one';
visits['1'] = 'string one';            // same key as 1!
const lan = { id: 7 }, minh = { id: 8 };
visits[lan] = 'Lan';
visits[minh] = 'Minh';                 // overwrites Lan: both become "[object Object]"
console.log(Object.keys(visits));
console.log(visits[lan]);

// A Map keeps keys exactly as they are
const m = new Map();
m.set(1, 'number one').set('1', 'string one').set(lan, 'Lan').set(minh, 'Minh');
console.log(m.size, m.get(1), '|', m.get('1'), '|', m.get(lan), '|', m.get(minh));
console.log('has minh?', m.has(minh), '| delete 1:', m.delete(1), '| size now', m.size);
