const user = { name: 'Lan', age: 20, address: { city: 'Hanoi' } };

// replace instead of mutate
const older = { ...user, age: 21 };
console.log(user.age, older.age, '| same object?', user === older);

// spread is SHALLOW: nested objects are still shared
const moved = { ...user };
moved.address.city = 'Da Nang';
console.log('user city after editing the "copy":', user.address.city);

// correct: copy each level you change
const moved2 = { ...user, address: { ...user.address, city: 'Hue' } };
console.log('user:', user.address.city, '| moved2:', moved2.address.city);

// structuredClone = full deep copy
const deep = structuredClone(user);
deep.address.city = 'Can Tho';
console.log('after structuredClone edit, user:', user.address.city);
