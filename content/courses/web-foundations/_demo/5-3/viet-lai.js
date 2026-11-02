const getUser = (id) => new Promise((r) => setTimeout(() => r({ id, name: 'Linh' }), 30));
const getOrders = (user) => new Promise((r) => setTimeout(() => r([{ total: 120 }, { total: 80 }]), 30));

// with .then
getUser(7)
  .then((user) => getOrders(user).then((orders) => ({ user, orders })))
  .then(({ user, orders }) => console.log('then :', user.name, orders.length, 'orders'));

// the same with async/await: reads top to bottom
async function showOrders(id) {
  const user = await getUser(id);
  const orders = await getOrders(user);
  console.log('await:', user.name, orders.length, 'orders');
  return orders.length;
}
const result = showOrders(7);
console.log('an async function always returns a promise:', result instanceof Promise);
