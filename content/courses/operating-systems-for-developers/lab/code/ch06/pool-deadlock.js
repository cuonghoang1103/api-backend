// pool-deadlock.js — "deadlock" bằng pool kết nối: handler giữ 1 kết nối cho giao dịch, rồi gọi một hàm phụ
// tự xin kết nối THỨ HAI từ cùng pool. Pool có 2 kết nối.
//   node pool-deadlock.js <số đơn cùng lúc> [nested|timeout|pass-client]
const { Pool } = require('./pool');
const n = Number(process.argv[2] || 1), mode = process.argv[3] || 'nested';
const pool = new Pool({ max: 2, connectionTimeoutMillis: mode === 'timeout' ? 1000 : 0 });
const t0 = Date.now(), ms = () => String(Date.now() - t0).padStart(5) + ' ms';

async function getPrice(client) {                      // hàm phụ "tiện tay" dùng pool.query ⇒ xin kết nối mới
  return client ? client.query(20) : pool.query(20);
}

async function placeOrder(id) {
  const tx = await pool.connect();                     // BEGIN … giữ kết nối suốt giao dịch
  try {
    await tx.query(50);                                // INSERT order …
    await getPrice(mode === 'pass-client' ? tx : null);
    await tx.query(10);                                // COMMIT
    console.log(`${ms()}  order ${id} committed`);
  } catch (e) {
    console.log(`${ms()}  order ${id} FAILED: ${e.message}`);
  } finally { tx.release(); }
}

console.log(`${n} concurrent order(s), pool max 2, mode ${mode}`);
const all = Promise.all(Array.from({ length: n }, (_, i) => placeOrder(i + 1)));
const watch = setInterval(() => console.log(`${ms()}  pool: ${pool.stats()}`), 1000);
all.then(() => { clearInterval(watch); console.log(`${ms()}  all done`); });
setTimeout(() => { console.log(`${ms()}  giving up: still stuck`); process.exit(1); }, 3000).unref();
