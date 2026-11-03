const user = { name: 'Linh', age: 20, 'favourite color': 'blue', address: { city: 'Hà Nội' } };

console.log(user.name, user['age'], user['favourite color']);
const field = 'age';
console.log(user[field], user.field);        // [] uses the variable; . looks for a key named "field"

user.email = 'linh@example.com';             // add
user.age = 21;                               // update
delete user['favourite color'];              // remove
console.log(user);

console.log(Object.keys(user));
console.log(Object.values(user).length, Object.entries({ a: 1, b: 2 }));
console.log('age' in user, user.phone, user.phone?.number);

const { name, age: years, phone = 'none' } = user;   // destructuring
console.log(name, years, phone);

const older = { ...user, age: 22 };          // copy + change
console.log(older.age, user.age);

const shallow = { ...user };
shallow.address.city = 'Huế';                // nested objects are still shared
console.log(user.address.city);
