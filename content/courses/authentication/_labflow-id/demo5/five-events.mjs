// demo5/five-events.mjs — lesson 5.3: five events that must end a session, each shown on the refresh layer.
import { refreshLayer, memoryStore } from '../src/refresh/index.js';

async function fresh() { const store = memoryStore(); let t = Date.UTC(2026, 10, 3, 9, 0, 0);
  const rl = refreshLayer({ store, now: () => t, graceMs: 10e3, familyTtlMs: 30 * 24 * 3600e3 });
  const a = await rl.issue('usr_1', { ua: 'laptop' });
  return { rl, a, tick: (ms) => (t += ms), alive: async (tok) => (await rl.rotate(tok)).error || 'OK' }; }

// 1) explicit sign-out of this device
let e = await fresh(); await e.rl.revokeFamily(e.a.row.familyId);
console.log('1. sign-out (this device)        → next refresh:', await e.alive(e.a.token));

// 2) sign-out everywhere / password change: revoke all families
e = await fresh(); await e.rl.revokeAll('usr_1');
console.log('2. sign-out everywhere / pw change → next refresh:', await e.alive(e.a.token));

// 3) refresh-token reuse detected (theft): revoke the family
e = await fresh(); e.tick(60e3); const r1 = await e.rl.rotate(e.a.token); e.tick(3600e3); await e.rl.rotate(e.a.token);
console.log('3. refresh reuse (theft)          → next refresh:', await e.alive(r1.token));

// 4) absolute expiry: the family's 30 days are up
e = await fresh(); e.tick(31 * 24 * 3600e3);
console.log('4. absolute expiry (30 days)      → next refresh:', await e.alive(e.a.token));

// 5) an admin revokes one user's device from the devices page
e = await fresh(); const d = (await e.rl.listDevices('usr_1'))[0]; await e.rl.revokeDevice('usr_1', d.familyId);
console.log('5. admin/devices-page revoke      → next refresh:', await e.alive(e.a.token));

console.log('\nEvery path ends with a refresh that no longer works, so the next 15-minute access token is never minted.');
console.log('The access token already out there still works until it expires (≤ 15 min) — the window you accept for');
console.log('skipping a per-request lookup (lesson 4.3). Shorten the access token to shrink it.');
