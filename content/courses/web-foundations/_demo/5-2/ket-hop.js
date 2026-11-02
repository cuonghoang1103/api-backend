const wait = (ms, v, fail = false) => new Promise((res, rej) => setTimeout(() => (fail ? rej(new Error(v)) : res(v)), ms));
const t0 = performance.now();
const since = () => Math.round((performance.now() - t0) / 50) * 50 + ' ms';

Promise.all([wait(100, 'user'), wait(200, 'posts'), wait(150, 'likes')])
  .then((r) => console.log('all:', r, 'after about', since()));

Promise.all([wait(100, 'ok'), wait(50, 'broken', true)])
  .catch((e) => console.log('all fails fast:', e.message, 'after about', since()));

Promise.allSettled([wait(100, 'ok'), wait(50, 'broken', true)])
  .then((r) => console.log('allSettled:', r.map((x) => x.status)));

Promise.race([wait(300, 'slow'), wait(80, 'fast')])
  .then((v) => console.log('race:', v));

Promise.any([wait(60, 'a', true), wait(120, 'b')])
  .then((v) => console.log('any: first success =', v));
