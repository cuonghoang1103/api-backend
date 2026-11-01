// demo2/hibp-down.mjs — lesson 2.4: what if the breach service hangs? A server on :4801 that accepts and never answers.
import http from 'node:http';
import { pwnedCount } from '../src/passwords/index.js';
const silent = http.createServer(() => {}).listen(4801);
const t0 = performance.now();
const n = await pwnedCount('iloveyouiloveyou', { base: 'http://127.0.0.1:4801', timeoutMs: 1500 });
console.log(`pwnedCount → ${n} after ${(performance.now() - t0).toFixed(0)} ms (null = "could not ask": fail open, log it)`);
silent.close(); process.exit(0);
