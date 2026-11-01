// hoi.mjs — y như Hoi.java nhưng bằng Node: dns.lookup (= getaddrinfo, cái mà http/fetch/pg dùng). Node KHÔNG có cache DNS.
import dns from 'node:dns/promises';
for (let i = 1; i <= 5; i++) {
  const t = performance.now();
  const { address } = await dns.lookup(process.argv[2], { family: 4 });
  console.log(`node lookup ${i}: ${address} in ${(performance.now() - t).toFixed(1)} ms`);
  await new Promise((r) => setTimeout(r, 1000));
}
