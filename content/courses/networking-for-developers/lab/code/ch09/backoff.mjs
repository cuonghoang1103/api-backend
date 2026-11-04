// Ch9 lab — lịch NỐI LẠI CÓ LÙI DẦN kèm nhiễu (exponential backoff + jitter), như client WebSocket/SSE thật khi rớt.
// In lịch (không chờ thật) để thấy: KHÔNG dồn vào một mốc, tăng gấp đôi tới trần, có nhiễu để tránh "bầy đàn" nối lại cùng lúc.
const BASE = 1000, MAX = 30000;                 // 1s → tối đa 30s
let seed = 42; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;  // nhiễu lặp lại được để output ổn định

console.log('try  base(ms)  +jitter(ms)  wait(ms)');
for (let i = 0; i < 8; i++) {
  const base = Math.min(BASE * 2 ** i, MAX);
  const jitter = Math.floor(rnd() * base * 0.3);               // tối đa +30%
  const wait = base + jitter;
  console.log(String(i + 1).padEnd(5) + String(base).padEnd(10) + String(jitter).padEnd(13) + wait);
}
console.log('(10,000 clients reconnecting at once = 10,000 connections in one millisecond; backoff + jitter spreads them out)');
