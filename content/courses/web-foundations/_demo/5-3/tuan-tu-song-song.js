// cho: 1500
const fetchFake = (name, ms) => new Promise((r) => setTimeout(() => r(name), ms));
const round = (ms) => Math.round(ms / 100) * 100;

async function sequential() {
  const t0 = performance.now();
  const a = await fetchFake('user', 200);     // wait…
  const b = await fetchFake('posts', 200);    // …then wait again
  const c = await fetchFake('likes', 200);
  console.log('sequential:', [a, b, c], 'about', round(performance.now() - t0), 'ms');
}
async function parallel() {
  const t0 = performance.now();
  const [a, b, c] = await Promise.all([fetchFake('user', 200), fetchFake('posts', 200), fetchFake('likes', 200)]);
  console.log('parallel  :', [a, b, c], 'about', round(performance.now() - t0), 'ms');
}
sequential().then(parallel);
