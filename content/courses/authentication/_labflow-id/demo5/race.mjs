// demo5/race.mjs — lesson 5.5: the refresh race, and the false positive that kills the feature.
// Two tabs of the SAME browser both notice the access token expired and both POST /refresh with the SAME cookie at
// almost the same moment. Naive rotation marks the token used on the first request, so the second looks like reuse —
// and revokes the family, logging the real user out. A short grace window returns the first request's new token to the
// second, so a race is not mistaken for theft.
import { refreshLayer, memoryStore } from '../src/refresh/index.js';

async function trial(graceMs, gapMs = 50) {
  let t = Date.UTC(2026, 10, 3, 9, 0, 0);
  const rl = refreshLayer({ store: memoryStore(), now: () => t, graceMs });
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  t += 60e3;
  // Tab A refreshes first and rotates the token. Tab B's request was already in flight carrying the SAME (old) cookie,
  // so it arrives a moment later with a token that is now "used". gapMs is how far behind B is.
  const x1 = await rl.rotate(a.token);
  t += gapMs;
  const x2 = await rl.rotate(a.token);
  return { x1, x2 };
}

console.log('grace window = 10 s (LabFlow ID default):');
let { x1, x2 } = await trial(10e3);
console.log('  tab A →', x1.token ? 'new token ' + x1.token.slice(0, 12) + '…' : x1.error);
console.log('  tab B →', x2.token ? 'new token ' + x2.token.slice(0, 12) + '… (raced=' + !!x2.raced + ')' : x2.error);
console.log('  same token?', x1.token === x2.token, '→ both tabs stay signed in\n');

console.log('grace window = 0 (naive rotation — the false positive):');
({ x1, x2 } = await trial(0));
console.log('  tab A →', x1.token ? 'new token ' + x1.token.slice(0, 12) + '…' : x1.error);
console.log('  tab B →', x2.token ? 'new token' : x2.error, x2.error === 'REUSE_DETECTED' ? '← the real user just got logged out' : '');

// how fast is a rotation? (memory store; a DB adds its own round trip)
const rl = refreshLayer({ store: memoryStore() });
let cur = (await rl.issue('usr_1')).token;
for (let i = 0; i < 200; i++) cur = (await rl.rotate(cur)).token; // warm up
const N = 5000; const start = process.hrtime.bigint();
for (let i = 0; i < N; i++) cur = (await rl.rotate(cur)).token;
const ms = Number(process.hrtime.bigint() - start) / 1e6;
console.log(`\nrotation throughput (memory store, macOS arm64): ${Math.round(N / (ms / 1000)).toLocaleString('en-US')} rotations/s (${(ms / N).toFixed(3)} ms each)`);
