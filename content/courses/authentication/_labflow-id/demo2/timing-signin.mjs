// demo2/timing-signin.mjs — lesson 2.3: does the sign-in endpoint tell an outsider which emails have accounts?
// 60 requests per case, alternating, through HTTP. Same 401 body every time — only the clock differs.
const port = process.argv[2] ?? '4800';
const CASES = { 'no such email ': 'nobody@student.labflow.example', 'An, wrong pw  ': 'an@student.labflow.example' };
const times = Object.fromEntries(Object.keys(CASES).map((k) => [k, []]));
let body;
for (let i = 0; i < 60; i++) {
  for (const [k, email] of Object.entries(CASES)) {
    const t0 = performance.now();
    const res = await fetch(`http://localhost:${port}/sign-in`, {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password: 'wrong-password-1' }),
    });
    body = `${res.status} ${await res.text()}`;
    times[k].push(performance.now() - t0);
  }
}
const med = (xs) => xs.sort((a, b) => a - b)[xs.length >> 1];
console.log(`port ${port} · every response: ${body}`);
for (const [k, xs] of Object.entries(times)) console.log(`${k} median ${med(xs).toFixed(1).padStart(6)} ms`);
const [a, b] = Object.values(times).map(med);
console.log(`ratio ${(Math.max(a, b) / Math.min(a, b)).toFixed(1)}×`);
