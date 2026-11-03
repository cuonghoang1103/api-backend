// Lesson 9.5 — old JavaScript renamed to .ts: how many problems does each setting find?
function total(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
function findUser(users, id) {
  return users.find((u) => u.id === id);
}
const user = findUser([{ id: 1, name: 'Lan' }], 2);
console.log(user.name);
let count;
console.log(count + 1);
