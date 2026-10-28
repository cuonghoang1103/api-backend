// load.js URL N — bắn N yêu cầu CÙNG LÚC, in tổng thời gian và độ trễ nhanh nhất/chậm nhất.
const [url, n] = [process.argv[2], Number(process.argv[3] || 10)];
const t0 = performance.now();
Promise.all(Array.from({ length: n }, async () => {
  const s = performance.now(); await (await fetch(url)).text(); return performance.now() - s;
})).then((lat) => {
  lat.sort((a, b) => a - b);
  console.log(`${n} concurrent requests: all done in ${(performance.now() - t0).toFixed(0)} ms` +
    `  (fastest ${lat[0].toFixed(0)} ms, slowest ${lat[n - 1].toFixed(0)} ms)`);
});
