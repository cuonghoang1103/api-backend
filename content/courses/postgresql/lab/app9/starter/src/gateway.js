// gateway.js — a FAKE payment gateway: answers after GATEWAY_MS milliseconds (default 300), like a real one over the internet.
const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

export async function thuTien({ order_id, amount, method }) {
  await ngu(Number(process.env.GATEWAY_MS ?? 300));
  return { ref: `GW-${order_id}-${method}`, amount: amount.toString() };
}
