// cho: 300
async function loadOrdersSwallow() {
  try {
    throw new Error('500 Internal Server Error from /api/orders');   // pretend the server failed
  } catch {
    return [];                                                         // "a safe default"
  }
}
async function loadOrdersHonest() {
  throw new Error('500 Internal Server Error from /api/orders');
}

(async () => {
  const orders = await loadOrdersSwallow();
  if (orders.length === 0) console.log('swallowed → UI: "You have no orders yet."   ← wrong, the server is down');
  try {
    await loadOrdersHonest();
  } catch (err) {
    console.log('honest    → UI: "Could not load your orders. Try again." and the team gets: ' + err.message);
  }
})();
