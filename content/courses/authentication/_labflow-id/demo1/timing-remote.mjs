// demo1/timing-remote.mjs — lesson 1.3: can a client see the === difference through HTTP on the SAME machine?
// Sends two guesses alternately (0 vs 63 leading characters right), N requests each, over one keep-alive connection.
import http from 'node:http';
const KEY = process.env.DEMO_API_KEY;
const N = Number(process.env.N ?? 20000);
const agent = new http.Agent({ keepAlive: true, maxSockets: 1 });
const wrong = (m) => KEY.slice(0, m) + (KEY[m] === 'A' ? 'B' : 'A') + KEY.slice(m + 1);
const guesses = { 'first char wrong': wrong(0), 'last char wrong ': wrong(63) };
const send = (key) => new Promise((resolve) => {
  const t = process.hrtime.bigint();
  http.get({ host: '127.0.0.1', port: 4802, path: '/', agent, headers: { 'x-api-key': key } }, (res) => {
    res.resume();
    res.on('end', () => resolve(Number(process.hrtime.bigint() - t)));
  });
});
const samples = Object.fromEntries(Object.keys(guesses).map((k) => [k, []]));
for (let i = 0; i < 2000; i++) await send(guesses['first char wrong']); // warm-up
for (let i = 0; i < N; i++) for (const [name, key] of Object.entries(guesses)) samples[name].push(await send(key));
const q = (a, p) => a[Math.floor(p * (a.length - 1))];
console.log(`${N.toLocaleString('en-US')} requests per guess, 127.0.0.1, one keep-alive connection`);
for (const [name, a] of Object.entries(samples)) {
  a.sort((x, y) => x - y);
  console.log(`${name}: p10 ${(q(a, 0.1) / 1000).toFixed(1)} µs · median ${(q(a, 0.5) / 1000).toFixed(1)} µs · p90 ${(q(a, 0.9) / 1000).toFixed(1)} µs`);
}
const [a, b] = Object.values(samples);
console.log(`median difference: ${((q(b, 0.5) - q(a, 0.5))).toFixed(0)} ns (the in-process difference was about 2 ns)`);
