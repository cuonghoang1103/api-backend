// fetch.js — gọi API chậm (slow.js, 100 ms mỗi lời gọi) N lần trên MỘT luồng JavaScript, bằng ba cách.
//   node fetch.js seq N        await lần lượt
//   node fetch.js all N        Promise.all — bắn hết cùng lúc
//   node fetch.js limit N C    tối đa C lời gọi đang bay cùng lúc (một "pool" viết tay 10 dòng)
const URL_ = 'http://localhost:9000/?ms=100';
const call = async () => (await fetch(URL_)).text();

async function limit(n, c) {            // C "làn": mỗi làn lấy việc kế tiếp khi xong việc cũ
  let next = 0; const out = [];
  async function lane() { while (next < n) { const i = next++; out[i] = await call(); } }
  await Promise.all(Array.from({ length: c }, lane));
  return out;
}

(async () => {
  const [mode, n, c] = [process.argv[2], Number(process.argv[3]), Number(process.argv[4] ?? 0)];
  const t0 = performance.now();
  let r;
  if (mode === 'seq') { r = []; for (let i = 0; i < n; i++) r.push(await call()); }
  else if (mode === 'all') r = await Promise.all(Array.from({ length: n }, call));
  else r = await limit(n, c);
  const ok = r.filter((x) => x.startsWith('ok')).length;
  const stats = await (await fetch('http://localhost:9000/stats')).json();
  console.log(`${mode.padEnd(5)} ${c ? 'x' + c : '   '} calls=${n} ok=${ok} server saw peak=${stats.peak} in flight  ${(performance.now() - t0).toFixed(0)} ms`);
})();
