// demo11/ratelimit.mjs — rate limiting that survives real traffic (Chapter 11, 11.3).
import { allow } from '../src/ops/ratelimit.js';

const limit = 5, windowMs = 1000;
const store = new Map();                 // in production this Map is Redis, shared by every instance
const hit = (key, now) => allow(store, key, { limit, windowMs, now });

console.log(`Fixed window: ${limit} requests per ${windowMs}ms, per key.\n`);
console.log('Seven requests from ip-A inside one window:');
for (let i = 1; i <= 7; i++) { const r = hit('ip-A', 1000); console.log(`  #${i} → ${r.ok ? 'allow' : 'BLOCK'} (count ${r.count}, remaining ${r.remaining})`); }
console.log('\nip-B in the same window is independent:');
console.log(`  ip-B #1 → ${hit('ip-B', 1000).ok ? 'allow' : 'BLOCK'}   (one key\'s flood does not throttle another)`);
console.log('\nip-A in the NEXT window resets:');
console.log(`  ip-A #1 → ${hit('ip-A', 2000).ok ? 'allow' : 'BLOCK'}`);

console.log('\n⇒ The counter MUST be shared across instances (Redis), or each of N nodes lets the limit through N times.');
console.log('  Rate-limit by the right key (IP, account, route), fail OPEN if the store is down (never lock out everyone),');
console.log('  and return 429 with Retry-After — a limit the client cannot see is a limit it cannot back off from.');
